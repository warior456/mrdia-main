(async () => {
	require("dotenv").config();
	const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
	const config = require("./Config");
	const fs = require("fs");
	const {
		MessageCommandHandler,
		EventManager,
		ButtonCommandHandler,
		SelectMenuHandler,
		SlashCommandsHandler,
		ContextMenuHandler,
		ModalFormsHandler,
	} = require("./Src/Structures/Handlers/HandlersManager");
	const { connect } = require("mongoose");
	const Genius = require("genius-lyrics");
	const DirPath = __dirname;
	const err = require("./src/events/mongo/err");

	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.DirectMessageReactions,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildWebhooks,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildInvites,
			GatewayIntentBits.GuildBans,
		],
		partials: [Partials.Channel],
	});

	client.commands = new Collection();
	client.limitCommandUses = new Collection();
	client.expireAfter = new Collection();
	client.messageCommands = new Collection();
	client.messageCommands_Aliases = new Collection();
	client.events = new Collection();
	client.slashCommands = new Collection();
	client.contextMenus = new Collection();
	client.selectMenus = new Collection();
	client.buttonCommands = new Collection();
	client.modalForms = new Collection();

	exports.rootPath = DirPath;

	global.LyricsClient = new Genius.Client();

	connect(config.dbtoken).catch("Database error");
	await MessageCommandHandler(DiscordClient, DirPath);
	await EventManager(DiscordClient, DirPath);
	await ButtonCommandHandler(DiscordClient, DirPath);
	await SelectMenuHandler(DiscordClient, DirPath);
	await ModalFormsHandler(DiscordClient, DirPath);

	await client.login(config.token);

	DiscordClient.user.setActivity("Starting", {
		type: ActivityType.Playing,
	});

	await SlashCommandsHandler(DiscordClient, DirPath);
	await ContextMenuHandler(DiscordClient, DirPath);
})();
