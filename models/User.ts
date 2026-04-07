import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '@/lib/database';
import { Role, Division, Language, DEFAULT_LANGUAGE } from './enums';

export interface IUser {
  id: string;
  email: string;
  password: string;
  name?: string;
  role: Role;
  keyPath?: string;
  division: Division;
  preferredLanguage: Language;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserCreationAttributes = Optional<
  IUser,
  'id' | 'role' | 'division' | 'preferredLanguage' | 'createdAt' | 'updatedAt'
>;

class User extends Model<IUser, UserCreationAttributes> implements IUser, IUserMethods {
  declare id: string;
  declare email: string;
  declare password: string;
  declare name: string | undefined;
  declare role: Role;
  declare keyPath: string | undefined;
  declare division: Division;
  declare preferredLanguage: Language;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Please enter a valid email address' },
        notEmpty: { msg: 'Email is required' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [8, 1024], msg: 'Password must be at least 8 characters' },
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      allowNull: false,
      defaultValue: Role.OWNER,
    },
    keyPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    division: {
      type: DataTypes.ENUM(...Object.values(Division)),
      allowNull: false,
      defaultValue: Division.STATISTICA,
    },
    preferredLanguage: {
      type: DataTypes.ENUM(...Object.values(Language)),
      allowNull: false,
      defaultValue: DEFAULT_LANGUAGE,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ['id', 'email', 'name', 'role', 'keyPath', 'division', 'preferredLanguage', 'password', 'createdAt', 'updatedAt'],
        },
      },
    },
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed('password') && user.password) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
