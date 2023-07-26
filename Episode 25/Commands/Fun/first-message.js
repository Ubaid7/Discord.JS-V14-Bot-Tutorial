const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); // npm i discord.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('first-message') // Name Of Slash Command
        .setDescription('Get First Message Of A Channel') // Description Of Slash Command
        // Add Channel option
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Channel You Want To Get The First Message Of')
                .setRequired(true))
        .setDMPermission(false),
    async execute(interaction, client) {
        await interaction.deferReply({ fetchReply: true })
        const channel = interaction.options.getChannel('channel') // Get The Channel

        const fetchMessages = await channel.messages.fetch({
            limit: 1,
            after: 1
        })

        const message = fetchMessages.first() // Get First Message

        const firstMessageEmbed = new EmbedBuilder()
            .setTitle(`First Meesage In ${channel.name}`)
            .setURL(message.url)
            .setColor('Random')
            .setTimestamp()
            .setDescription(`
Content:
${message.content}
        `)
            .addFields(
                { name: 'Author', value: `${message.author}`, inline: true },
                { name: 'ID', value: `${message.id}`, inline: true }
            )
        await interaction.editReply({ embeds: [firstMessageEmbed] })
    }
}