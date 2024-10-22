// events/interactionCreate.js
module.exports = async (client, interaction) => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;

        // Load the command dynamically based on the command name
        const command = require(`../commands/${commandName}`);

        if (command && typeof command.execute === 'function') {
            await command.execute(interaction);
        } else {
            console.error(`No command matching ${commandName} was found.`);
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === 'verify') {
            // Check if the user is already verified by checking if they have the 'Verified' role
            const verifiedRole = interaction.guild.roles.cache.find(role => role.name === 'Verified');
            if (!verifiedRole) {
                return interaction.reply({ content: '⚠️ The "Verified" role is not set up. Please contact an admin.', ephemeral: true });
            }

            if (interaction.member.roles.cache.has(verifiedRole.id)) {
                return interaction.reply({ content: 'You are already verified 🟢', ephemeral: true });
            }

            // Proceed with the verification process if the user is not verified yet
            const dmChannel = await interaction.user.createDM();

            // Generate a random math question for verification
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const correctAnswer = num1 + num2;

            // Create an embed for a more professional look
            const verificationEmbed = {
                color: 0x36393F, // Dark gray color (#36393F)
                title: 'Verification Required 🗝️',
                description: `Welcome **${interaction.user.username}** to our community! 🧣\n\nTo ensure the safety and integrity of our server, we require all new members to complete a verification process. Please answer the following question to verify your account:\n\n**What is ${num1} + ${num2}?**\n\nType your answer in this chat to proceed. Thank you for your cooperation!`,
                thumbnail: {
                    url: interaction.user.displayAvatarURL(), // User's profile picture as a thumbnail
                },
                footer: {
                    text: 'Your response is necessary to access the server!',
                },
            };

            // Send the verification DM with the embed (no buttons included)
            await dmChannel.send({ embeds: [verificationEmbed] });

            // Create a message collector in the DM for the user's response
            const filter = response => response.author.id === interaction.user.id;
            const collector = dmChannel.createMessageCollector({ filter, time: 30000, max: 1 });

            collector.on('collect', async (response) => {
                const userInput = response.content.trim();
                const userAnswer = parseInt(userInput, 10);

                if (!isNaN(userAnswer)) {
                    if (userAnswer === correctAnswer) {
                        await interaction.member.roles.add(verifiedRole);
                        await dmChannel.send({ content: 'Verification successful! 📌' });
                    } else {
                        await dmChannel.send({ content: `Incorrect answer. The correct answer was **${correctAnswer}**. Please try again.` });
                    }
                } else {
                    await dmChannel.send({ content: '⚠️ Please enter a valid number for your answer.' });
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    dmChannel.send({ content: 'You did not provide an answer in time ⏳. Please try verifying again by clicking the Verify button in the server.' });
                }
            });
        }
    }
};
