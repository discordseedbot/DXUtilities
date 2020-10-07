const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");
const prefix = SB.prefix.default;
const signale = require("signale");

module.exports = function() {
	SB.client.on('message',async message => {
		if (message.author.bot) return;
		if (message.content.indexOf(prefix) !== 0) return;
		var args = message.content.slice(prefix.length).trim().split( / +/g);
		const command = args.shift().toLowerCase();

		try {
			switch (command) {
				case 'screenshare':
					require("./screen.js").cmd(message)
					break;
			}
		} catch(err){
			SB,libraries.forEach(async (m) => {
				if (m.name === "developer_alerts") {
					let tmpRequire = require(`./../../${m.location}/${m.main}`).userspaceError(message,err);
				}
			})
		}
	})

	SB.client.on('ready', () => {
		SB.con.module.bot.loaded("Screenshare")
	})
}
