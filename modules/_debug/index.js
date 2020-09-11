module.exports = function() {

    // Print all Libaries
    //console.log(libr);

    SB_Client.on('ready', async () => {
        /*
        console.log(SB_Client.guilds.cache.map(m => m.name).join("\n"))
        let totalSize = {
            "members": 0,
            "guilds": 0,
            "channels": 0
        };
        SB_Client.guilds.cache.forEach(m => {
            totalSize.members+=m.memberCount
            totalSize.guilds+=1
            totalSize.channels+=m.channels.cache.size
        })
        console.log(totalSize)
        delete(totalSize)
        */

    })
const prefix = SB_CoreLibrary.prefix().default;
    SB_Client.on('message', async message => {
        if (message.author.bot) return;
        //console.log("\n" + `[${message.author.id}] - ${message.content}`)
		//console.log(message.content.slice(prefix.length).trim().split(/ +/g))
    })
}
