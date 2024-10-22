const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { verifyConfig, saveVerifyConfig } = require('../config/verifyConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updateverify')
        .setDescription('Update the verification channel, banner, embed color, title, and description')
        .addStringOption(option =>
            option.setName('banner')
                .setDescription('Verification banner URL')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Embed color (hex value)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Verification embed title')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Verification embed description')
                .setRequired(false)),

    async execute(interaction) {
        const banner = interaction.options.getString('banner') || verifyConfig.banner;
        const color = interaction.options.getString('color') || verifyConfig.color;
        const title = interaction.options.getString('title') || verifyConfig.title;
        const description = interaction.options.getString('description') || verifyConfig.description;

        verifyConfig.banner = banner;
        verifyConfig.color = color;
        verifyConfig.title = title;
        verifyConfig.description = description;

        saveVerifyConfig(verifyConfig);

        // Create an embed for the reply
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ text: 'All rights reserved by ahjindev.co.' });

        await interaction.reply({ embeds: [embed] });

        // Create buttons for the verification message
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verify')
                    .setLabel('🔎 Start Verification!')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('rules')
                    .setLabel('📜 The Rules')
                    .setStyle(ButtonStyle.Secondary)
            );

        // Resend the updated verification embed to the specified channel
        const verifyChannel = interaction.guild.channels.cache.get(verifyConfig.channelId);
        if (!verifyChannel) {
            return console.error(`Verification channel not found! Channel ID: ${verifyConfig.channelId}`);
        }

        const verificationEmbed = {
            color: parseInt(color.replace('#', ''), 16),
            title: title,
            description: description,
            image: {
                url: banner,
            },
            footer: {
                text: 'All rights reserved by ahjindev.co.',
            },
        };

        try {
            // Check if an old embed exists and delete it (optional)
            const messages = await verifyChannel.messages.fetch({ limit: 10 });
            const oldEmbedMessage = messages.find(msg => msg.embeds.length > 0);
            if (oldEmbedMessage) {
                await oldEmbedMessage.delete();
                console.log(`Deleted old verification embed from ${verifyChannel.name}`);
            }

            // Send the updated verification embed with buttons
            await verifyChannel.send({ embeds: [verificationEmbed], components: [row] });
            console.log(`Updated verification embed sent to ${verifyChannel.name}`);
        } catch (error) {
            console.error(`Error sending updated verification embed: ${error}`);
        }
    },
};
