import UserLoginHistoryEntity from '@entities/userLoginHistories';
import UserLoginHistoryInterface from '@interfaces/userLoginHistories';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class UserLoginHistoryModel extends Model<UserLoginHistoryInterface> implements UserLoginHistoryInterface {
  public id: number;

  public userId: number;

  public createdAt?: Date;

  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<UserLoginHistoryModel>> = {

  };

  static readonly validations: ModelValidateOptions = {

  };

  static readonly scopes: ModelScopeOptions = {
    byUser(userId) {
      return { where: { userId } };
    },
  };

  public static initialize(sequelize: Sequelize) {
    this.init(UserLoginHistoryEntity, {
      hooks: UserLoginHistoryModel.hooks,
      scopes: UserLoginHistoryModel.scopes,
      validate: UserLoginHistoryModel.validations,
      tableName: 'user_login_histories',
      sequelize,
    });
  }

  public static associate() {
  }
}

export default UserLoginHistoryModel;
