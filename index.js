// index.js
import "dotenv/config";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { readdirSync } from "fs";
import { Client, GatewayIntentBits, Partials, Collection, ActivityType } from "discord.js";
import { connect, mongoose } from "mongoose";
import Genius from "genius-lyrics";
import config from "./Config.js";

// Handlers
import HandlersManager from "./src/structures/handlers/HandlersManager.js";
const {
  MessageCommandHandler,
  EventManager,
  ButtonCommandHandler,
  SelectMenuHandler,
  SlashCommandsHandler,
  ContextMenuHandler,
  ModalFormsHandler,
} = HandlersManager;

// DisTube & plugins
import { DisTube } from "distube";
import { YouTubePlugin } from "@distube/youtube";
import { SpotifyPlugin } from "@distube/spotify";
import SoundCloudPlugin from "@distube/soundcloud";
import { DeezerPlugin } from "@distube/deezer";
import { DirectLinkPlugin } from "@distube/direct-link";

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
global.rootPath = __dirname;

// Mongoose setup
mongoose.set("strictQuery", true);

// Genius lyrics
global.LyricsClient = new Genius.Client();

class DisTubeClient extends Client {
  constructor(options) {
    super(options);

    // Initialize DisTube
    this.distube = new DisTube(this, {
      plugins: [
        new YouTubePlugin(),
        new SoundCloudPlugin(),
        new SpotifyPlugin(),
        new DeezerPlugin(),
        new DirectLinkPlugin(),
      ],
      emitAddListWhenCreatingQueue: true,
      emitAddSongWhenCreatingQueue: true,
      customFilters: { subboost: "asubboost" },
    });

    this.commands = new Collection();
    this.limitCommandUses = new Collection();
    this.expireAfter = new Collection();
    this.messageCommands = new Collection();
    this.messageCommands_Aliases = new Collection();
    this.events = new Collection();
    this.slashCommands = new Collection();
    this.contextMenus = new Collection();
    this.selectMenus = new Collection();
    this.buttonCommands = new Collection();
    this.modalForms = new Collection();

    // Load DisTube events
    const distubeEvents = readdirSync(join(__dirname, "src", "events", "distube"));
    distubeEvents.forEach((name) => this.loadDisTubeEvent(name));
  }

  async loadDisTubeEvent(name) {
    try {
      const E = await import(`./src/events/distube/${name}`);
      const EventClass = E.default || E;
      const event = new EventClass(this);
      this.distube.on(event.name, event.run.bind(event));
      console.log(`Listening to DisTube event: ${event.name}`);
    } catch (err) {
      console.error(`Failed to load DisTube event "${name}": ${err.stack || err}`);
    }
  }
}

(async () => {
  const client = new DisTubeClient({
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
      GatewayIntentBits.GuildModeration,
    ],
    partials: [Partials.Channel],
  });

  // Attach config
  client.config = config;

  // Connect to MongoDB
  connect(config.dbtoken).catch((err) => console.error("Database connection error:", err));

  // Load handlers
  await MessageCommandHandler(client, __dirname);
  await EventManager(client, __dirname);
  await ButtonCommandHandler(client, __dirname);
  await SelectMenuHandler(client, __dirname);
  await ModalFormsHandler(client, __dirname);
  await SlashCommandsHandler(client, __dirname);
  await ContextMenuHandler(client, __dirname);

  // Login
  await client.login(config.token);

  // Set initial activity
  client.user.setActivity("Starting", { type: ActivityType.Playing });

  console.log("Bot started successfully.");
})();
