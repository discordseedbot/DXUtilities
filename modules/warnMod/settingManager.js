var me = {};

var res = require("./response.json")

me = function (message){

}

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
		var Enmap = SB.modules.node.enmap;
		SB.client.settings.warnMod = [];

		SB.client.settings.warnMod = new Enmap({
			name: "warnModSettings",
			fetchAll: true,
			autoFetch: true,
			cloneLevel: 'deep'
		});
		return true;
	} catch(e){
		console.error(e);
		return false;
	}
}

me.init = function(guildID) {
	try {
		var Enmap = SB.modules.node.enmap;
		SB.client.settings.warnMod.ensure(guildID,{
			warnLogChannel: 0,
			warnLimit: 3,
			warnRoles: [],
			settingsChanged: false
		})
		return true;
	} catch(e){
		console.error(e);
		return false;
	}
}

me.setup = async function(message) {
	message.channel.startTyping();
	var setupMSG = await message.channel.send("Preparing our side to setup your server, hold tight!");
	var customIdentifiyer = me.OTPGen(8);
	if (me.init(message.guild.id)) {
		setupMSG.edit(res.setup.ready.replace("%OTP%",customIdentifiyer));
		message.channel.stopTyping();
	} else {
		setupMSG.edit(res.error.internalError);
		message.channel.stopTyping();
	}
	SB.client.on('message',async (cmg)=>{
		var prefix = `<@!${SB.client.user.id}> `;
        var args = cmg.content.slice(prefix.length).trim().split(/ +/g);

		if (args[0] === customIdentifiyer) {
			switch(args[1].toLowerCase()) {
				case "warnchannel":
					require("./settings/warnChannel.js")(cmg);
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
