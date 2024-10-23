const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generate } = require('../external/gemini');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('askgemini')
    .setDescription('Ask Gemini a question.')
    .addStringOption(option => option.setName('prompt')
    .setDescription('The prompt to ask Gemini.')
    .setRequired(true)),
    async execute(interaction) {
        try {
            const prompt = interaction.options.getString("prompt");
            const user = interaction.user.username;

            await interaction.deferReply();

            const story = await generate(prompt);

            const embed = new EmbedBuilder()
                .setColor(0x7DF9FF)
                .setTitle('GeminiAI')
                .addFields(
                    { name: 'Prompt', value: prompt, inline: false },
                    { name: 'Output', value: story, inline: false }
                )
                .setFooter({ text: `Prompt by ${user}` })
                .setTimestamp();

            await interaction.followUp({ embeds: [embed] });
            console.log(story);
        } catch (error) {
            console.error('Error handling interaction:', error);
    
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('An error occurred while processing your request.')
                .addFields({ name: 'Details', value: error.message || 'Unknown error' })
                .setTimestamp();
    
            await interaction.followUp({ embeds: [errorEmbed] });
        }
    }
}
