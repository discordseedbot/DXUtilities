var res = require("./../response.json");

module.exports = async function(cmg){
	var args = cmg.content.slice(`<@!${SB.client.user.id}> `.length).trim().split(/ +/g);
	cmg.channel.stopTyping();
	cmg.channel.startTyping();
	if (typeof args[2] === undefined) {
		cmg.reply(res.warnChannel.undefined)
		cmg.channel.stopTyping();
		return;
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
			return;
		} else {
			try {
				var msg2edit = await cmg.channel.send("Processing...");
				SB.client.channels.cache.get(givenChannel).overwritePermissions([
						{
							id: cmg.guild.roles.everyone.id,
							deny: ['SEND_MESSAGES'],
						},
					], `Warn Channel Reserved by ${cmg.author.username}#${cmg.author.discriminator}`)
				SB.client.settings.warnMod.set(cmg.guild.id,'warnLogChannel',givenChannel);
				SB.client.channels.cache.get(givenChannel).send(res.warnChannel.channelReserved.replace("%timeReserved%",new Date().toISOString()));
				msg2edit.edit(res.warnChannel.edited.replace("%channel%",`<#${givenChannel}>`));
				SB.client.settings.warnMod.set(cmg.guild.id,'settingsChanged','true')
			} catch(e){
				console.error(e);
				cmg.channel.send(res.setup.error);
			}
			cmg.channel.stopTyping();
		}
	}
}
