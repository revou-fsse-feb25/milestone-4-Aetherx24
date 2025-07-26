<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# 🏦 RevoBank API

A secure and scalable banking API built with NestJS and Prisma, designed for a fictional financial institution. This project demonstrates modern backend development practices including authentication, database design, testing, and deployment.

Deployment Link: https://milestone-4-aetherx24-production.up.railway.app/

## 📋 Overview

RevoBank API is a full-stack banking solution that provides secure access to banking operations for both customers and administrators. The system enables users to manage accounts, perform transactions, and monitor their financial activities through a robust RESTful API.

## ✨ Features Implemented

### 🔐 Authentication & Authorization
- **User Registration**: Secure user account creation with email validation
- **User Login**: JWT-based authentication system
- **Role-based Access Control**: Support for both customers and administrators
- **Protected Routes**: Secure endpoints using JWT guards

### 🏦 Account Management
- **Create Bank Accounts**: Users can create new bank accounts with initial balance
- **View Accounts**: Retrieve all user accounts and specific account details
- **Update Accounts**: Modify account information (admin functionality)
- **Delete Accounts**: Remove accounts from the system (admin functionality)

### 💸 Transaction Operations
- **Deposits**: Add funds to bank accounts
- **Withdrawals**: Remove funds from accounts (with balance validation)
- **Transfers**: Move money between accounts
- **Transaction History**: View detailed transaction records
- **Transaction Details**: Get specific transaction information

### 👤 User Profile Management
- **Profile Retrieval**: Get current user profile information
- **Profile Updates**: Modify user profile details

## 🛠️ Technologies Used

### Backend Framework
- **NestJS**: Progressive Node.js framework for building scalable server-side applications
- **TypeScript**: Type-safe JavaScript for better development experience

### Database & ORM
- **PostgreSQL**: Robust relational database for data persistence
- **Prisma**: Next-generation ORM for Node.js and TypeScript

### Authentication & Security
- **JWT (JSON Web Tokens)**: Stateless authentication mechanism
- **bcryptjs**: Password hashing for security
- **Passport.js**: Authentication middleware

### Testing
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library for API testing

### Documentation
- **Swagger/OpenAPI**: Interactive API documentation
- **@nestjs/swagger**: NestJS integration for Swagger

### Deployment
- **Railway**: Cloud platform for application and database hosting
- **Git**: Version control system

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (local or cloud)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd milestone-4-Aetherx24
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your database credentials
   DATABASE_URL="postgresql://username:password@localhost:5432/revobank"
   JWT_SECRET="your-super-secret-jwt-key"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

6. **Access the application**
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api
   - Health Check: http://localhost:3000/

### Production Deployment

The application is deployed on Railway with the following configuration:

1. **Database**: PostgreSQL hosted on Railway
2. **Backend**: NestJS application deployed on Railway
3. **Environment Variables**: Configured in Railway dashboard
4. **Health Checks**: Automatic health monitoring

## 📚 API Documentation

### Base URL
- **Local**: `http://localhost:3000`
- **Production**: `https://milestone-4-aetherx24-production.up.railway.app/`

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### User Profile Endpoints

#### Get User Profile
```http
GET /user/profile
Authorization: Bearer <jwt-token>
```

#### Update User Profile
```http
PATCH /user/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Name"
}
```

### Account Management Endpoints

#### Create Account
```http
POST /accounts
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "initialBalance": 1000
}
```

#### Get All Accounts
```http
GET /accounts
Authorization: Bearer <jwt-token>
```

#### Get Specific Account
```http
GET /accounts/:id
Authorization: Bearer <jwt-token>
```

#### Update Account
```http
PATCH /accounts/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "balance": 2000
}
```

#### Delete Account
```http
DELETE /accounts/:id
Authorization: Bearer <jwt-token>
```

### Transaction Endpoints

#### Deposit Money
```http
POST /transactions/deposit
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "accountId": 1,
  "amount": 500
}
```

#### Withdraw Money
```http
POST /transactions/withdraw
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "accountId": 1,
  "amount": 200
}
```

#### Transfer Money
```http
POST /transactions/transfer
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 100
}
```

#### Get Transaction History
```http
GET /transactions
Authorization: Bearer <jwt-token>
```

#### Get Transaction Details
```http
GET /transactions/:id
Authorization: Bearer <jwt-token>
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Test Coverage
The project includes comprehensive test coverage for:
- Authentication services and controllers
- User profile management
- Account CRUD operations
- Transaction processing
- Error handling scenarios

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
├── user/                # User profile module
│   ├── user.controller.ts
│   └── user.module.ts
├── account/             # Account management module
│   ├── dto/
│   ├── account.controller.ts
│   ├── account.service.ts
│   └── account.module.ts
├── transaction/         # Transaction module
│   ├── dto/
│   ├── transaction.controller.ts
│   ├── transaction.service.ts
│   └── transaction.module.ts
├── prisma/             # Database configuration
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.controller.ts   # Health check endpoint
├── app.service.ts
├── app.module.ts       # Root module
└── main.ts            # Application entry point
```

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Application port (default: 3000)

### Database Schema
The application uses three main models:
- **User**: Stores user information and authentication data
- **Account**: Represents bank accounts with balances
- **Transaction**: Records all financial transactions

## 🚀 Deployment

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Add PostgreSQL database service
3. Configure environment variables
4. Deploy the application

### Environment Variables in Railway
- `DATABASE_URL`: Automatically provided by Railway PostgreSQL
- `JWT_SECRET`: Set a secure secret key
- `PORT`: Railway automatically sets this

## 📊 API Status

- **Health Check**: `GET /` - Returns API status
- **Database Test**: `GET /db-test` - Tests database connectivity
- **Swagger Docs**: `GET /api` - Interactive API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of a milestone assignment.

## 🆘 Support

For issues and questions:
1. Check the API documentation at `/api`
2. Review the test files for usage examples
3. Check the application logs for error details

---

**Built with ❤️ using NestJS and Prisma**

## Created By Muhammad Iqbal Maulana
