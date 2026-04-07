# Next.js + Mongoose Boilerplate

A modern, production-ready boilerplate for building full-stack applications with **Next.js 16**, **React 19**, **MongoDB/Mongoose**, and **TypeScript**.

## ✨ Features

- 🚀 **Next.js 16** with App Router and React Server Components
- ⚛️ **React 19** with latest features (use(), useActionState, etc.)
- 📦 **MongoDB/Mongoose** for database management
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
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/your-app.git
cd your-app
```

1. **Install dependencies**

```bash
bun install
```

1. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# App Configuration
APP_NAME="MyApp"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# NODE_ENV is automatically set by Next.js during build/dev (development/production)
# You can override it if needed. See: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
NODE_ENV="development"

# MongoDB Connection
MONGODB_URI="mongodb://localhost:27017/myapp"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

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

1. **Run the development server**

```bash
bun dev
```

1. **Open [http://localhost:3000](http://localhost:3000)**

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
│   ├── mongodb.ts              # MongoDB connection
│   ├── session.ts              # Session management
│   ├── mailer.ts               # Email utilities
│   └── i18n/                   # Internationalization utilities
├── models/
│   ├── User.ts                 # User model
│   ├── PasswordResetToken.ts   # Password reset token model
│   └── enums/                  # TypeScript enums
└── templates/
    └── email/                  # Email templates
```

## 🎨 Customization

### Branding

1. **Logo**: Update `components/logo.tsx` with your own logo/branding
2. **Colors**: Modify the brand colors in `app/globals.css`:

```css
--color-brand: #your-color;
--color-brand-dark: #your-dark-color;
```

1. **Metadata**: Update `app/[lang]/layout.tsx` with your app name and description
2. **Email Templates**: Customize templates in `templates/email/`

### Adding Languages

1. Create a new dictionary file in `app/[lang]/dictionaries/` (e.g., `fr.json`)
2. Add the language to `models/enums/Language.ts`
3. Update `SUPPORTED_LANGUAGES` array

### Adding Models

Create new Mongoose models in the `models/` directory:

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IYourModel extends Document {
  // your fields
}

const YourModelSchema = new Schema<IYourModel>({
  // your schema
}, { timestamps: true });

export default mongoose.models.YourModel || mongoose.model('YourModel', YourModelSchema);
```

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
      - MONGODB_URI=mongodb://mongo:27017/myapp
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
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
| MongoDB | - | Database |
| Mongoose | 9 | ODM |
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
