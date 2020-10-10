const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");

module.exports = function(message,override) {
	var args = message.content.slice(SB.prefix.default.length).trim().split( / +/g);
	let userToKick = message.mentions.users.first() || message.guild.members.cache.get(args[1]).user;
	var kickReason = "";
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
	if (kickReason.length < 1) { message.reply('You must supply a reason for the kick.'); return false; }
	if (userToKick === undefined) { message.reply('You must mention someone to kick them.'); return false; }

	if (!message.guild.member(userToKick).kickable){ message.reply('I cannot kick that member'); return false; };
	if (!override) {
		if (!message.member.hasPermission('KICK_MEMBERS')) {
			return message.reply('You do not have permissions to kick.');
		}
	}

	if (!message.guild.me.hasPermission('KICK_MEMBERS')) {message.reply("I don't have permission to kick!"); return false;}
	message.guild.member(userToKick).kick(kickReason).then((member) => {
		kickedUserID = userToKick.id;

		message.channel.send({embed: {
			color: 770000,
			author: {name:`User was kicked from ${message.guild.name}`},
			fields: [{
				name: `Reason // ${member.displayName} was kicked`,
				value: `${kickReason}`
			}],
			timestamp: `Kicked at; ${new Date()}`,
			footer: {
				text: `Kicked by; ${message.author.username}`
			}
		}});
		SB.client.users.cache.get(userToKick.id).send({embed: {
			color: 770000,
			author: {name:`You were Kicked from ${message.guild.name}`},
			fields: [{
				name: `Reason // ${member.displayName} kicked`,
				value: `${kickReason}`
			}],
			timestamp: `Kicked at; ${new Date()}`,
			footer: {
				text: `Kicked by; ${message.author.username}`
			}
		}});
	})
}
