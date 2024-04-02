import UserEntity from '@entities/users';
import UserInterface from '@interfaces/users';
import MailjetService from '@services/mailjet';
import bcrypt from 'bcryptjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import { getConsoleLogger } from '@libs/consoleLogger';
import jwt from 'jsonwebtoken';
import Settings from '@configs/settings';
import dayjs from 'dayjs';
import UserLoginHistoryModel from './userLoginHistories';

class UserModel extends Model<UserInterface> implements UserInterface {
  public id: number;

  public email: string;

  public password: string;

  public passwordConfirmation?: string;

  public currentPassword?: string;

  public unEncryptedPassword?: string;

  public fullName: string;

  public verificationCode: string;

  public verificationAt: Date;

  public googleUserId: string;

  public lastActiveAt: Date;

  public lastLoginAt: Date;

  public createdAt: Date;

  public updatedAt: Date;

  public totalOrder?: number;

  static readonly CREATABLE_PARAMETERS = ['email', 'password', 'passwordConfirmation', 'fullName'];

  static readonly UPDATABLE_PARAMETERS = ['fullName'];

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
    async verifyNewPassword() {
      if (!this.currentPassword) return;
      if (this.currentPassword === this.password) {
        throw new ValidationErrorItem('New password must not be the same as current password.', 'verifyNewPassword', 'password', this.password);
      }
    },
  };

  static readonly scopes: ModelScopeOptions = {
    byId(id) {
      return { where: { id } };
    },
    byEmail(email) {
      return { where: { email } };
    },
    byVerificationCode(code) {
      return { where: { verificationCode: code } };
    },
    bySorting(sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    byFreeWord(freeWord) {
      return {
        where: {
          [Op.or]: [
            { fullName: { [Op.like]: `%${freeWord || ''}%` } },
            { email: { [Op.like]: `%${freeWord || ''}%` } },
          ],
        },
      };
    },
    byActiveIn(from, to) {
      if (!from && !to) return { where: {} };
      const activeAtCondition: any = {};
      if (from) Object.assign(activeAtCondition, { [Op.gt]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(activeAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        where: { lastActiveAt: activeAtCondition },
      };
    },
    withTotalLogin() {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal(
                '(SELECT COUNT(\'id\') FROM user_login_histories WHERE user_login_histories.userId = UserModel.id)'),
              'totalLogin',
            ],
          ],
        },
      };
    },
  };

  public async validPassword(password: string) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      return false;
    }
  }

  public async generateAccessToken() {
    const token = jwt.sign({ id: this.id }, Settings.jwt.secret, { expiresIn: Settings.jwt.ttl });
    return token;
  }

  public async sendVerificationEmail() {
    if (this.verificationAt) return;
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
    this.hasMany(UserLoginHistoryModel, { as: 'loginHistories', foreignKey: 'userId', hooks: true, onDelete: 'CASCADE' });
  }
}

export default UserModel;
