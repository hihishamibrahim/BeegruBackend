# Beegru Backend

Backend service for the Beegru application.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and configure environment variables:
```bash
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
MONGODB_URI=mongodb://localhost:27017/mydatabase
```

## Running the Application

Development mode:
```bash
node server.js
```