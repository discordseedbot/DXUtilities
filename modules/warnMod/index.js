var responses = {
	kickedFromWarnLimit: {
		channel: "$user$ has been kicked due to exceding the warn limit.",
		userKicked: "You have been kicked from $server$ by $warnedBy$ due to exceding the warn limit, send them a message to get back in the server.",
		auditReason: "Exceded Warn Limit [from $warnedBy$] $warnReason$",
	},
	warned: {
		channel: "$user$ has been warned, you have $chancesLeft$ chances left.",
		userWarned: "You have been warned on $server$, you have $chancesLeft$ chances left.\r\nIf you disagree with this action please message the moderators in <#754018959036121148>.",
	},
	error: {
		settingsNotChanged: "Settings have not been changed, please refer to the SeedBot Partner Handbook that was given to you with the bot invite."
	}
};



module.exports = async function() {
	const prefix = SB.prefix.default;
	const Discord = require("discord.js");
	var pref = SB.prefrences;

	if (SB.client.settings.warnMod === undefined) {
		require("./settingManager.js").moduleInit()
	}

    SB.client.on('message', async message => {
        if (message.author.bot) return;
        if (message.content.indexOf(prefix) !== 0) return;
        var args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

		//filter(string,currentWarn,warnReason,MGR)
		function filter(string,currentWarn,warnReason,MGR) {
			return string.replace("$server$",		message.guild.name)
						 .replace("$warnedBy$",		`<@${message.author.id}>`)
						 .replace("$user$",			`<@${MGR.id}>`)
						 .replace("$chancesLeft$",	3 - currentWarn)
						 .replace("$warnReason$",	warnReason)
		}

        try {
            switch (command) {
                case "warn":
					if (SB.client.settings.get(message.guild.id, settingsChanged) === undefined) {
						client.settings.ensure(member.guild.id, defaultSettings);
					}
                    var MGR = message.mentions.users.first();
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

					if (!message.member.hasPermission(["KICK_MEMBERS","MANAGE_ROLES"], { checkAdmin: false, checkOwner: false })) return message.reply("you don't have permission bossman");
					message.guild.roles.cache.forEach((r)=>{
						if (r.name.search(/(warn|warning)(| )[1-3]/i)>=0) {
							serverWarnRoles[r.name.substr(r.name.length - 1)-1]=
								{name:r.name,id:r.id,value:r.name.substr(r.name.length-1)};
						}
					})
					message.guild.member(MGR).roles.cache.forEach((r)=>{
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
						message.channel.send(`:no_entry_sign: <@${MGR.id}> has sinned too much, thus can not be warned anymore. what a cheeky fella.`)

					} else {
						var warnToGive = (parseInt(currentWarn) + 1).toString();
						serverWarnRoles.forEach((r)=>{
							if (r.name.charAt(r.name.length-1)==warnToGive.toString()){
								var rtg = message.guild.roles.cache.find(ra=>ra.id==r.id)
								message.guild.member(MGR).roles.add(rtg).then(()=>{
									var warnLogContent = new Discord.MessageEmbed()
										.setTitle(`${MGR.username} was warned`)
										.setDescription(`<@${MGR.id}> was warned by <@${message.author.id}>\r\n**reason** - ${warnReason}`)
										.setTimestamp()
										.setFooter(`warned by ${message.author.username}#${message.author.discriminator}`);
									message.reply(filter(responses.warned.channel,currentWarn,warnReason,MGR))
									SB.client.users.cache.get(MGR.id).send(filter(responses.warned.userWarned,currentWarn,warnReason,MGR))
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
        SB.con.module.bot.loaded("Warn Utilities");
    })
}
