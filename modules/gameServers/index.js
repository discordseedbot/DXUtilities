const dns = require("dns");
const serverJSON = require("./servers.json");
const serverCache = require("./servers.json");

function isIP(ipaddress) {
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
		return true
	}
	return false
}

async function populateCache(givenEmbed) {
	serverJSON.forEach((sC)=>{
		var isDomain = !isIP(sC.address);
		var ipv4 = "";

		dns.lookup(sC.address, (err, address, family) => {
			if(err) throw err;
			ipv4 = address;
		});
		var finalField = `Address: ${sC.address}\r\nPort: ${sC.port}`;
		setTimeout(()=>{
			if (sC.game === "source_engine") {
				finalField+= `\r\nConnect: steam://connect/${ipv4}:${sC.port}`;
			}
			givenEmbed.addField(sC.name,finalField,true);
		},500)
	})
	return givenEmbed;
}

module.exports = async function() {
	const Discord = SB.modules.node.discord;
	const { MessageEmbed } = require("discord.js");
	const prefix = SB.prefix.default;


    SB.client.on('message', async message => {
        if (message.author.bot) return;
        if (message.content.indexOf(prefix) !== 0) return;
        var args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        try {
            switch (command.toLowerCase()) {
                case "gameserver":
						var servers = require("./servers.json");
						var messageToSend = new Discord.MessageEmbed()
							.setColor(SB.core.misc_randHex())
							.setTitle(`${servers.length} servers found.`)
							var duh = await populateCache(messageToSend);
							setTimeout(()=>{
								message.channel.send(duh)
							},500)
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
        SB.con.module.bot.loaded("Game Server Viewer");
	})
}
