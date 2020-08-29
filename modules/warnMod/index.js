const Discord = require("discord.js");
const { RichEmbed } = require("discord.js");
const prefix = SB_CoreLibrary.prefix().default;

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
					console.log(MGR);
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
						message.guild.member(MGR).kick("exceded warn limit").then((km)=>{
							message.channel.send(`<@${km.id}> got kicked for having too many warns jajajajaja`);
							SB_Client.users.cache.get(km.id).send("you got kicked for exceding the warn limit, message a moderator or admin to invite you back.");
						})

					} else {
						var warnToGive = (parseInt(currentWarn) + 1).toString();
						serverWarnRoles.forEach((r)=>{
							if (r.name.charAt(r.name.length-1)==warnToGive.toString()){
								var rtg = message.guild.roles.cache.find(ra=>ra.id==r.id)
								message.guild.member(MGR).roles.add(rtg).then(()=>{
									var returnMessage="";
									if (parseInt(warnToGive)+1 == 4){
										returnMessage="Getting kicked on next warn";
									} else {
										returnMessage=`warn ${parseInt(warnToGive)+1}`;
									}
									message.reply(`warned user <@${MGR.id}>, next warn; ${returnMessage}`)
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
