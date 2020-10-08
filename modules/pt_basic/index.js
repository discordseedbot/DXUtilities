module.exports = function() {
	const Discord = require("discord.js");
	const { RichEmbed } = require("discord.js");
	const prefix = SB.prefix.default;
	const signale = require("signale");

	SB.client.on('message',async message => {
		if (message.author.bot) return;
		if (message.content.indexOf(prefix) !== 0) return;
		var args = message.content.slice(prefix.length).trim().split( / +/g);
		const command = args.shift().toLowerCase();

		try {
			switch (command) {
				case 'avatar':
					require('./avatar.js').cmd(message);
					break;
				case 'contrib':
				case 'contributors':
					require('./contrib.js').github(message);
					break;
				case 'help':
					require('./help.js').cmd(message);
					break;
				case 'ping':
					require('./ping.js').cmd(message);
					break;
				case 'avatar':
					require('./avatar.js').cmd(message);
					break;
				case 'info':
					require('./info.js').cmd(message);
					break;
				case 'github':
					require('./contrib.js').github(message);
					break;
			}
		} catch(err) {
			SB_Libraries.forEach(async (m) => {
				if (m.name === "developer_alerts") {
					let tmpRequire = require(`./../../${m.location}/${m.main}`).userspaceError(message,err);
				}
			})
		}
	})

	SB.client.on('ready', () => {
		SB.con.module.bot.loaded("Basic")
	})
}
