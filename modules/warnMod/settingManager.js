var me = {};

var res = require("./response.json")
const fs = require("fs");
var storageName = SB.prefrences.warnMod.storageLocation;


me.OTPGen = function(length) {
	if (typeof length != 'number') {
		throw "length given is not an interger";
	}
	if (length < 0) {
		throw "length cannot be a negative number";
	}
	var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	var retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

me.moduleInit = function() {
	try {
		var storageExists = fs.exists(storageName,(e)=>{
			return e;
		})
		if (!storageExists) {
			require("./functions.js").initialize()
			return true;
		}
	} catch(e){
		console.error(e);
		return false;
	}
}

me.setup = async function(message) {
	message.channel.startTyping();
	var setupMSG = await message.channel.send("Preparing our side to setup your server, hold tight!");
	var customIdentifiyer = me.OTPGen(8);
	var SHOUDISTAYORSHOULDIGOQUESTIONMARK = require("./functions.js").guildExists(message.guild.id)
	message.channel.startTyping();
	setTimeout(()=>{
		if (SHOUDISTAYORSHOULDIGOQUESTIONMARK) {
			setupMSG.edit(res.setup.ready.replace("%OTP%",customIdentifiyer));
			message.channel.stopTyping();
		} else {
			setupMSG.edit(res.error.internalError);
			message.channel.stopTyping();
		}
	},5000)
	SB.client.on('message',async (cmg)=>{
        if (message.author.bot) return;
		var prefix = `${SB.prefix.default}setup `;
        var args = cmg.content.slice(prefix.length).trim().split(/ +/g);

		if (args[0] === customIdentifiyer) {
			switch(args[1].toLowerCase()) {
				case "warnchannel":
					require("./settings/warnChannel.js")(cmg);
					break;
				case "warnrole":
					require("./settings/warnRole.js")(cmg);
					break;
				default:
					message.reply(res.setup.invalidCommand)
					break;
			}
		}
	})
}


me.fetch = function(guildID) {

}
me.set = function(guildID) {

}

module.exports = me;
