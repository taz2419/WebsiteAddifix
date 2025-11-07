# Testing Guide for AddiFix Visitor Counter

## Quick Test (Static Version)

If you want to see how the visitor counter looks without setting up the backend:

1. Open `index-static.html` in your web browser
2. You'll see demo visitor counts in the footer
3. Refresh the page a few times to see the numbers change

## Full Test (With Backend)

### 1. Setup and Start Server

```bash
# Navigate to project directory
cd /Users/tushar/Documents/Masters/Addifix/WebsiteAddifix

# Run automatic setup
./setup.sh

# Or manual setup:
# npm install
# npm start
```

### 2. Test the Website

1. Open your browser and go to `http://localhost:3000`
2. You should see the AddiFix website with visitor counter in the footer
3. The counter should start at 1 unique visitor and 1 total visit

### 3. Test Visitor Tracking

1. **Same Browser Test**: Refresh the page multiple times
   - Unique visitors should stay at 1
   - Total visits should increment each time

2. **Different Browser Test**: Open the site in a different browser (Safari, Chrome, Firefox)
   - Unique visitors should increment to 2
   - Total visits should also increment

3. **Incognito/Private Test**: Open in incognito/private browsing mode
   - Should be counted as a new unique visitor

### 4. Test Contact Form

1. Navigate to the Contact page (`http://localhost:3000/contact.html`)
2. Fill out and submit the form
3. Check the `contact-requests.json` file that gets created
4. Visitor counter should also update on the contact page

### 5. Test API Endpoints

You can test the API directly:

```bash
# Get current statistics
curl http://localhost:3000/api/stats

# Track a visitor (simulate a visit)
curl -X POST http://localhost:3000/api/visitor \
  -H "Content-Type: application/json"
```

### 6. Check Data Files

After running tests, you should see these files created:

- `visitor-data.json` - Contains visitor statistics
- `contact-requests.json` - Contains form submissions (if any)

## Expected Behavior

### Visitor Counter Logic

- **Unique Visitors**: Counted once per browser/device combination
- **Total Visits**: Every page load/refresh
- **Privacy**: Uses hashed fingerprints, not actual IP addresses

### Data Structure

The `visitor-data.json` file contains:

```json
{
  "totalVisitors": 5,
  "uniqueVisitors": ["hash1", "hash2", "hash3"],
  "visits": [
    {
      "timestamp": "2024-11-06T10:30:00.000Z",
      "fingerprint": "abc12345",
      "isNew": true,
      "userAgent": "Mozilla/5.0...",
      "ip": "127.0.0.1"
    }
  ]
}
```

## Troubleshooting

### Server Won't Start

1. **Port in use**: Try `PORT=8080 npm start`
2. **Node.js not installed**: Follow setup instructions in README.md
3. **Permission issues**: Make sure you have write permissions in the directory

### Visitor Counter Not Updating

1. Check browser console for JavaScript errors
2. Verify the server is running on the correct port
3. Check network tab in browser dev tools for failed API calls

### Numbers Don't Match Expected

1. Remember that the counter uses browser fingerprinting
2. Different browsers = different unique visitors
3. Incognito mode = new unique visitor
4. Same browser/same mode = same unique visitor

## Performance Notes

- The system stores the last 1000 visits to prevent the data file from growing too large
- For production use, consider migrating to a proper database
- Current implementation is suitable for small to medium traffic websites

## Next Steps

Once testing is complete, you can:

1. Deploy to a web server (Heroku, DigitalOcean, etc.)
2. Set up a proper database (PostgreSQL, MySQL)
3. Add more analytics features (page views, referrers, etc.)
4. Implement an admin dashboard to view statistics
