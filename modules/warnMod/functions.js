var mex = {};

const fs = require("fs");
var storageLocation = SB.prefrences.warnMod.storageLocation;

function readJSON(){
	fs.readFile(storageLocation,'utf8',(e,d)=>{
		if (e) throw e;
		return JSON.parse(d);
	})
}

mex.write = async function (guildID,data,value){
	try {
		const file = await readJSON();
		if (eval(`file[${guildID}].data`) === undefined) {
			eval(`file[${guildID}].data = {}`)
		}
		eval(`file[${guildID}].${data} = ${value}`);

		fs.writeFile(storageLocation,JSON.stringify(file),(err)=>{
			if (err) throw err;
			return ("Written data.");
		})
	} catch (e) {
		console.error(e)
	}
}

mex.read = async function(guildID,data) {
	try {
		const file = await readJSON();
		var retval = await eval(`file[${guildID}].${data}`);
		return retval;
	} catch(e) {
		console.error(e);
	}
}

mex.initialize = async function() {
	if (fs.existsSync(storageLocation)) {
		// storage exists, we delete the file
		console.log("Deleting warnMod Storage");
		fs.unlink(storageLocation,(e)=>{
			if(e) throw e;
			console.log("Deleted warnMod Storage");
		})
	} else {
		// storage dose not exist, create file
		var outFile = [];
		fs.writeFile(storageLocation,JSON.stringify(outFile),(e)=>{
			if (e) throw e;
			console.log("Created warnLog Storage");
		})
	}
}

module.exports = mex;
