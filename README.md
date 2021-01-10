# releasetrain-forecast
Forecast software release version date.

```javascript

const rf = require('releasetrain-forecast');
rf.nextReleaseDate("android").then((data) => {console.log(data)});
// Sun, 31 Jan 2021 23:00:00 GMT
```