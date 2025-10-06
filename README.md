# rxjsSenM

Internet Archive Search Bar built with RxJS - A reactive, declarative search interface.

![Search Interface](https://github.com/user-attachments/assets/e4fc5eb1-705e-4190-a461-cbf700b00554)

## Features

- Real-time search with 250ms throttling to reduce API calls
- Automatic retry on failure (up to 3 attempts)
- Request cancellation using switchMap (only latest search is active)
- Error handling with user-friendly messages
- Integration with Internet Archive's scrape API

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

4. Type in the search box to search the Internet Archive

## Implementation Details

The search bar follows the reactive pattern from the RxJS snippet:

```javascript
var searchResultSets =
  keyPresses
    .throttle(250)
    .map(key => getJSON("/searchResults?q=" + input.value).retry(3))
    .switchLatest();
```

Implemented as:
- `throttleTime(250)` - Throttles keypress events to reduce API calls
- `switchMap` - Cancels previous searches when a new one starts (replaces switchLatest)
- `retry(3)` - Automatically retries failed requests up to 3 times
- Error handling displays "the server appears to be down" message

## API Integration

The application uses the Internet Archive's scrape API:
- Endpoint: `https://archive.org/services/search/v1/scrape`
- Documentation: https://archive.org/services/search/v1/scrape
- Search syntax: https://archive.org/help/aboutsearch.htm

## Note

The Internet Archive API may be blocked by CORS policies in some environments. The application includes proper error handling to gracefully handle such cases.