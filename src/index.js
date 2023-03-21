require('dotenv').config();

const Discord = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

const client = new Discord.Client({ intents: 8833 });

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
    if (message.content === '!activate') {
        goodbyeActive = true;
    } else if (message.content === '!deactivate') {
        goodbyeActive = false;
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    await checkLog(oldState.member);

    // if user leaves channel bot joins, plays Ciaoooo.mp3 and leaves
    if (oldState.channelId !== null && newState.channelId === null && goodbyeActive) {
        if (oldState.member.id !== client.user.id) {
            const connection = await oldState.channel.join();
            const player = connection.play('Ciaoooo.mp3');
            player.on(AudioPlayerStatus.Idle, () => {
                connection.disconnect();
            });
        }
    }
});

async function checkLog(member) {
    const guild = client.guilds.cache.get(GUILD_ID);
    let newlog = null;
    let newdisconnect = null;
    let newMove = null;

    let i = 0;
    const logs = await guild.fetchAuditLogs({limit: 100});
    for (const entry of logs.entries) {
        if (i === 0) {
            newlog = entry;
        }
        const action = `${entry.action}`;
        if (newdisconnect === null && action === 'MEMBER_DISCONNECT') {
            newdisconnect = entry;
        }
        if (newMove === null && action === 'MEMBER_MOVE') {
            newMove = entry;
        }
        if (newdisconnect !== null && newMove !== null) {
            break;
        }
        i = i + 1;
    }

    if (previouslog === null) {
        previouslog = newlog;
        return;
    }

    if (previouslog.id !== newlog.id) {
        previouslog = newlog;
        await printLog(newlog, member);
        return;
    }

    if (`${newlog.action}` === 'MEMBER_DISCONNECT') {
        if (previousdisconnect === null) {
            previousdisconnect = newlog;
            await printLog(newlog, member);
            return;
        } else if (previousdisconnect.id !== newlog.id) {
            previousdisconnect = newlog;
            await printLog(newlog, member);
            return;
        } else {
            console.log("previousdisconnect nein");
        }
    }

    if (`${newlog.action}` === 'MEMBER_MOVE') {
        if (previousmove === null) {
            previousmove = newlog;
            await printLog(newlog, member);
        } else if (previousmove.id !== newlog.id) {
            previousmove = newlog;
            await printLog(newlog, member);
        } else {
            console.log("previousdisconnect nein");
        }
    }
}

async function printLog(entry, member) {
    const channel = client.channels.cache.find(channel => channel.id === LOG_CHANNEL_ID);
    const action = entry.action;

    let message;
    if (action === 'AuditLogAction.member_disconnect') {
        if (member !== null) {
            message = `${entry.user} disconnected ${member}`;
        } else {
            message = `${entry.user} disconnected a user`;
        }
    } else if (action === 'AuditLogAction.member_move') {
        if (member !== null) {
            message = `${entry.user} moved ${member}`;
        } else {
            message = `${entry.user} moved a user`;
        }
    } else if (action === 'AuditLogAction.unban') {
        message = `${entry.user} unbanned ${entry.target}`;
    } else if (action === 'AuditLogAction.ban') {
        message = `${entry.user} banned ${entry.target}`;
    } else if (action === 'AuditLogAction.member_role_update' || action === 'AuditLogAction.invite_create') {
        return;
    } else if (entry.target === null) {
        message = `${entry.user} did ${action}`;
    } else {
        message = `${entry.user} did ${action} to ${entry.target}`;
    }

    console.log(message);
    await channel.send(message);
}