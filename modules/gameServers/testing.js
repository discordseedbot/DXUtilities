
const dns = require("dns");
const serverJSON = require("./servers.json");
var mcUtil = require('minecraft-server-util');

function isIP(ipaddress) {
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
		return true
	}
	return false
}

serverJSON.forEach((sC)=>{
	var isDomain = !isIP(sC.address);
	console.log(JSON.stringify(sC,null,"\t"));
	var ipv4 = "";

	dns.lookup(sC.address, (err, address, family) => {
		if(err) throw err;
		ipv4 = address;
	});
	setTimeout(()=>{
		var finalField = `Address: ${sC.address}\r\nPort: ${sC.port}`;
		if (sC.game === "source_engine") {
			finalField+= `\r\n[Connect](steam://connect/${ipv4}:${sC.port})`;
		}
		console.log(finalField)
	},500)
})
