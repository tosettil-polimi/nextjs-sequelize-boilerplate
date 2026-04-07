# Next.js + Sequelize Boilerplate

A modern, production-ready boilerplate for building full-stack applications with **Next.js 16**, **React 19**, **PostgreSQL/Sequelize**, and **TypeScript**.

## ✨ Features

- 🚀 **Next.js 16** with App Router and React Server Components
- ⚛️ **React 19** with latest features (use(), useActionState, etc.)
- 🐘 **PostgreSQL + Sequelize v6** for database management
- 🔐 **JWT Authentication** with secure session management
- 🔑 **Password Reset** flow with email verification
- 🌍 **i18n** Multi-language support (EN/IT out of the box)
- 🎨 **Tailwind CSS v4** with custom theming
- 🧩 **shadcn/ui** components
- 📊 **Sentry** integration for error tracking
- 🐳 **Docker** ready with multi-stage builds
- 🚢 **GitHub Actions** CI/CD pipeline
- 📝 **TypeScript** strict mode

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20+
- PostgreSQL instance (local or cloud)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/your-app.git
cd your-app
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# App Configuration
APP_NAME="MyApp"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# NODE_ENV is automatically set by Next.js during build/dev (development/production)
# You can override it if needed. See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
NODE_ENV="development"

# PostgreSQL Connection
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"

# Session Secret (generate with: openssl rand -base64 32)
SESSION_SECRET="your-super-secret-session-key-change-in-production"

# SMTP Configuration (for password reset emails)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-smtp-password"
SMTP_FROM="noreply@example.com"

# Sentry (optional - for error tracking)
SENTRY_DSN=""
NEXT_PUBLIC_SENTRY_DSN=""
SENTRY_ORG=""
SENTRY_PROJECT=""
SENTRY_AUTH_TOKEN=""
```

4. **Run the development server**

```bash
bun dev
```

The database tables are created/updated automatically on startup in development (`sequelize.sync({ alter: true })`). For production, use migrations (see [Migrations](#-migrations)).

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```text
├── app/
│   ├── [lang]/                 # i18n language routes
│   │   ├── (auth)/             # Auth pages (login, forgot-password, etc.)
│   │   ├── (protected)/        # Protected pages (dashboard, settings)
│   │   └── dictionaries/       # Translation files
│   ├── actions/                # Server Actions
│   └── globals.css             # Global styles & Tailwind config
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── logo.tsx                # App logo component (customize this!)
├── lib/
│   ├── auth.ts                 # Authentication utilities
│   ├── database.ts             # Sequelize singleton connection
│   ├── session.ts              # Session management
│   ├── mailer.ts               # Email utilities
│   └── i18n/                   # Internationalization utilities
├── models/
│   ├── User.ts                 # User model
│   ├── PasswordResetToken.ts   # Password reset token model
│   ├── index.ts                # Model registry + dbConnect()
│   └── enums/                  # TypeScript enums
└── templates/
    └── email/                  # Email templates
```

## 🗄️ Database

### Connection

The Sequelize instance is a singleton defined in `lib/database.ts` and reads the `DATABASE_URL` environment variable. It is connected once at startup via `instrumentation.ts`.

### Migrations

In **development**, `sequelize.sync({ alter: true })` keeps the schema in sync automatically.

In **production**, use `sequelize-cli` migrations:

```bash
bun add -d sequelize-cli
bunx sequelize-cli migration:generate --name create-users
bunx sequelize-cli db:migrate
bunx sequelize-cli db:migrate:undo
```

### Transactions

Always use unmanaged transactions for operations that must succeed or fail together:

```typescript
import sequelize from '@/lib/database';

const t = await sequelize.transaction();
try {
  await PasswordResetToken.destroy({ where: { userId }, transaction: t });
  await PasswordResetToken.create({ userId, token, expiresAt }, { transaction: t });
  await t.commit();
  // side effects (email, etc.) after commit
} catch (error) {
  await t.rollback();
  throw error;
}
```

## 🎨 Customization

### Branding

1. **Logo**: Update `components/logo.tsx` with your own logo/branding
2. **Colors**: Modify the brand colors in `app/globals.css`:

```css
--color-brand: #your-color;
--color-brand-dark: #your-dark-color;
```

3. **Metadata**: Update `app/[lang]/layout.tsx` with your app name and description
4. **Email Templates**: Customize templates in `templates/email/`

### Adding Languages

1. Create a new dictionary file in `app/[lang]/dictionaries/` (e.g., `fr.json`)
2. Add the language to `models/enums/Language.ts`
3. Update the `SUPPORTED_LANGUAGES` array

### Adding Models

Create new Sequelize models in the `models/` directory:

```typescript
import { Model, DataTypes } from 'sequelize';
import sequelize from '@/lib/database';

export interface IYourModel {
  id: string;
  // your fields
}

class YourModel extends Model<IYourModel> implements IYourModel {
  declare id: string;
  // your fields
}

YourModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // your fields
  },
  {
    sequelize,
    tableName: 'your_models',
    timestamps: true,
  }
);

export default YourModel;
```

Then import the model in `models/index.ts` to register it with the Sequelize instance and export it.

## 🐳 Docker

### Build and run locally

```bash
docker build -t myapp .
docker run -p 3000:3000 --env-file .env.local myapp
```

### Using Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/myapp
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: myapp
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

## 🚀 Deployment

### Versioning & Release

```bash
# Beta release
bun run deploy:beta

# Production patch release (0.0.x)
bun run deploy:production

# Minor release (0.x.0)
bun run deploy:minor:production

# Major release (x.0.0)
bun run deploy:major:production
```

The GitHub Actions workflow will automatically build and push Docker images to GitHub Container Registry when you push a tag.

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |
| `bun lint:fix` | Fix ESLint errors |
| `bun format` | Format code with Prettier |
| `bun format:check` | Check code formatting |
| `bun check` | Run format check + lint |

## 🔧 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 | React framework |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| PostgreSQL | 16 | Database |
| Sequelize | 6 | ORM |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | - | UI components |
| Sentry | 10 | Error tracking |
| Bun | - | Runtime & package manager |

## 👥 Authors

- **[@tosettil-polimi](https://github.com/tosettil-polimi)**
- **[@giorgiopiazza](https://github.com/giorgiopiazza)**

## 📄 License

MIT License - feel free to use this boilerplate for your projects!

---

Made with ❤️ by [tosettil-polimi](https://github.com/tosettil-polimi) & [giorgiopiazza](https://github.com/giorgiopiazza)
