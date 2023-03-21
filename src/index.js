require('dotenv').config();

const { Client, AuditLogEvent, Events } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const client = new Client({ intents: 3276799 });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const LOG_CHANNEL_ID = process.env.CHANNEL_ID;
let previouslog = null;
let previousmove = null;
let previousdisconnect = null;
let goodbyeActive = false;

client.login(DISCORD_TOKEN).then();

client.on('ready', () => {
    console.log(`Connected to bot: ${client.user.tag}`);
    console.log(`Bot ID: ${client.user.id}`);
    const channel = client.channels.cache.get(LOG_CHANNEL_ID);
    channel.send('I´m ready');
    console.log('I´m ready');
});

client.on('messageCreate', async message => {
    if (message.content === '!enable') {
        goodbyeActive = true;
        console.log("Yak-Bot Enabled");
        message.channel.send("Yak-Bot Enabled");
    } else if (message.content === '!disable') {
        goodbyeActive = false;
        message.channel.send("Yak-Bot Disabled");
        console.log("Yak-Bot Disabled");
    }
});

client.on('voiceStateUpdate', async (oldState) => {
    await checkLog();
    console.log("nach voiceStateUpdate");
});

async function checkLog() {
    const guild = client.guilds.cache.get(GUILD_ID);
    guild.fetchAuditLogs().then(logs => {
        /*
        logs.entries.forEach(entry => {
            console.log(entry);
            const { action, actionType, executorId, target, targetId } = entry;
            console.log("action: " + action + " actionType: " + actionType + " executorId: " + executorId + " target: " + target + " targetId: " + targetId)
        });
         */

        const entry = logs.entries.first();
        console.log(entry);
        const { action, actionType, executorId, target, targetId } = entry;
        console.log("action: " + action + " actionType: " + actionType + " executorId: " + executorId + " target: " + target + " targetId: " + targetId)
    });
}