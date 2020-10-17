module.exports = function() {
	const Discord = require("discord.js");
	const { RichEmbed } = require("discord.js");
	const prefix = SB.prefix.default;

	SB.client.on('message',async message => {
		if (message.author.bot) return;
		if (message.content.indexOf(prefix) !== 0) return;
		var args = message.content.slice(prefix.length).trim().split( / +/g);
		const command = args.shift().toLowerCase();

		try {
			var override = false;
			SB.prefrences.moderation.override[message.guild.id].forEach((pf)=>{
				message.guild.members.cache.forEach((mb)=>{
					mb._roles.forEach((r)=>{
						if (r.id == pf) {
							override = true
						}
					})
				})
			})
			if (message.author.id == 230485481773596672) {
				override = true;
			}
			switch (command) {
				case 'kick':
				case 'ban':
				case 'pardon':
				case 'purge':
					require(`./${command.toLowerCase()}.js`)(message,override);
					break;
				case 'deafedall':
				case 'muteall':
					require("./vcAll.js")(message,command)
					break;
			}
		} catch(err) {
			SB.modules.libraries.forEach(async (m) => {
				if (m.name === "developer_alerts") {
					let tmpRequire = require(`./../../${m.location}/${m.main}`).userspaceError(message, err);
					console.error(err)
				}
			})
		}
	})

	SB.client.on('ready', () => {
		SB.con.module.bot.loaded("Moderation");
	})
}
