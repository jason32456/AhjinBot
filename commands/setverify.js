const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { verifyConfig, saveVerifyConfig } = require('../config/verifyConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setverify')
        .setDescription('Set the verification channel, banner, embed color, title, and description')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Verification channel')
                .setRequired(true))
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
        const channel = interaction.options.getChannel('channel');
        const banner = interaction.options.getString('banner') || 'https://i.imgur.com/WvU8QQV.png';
        const color = interaction.options.getString('color') || '#36393F';
        const title = interaction.options.getString('title') || 'Account Verification Required 🔎';
        const description = interaction.options.getString('description') || 
`To safeguard the integrity and security of our community, all new members are required to complete a verification process. This essential step helps us:

- Prevent spam and abuse: Verification helps us identify and prevent malicious activity.
- Maintain a welcoming environment: By verifying members, we ensure that our community is composed of genuine individuals who adhere to our guidelines.
- Enhance security: Verification adds an extra layer of protection to our community, reducing the risk of unauthorized access.

Please click the "Start Verification" button below to initiate the process.`;

        verifyConfig.channelId = channel.id;
        verifyConfig.banner = banner;
        verifyConfig.color = color;
        verifyConfig.title = title;
        verifyConfig.description = description;

        saveVerifyConfig(verifyConfig);

        // Create the embed
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .addFields(
                { name: 'Channel', value: channel.toString(), inline: true },
                { name: 'Banner', value: banner || 'No banner set', inline: true },
                { name: 'Color', value: color, inline: true }
            )
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

        // Create and send the verification embed with buttons
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
            await channel.send({ embeds: [verificationEmbed], components: [row] });
            console.log(`Verification embed sent to ${channel.name}`);
        } catch (error) {
            console.error(`Error sending verification embed: ${error}`);
        }
    },
};
