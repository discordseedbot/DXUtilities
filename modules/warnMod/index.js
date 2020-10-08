var responses = require("./response.json");



module.exports = async function() {
	const prefix = SB.prefix.default;
	const Discord = require("discord.js");
	var pref = SB.prefrences;



    SB.client.on('message', async message => {
        if (message.author.bot) return;
        if (message.content.indexOf(prefix) !== 0) return;
        var args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

		//filter(string,currentWarn,warnReason,targetUser)
		function filter(string,currentWarn,warnReason,targetUser) {
			return string.replace("$server$",		message.guild.name)
						 .replace("$warnedBy$",		`<@${message.author.id}>`)
						 .replace("$user$",			`<@${targetUser.id}>`)
						 .replace("$chancesLeft$",	3 - currentWarn)
						 .replace("$warnReason$",	warnReason)
		}

        try {

            switch (command) {
                case "warn":
					console.log(SB.client.settings.warnMod.get(message.guild.id,'warnLogChannel'))
					if (SB.client.settings.warnMod.get(message.guild.id, 'settingsChanged') == false) {
						require("./settingManager.js").init(message.guild.id);
						message.channel.send(responses.error.settingsNotChanged);
						break;
					}
					if (SB.client.settings.warnMod.get(message.guild.id,'warnLogChannel') == 0) {
						message.channel.send(responses.error.warnLogChannelUndefined);
						break;
					}
					var warnReason = "";
					if (args[1] === undefined) {
						// No reason given
						warnReason = "No Reason";
					}
					args.forEach((ag)=>{
						if (ag !== args[0]) {
							warnReason+=ag;
						}
					})

					if (SB.client.settings.get(message.guild.id,settingsChanged) === false) {
						message.channel.send(responses.error.settingsNotChanged)
					}

					var currentWarn=0;
					var targetUser = message.mentions.users.first();
					targetUser.warns = []
					var serverWarnRoles=[];
					var warnLimit = SB.client.settings.ensure()

					if (!message.member.hasPermission(["KICK_MEMBERS","MANAGE_ROLES"], { checkAdmin: true, checkOwner: true })) return message.reply(res.error.invalidPermissions);
					message.guild.roles.cache.forEach((r)=>{
						if (r.name.search(/(warn|warning)(| )[1-3]/i)>=0) {
							serverWarnRoles[r.name.substr(r.name.length - 1)-1]=
								{name:r.name,id:r.id,value:r.name.substr(r.name.length-1)};
						}
					})
					message.guild.member(targetUser).roles.cache.forEach((r)=>{
						if (r.name.search(/(warn|warning)(| )[1-3]/i)>=0) {
							whatWarnsUserHas[r.name.substr(r.name.length - 1)-1]=
								{name:r.name,id:r.id,value:r.name.substr(r.name.length-1)};
						}
					})
					whatWarnsUserHas.forEach((d)=>{
						if (typeof d.value == number) {
							currentWarn = d.value;
						}
					})
					if (currentWarn == 3){
						message.channel.send(`:no_entry_sign: <@${targetUser.id}> has sinned too much, thus can not be warned anymore. what a cheeky fella.`)

					} else {
						var warnToGive = (parseInt(currentWarn) + 1).toString();
						serverWarnRoles.forEach((r)=>{
							if (r.name.charAt(r.name.length-1)==warnToGive.toString()){
								var rtg = message.guild.roles.cache.find(ra=>ra.id==r.id)
								message.guild.member(targetUser).roles.add(rtg).then(()=>{
									var warnLogContent = new Discord.MessageEmbed()
										.setTitle(`${targetUser.username} was warned`)
										.setDescription(`<@${targetUser.id}> was warned by <@${message.author.id}>\r\n**reason** - ${warnReason}`)
										.setTimestamp()
										.setFooter(`warned by ${message.author.username}#${message.author.discriminator}`);
									message.reply(filter(responses.warned.channel,currentWarn,warnReason,targetUser))
									SB.client.users.cache.get(targetUser.id).send(filter(responses.warned.userWarned,currentWarn,warnReason,targetUser))
									message.guild.channels.cache.forEach((cj)=>{
										if (cj.name==="warn-log") {
											SB.client.channels.cache.get(cj.id).send(warnLogContent);
										}
									})
								})
							}
						})
					}
                    break;
				case "setup":
					if (args[0] === "warn") {
						if (message.member.hasPermission("ADMINISTRATOR")) {
							message.channel.stopTyping();
							require("./settingManager.js").setup(message);
						} else {
							message.reply("You do not have the administrator permission.");
						}
					}
					break;
            }
        } catch (err) {
			SB.modules.libraries.forEach(async (m) => {
				if (m.name === "developer_alerts") {
					let tmpRequire = require(`./../../${m.location}/${m.main}`).userspaceError(message, err);
				}
			})
        }

    })


    SB.client.on('ready', async () => {
		console.log(typeof SB.client.settings.warnMod)
		if (SB.client.settings.warnMod === undefined) {
			require("./settingManager.js").moduleInit()
		}
        SB.con.module.bot.loaded("Warn Utilities");
    })
}
