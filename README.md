# Monorepo Full-Stack Application

A modern full-stack application built as a monorepo with frontend and backend workspaces, using TypeScript throughout for type safety and developer productivity.

## 🏗️ Architecture

This monorepo contains two main workspaces:

- **Frontend** (`/frontend`): Next.js 14 application with TypeScript, Tailwind CSS
- **Backend** (`/backend`): Express.js API server with TypeScript, MongoDB

### Tech Stack

#### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (ready for Redux/Zustand integration)
- **HTTP Client**: Axios
- **Linting**: ESLint + Prettier

#### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Security**: Helmet, CORS, Rate Limiting
- **AI Integration**: Google Gemini API
- **Linting**: ESLint + Prettier

#### Development Tools
- **Package Manager**: npm with workspaces
- **Code Formatting**: Prettier with shared configuration
- **Linting**: ESLint with shared base configuration
- **Type Checking**: TypeScript with shared base configuration
- **Environment**: dotenv for environment variable management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- MongoDB (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd monorepo-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env` (see Environment Configuration below)

5. Bootstrap the project:
```bash
npm run bootstrap
```

### Development

Start both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

#### Individual Workspace Commands

Start only the frontend:
```bash
npm run dev:frontend
```

Start only the backend:
```bash
npm run dev:backend
```

### Production Build

Build both applications:
```bash
npm run build
```

Start production servers:
```bash
npm run start
```

## 📁 Project Structure

```
monorepo-app/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages and layouts
│   │   ├── components/      # Reusable React components
│   │   ├── lib/             # Utility functions and configurations
│   │   └── types/           # TypeScript type definitions
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose data models
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Express middleware
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Application entry point
│   ├── package.json
│   └── tsconfig.json
├── .env.example             # Environment variables template
├── .editorconfig           # Editor configuration
├── .eslintrc.json          # Base ESLint configuration
├── .gitignore              # Git ignore patterns
├── .prettierrc             # Prettier configuration
├── package.json            # Root package.json with workspace config
├── tsconfig.base.json      # Base TypeScript configuration
└── README.md               # This file
```

## ⚙️ Environment Configuration

Create a `.env` file from `.env.example` and configure the following variables:

### Database
```env
MONGODB_URI=mongodb://localhost:27017/monorepo-app
MONGODB_DB_NAME=monorepo-app
```

### Authentication
```env
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

### External APIs
```env
GEMINI_API_KEY=your-gemini-api-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Application URLs
```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Server Configuration
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🛠️ Available Scripts

### Root Commands
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications for production
- `npm run start` - Start both applications in production mode
- `npm run lint` - Lint all code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run all tests
- `npm run clean` - Clean build artifacts
- `npm run bootstrap` - Install dependencies and build

### Frontend Commands
- `npm run dev:frontend` - Start Next.js development server
- `npm run build:frontend` - Build Next.js for production
- `npm run start:frontend` - Start Next.js production server
- `npm run lint:frontend` - Lint frontend code

### Backend Commands
- `npm run dev:backend` - Start Express development server with nodemon
- `npm run build:backend` - Compile TypeScript to JavaScript
- `npm run start:backend` - Start Express production server
- `npm run lint:backend` - Lint backend code

## 🧪 Testing

Both workspaces are configured for testing with Jest:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Workspace Management

This monorepo uses npm workspaces for dependency management:

### Adding Dependencies

To add a dependency to a specific workspace:
```bash
# Add to frontend
npm install <package> --workspace=frontend

# Add to backend
npm install <package> --workspace=backend

# Add dev dependency to frontend
npm install <package> -D --workspace=frontend
```

To add a shared dependency to the root:
```bash
npm install <package> -D
```

## 🚀 Deployment

### Frontend (Next.js)
The frontend is ready for deployment to platforms like:
- Vercel (recommended)
- Netlify
- AWS Amplify

### Backend (Express.js)
The backend can be deployed to:
- Railway
- Heroku
- AWS EC2/ECS
- DigitalOcean App Platform

### Environment Variables in Production
Ensure all required environment variables are configured in your production environment. Refer to `.env.example` for the complete list.

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add type definitions for shared data structures

### File Organization
- Keep components small and focused
- Use absolute imports with `@/` prefix
- Separate business logic from UI components
- Maintain consistent naming conventions

### Git Workflow
- Create feature branches from `main`
- Use descriptive branch names
- Ensure all tests pass before committing
- Run linting and formatting before PRs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and formatting
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Dependencies not found:**
```bash
npm run clean
npm install
```

**TypeScript errors:**
```bash
npm run type-check
```

**Port conflicts:**
- Check if ports 3000 and 5000 are available
- Modify PORT in `.env` for backend if needed

**MongoDB connection issues:**
- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify database exists and is accessible

### Getting Help

- Check the console logs for detailed error messages
- Ensure all environment variables are properly set
- Verify Node.js and npm versions meet requirements