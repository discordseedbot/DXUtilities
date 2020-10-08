var me = {};

var res = {
	"warnChannel": {
		"undefined": "No warn channel was given, just do # then the channel name in the command, e.g `@DARiOX Utilities [code] warnChannel #warnLog`",
		"invalid": "Channel given does not exist!",
		"edited": "Warn channel has been set to %channel%. Whenever somebody is warned a message will be put in there with a info about their warn. For more information check your Partner Guide."
	},
	"setup": {
		"ready": "We're ready to setup your server, read the guide (https://github.com/discordseedbot/DXUtilities/warmMod.md). Your SessionID is `%OTP%`",
		"error": "An internal error occoured, sorry for the inconvenience!"
	}
}

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
			name: "settings",
			fetchAll: false,
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
					cmg.channel.stopTyping();
					cmg.channel.startTyping();
					if (typeof args[2] === undefined) {
						cmg.reply(res.warnChannel.undefined)
						cmg.channel.stopTyping();
						break;
					} else {
						var givenChannel = args[2].substring(0, args[2].length - 1).substring(2);
						var channelExists = false;
						cmg.guild.channels.cache.forEach((ch)=>{
							if (ch.id === givenChannel) {
								channelExists = true;
							}
						})
						if (channelExists === false){
							cmg.channel.stopTyping();
							cmg.reply(res.warnChannel.invalid)
							break;
						} else {
							try {
								var msg2edit = await cmg.channel.send("Processing...");
								SB.client.settings.warnMod.set(cmg.guild.id,'warnLogChannel',givenChannel)
								msg2edit.edit(res.warnChannel.edited.replace("%channel%",`<#${givenChannel}>`));
							} catch(e){
								console.error(e);
								cmg.channel.send(res.setup.error);
							}
							cmg.channel.stopTyping();
						}
					}
					break;
				default:

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
