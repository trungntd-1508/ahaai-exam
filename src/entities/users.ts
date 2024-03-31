import { DataTypes } from 'sequelize';

const UserEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Email cannot be empty,',
      },
      notEmpty: {
        msg: 'Email cannot be empty,',
      },
      isEmail: {
        msg: 'Email is not in correct format.',
      },
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      is: {
        args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        msg: 'Password is not in correct format.',
      },
    },
  },
  passwordConfirmation: {
    type: DataTypes.VIRTUAL, allowNull: true,
  },
  unEncryptedPassword: {
    type: DataTypes.VIRTUAL,
  },
  fullName: {
    type: DataTypes.STRING(100), allowNull: true,
  },
  verificationCode: {
    type: DataTypes.STRING(50), allowNull: true, unique: true,
  },
  verificationAt: {
    type: DataTypes.DATE, allowNull: true,
  },
  googleUserId: {
    type: DataTypes.STRING(50), allowNull: true, unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default UserEntity;
