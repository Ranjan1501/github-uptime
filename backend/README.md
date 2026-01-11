# Backend API Server

## Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create a `.env` file with your GitHub token:
```
GITHUB_TOKEN=your_github_personal_access_token_here
```

## Getting a GitHub Token

To increase the API rate limit from 60 requests/hour to 5000 requests/hour:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "github-profile-api")
4. Select scopes: You don't need any special scopes for public data, but you can select `public_repo` if needed
5. Click "Generate token"
6. Copy the token and add it to your `.env` file as `GITHUB_TOKEN`

**Note:** Without a token, you're limited to 60 requests/hour per IP address. With a token, you get 5000 requests/hour.

## Running the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

- `GET /api/github/user/:username` - Get user profile
- `GET /api/github/repositories/:username` - Get user repositories
- `GET /api/github/contributions/:username` - Get user contributions (may return empty array)

## Error Handling

- **403 Forbidden**: Rate limit exceeded. Check the error message for reset time.
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server error, check logs
