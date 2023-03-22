require('dotenv').config();

const { Client} = require('discord.js');

const client = new Client({ intents: 3276799 });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const LOG_CHANNEL_ID = process.env.CHANNEL_ID;
let logChannel = null;
let saved_logs = [];
let enabled = false;

client.login(DISCORD_TOKEN).then();

client.on('ready', () => {
    console.log(`Connected to bot: ${client.user.tag}`);
    console.log(`Bot ID: ${client.user.id}`);
    onReadySaveLogs();
    logChannel = client.channels.cache.find(channel => channel.id === LOG_CHANNEL_ID);
    console.log('I´m ready');
});

client.on('messageCreate', async message => {
    if (message.content === '!enable') {
        enabled = true;
        console.log("Yak-Bot Enabled");
        message.channel.send("Yak-Bot Enabled");
    } else if (message.content === '!disable') {
        enabled = false;
        message.channel.send("Yak-Bot Disabled");
        console.log("Yak-Bot Disabled");
    }
});

client.on('voiceStateUpdate', async () => {
    await calculateLogs();
});

function onReadySaveLogs() {
    const guild = client.guilds.cache.get(GUILD_ID);
    guild.fetchAuditLogs().then(async logs => {
        let promised_logs = logs.entries;
        let array_logs = [];
        promised_logs.forEach(log => {
            array_logs.push(log);
        });

        saved_logs = await filterLogs(array_logs);
    });
}

async function calculateLogs(){
    const guild = client.guilds.cache.get(GUILD_ID);
    guild.fetchAuditLogs().then(async logs => {
        let promised_logs = logs.entries;
        let array_logs = [];
        promised_logs.forEach(log => {
            array_logs.push(log);
        });

        const filtered_logs = await filterLogs(array_logs);
        if (JSON.stringify(saved_logs) === JSON.stringify(filtered_logs)) return;
        const different_logs = await calculateDifferences(filtered_logs);
        await printLogs(different_logs);
        saved_logs = filtered_logs.slice();
    });
}

async function filterLogs(array_logs){
    let filtered_logs = [];
    array_logs.forEach(log => {
        if (log.targetType !== 'User') return;
        //26 = Update, 27 = Delete
        if (log.action !== 26 && log.action !== 27) return;
        //Filter for Voice Channel
        if (!(log.extra.channel) || log.extra.channel.type !== 2) return;

        filtered_logs.push(log);
    });

    filtered_logs = filtered_logs.filter((log) => log.extra !== undefined);

    return filtered_logs;
}

async function calculateDifferences(filtered_logs){
    let temp_logs = filtered_logs.slice();
    let different_logs = [];

    saved_logs.forEach(saved => {
        temp_logs.forEach(temp => {
            if (saved.id === temp.id) {
                if (saved.extra.count < temp.extra.count) different_logs.push(temp);
                temp_logs.splice(temp_logs.indexOf(temp), 1);
            }
        });
    });

    temp_logs.forEach(log => {
        if(log.extra.count === 1) different_logs.push(log);
    });

    return different_logs;
}

async function printLogs(different_logs) {
    different_logs.forEach(log => {
        //let message = log.executor.username;
        let message = "<@"+ log.executor.id +">"
        if (log.action === 26) message += " moved a user to " + log.extra.channel.name + "!";
        //if (log.action === 27) message += " disconnected a user!";
        logChannel.send(message);
        console.log(message);
    });
}

