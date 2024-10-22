module.exports = async (client, member) => {
    console.log(`New member joined: ${member.user.username}`);

    const welcomeChannel = member.guild.channels.cache.get(client.welcomeConfig.channelId) || member.guild.systemChannel;

    if (!welcomeChannel) {
        console.error(`Welcome channel not found! Channel ID: ${client.welcomeConfig.channelId}`);
        return;
    }

    const welcomeMessage = client.welcomeConfig.message.replace('{{username}}', member.user.username);
    const embedColor = client.welcomeConfig.color ? parseInt(client.welcomeConfig.color.replace('#', ''), 16) : 0x0099ff;

    const welcomeEmbed = {
        color: embedColor,
        title: 'Welcome!',
        description: welcomeMessage,
        thumbnail: {
            url: member.user.displayAvatarURL(),
        },
        image: {
            url: client.welcomeConfig.banner || '',
        },
        timestamp: new Date(),
    };

    try {
        await welcomeChannel.send({ embeds: [welcomeEmbed] });
        console.log(`Welcome message sent to ${welcomeChannel.name} for ${member.user.username}`);
    } catch (error) {
        console.error(`Error sending welcome message: ${error}`);
    }
};
