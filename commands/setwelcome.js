const { SlashCommandBuilder } = require('discord.js');
const { welcomeConfig, saveConfig } = require('../config/welcomeConfig'); // Adjust the path as necessary

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Sets the welcome channel, message, and banner.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select a channel for welcome messages')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The welcome message. Use {{username}} for the username.'))
        .addStringOption(option =>
            option.setName('banner')
                .setDescription('The URL of the welcome banner.')),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');
        const banner = interaction.options.getString('banner');

        // Check if the user is the server owner
        if (interaction.guild.ownerId !== interaction.user.id) {
            return interaction.reply({ content: 'Only the server owner can set the welcome channel.', ephemeral: true });
        }

        // Update the welcome configuration
        welcomeConfig.channelId = channel.id;

        // Update the welcome message and banner if provided
        if (message) {
            welcomeConfig.message = message;
        }
        if (banner) {
            welcomeConfig.banner = banner;
        }

        // Save the updated configuration
        try {
            saveConfig(); // Save to JSON file using the saveConfig function from welcomeConfig.js
            console.log(`Welcome channel set to: ${channel.id}`);

            return interaction.reply({ content: `Welcome messages will be sent in ${channel}.`, ephemeral: true });
        } catch (error) {
            console.error('Error saving welcome configuration:', error);
            return interaction.reply({ content: 'There was an error saving the welcome configuration. Please try again later.', ephemeral: true });
        }
    },
};
