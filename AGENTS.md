# AGENTS.md

Instructions and guidelines for AI coding assistants working in the **MrDia (v4)** repository.

---

## 1. Prime Directives for Agents

1. **Preserve Current Code Structure**:
   - **Do NOT** reorganize directory layouts, rewrite handlers, or convert module formats unilaterally.
   - Always work within the established patterns described below.
   - If an architectural refactor is needed (e.g., migrating to full ESM or changing command registration), **you must propose the alternative to the user and obtain confirmation before making structural modifications.**

2. **Respect the Hybrid Module System**:
   - Root files (`index.js`, `Config.js`) use **ECMAScript Modules (ESM)** (`import` / `export`).
   - Subsystem files inside `src/` (`commands/`, `events/`, `functions/`, `structures/`, `schemas/`) use **CommonJS (CJS)** (`require()` / `module.exports`).
   - Do **not** mix syntax inside a file or introduce ESM into `src/` files without explicit instruction.

3. **DisTube & Discord.js Centrality**:
   - The bot is built around **DisTube v5** (`distube`) and **Discord.js v14**.
   - Music handling, queues, filters, and streaming must adhere to the DisTube plugin and queue lifecycle.

4. **Maintain & Audit AGENTS.md**:
   - Keep this document accurate and up to date as the project evolves (e.g., adding new command categories, handlers, dependencies, or schemas).
   - **Inconsistency Alerting**: If you ever detect an inconsistency or contradiction between `AGENTS.md` and the actual codebase, **you must notify the user immediately and ask for permission to update `AGENTS.md`**.

---

## 2. Architecture & Directory Overview

```
mrdia-v4/
├── Config.js                  # ESM: Loads env vars and exports bot configuration
├── index.js                   # ESM: DisTubeClient definition, connects DB, loads handlers, logs in
├── package.json               # Dependencies: discord.js v14, distube v5, mongoose v8, etc.
├── scratch_test_pipeline.js   # Scratch script for testing plugins/extractors
├── src/
│   ├── commands/              # Command definitions
│   │   ├── normal/            # Dual-purpose commands (both Message prefix & Slash /)
│   │   │   ├── botOwner/      # Owner-only utilities (restart, migratequeues, downloadSong, etc.)
│   │   │   ├── music/         # Playback & queue commands (play, pause, skip, loop, queue, etc.)
│   │   │   └── other/         # General commands (help, ping, prefix, clear, etc.)
│   │   ├── buttons/           # Button interaction handlers (mapped by customId)
│   │   ├── contextMenus/      # Context menu handlers
│   │   ├── modals/            # Modal submit handlers
│   │   └── selectMenus/       # String select menu handlers
│   ├── events/                # Event listeners
│   │   ├── client/            # Discord.js client events (ready, interactionCreate, messageCreate)
│   │   ├── distube/           # DisTube player events (playSong, addSong, empty, error, finish)
│   │   └── mongo/             # Mongoose connection events (connected, err, disconnected)
│   ├── functions/             # Shared business logic
│   │   ├── music/             # Reusable music logic (playFunction, skipFunction, manageQueues, etc.)
│   │   ├── File.js            # Async file I/O helper class
│   │   └── utilities.js       # Formatting utilities (e.g., toHHMMSS)
│   ├── schemas/               # Mongoose schemas & models (guild.js, queue.js, user.js)
│   └── structures/
│       ├── commandOptions/    # Permission & limitation checkers (OwnerOnly, LimitUses, ExpireAfter)
│       ├── handlers/          # Dynamic loaders (MessageCommands, SlashCommands, Events, replyHandler)
│       └── plugins/           # Custom DisTube plugins (YtDlpPlugin.js)
```

---

## 3. Command System & Conventions

### 3.1 Dual-Purpose Normal Commands (`src/commands/normal/`)
All files under `src/commands/normal/**` are loaded by **both** `MessageCommands.js` and `SlashCommands.js`.
The `message` parameter in `run(client, message, args)` can be either:
- A `Discord.Message` (for standard prefix-based text commands)
- A `ChatInputCommandInteraction` (for `/` slash commands)

#### Standard Command Template
```javascript
const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "commandname",
    description: "Brief command description",
    aliases: ["alias1", "alias2"],     // Used by message commands
    category: "music",                 // "music" | "other" | "botOwner"
    options: [                         // Slash command options
        {
            name: "query",
            type: ApplicationCommandOptionType.String,
            description: "Option description",
            required: true,
        },
    ],
    // Optional permissions / limitations checked by commandOptions:
    // ownerOnly: true,
    // onlyGuilds: ["GUILD_ID"],
    // limitUses: 5,
    // expireAfter: 10000,
    run: async (client, message, args) => {
        // Always use Reply handler for message/interaction polymorphism
        await Reply.deferReply(message, false);
        // ... perform action ...
        Reply.editReply(message, "Result message");
    },
};
```

### 3.2 Interaction Response Abstraction (`replyHandler.js`)
**Always use `src/structures/handlers/replyHandler.js`** when sending responses in normal commands:
- `Reply.send(message, content)`: Sends reply for interaction or channel message for standard command.
- `Reply.deferReply(message, invisible)`: Defers an interaction (or no-op for message).
- `Reply.editReply(message, content)`: Edits deferred interaction or sends a channel message.
- `Reply.follow(message, content)`: Follows up an interaction or sends to channel.
- `Reply.deferUpdate(message)`: Acknowledges button/component clicks.
- `Reply.dm(message, content)`: Direct messages the invoking user.

### 3.3 Button & Component Commands (`src/commands/buttons/`)
- Mapped directly by `interaction.customId`.
- The filename should match or cleanly represent the `customId` registered on the Discord component.
- Export format:
  ```javascript
  module.exports = {
      name: "button_custom_id",
      run: async (client, interaction) => {
          // Component response logic
      }
  };
  ```

---

## 4. DisTube Audio Subsystem

### 4.1 Client Setup & Plugins
The bot extends `Client` into `DisTubeClient` inside `index.js`.
Plugins configured in `this.distube`:
- `SpotifyPlugin` (`@distube/spotify`)
- `SoundCloudPlugin` (`@distube/soundcloud`)
- `DeezerPlugin` (`@distube/deezer`)
- `DirectLinkPlugin` (`@distube/direct-link`)
- `YtDlpPlugin` (`./src/structures/plugins/YtDlpPlugin.js` - custom fallback/primary extractor)

### 4.2 Custom `YtDlpPlugin`
- Extends `PlayableExtractorPlugin` from `distube`.
- Discovers `yt-dlp` in `node_modules`, system `PATH`, or local `bin/`.
- If missing, auto-downloads the latest binary release from GitHub releases.
- Spawns `yt-dlp` using `--dump-single-json` with Android client arguments to resolve streams.
- **Rule**: `YtDlpPlugin` should remain the last plugin in DisTube's plugin array so specialized source plugins (Spotify, SoundCloud, Deezer) take precedence.

### 4.3 Music Functions & Metadata
- Music execution logic is centralized in `src/functions/music/` (e.g., `playFunction.js`, `skipFunction.js`, `showQueueFunction.js`, `manageQueuesFunction.js`).
- When playing a song:
  ```javascript
  await client.distube.play(voiceChannel, query, {
      member: message.member,
      textChannel: message.channel,
      metadata: {
          messageObject: message,
          skipVotes: [],
          previousVotes: [],
          ignoremessage: false,
      },
  });
  ```
- DisTube event listeners (`src/events/distube/`) read `song.metadata.messageObject` to route playback notices back to the appropriate channel.

---

## 5. Database & Data Models

- **Database**: MongoDB using Mongoose v8.
- **Connection**: Established in `index.js` via `connect(config.dbtoken)` with Mongoose strictQuery enabled.
- **Models (`src/schemas/`)**:
  - `guild.js` (`Guild` model, collection `guilds`): Stores `guildId`, `guildName`, `guildQueues`, `prefix`.
  - `queue.js` (`Queue` model, collection `savedQueues`): Stores saved user/guild playlists (`queueName`, `serverId`, `queueOwnerId`, `songs: [{ url, name, requestedBy }]`).
  - `user.js` (`User` model, collection `users`): Stores user preferences (`userId`, `userFavoriteLinks`, `userFavoriteNames`).

---

## 6. Environment & Configuration

Config values are managed in `.env` and exposed via `Config.js`:
- `PREFIX`: Default bot command prefix.
- `OWNER`: Discord user ID of the bot owner.
- `DISCORD_TOKEN`: Discord Bot Token.
- `DBTOKEN`: MongoDB connection URI.
- `INVITE`: Bot invite link.
- `YOUTUBECOOKIE`: Optional YouTube cookie string.
- `SERVERWAKE_API_LINK` / `PCWAKE_API_LINK`: External wake-on-LAN / API integration links.

---

## 7. Guidelines for Agents Making Changes

1. **Voice State Validation**:
   When implementing or editing music commands, always verify:
   - User is in a voice channel: `message.member?.voice?.channel`.
   - If bot is already playing, user is in the same voice channel as the bot.
2. **Error Handling**:
   - Wrap async calls in `try / catch` blocks.
   - Use `Reply.send` or `Reply.editReply` with `ephemeral: true` when returning user-facing error messages.
3. **Preserve Legacy Logic & Metadata**:
   - Functions like `specials()` in `playFunction.js` contain seasonal easter eggs. Do not remove them without asking.
   - Retain `metadata` keys in songs (`messageObject`, `skipVotes`, `previousVotes`) as event handlers depend on them.
4. **Do Not Introduce Breaking Module Syntax**:
   - Any new file added to `src/` **must use CommonJS** (`const ... = require(...)` and `module.exports = ...`).
5. **Keep Documentation Synchronized**:
   - Keep `AGENTS.md` up to date when introducing new conventions, schemas, or handlers.
   - If an inconsistency in `AGENTS.md` is discovered during development, tell the user about it and request permission to update the file before proceeding.

---

## 8. Suggested Future Architecture Improvements (Informational)

If the user requests refactoring or structural modernisation, here are the recommended upgrade paths to suggest:

1. **Full ESM Migration**:
   - Convert all files in `src/` to standard ESM (`import`/`export`), add `"type": "module"` to `package.json`, and replace `__dirname` / `require()` with `import.meta.url` / `import()`.
2. **REST-Based Slash Command Deployment**:
   - Replace the sequential `SlashCommands.js` deployment loop with a dedicated `deploy-commands.js` script using Discord REST API (`Routes.applicationCommands(clientId)` or `Routes.applicationGuildCommands(clientId, guildId)` with `PUT` bulk overwrite).
3. **Structured Logger**:
   - Replace scattered `console.log` statements with a structured logging solution (such as Pino or Winston) with log levels (`info`, `warn`, `error`, `debug`).
