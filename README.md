# releasetrain-forecast
Forecast software release version date.

```javascript
const rf = require('releasetrain-forecast');

rf.nextReleaseDate("vite").then((data) => {console.log(data)});
// Sun, 31 Jan 2021 23:00:00 GMT

rf.nextReleaseDate("vite-2").then((data) => {console.log(data)});
// Forecast not possible. Component unknown :-(

rf.nextReleaseDate("mongo").then((data) => {console.log(data)});
// Forecast not possible. Not sufficient data :-(

rf.isCoincideReleaseDate(["vite","mongo","next.js"])
	.then((data) => {
		console.log(data)
	});
/*
{
  isCoincideReleaseDate: true,
  coincideReleaseDate: 'Wed, 13 Jan 2021 09:00:00 GMT',
  components: [ 'vite', 'next.js' ]
}
*/

rf.isCoincideReleaseDate(["mongo","express","angular","node"])
	.then((data) => {
		console.log(data)
	});
/*
{
  isCoincideReleaseDate: false,
  coincideReleaseDate: null,
  components: []
}
*/

```