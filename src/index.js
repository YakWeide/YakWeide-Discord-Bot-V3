require("dotenv").config();

const {
  Client,
  Events,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
const { formatAuditLog } = require("./audit-log");

const { DISCORD_TOKEN, GUILD_ID, CHANNEL_ID } = process.env;

if (!DISCORD_TOKEN || !GUILD_ID || !CHANNEL_ID) {
  throw new Error("DISCORD_TOKEN, GUILD_ID, and CHANNEL_ID are required.");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let enabled = true;

client.once(Events.ClientReady, () => {
  console.log(`Connected to bot: ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (
    message.guildId !== GUILD_ID ||
    message.author.bot ||
    !message.member?.permissions.has(PermissionsBitField.Flags.ManageGuild)
  ) {
    return;
  }

  if (message.content === "!enable") {
    enabled = true;
    try {
      await message.channel.send("Yak-Bot Enabled");
    } catch (error) {
      console.error("Could not confirm enable command:", error);
    }
  } else if (message.content === "!disable") {
    enabled = false;
    try {
      await message.channel.send("Yak-Bot Disabled");
    } catch (error) {
      console.error("Could not confirm disable command:", error);
    }
  }
});

client.on(Events.GuildAuditLogEntryCreate, async (entry, guild) => {
  if (!enabled || guild.id !== GUILD_ID) {
    return;
  }

  const text = formatAuditLog(entry);
  if (!text) {
    return;
  }

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel?.isSendable()) {
      throw new Error(`Log channel ${CHANNEL_ID} is not sendable.`);
    }

    await channel.send({ content: text, allowedMentions: { parse: [] } });
    console.log(text);
  } catch (error) {
    console.error("Could not send audit log message:", error);
  }
});

client.login(DISCORD_TOKEN).catch((error) => {
  console.error("Could not log in to Discord:", error);
  process.exitCode = 1;
});
