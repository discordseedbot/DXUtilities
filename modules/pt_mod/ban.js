const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");

module.exports = function(message,override) {
	var args = message.content.slice(SB.prefix.default.length).trim().split( / +/g);
	let userToBan = message.mentions.users.first() || SB.client.users.cache.get(args[1]);
	var reason = "";
	args.forEach((ag)=>{
		switch (ag) {
			case args[0]:
			case args[1]:
				break;
			default:
				reason+=`${ag} `;
				break;
		}
	})
	console.log(args);
	let banReason = reason;
	if (reason.length < 1) { message.reply('You must supply a reason for the ban.'); return false; }
	if (userToBan === undefined) { message.reply('You must mention someone to ban them.'); return false; }

	if (message.guild.member(userToBan) !== null && !message.guild.member(userToBan).bannable){ message.reply('I cannot ban that member'); return false; };
	if (!override) {
		if (!message.member.hasPermission('BAN_MEMBERS')) {
			return message.reply('You do not have permissions to ban.');
		}
	}

	if (!message.guild.me.hasPermission('BAN_MEMBERS')) {message.reply("I don't have permission to ban!"); return false;}
	console.log(userToBan)
	message.guild.members.ban(userToBan,{reason: banReason}).then((member) => {
		bannedUserID = userToBan.id;

		message.channel.send({embed: {
			color: 770000,
			author: {name:`User was banned from ${message.guild.name}`},
			fields: [{
				name: `Reason // ${userToBan.username} was banned`,
				value: `${reason}`
			}],
			timestamp: `Banned at; ${new Date()}`,
			footer: {
				text: `Banned by; ${message.author.username}`
			}
		}});
		SB.client.users.cache.get(userToBan.id).send({embed: {
			color: 770000,
			author: {name:`You were banned from ${message.guild.name}`},
			fields: [{
				name: `Reason // ${userToBan.username} banned`,
				value: `${reason}`
			}],
			timestamp: `Banned at; ${new Date()}`,
			footer: {
				text: `Banned by; ${message.author.username}`
			}
		}});
	})
}
