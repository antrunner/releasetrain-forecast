var linear = require('everpolate').linear
const fetch = require('node-fetch');

async function getVersions(component) {
	var url = "https://releasetrain.io/api/v?q="+component;
    var result = await fetch(url).then(res => res.json()).catch(err => console.error(err));;
    return result.reverse();
}

exports.nextReleaseDate = async function(component) {
	console.log("Component:", component);
	var prevReleaseDates  = [];
	var nextReleaseMs = []; 
	var nextReleaseDate = "";
	var vrd, year, month, day = ""
	var array1 = [];
	var nowMs = new Date().getTime();

	var versions = await getVersions(component).then((data) => {return data})

	if ( versions && versions.length > 0 ) {
		for (var i = 0; i < versions.length; i++) {
			if (versions[i].versionProductName.toLowerCase() == component.toLowerCase() &&
				versions[i].versionReleaseChannel.toLowerCase() != "cve") {
				array1.push(i+1)
				vrd = versions[i].versionReleaseDate; // "20120213"
				year = vrd.substring(0,4); 
				month = vrd.substring(4,6); 
				day = vrd.substring(6,8); 

				prevReleaseDates.push(new Date(year, month, day).getTime());
			}
		}

		// console.log(prevReleaseDates)

		nextReleaseMs = linear(array1.length+1,array1,prevReleaseDates);
		nextReleaseDate = new Date(parseInt(nextReleaseMs)).toUTCString();

		if (nextReleaseMs < nowMs) {
			return "Forecast not possible. Not sufficient data :-(";
		} else {
			return nextReleaseDate.toString();
		}
	} else {
		return "Forecast not possible. Component unknown :-(";
	}
}

this.nextReleaseDate("android").then((data) => {console.log(data)});