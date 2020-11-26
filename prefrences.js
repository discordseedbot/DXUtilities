module.exports = {
	prefix: {
		default: "s!",
		dev: "s~",
		music: "s?",
		math: "s!math",
		dmoj: "s!dmoj",
		youtube: "s!yt"
	},
	core: {
		stats: {
			timer: 600,
			loginRetryTimer: 1
		},
		tokenManager: {
			enviromentVariable: false,
			location: "aboveRoot",
			filename: "token",
			debug: {
				location: "aboveRoot",
				filename: "canary",
			}
		},
		developerAlerts: {
			enable: true,
			override: {
				error: true
			},
			developer: {
				error: "720187904705691689",
				notifications: "720187664120152114",
				unauthAccess: "720566055445069864"
			},
			userspace: {
				error: "72018793426282a0955",
				notifications: "720187870933024829"
			},
			default: {
				error: "781453506372304996",
				notifications: "781453582263255041"
			}
		},
		localization: {
			name: "DARiOX Utilities",
			website: "https://seedbot.xyz",
			contact: "contact@dariox.club"
		}
	},
	archive: {
		guilds: [
			{
				label: "seeds private server",
				id: "423433970810748960",
				archive_channel: "737598935274619020",
				allowed_roles: [
					"760458728780070912"
				]
			},
			{
				label: "seeds shed",
				id: "358228594918555658",
				archive_channel: "736163506696486972",
				allowed_roles: [
					"496895720503377931"
				]
			},
			{
				label: "private friends server [the gamer hole]",
				id: "543016052456685578",
				archive_channel: "760176218459865149",
				allowed_roles: [
					"697426350335852636"
				]
			}
		],
		allowed_users: [
			"230485481773596672"
		]
	},
	moderation: {
		override: {
			543016052456685578: [
				"697426350335852636"
			],
			423433970810748960: [
				"424465888817709056"
			]
		}
	},
	warnMod: {
		storageLocation: "data/storage_warnMod.json"
	}
}
