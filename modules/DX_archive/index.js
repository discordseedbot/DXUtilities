const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");
const prefix = SB_CoreLibrary.prefix().default;

module.exports = async function() {

    SB_Client.on('message', async message => {
        if (message.author.bot) return;
        if (message.content.indexOf(prefix) !== 0) return;
        var args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

		var prefrences = SB_Prefrences.archive;
        try {
            switch (command) {
                case "archive":
					var allow = {"validGuild": false,"validSelectedChannel":false,"allowUser":false,"categoryExists":false};
					
					prefrences.guilds.forEach((gd)=>{
						if (gd.id == message.guild.id) {
							gd.allowed_roles.forEach((rhas)=>{
								message.guild.member(message.author).roles.cache.forEach((mr)=>{
									if (mr == rhas) {
										console.log("user has allowed role");
										allow.allowUser=true;
										allow.validGuild = true;
									}
								})
							})
						}
					})
					
					if (allow.allowUser == false || prefrences.allowed_users.indexOf(message.author.id) < -1) {
						// user not allowed
						SB_Libraries.forEach(async (m) => {
							if (m.name === "developer_alerts") {
								require(`./../../${m.location}/${m.main}`).developerUnauth(message);
								allow.allowUser = false;
							}
						})
					} else {
						if (args[0] === undefined) {
							//channel to archive is not defined
							message.reply("Channel was not defined, try `"+prefix+command+" #channel`");
							break;
						} else {allow.validSelectedChannel=true;}



						// check if the server is defined in prefrences
						prefrences.guilds.forEach(async (g) => {
							if (g.id = message.guild.id) {
								console.log("guild correct");
								allow.validGuild = true;
								if (allow.validSelectedChannel) {
									console.log("channel valid")
									var channelIDToMove = args[0].substring(2).substring(0, args[0].substring(2).length -1);
									if (allow.validGuild) {
										message.guild.channels.cache.forEach(async (c) => {
											if (c.type === "category" && c.id === g.archive_channel) {
												console.log(channelIDToMove)
												SB_Client.channels.cache.get(channelIDToMove).setParent(c.id, { lockPermissions: true, reason: `Archived By ${message.author.id}` })
													.then(channel => {
														let embed = new Discord.MessageEmbed()
															.setTitle("Channel Archived")
															.setDescription("This channel no longer has a purpose but it is locked for archival purposes.\n\n" + `Archived by <@${message.author.id}>`)
															.setTimestamp()
														SB_Client.channels.cache.get(channel.id).send(embed);
														SB_Client.channels.cache.get(channelIDToMove).overwritePermissions([
																{
																	id: message.guild.roles.everyone.id,
																	deny: ['SEND_MESSAGES'],
																},
															], 'Needed to change permissions');
														message.author.send(`Channel \`<#${channelIDToMove}>\` has been archived`);
													})
											}
										})
									}
								}
							}
						})
					}


                    break;
            }
        } catch (err) {
			SB_Libraries.forEach(async (m) => {
				if (m.name === "developer_alerts") {
					require(`./../../${m.location}/${m.main}`).userspaceError(message, err);
					console.error(err);
				}
			})
        }

    })


    SB_Client.on('ready', async () => {
        botModuleConsole.loaded("Archive");
    })
}
