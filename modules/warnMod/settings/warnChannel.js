var res = require("./../response.json");
var func = require("./../functions.js");

module.exports = async function(message){
	var args = message.content.slice(`${SB.prefix.default}setup `.length).trim().split(/ +/g);
	message.channel.stopTyping();
	message.channel.startTyping();
	if (typeof args[2] === undefined) {
		message.reply(res.warnChannel.undefined)
		message.channel.stopTyping();
		return;
	} else {
		var givenChannel = args[2].substring(0, args[2].length - 1).substring(2);
		var channelExists = false;
		message.guild.channels.cache.forEach((ch)=>{
			if (ch.id === givenChannel) {
				channelExists = true;
			}
		})
		if (channelExists === false){
			message.channel.stopTyping();
			message.reply(res.warnChannel.invalid)
			return;
		} else {
			try {
				var msg2edit = await message.channel.send("Processing...");
				SB.client.channels.cache.get(givenChannel).overwritePermissions([
						{
							id: message.guild.roles.everyone.id,
							deny: ['SEND_MESSAGES'],
						},
					], `Warn Channel Reserved by ${message.author.username}#${message.author.discriminator}`)
				func.write(message.guild.id,'warnLogChannel',givenChannel)
				SB.client.channels.cache.get(givenChannel).send(res.warnChannel.channelReserved.replace("%timeReserved%",new Date().toISOString()));
				msg2edit.edit(res.warnChannel.edited.replace("%channel%",`<#${givenChannel}>`));
			} catch(e){
				console.error(e);
				message.channel.send(res.setup.error);
			}
			message.channel.stopTyping();
		}
	}
}
