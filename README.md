# rxjsSenM

Internet Archive Search Bar built with RxJS - A reactive, declarative search interface.

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

The search bar follows the reactive pattern:
- `throttleTime(250)` - Throttles keypress events to reduce API calls
- `switchMap` - Cancels previous searches when a new one starts
- `retry(3)` - Automatically retries failed requests up to 3 times
- Error handling displays "the server appears to be down" message

Based on the RxJS pattern:
```javascript
var searchResultSets =
  keyPresses
    .throttle(250)
    .map(key => getJSON("/searchResults?q=" + input.value).retry(3))
    .switchLatest();
```