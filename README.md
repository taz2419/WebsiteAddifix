# AddiFix Website with Visitor Counter

This is the AddiFix vintage car parts website enhanced with a visitor counter system that tracks unique visitors and total visits.

## Features

- **Visitor Counter**: Tracks unique visitors and total visits
- **Data Persistence**: Visitor data is stored in a JSON file on the backend
- **Privacy-Focused**: Uses hashed fingerprints (IP + User-Agent) to identify unique visitors without storing personal information
- **Real-time Updates**: Visitor count updates automatically when users visit the site
- **Contact Form**: Handles contact form submissions and stores them in a JSON file

## Setup Instructions

### Option 1: Automatic Setup (Recommended)

Run the setup script which will install all dependencies automatically:

```bash
cd /Users/tushar/Documents/Masters/Addifix/WebsiteAddifix
./setup.sh
```

### Option 2: Manual Setup

#### 1. Install Node.js

**Method A - Using Homebrew (Recommended):**

First install Homebrew if you don't have it:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install Node.js:
```bash
brew install node
```

**Method B - Download from Official Site:**

Visit [nodejs.org](https://nodejs.org/) and download the LTS version for macOS.

#### 2. Install Project Dependencies

```bash
cd /Users/tushar/Documents/Masters/Addifix/WebsiteAddifix
npm install
```

#### 3. Start the Server

To start the server in production mode:

```bash
npm start
```

For development with auto-restart on file changes:

```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

### 3. Access the Website

Open your web browser and navigate to `http://localhost:3000` to see your website with the visitor counter.

## How It Works

### Backend (server.js)

- **Express.js Server**: Handles API requests and serves static files
- **Visitor Tracking**: Creates a unique fingerprint for each visitor based on IP and User-Agent
- **Data Storage**: Stores visitor data in `visitor-data.json` and contact requests in `contact-requests.json`
- **Privacy**: Only stores hashed fingerprints, not actual IP addresses or personal data

### Frontend Integration

- **Automatic Tracking**: The visitor counter is triggered when pages load
- **Display**: Shows unique visitors and total visits in the footer
- **API Integration**: Communicates with the backend via REST API

### API Endpoints

- `POST /api/visitor` - Track a new visitor and return current statistics
- `GET /api/stats` - Get current visitor statistics
- `POST /api/requests` - Handle contact form submissions

## Data Files

The system creates the following data files automatically:

- `visitor-data.json` - Stores visitor statistics and visit history
- `contact-requests.json` - Stores contact form submissions

## Customization

### Changing the Port

Set the `PORT` environment variable:

```bash
PORT=8080 npm start
```

### Database Integration

To upgrade to a proper database (recommended for production):

1. Install a database driver (e.g., `pg` for PostgreSQL, `mysql2` for MySQL)
2. Replace the JSON file operations in `server.js` with database queries
3. Create appropriate database tables for visitors and contact requests

### Analytics Enhancement

You can enhance the system by:

- Adding page view tracking
- Implementing geographic location tracking
- Adding referrer tracking
- Creating an admin dashboard to view statistics

## Security Considerations

- The current implementation is suitable for development and small-scale deployment
- For production use, consider:
  - Adding rate limiting
  - Using a proper database with connection pooling
  - Implementing proper error handling and logging
  - Adding SSL/HTTPS support
  - Using environment variables for configuration

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, either:
- Stop the service using that port, or
- Use a different port: `PORT=8080 npm start`

### Permission Issues

Make sure Node.js has write permissions to create the data files in the project directory.

## License

MIT License - see package.json for details.
