/*
	Copyright 2018-2020 DARiOX					https://dariox.club
	Copyright 2019-2020 SeedBot Contributers	https://seedbot.xyz
*/

/*
	---++++========|DISCLAIMER|========++++---
		Please do not edit this file if you
		have know idea what you are doing.

		If you edit this file and something
		goes wrong, nobody is to blame except
		yourself.

		If you do plan to edit this file,
		make a pull request with your changes
		any changes that are usefull are
		most likely to be merged.
	---++++============================++++---
*/



//			Check if node mdoules are installed
const fs = require("fs");
if (!fs.existsSync("node_modules/")) {
	console.log("Node Modules were not installed, try `npm i`");
	process.exit(10);
}

//			Initialize SeedBot Global Variable
global.SB = {
	parameters: {
		buildMode: false,
		debugMode: false,
		safeMode: false
	},
	prefrences: {},
	libraries: {},
	modules: {"node":{}},
	client: () => {
		return new Error("Client has not been, something has gone wrong with your module or the loader.");
	},
	core: () => {
		return new Error("Core Module has not been. There might be something wrong with `/index.js` or with the core module itself.");
	},
	buildTools: () => {
		return new Error("BuildMode is not enabled. Please read documentation for farther knowledge.")
	},
};
//			Check if SeedBot was launched in DebugMode or buildMode,
//				if it was then we set the debugMode parameter.
if(process.argv.indexOf("--debug") > -1 || process.argv.indexOf("--buildMode") > -1){
	global.SB.parameters.debugMode 	= true;
}
if(process.argv.indexOf("--buildMode") > -1){
	global.SB.parameters.buildMode 	= true;
}
if(process.argv.indexOf("--safe") > -1){
	global.SB.parameters.safeMode 	= true;
}

if (!SB.parameters.buildMode || !SB.parameters.safeMode) {
	if (!fs.existsSync("logs")){ fs.mkdirSync("logs"); }
	var botStartTime = Math.floor(+new Date() / 1000);
	function dateFormat (date, fstr, utc) { utc = utc ? 'getUTC' : 'get'; return fstr.replace (/%[YmdHMS]/g, function (m) { switch (m) { case '%Y': return date[utc + 'FullYear'] (); case '%m': m = 1 + date[utc + 'Month'] (); break; case '%d': m = date[utc + 'Date'] (); break; case '%H': m = date[utc + 'Hours'] (); break; case '%M': m = date[utc + 'Minutes'] (); break; case '%S': m = date[utc + 'Seconds'] (); break; default: return m.slice (1); } return ('0' + m).slice (-2); }); }
	function formatOutput(content,ptype) { var currentTime = new Date(); var currentUNIX = Math.floor(+currentTime / 1000); var currentFormattedTime = dateFormat(currentTime, "%Y/%m/%d - %H:%M:%S", true); var printType = ""; if (ptype === undefined) { ptype = "log"; } switch(ptype.toLowerCase()){ case "log":case "info":default: printType = "LOG"; break; case "info": printType = "INF"; break; case "error": printType = "ERR"; break; case "debug": printType = "DBG"; break; case "warn": printType = "WRN"; break; }; var z = `[${currentFormattedTime}]   ${printType}   ${content}`; fs.appendFileSync(`logs/${botStartTime}.log`,`${z}\r\n`); return z; }
	global.console.log = function(){
		for (i=0;i<arguments.length;i++){
			try {
				process.stdout.write(`${formatOutput(arguments[i])}\r\n`);
			} catch (e){
				throw e;
			}
		}
	}
	global.console.error = function(){
		for (i=0;i<arguments.length;i++){
			try {
				process.stdout.write(`${formatOutput(arguments[i],"error")}\r\n`);
			} catch (e){
				throw e;
			}
		}
	}
	global.console.debug = function(){
		for (i=0;i<arguments.length;i++){
			try {
				process.stdout.write(`${formatOutput(arguments[i],"debug")}\r\n`);
			} catch (e){
				throw e;
			}
		}
	}
	global.console.warn = function(){
		for (i=0;i<arguments.length;i++){
			try {
				process.stdout.write(`${formatOutput(arguments[i],"warn")}\r\n`);
			} catch (e){
				throw e;
			}
		}
	}
	global.console.info = function(){
		for (i=0;i<arguments.length;i++){
			try {
				process.stdout.write(`${formatOutput(arguments[i],"info")}\r\n`);
			} catch (e){
				throw e;
			}
		}
	}

	//			If buildTools was not found then we will disable it.
	if (!fs.existsSync("./.buildTools.js") && SB.parameters.buildMode) {
		global.SB.parameters.buildMode 	= false;
		throw new Error("BuildTools could not be found. Disabling.");
	} else {
		//			Set buildTools function so modules can use it.
		if (SB.parameters.buildMode) {
			try {
				global.SB.buildTools = require("./.buildTools.js");
			} catch(e) {
				console.error(e);
				process.exit(10);
			}
		}
	}
}

//			Declare Global Static Varaibles and other (sorta) pre-launch stuff.
try {
	require('events').EventEmitter.defaultMaxListeners = 255;
	if (SB.parameters.buildMode) {
		SB.buildTools.buildIncrement()
	}
	SB.package = require("./package.json");
	SB.prefrences = require("./prefrences.json");
	SB.modules.node.signale = require("signale");
} catch (e) {
	require("signale").error("An error Occoured when declaring [GlobalVariables]");
	console.error(e);
	process.exit(11);
}

//			Clear console if debugMode is not set.
if (!SB.parameters.debugMode) {
	console.clear();
}
function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

//			Check each of the directories in "modules/" if they have a "manifest.json" file.
var moduleArray = getDirectories("modules/");
var viableModules = [];
moduleArray.forEach(async (m) => {
	let tmpManiLoc = `modules/${m}/manifest.json`;
	if (!fs.existsSync(tmpManiLoc)) {
		signale.note(`[modman] no manifest found for "${m}" in "${tmpManiLoc}"`);
	} else {
		viableModules.push(`modules/${m}`);
	}
})

//			If there are no valid modules quit process.
if (viableModules.length < 1) {
	signale.log("[modman] No valid modules found.");
	process.exit(1);
}

//			Check if manifest for the module is valid
viableModules.forEach(async (m) => {
	try {
		var json = require(`./${m}/manifest.json`).name;
	} catch (e) {
		console.error(e);
		switch (e.code) {
			case "MODULE_NOT_FOUND":
				signale.fatal("invalid location? but we checked that in lines 100 to 107, huh. you probably should tell the developers shit went down.");
				process.exit(10);
				break;
			default:
				signale.fatal(`[modman] Manifest is invalid at "${m}/manifest.json"`);
				viableModules.splice(j);
				break;
		}
	}
})

//			Check if any of the modules are libraries and if they are, remove them from the viableModules array.

//		Setup variables for checking modules.
var botModulesToLoad = [];
var genericModulesToLoad = [];
var libraries = [];
var temparr = [];

//			Run this function for every module found in the varaible viableModules
viableModules.forEach(async (m) => {
	try {
		let jsontemp = require(`./${m}/manifest.json`);
		let filepush = `${m}/${jsontemp.main}`;
		if (!SB.parameters.debugMode) {
			if (m.indexOf('example') !== -1 || m.indexOf('test') !== -1) {
				SB.modules.node.signale.error("Example Module was disabled [Not in Debug Mode]");
				jsontemp.type = "example";
				return;
			}
			if (m.indexOf('debug') !== -1) {
				SB.modules.node.signale.info("Disabed Debug Module");
				jsontemp.type = "disabled";
			}
		}
		jsontemp.location = `${m}`;
		jsontemp.f = require(`./${jsontemp.location}/${jsontemp.main}`);
		jsontemp.storage = null;
		switch (jsontemp.type) {
			case "botmod":
				botModulesToLoad.push(		jsontemp);
				break;
			case "generic":
				genericModulesToLoad.push(	jsontemp);
				break;
			case "library":
				libraries.push(				jsontemp);
				break;
			case "disabled":
				SB.modules.node.signale.info(`${jsontemp.name}@${jsontemp.version} disabled`);
				break;
			default:
				SB.modules.node.signale.warn(`[modman] Unknown Module type at "${m}/manifest.json"`);
				break;
		}
		global.SB.modules.bot = botModulesToLoad;
		global.SB.modules.generic = genericModulesToLoad;
	} catch(e) {
		SB.modules.node.signale.error("[modman] An Error Occoured while sorting modules.");
		console.error(e);
	}
})

var coreFound = false;
libraries.forEach((m) => {
	if (m.name === "core") {
		global.SB.core = require(`./${m.location}/${m.main}`);
		coreFound = true;
	}
})
if (!coreFound) {
	SB.modules.node.signale.error("Core Library was not found. Process Halted.");
	delete(coreFound);
	process.exit(12);
} else {
	SB.modules.libraries = libraries;
	SB.core.onLaunch();
}

//			Discord.JS Login with Error Catching.
SB.modules.node.discord = require("discord.js");
global.SB.client = new SB.modules.node.discord.Client();

// Declare Enmap
SB.modules.node.enmap = require("enmap")

setTimeout(()=>{
	SB.client.login(SB.token.discord).catch((e)=>{
		console.log(e);
		switch(e.code) {
			case "SELF_SIGNED_CERT_IN_CHAIN":
				SB.modules.node.signale.error("Self-Signed certificate found in chain.");
				process.exit(1);
				break;
			case "TOKEN_INVALID":
				SB.modules.node.signale.error("Discord Token is Invalid.")
				process.exit(1);
				break;
			default:
				console.log(e);
				process.exit(1);
				break;
		}
	});

	//			From this point all errors should be from the modules.
	SB.client.on('ready', function(){
		if (!SB.parameters.debugMode) {
			console.clear()
			SB.modules.node.signale.complete("Discord Bot connected at", new Date().toISOString());
		} else {
			console.log("- - - - - Discord Bot Logged In - - - - -");
			console.log("Logged in at", new Date().toISOString())
		}
	});
	SB.modules.bot.forEach(async (m) => {
		SB.con.module.bot.attemptLoad(`${m.name}@${require("./"+m.location+"/manifest.json").version}`)
		m.f();
	});
	SB.modules.generic.forEach(async (m) => {
		SB.con.module.attemptLoad(`${m.name}@${require("./"+m.location+"/manifest.json").version}`);
		m.f();
	});
},2000)
