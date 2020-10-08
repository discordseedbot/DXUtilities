const defaultSettings = {
	channels: {
		warnLog: 0
	},
	warn: {
		limit: 3,
		roles: []
	},
	settingsChanged: false
};

var me = {};

me.init = function(guildID) {
	var Enmap = SB.modules.node.enmap;
	SB.client.settings.warnMod = [];

	SB.client.settings.warnMod[guildID] = new Enmap({
		name: "settings",
		fetchAll: false,
		autoFetch: true,
		cloneLevel: 'deep'
	});
}

me.setup = function(message) {
	message.channel.startTyping();
	var setupMSG = message.channel.send("Preparing our side to setup your server, hold tight!");
}

me = function (message){

}

me.fetch = function(guildID) {

}
me.set = function(guildID) {

}

module.exports = me;
