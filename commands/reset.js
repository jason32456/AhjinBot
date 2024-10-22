const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const setupStateFile = path.join(__dirname, 'setupState.json');

// Load setup state from file
const loadSetupState = () => {
    if (fs.existsSync(setupStateFile)) {
        const data = fs.readFileSync(setupStateFile);
        return JSON.parse(data);
    }
    return {};
};

// Save setup state to file
const saveSetupState = (setupState) => {
    fs.writeFileSync(setupStateFile, JSON.stringify(setupState, null, 2));
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Resets the server setup by removing all roles, channels, and categories.'),
    async execute(interaction) {
        const setupState = loadSetupState();
        const guildId = interaction.guild.id;

        // Check if setup has been done
        if (!setupState[guildId]) {
            return interaction.reply('Server setup has not been completed yet.');
        }

        await interaction.reply('Resetting the server setup... Please wait.');

        const guild = interaction.guild;

        // Remove all channels
        const channels = guild.channels.cache;
        channels.forEach(channel => {
            channel.delete().catch(console.error);
        });

        // Remove all roles
        const roles = guild.roles.cache;
        roles.forEach(role => {
            if (role.name !== '@everyone') {
                role.delete().catch(console.error);
            }
        });

        // Remove the setup state
        delete setupState[guildId];
        saveSetupState(setupState);

        await interaction.followUp('Server setup has been reset successfully!');
    },
};
