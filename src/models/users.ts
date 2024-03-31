import UserEntity from '@entities/users';
import UserInterface from '@interfaces/users';
import MailjetService from '@services/mailjet';
import bcrypt from 'bcryptjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import { getConsoleLogger } from '@libs/consoleLogger';

class UserModel extends Model<UserInterface> implements UserInterface {
  public id: number;

  public email: string;

  public password: string;

  public passwordConfirmation?: string;

  public unEncryptedPassword?: string;

  public fullName: string;

  public verificationCode: string;

  public verificationAt: Date;

  public googleUserId: string;

  public createdAt: Date;

  public updatedAt: Date;

  static readonly CREATABLE_PARAMETERS = ['email', 'password', 'passwordConfirmation', 'fullName'];

  static readonly hooks: Partial<ModelHooks<UserModel>> = {
    async beforeValidate(record) {
      if (!record.fullName) record.setDataValue('fullName', `User ${Math.floor(100000 + Math.random() * 900000)}`);
    },
    beforeUpdate(record, options) {
      options.validate = false;
    },
    beforeSave(record) {
      if (record.password && record.password !== record.previous('password')) {
        const salt = bcrypt.genSaltSync();
        record.password = bcrypt.hashSync(record.password, salt);
      }
    },
    afterCreate(record) {
      record.sendVerificationEmail();
    },
  };

  static readonly validations: ModelValidateOptions = {
    async uniqueEmail() {
      if (this.email) {
        const existedRecord = await UserModel.findOne({
          attributes: ['id'], where: { email: this.email },
        });
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('This email has already taken.', 'uniqueEmail', 'email', this.email);
        }
      }
    },
    async verifyMatchPassword() {
      if (this.isNewRecord) return;
      const isInputNewPassword = this.password !== this._previousDataValues.password;
      if (!isInputNewPassword && !this.passwordConfirmation) return;
      if (this.password !== this.passwordConfirmation) {
        throw new ValidationErrorItem('Password confirmation is not matched.', 'verifyMatchPassword', 'password', this.passwordConfirmation);
      }
    },
  };

  static readonly scopes: ModelScopeOptions = {
    byId(id) {
      return { where: { id } };
    },
    byVerificationCode(code) {
      return { where: { verificationCode: code } };
    },
  };

  public async validPassword(password: string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      return false;
    }
  }

  // public async generateAccessToken() {
  //   const token = jwt.sign({ id: this.id }, Settings.jwt.userSecret, { expiresIn: Settings.jwt.ttl });
  //   return token;
  // }

  public async sendVerificationEmail() {
    try {
      const code = await this.generateVerificationCode();
      await this.update({ verificationCode: code }, { validate: false });
      const verificationUrl = `${process.env.VERIFICATION_PATH}?code=${code}`;
      await MailjetService.send([{ email: this.email, name: this.fullName }] as any, 'accountActivation', { verification_url: verificationUrl }, undefined);
    } catch (error) {
      const errorLogger = getConsoleLogger('errorLogging');
      errorLogger.addContext('requestType', 'CronLogging');
      errorLogger.error(error);
    }
  }

  private async generateVerificationCode() {
    let code = '';
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 32; i > 0; --i) code += characters[Math.floor(Math.random() * characters.length)];
    const existedRecord = await UserModel.findOne({
      attributes: ['verificationCode'], where: { verificationCode: code },
    });
    if (existedRecord) code = await this.generateVerificationCode();
    return code;
  }

  public static initialize(sequelize: Sequelize) {
    this.init(UserEntity, {
      hooks: UserModel.hooks,
      scopes: UserModel.scopes,
      validate: UserModel.validations,
      tableName: 'users',
      sequelize,
    });
  }

  public static associate() {
  }
}

export default UserModel;
