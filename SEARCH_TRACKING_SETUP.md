# Search Tracking Setup — Google Sheets

Track every search on help.kanencoffee.com and identify content gaps (searches with zero results).

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it **"Help Site Search Log"**
3. In Row 1, add these headers: `Timestamp | Query | Results | Total | Page`

## Step 2: Add the Apps Script

1. In the spreadsheet, go to **Extensions > Apps Script**
2. Delete everything in the editor and paste this:

```javascript
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var query = (e.parameter.q || '').trim().toLowerCase();
  var results = parseInt(e.parameter.results) || 0;
  var total = parseInt(e.parameter.total) || 0;

  if (query.length < 2) {
    return ContentService.createTextOutput('too short');
  }

  // Log the search
  sheet.appendRow([
    new Date(),
    query,
    results,
    total,
    'help.kanencoffee.com'
  ]);

  // Return a 1x1 transparent pixel (for Image beacon)
  return ContentService.createTextOutput('ok');
}
```

3. Click **Deploy > New deployment**
4. Choose **Web app**
5. Set "Execute as" to **Me**
6. Set "Who has access" to **Anyone**
7. Click **Deploy** and copy the URL (looks like `https://script.google.com/macros/s/AKfyc.../exec`)

## Step 3: Add the URL to your site

Open `index.html` and find this line near the bottom:

```html
<script>window.__SEARCH_LOG_URL = '';</script>
```

Paste your Apps Script URL between the quotes:

```html
<script>window.__SEARCH_LOG_URL = 'https://script.google.com/macros/s/AKfyc.../exec';</script>
```

Commit and push. Done!

## How it works

- Every search (3+ characters) fires after 1 second of no typing
- Sends query + result count to both GA4 and your Google Sheet
- Uses an Image beacon (no CORS issues, works on any static site)
- Zero impact on page performance (async, fire-and-forget)

## Viewing your content gaps

In the Google Sheet:
1. **Filter** column B (Results) to show only `0`
2. **Sort** by Query to group identical searches
3. These are the topics people are looking for but can't find — add them to the site!

You can also create a pivot table: Rows = Query, Values = COUNT of Query, Filter = Results = 0.
This gives you a ranked list of missing content.

## GA4 reporting

In Google Analytics (GA4):
- **Reports > Engagement > Events > `search_no_results`** — shows zero-result searches
- **Reports > Engagement > Events > `search`** — shows all searches
- Create an **Exploration** with `search_term` dimension + `event_count` metric, filtered to `search_no_results` event
