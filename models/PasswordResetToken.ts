import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '@/lib/database';

export interface IPasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

type PasswordResetTokenCreationAttributes = Optional<IPasswordResetToken, 'id' | 'createdAt'>;

class PasswordResetToken
  extends Model<IPasswordResetToken, PasswordResetTokenCreationAttributes>
  implements IPasswordResetToken
{
  declare id: string;
  declare userId: string;
  declare token: string;
  declare expiresAt: Date;
  declare readonly createdAt: Date;
}

PasswordResetToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'password_reset_tokens',
    timestamps: true,
    updatedAt: false,
  }
);

export default PasswordResetToken;
