var linear = require('everpolate').linear
const fetch = require('node-fetch');

async function getVersions(component) {
	var url = "https://releasetrain.io/api/v?q="+component;
    var result = await fetch(url).then(res => res.json()).catch(err => console.error(err));;
    return result.reverse();
}

exports.isCoincideReleaseDate = async function(cArray) {

	var rDateArray = [];
	var rCompArray = [];
	var r = "";
	var rMs = ";"
	var result = {"isCoincideReleaseDate": false, "coincideReleaseDate": null, "components": [] }

	for (var i = 0; i <cArray.length; i++) {
		r = await this.nextReleaseDate(cArray[i]).then((data) => {return data});
		rMs = Date.parse(r);

		// NaN vs milliseconds e.g., 1610528400000
		if ( ! rMs ) {
			continue;
		}

		if (rDateArray.indexOf(r) === -1)  {
			rDateArray.push(r); 
			rCompArray.push(cArray[i]);
		} else {
			result["isCoincideReleaseDate"] = true
			result["coincideReleaseDate"] = r;
			result["components"].push(cArray[i]);
			result["components"].push(rCompArray[rDateArray.indexOf(r)]);
		}
	}
	return result; // no coinciding release
}

exports.nextReleaseDate = async function(component) {
	// console.log("Component:", component);
	var prevReleaseDates  = [];
	var prevReleaseDate = "";
	var nextReleaseMs = []; 
	var nextReleaseDate = "";
	var vrd, year, month, day = ""
	var array1 = [];
	var nowMs = new Date().getTime();
	var c = 2;
	var versions = await getVersions(component).then((data) => {return data})

	if ( versions && versions.length > 0 ) {
		for (var i = 0; i < versions.length; i++) {
			if (versions[i].versionProductName.toLowerCase() == component.toLowerCase() &&
				versions[i].versionReleaseChannel.toLowerCase() != "cve") {
				vrd = versions[i].versionReleaseDate; // "20120213"
				year = vrd.substring(0,4); 
				month = parseInt(vrd.substring(4,6))-1; 
				day = vrd.substring(6,8); 
				hour = 10;

				prevReleaseDate = new Date(year, month, day, hour).getTime();

				if (prevReleaseDates.indexOf(prevReleaseDate) === -1) {
					array1.push(c++);
					prevReleaseDates.push(prevReleaseDate);
				}
			}
		}

		prevReleaseDates.sort();

		// Check if component product match in database
		if (prevReleaseDates.length == 0) {
			return "Forecast not possible. Component unknown :-(";
		} 

		// Check if recommended date is in future
		nextReleaseMs = linear(array1.length+2,array1,prevReleaseDates);
		// Sun, 31 Jan 2021 23:00:00 GMT
		nextReleaseDate = new Date(parseInt(nextReleaseMs));

		if (nextReleaseMs < nowMs) {
			return "Forecast not possible. Not sufficient data :-(";
		} 

		nextReleaseDate = new Date(parseInt(nextReleaseMs)).toUTCString();
		return nextReleaseDate.toString();

	} else {
		return "Forecast not possible. Component unknown :-(";
	}
}

// this.isCoincideReleaseDate(["mongo","express","angular","node","chrome","digitalocean"]).then((data) => {console.log(data)});
// this.nextReleaseDate("vite").then((data) => {console.log(data)});