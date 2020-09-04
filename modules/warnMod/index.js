const prefix = SB_CoreLibrary.prefix().default;

var responses = {
	kickedFromWarnLimit: {
		channel: "$user$ has been kicked due to exceding the warn limit.",
		userKicked: "You have been kicked from $server$ by $warnedBy$ due to exceding the warn limit, send them a message to get back in the server.",
		auditReason: "Exceded Warn Limit [from $warnedBy$]",
	},
	warned: {
		channel: "$user$ has been warned, you have $chancesLeft$ chances left.",
		userWarned: "You have been warned on $server$, you have $chancesLeft$ chances left.",
	}
};

module.exports = async function() {

    SB_Client.on('message', async message => {
        if (message.author.bot) return;
        if (message.content.indexOf(prefix) !== 0) return;
        var args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();


        try {
            switch (command) {
                case "warn":
                    var MGR = message.mentions.users.first();
					var currentWarn=0;
					var whatWarnsUserHas=[];
					var serverWarnRoles=[];
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
						switch(parseInt(d.value)){
							case 1:
							case 2:
							case 3:
							currentWarn=d.value;
							break;
						}
					})
					if (currentWarn == 3){
						if (!message.guild.member(MGR).kickable) return message.reply("can't kick!");
						message.guild.member(MGR).kick(reasons.kickedFromWarnLimit.auditReason.replace("$warnedBy$",message.author.name)).then((km)=>{
							message.channel.send(responses.kickedFromWarnLimit.channel.replace("$user$",`<@${km.id}>`));
							SB_Client.users.cache.get(km.id).send(responses.kickedFromWarnLimit.userKicked.replace("$server$",message.guild.name).replace("$warnedBy$",`<@${message.author.id}>`).replace("$user$",`<@${km.id}>`).replace("$chancesLeft$",3-currentWarn));
						})

					} else {
						var warnToGive = (parseInt(currentWarn) + 1).toString();
						serverWarnRoles.forEach((r)=>{
							if (r.name.charAt(r.name.length-1)==warnToGive.toString()){
								var rtg = message.guild.roles.cache.find(ra=>ra.id==r.id)
								message.guild.member(MGR).roles.add(rtg).then(()=>{
									message.reply(responses.warned.channel.replace("$server$",message.guild.name).replace("$warnedBy$",`<@${message.author.id}>`).replace("$user$",`<@${km.id}>`).replace("$chancesLeft$",3-currentWarn))
									SB_Client.users.cache.get(MGR.id).send(responses.warned.userWarned.replace("$server$",message.guild.name).replace("$warnedBy$",`<@${message.author.id}>`).replace("$user$",`<@${km.id}>`).replace("$chancesLeft$",3-currentWarn))
								})
							}
						})
					}
                    break;
            }
        } catch (err) {
			SB_Libraries.forEach(async (m) => {
				if (m.name === "developer_alerts") {
					let tmpRequire = require(`./../../${m.location}/${m.main}`).userspaceError(message, err);
				}
			})
        }

    })


    SB_Client.on('ready', async () => {
        botModuleConsole.loaded("Warn Utilities");
    })
}
