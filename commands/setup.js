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

// Create a role with permissions
const createRole = async (guild, roleName, permissions = []) => {
    try {
        await guild.roles.create({ name: roleName, permissions, reason: 'Server setup' });
        console.log(`Role "${roleName}" created successfully.`);
    } catch (error) {
        console.error(`Failed to create role "${roleName}":`, error);
    }
};

// Create a channel under a specified category
const createChannel = async (guild, channelName, channelTopic, parentId) => {
    try {
        await guild.channels.create({
            name: channelName,
            type: 0, // Text channel
            topic: channelTopic,
            parent: parentId,
        });
        console.log(`Channel "${channelName}" created successfully under category ID "${parentId}".`);
    } catch (error) {
        console.error(`Failed to create channel "${channelName}":`, error);
    }
};

// Setup categories, channels, and roles
const setupServer = async (guild) => {
    // Define roles and their permissions
    const roles = [
        { name: 'Admin', permissions: ['ADMINISTRATOR'] },
        { name: 'Moderator', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS'] },
        { name: 'Member', permissions: [] },
        { name: 'Giveaway-Manager', permissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'] },
    ];

    // Create roles
    for (const role of roles) {
        await createRole(guild, role.name, role.permissions);
    }

    // Define categories and their associated channels
    const categories = [
        { name: 'Information', emoji: 'ℹ️', channels: [
            { name: 'rules', topic: 'Read the rules here.' },
            { name: 'announcements', topic: 'Important announcements will be posted here.' },
        ]},
        { name: 'Community', emoji: '👥', channels: [
            { name: 'general', topic: 'Chat with the community.' },
            { name: 'suggestions', topic: 'Share your suggestions.' },
        ]},
        { name: 'Games', emoji: '🎮', channels: [
            { name: 'game-chat', topic: 'Discuss games here.' },
            { name: 'game-nights', topic: 'Join us for game nights!' },
        ]},
        { name: 'Music', emoji: '🎶', channels: [
            { name: 'music-chat', topic: 'Share your favorite music.' },
            { name: 'music-bots', topic: 'Bot commands for music.' },
        ]},
        { name: 'Bots', emoji: '🤖', channels: [
            { name: 'bot-commands', topic: 'Commands for bot usage.' },
            { name: 'bot-feedback', topic: 'Give feedback on bots.' },
        ]},
        { name: 'Giveaways', emoji: '🎉', channels: [
            { name: 'giveaways', topic: 'Participate in giveaways here!' },
        ]},
        { name: 'Events', emoji: '📅', channels: [
            { name: 'upcoming-events', topic: 'Stay tuned for upcoming events!' },
        ]},
        { name: 'Support', emoji: '🆘', channels: [
            { name: 'support', topic: 'Get help with your problems here.' },
        ]},
    ];

    // Create categories and their channels
    for (const category of categories) {
        const createdCategory = await guild.channels.create({
            name: `${category.emoji} ${category.name}`,
            type: 4, // Category type
        });

        for (const channel of category.channels) {
            await createChannel(guild, channel.name, channel.topic, createdCategory.id);
        }
    }
};

// Command module exports
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the server with channels and roles.'),
    async execute(interaction) {
        const setupState = loadSetupState();
        const guildId = interaction.guild.id;

        // Check if setup has already been done
        if (setupState[guildId]) {
            return interaction.reply('Server setup has already been completed. Use `/reset` to reset the server.');
        }

        // Acknowledge the interaction immediately
        await interaction.reply('Setting up the server... Please wait.');

        const guild = interaction.guild;

        // Setup server with roles and channels
        await setupServer(guild);

        // Save the setup state
        setupState[guildId] = true;
        saveSetupState(setupState);

        await interaction.followUp('Server setup completed successfully!');
    },
};