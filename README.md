# User Authentication System

A secure user authentication system built with FastAPI, providing registration, login, logout, and password reset functionality.

## Features

- **Secure Registration**: Email validation and strong password requirements
- **User Login/Logout**: Session-based authentication with secure tokens
- **Password Reset**: Email-based password reset with secure tokens
- **Security**: Argon2 password hashing, rate limiting, timing attack protection
- **Modern Architecture**: Clean separation of concerns with comprehensive testing

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run Database Migrations**
   ```bash
   alembic upgrade head
   ```

4. **Start the Server**
   ```bash
   uvicorn auth.main:app --reload
   ```

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/password-reset/request` - Request password reset
- `POST /auth/password-reset/confirm` - Confirm password reset
- `GET /auth/session/validate` - Validate session

## Development

Run tests:
```bash
pytest
```

Format code:
```bash
black auth/ tests/
isort auth/ tests/
```

## Security Features

- Argon2 password hashing with configurable parameters
- Cryptographically secure token generation
- Rate limiting for authentication attempts
- Timing attack protection
- Comprehensive security event logging
- Session management with automatic cleanup# kiromuse
