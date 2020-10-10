const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");

module.exports = function(message,override) {
	var args = message.content.slice(SB.prefix.default.length).trim().split( / +/g);
	console.log(args)
	let userToPardon = message.mentions.users.first() || SB.client.users.cache.get(args[1]);
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
	let banReason = reason;
	if (reason.length < 1) { message.reply('You must supply a reason for the unban.'); return false; }
	if (userToPardon === undefined) { message.reply('You must mention someone to unban them.'); return false; }
	if (!override) {
		if (!message.member.hasPermission('BAN_MEMBERS')) {
			return message.reply('You do not have permissions to unban.');
		}
	}

	if (!message.guild.me.hasPermission('BAN_MEMBERS')) {message.reply("I don't have permission to unban!"); return false;}
	message.guild.members.unban(userToPardon,{reason: banReason}).then((member) => {
		bannedUserID = userToPardon.id;

		message.channel.send({embed: {
			color: 770000,
			author: {name:`User was Unbanned from ${message.guild.name}`},
			fields: [{
				name: `Reason // ${userToPardon.username} was Unbanned`,
				value: `${reason}`
			}],
			timestamp: `Unbanned at; ${new Date()}`,
			footer: {
				text: `Unbanned by; ${message.author.username}`
			}
		}});
		SB.client.users.cache.get(userToPardon.id).send({embed: {
			color: 770000,
			author: {name:`You were un-banned from ${message.guild.name}`},
			fields: [{
				name: `Reason // ${userToPardon.username} un-banned`,
				value: `${reason}`
			}],
			timestamp: `Unbanned at; ${new Date()}`,
			footer: {
				text: `Unbanned by; ${message.author.username}`
			}
		}});
	})
}
