const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");
const response = require("./response.json");

module.exports.github = function(message) {
	let evalEmbed = new Discord.MessageEmbed()
		.setColor(SB.core.misc_randHex())
		.setTitle(response.github.title)
		.setDescription(`${response.github.desc}`)
		.setTimestamp()
	message.channel.send(evalEmbed);
}
