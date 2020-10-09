var mex = {};

const fs = require("fs");
var storageLocation = SB.prefrences.warnMod.storageLocation;

function readJSON(){
	fs.readFile(storageLocation,'utf8',(e,d)=>{
		if (e) throw e;
		return JSON.parse(d);
	})
}

function writeJSONData(dataToWrite){
	dataToWrite = JSON.stringify(dataToWrite)
	fs.writeFile(storageLocation,dataToWrite,(e)=>{
		if (e) throw e;
		return true;
	})
}

mex.write = async function (guildID,data,value){
	try {
		fs.readFile(storageLocation,'utf8',async (e,d)=>{
			if (e) {
				throw e;
				return false;
			}
			const file = await JSON.parse(d);
			if (file[guildID][data] === undefined) {
				file[guildID][data] = "";
			}
			file[guildID][data] = value
			fs.writeFile(storageLocation,JSON.stringify(file),(err)=>{
				if (err) throw err;
				return ("Written data.");
			})
		})
	} catch (e) {
		console.error(e)
	}
}

mex.read = function(guildID,data) {
	try {
		const file = require(`./../../${storageLocation}`);
		return file[guildID][data];
	} catch(e) {
		console.error(e);
	}
}

mex.wipe = async function() {
	console.log("Deleting warnMod Storage");
	fs.unlink(storageLocation,(e)=>{
		if(e) throw e;
		console.log("Deleted warnMod Storage");
		return;
	})
}

mex.guildExists = async function(guildID) {
	fs.readFile(storageLocation,'utf8',async (e,d)=>{
		if (e) {
			throw e;
			return false;
		}
		var file = await JSON.parse(d)
		if (file[guildID] === undefined) {
			file[guildID] = {}
			writeJSONData(file);
		}
		return true;
	})
}

mex.initialize = async function() {
	if (!fs.existsSync(storageLocation)) {
		var outFile = {};
		fs.writeFile(storageLocation,JSON.stringify(outFile),(e)=>{
			if (e) throw e;
			console.log("Created warnLog Storage");
			return;
		})
	}
}

module.exports = mex;
