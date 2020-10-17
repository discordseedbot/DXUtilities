var mex = {}

mex.mute = (message,userID)=>{
	message.guild.member(userID).voice.setMute(!message.guild.member(userID).voice.mute)
	return;
}

mex.defan = (message,userID)=>{
	message.guild.member(userID).voice.setDeaf(!message.guild.member(userID).voice.deaf)
	return;
}

module.exports = async (message,type)=>{
	try {
		var args = message.content.slice(SB.prefix.default.length).trim().split( / +/g);
		var uCount = 0;
		var channelID = 0;
		var currentChannel;
		message.guild.channels.cache.forEach((ch)=>{
			if (ch.type == 'voice') {
				ch.members.forEach((mb)=>{
					if (mb.user.id === message.author.id) {
						channelID = ch.id;
						currentChannel = ch;
					}
				})
			}
		})
		switch (type) {
			case "muteall":
				if (!message.member.hasPermission("MUTE_MEMBERS")) return;
				if (channelID !== 0) {
					currentChannel.members.forEach((mb)=>{
						mex.mute(message,mb.id);
						uCount++
					})
				}
				break;
			case "deafedall":
				if (!message.member.hasPermission("DEAFEN_MEMBERS")) return;
				if (channelID !== 0) {
					currentChannel.members.forEach((mb)=>{
						mex.defan(message,mb.id);
						uCount++
					})
				}
				break;
		}
		if (uCount !== 0) {
			var msg = await message.channel.send(`Done command to ${uCount} users.`)
			setTimeout(()=>{
				msg.delete()
			},8000)
		}
		return;
	} catch (e) {
		console.error(e)
	}
	
}