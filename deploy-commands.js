const { REST, Routes } = require('discord.js');
const { config } = require('dotenv');
config();

const OptionType = {
    STRING: 3,
    INTEGER: 4,
    BOOLEAN: 5,
    USER: 6,
    CHANNEL: 7,
    ROLE: 8,
    MENTIONABLE: 9,
};

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'setup',
        description: 'Sets up the server with channels and roles.',
    },
    {
        name: 'reset',
        description: 'Reset the server.',
    },
    {
        name: 'setwelcome', 
        description: 'Set the welcome channel, message, banner, and embed color.',
        options: [
            {
                name: 'channel',
                type: OptionType.CHANNEL,
                description: 'The channel to send welcome messages in.',
                required: true,
            },
            {
                name: 'message',
                type: OptionType.STRING,
                description: 'The welcome message. Use {{username}} for the user\'s name.',
                required: true,
            },
            {
                name: 'banner',
                type: OptionType.STRING,
                description: 'The URL of the welcome banner image.',
                required: true,
            },
            {
                name: 'color',
                type: OptionType.STRING,
                description: 'The color of the embed in hex format (e.g. #0099ff).',
                required: true,
            },
        ],
    },
    {
        name: 'setverify',
        description: 'Set the verification channel, banner, embed color, title, and description.',
        options: [
            {
                name: 'channel',
                type: OptionType.CHANNEL,
                description: 'The channel where the verification message will be sent.',
                required: true,
            },
            {
                name: 'banner',
                type: OptionType.STRING,
                description: 'The URL of the verification banner image.',
                required: false,
            },
            {
                name: 'color',
                type: OptionType.STRING,
                description: 'The color of the embed in hex format (e.g. #0099ff).',
                required: false,
            },
            {
                name: 'title',
                type: OptionType.STRING,
                description: 'The title of the verification embed.',
                required: false,
            },
            {
                name: 'description',
                type: OptionType.STRING,
                description: 'The description of the verification embed.',
                required: false,
            },
        ],
    },
    {
        name: 'updateverify',
        description: 'Update the verification message, title, and banner',
        options: [
            {
                name: 'title',
                type: OptionType.STRING,
                description: 'New title for the verification embed',
                required: false,
            },
            {
                name: 'description',
                type: OptionType.STRING,
                description: 'New description for the verification embed',
                required: false,
            },
            {
                name: 'banner',
                type: OptionType.STRING,
                description: 'New verification banner URL',
                required: false,
            },
        ],
    },

];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
