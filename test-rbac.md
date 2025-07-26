# 🧪 Role-Based Access Control (RBAC) Testing Guide

## Overview
This guide helps you test the role-based access control implementation in the RevoBank API.

## Test Setup

### 1. Create Test Users

#### Create a Regular User
```bash
POST /auth/register
{
  "email": "user@test.com",
  "password": "password123",
  "name": "Test User"
}
```

#### Create an Admin User
First, register a regular user, then manually update their role in the database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@test.com';
```

Or use the admin endpoint (if you already have an admin):
```bash
PATCH /user/admin/{user_id}/role
Authorization: Bearer <admin_token>
{
  "role": "ADMIN"
}
```

## Test Scenarios

### Scenario 1: User Access Control

#### Test 1: Regular User Accessing Their Own Account
```bash
# Login as regular user
POST /auth/login
{
  "email": "user@test.com",
  "password": "password123"
}

# Create account (should work)
POST /accounts
Authorization: Bearer <user_token>
{
  "initialBalance": 1000
}

# Get own accounts (should work)
GET /accounts
Authorization: Bearer <user_token>
```

#### Test 2: Regular User Accessing Admin Endpoints
```bash
# Try to access admin-only endpoint (should fail with 403)
GET /accounts/admin/all
Authorization: Bearer <user_token>

# Try to create account for another user (should fail with 403)
POST /accounts/admin/create-for-user
Authorization: Bearer <user_token>
{
  "userId": 2,
  "initialBalance": 500
}
```

### Scenario 2: Admin Access Control

#### Test 1: Admin Accessing All Data
```bash
# Login as admin
POST /auth/login
{
  "email": "admin@test.com",
  "password": "password123"
}

# Get all accounts (should work)
GET /accounts/admin/all
Authorization: Bearer <admin_token>

# Get all users (should work)
GET /user/admin/all
Authorization: Bearer <admin_token>

# Create account for any user (should work)
POST /accounts/admin/create-for-user
Authorization: Bearer <admin_token>
{
  "userId": 1,
  "initialBalance": 2000
}
```

#### Test 2: Admin Accessing User-Specific Endpoints
```bash
# Get accounts (should show all accounts, not just admin's)
GET /accounts
Authorization: Bearer <admin_token>

# Get specific account (should work for any account)
GET /accounts/1
Authorization: Bearer <admin_token>
```

### Scenario 3: Cross-User Access Control

#### Test 1: User Trying to Access Another User's Account
```bash
# Login as user1
POST /auth/login
{
  "email": "user1@test.com",
  "password": "password123"
}

# Try to access user2's account (should fail with 404)
GET /accounts/2
Authorization: Bearer <user1_token>
```

#### Test 2: User Trying to Update Another User's Account
```bash
# Try to update user2's account (should fail with 404)
PATCH /accounts/2
Authorization: Bearer <user1_token>
{
  "balance": 5000
}
```

## Expected Results

### ✅ Success Cases
- Regular users can access their own accounts and transactions
- Admins can access all accounts, users, and transactions
- Admins can create accounts for any user
- Admins can update user roles

### ❌ Failure Cases
- Regular users get 403 Forbidden when accessing admin endpoints
- Regular users get 404 Not Found when accessing other users' data
- Invalid tokens result in 401 Unauthorized
- Missing tokens result in 401 Unauthorized

## API Endpoints Summary

### Regular User Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /user/profile` - Get own profile
- `PATCH /user/profile` - Update own profile
- `POST /accounts` - Create own account
- `GET /accounts` - Get own accounts
- `GET /accounts/:id` - Get own account by ID
- `PATCH /accounts/:id` - Update own account
- `DELETE /accounts/:id` - Delete own account
- All transaction endpoints (own accounts only)

### Admin-Only Endpoints
- `GET /accounts/admin/all` - Get all accounts with user details
- `POST /accounts/admin/create-for-user` - Create account for any user
- `GET /user/admin/all` - Get all users
- `GET /user/admin/:id` - Get specific user with details
- `PATCH /user/admin/:id/role` - Update user role

## Testing Checklist

- [ ] Regular user can access their own data
- [ ] Regular user cannot access admin endpoints (403)
- [ ] Regular user cannot access other users' data (404)
- [ ] Admin can access all data
- [ ] Admin can create accounts for any user
- [ ] Admin can update user roles
- [ ] Invalid tokens return 401
- [ ] Missing tokens return 401
- [ ] Role changes take effect immediately 