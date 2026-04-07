import sequelize from '@/lib/database';

// Import models to register them with the Sequelize instance
import User from './User';
import PasswordResetToken from './PasswordResetToken';

// Set up associations
PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(PasswordResetToken, { foreignKey: 'userId', as: 'passwordResetTokens' });

export { User, type IUser, type IUserMethods } from './User';
export { PasswordResetToken, type IPasswordResetToken } from './PasswordResetToken';
export * from './enums';

/**
 * Authenticate and sync the database schema.
 * Call this once at application startup (e.g. instrumentation.ts).
 */
export async function dbConnect(): Promise<void> {
  await sequelize.authenticate();
  // sync({ alter: true }) in development; use migrations in production
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
}
