const { Client, GatewayIntentBits } = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');
const path = require('path');
const { welcomeConfig } = require('./config/welcomeConfig'); 
const { verifyConfig, saveVerifyConfig } = require('./config/verifyConfig'); 

config();

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] 
});

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

// Load commands
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


const guildMemberAdd = require('./events/guildMemberAdd');
const interactionCreate = require('./events/interactionCreate');

// Handle guild events
client.on('guildMemberAdd', async (member) => {
    await guildMemberAdd(client, member);
});

// Handle interactions events
client.on('interactionCreate', async (interaction) => {
    await interactionCreate(client, interaction);
});

client.login(process.env.BOT_TOKEN);