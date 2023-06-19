const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js'); // npm i discord.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestion') // Name Of Slash Command
        .setDescription('Accept Or Decline A Suggestion') // Description Of Slash Command
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // Permission To Accept Or Decline Embed
        // Accept Suggestion
        .addSubcommand(command =>
            command
                .setName('accept')
                .setDescription('Accept A Suggestion')
                // Message ID Of Suggestion
                .addStringOption(option =>
                    option
                        .setName('message_id')
                        .setDescription('Message ID Of Suggestion You Want To Accept')
                        .setRequired(true))
                // Accept Message
                .addStringOption(option =>
                    option
                        .setName('accept_msg')
                        .setDescription('Accept Message')
                        .setRequired(true)))
        // Decline Suggestion
        .addSubcommand(command =>
            command
                .setName('decline')
                .setDescription('Decline A Suggestion')
                // Message ID Of Suggestion
                .addStringOption(option =>
                    option
                        .setName('message_id')
                        .setDescription('Message ID Of Suggestion You Want To Decline')
                        .setRequired(true))
                // Decline Message
                .addStringOption(option =>
                    option
                        .setName('decline_msg')
                        .setDescription('Decline Message')
                        .setRequired(true)))
        .setDMPermission(false),
    async execute(interaction, client) {

        const subcmd = interaction.options.getSubcommand()
        const messageID = interaction.options.getString('message_id')
        const accMessage = interaction.options.getString('accept_msg')
        const decMessage = interaction.options.getString('decline_msg')
        const suggestionChannel = await interaction.guild.channels.cache.get('1110241984188272790') // Suggestion Channel ID
        const suggestionEmbed = await suggestionChannel.messages.fetch(messageID)
        const data = suggestionEmbed.embeds[0]

        switch (subcmd) {
            case 'accept':
                try {
                    const accEmbed = new EmbedBuilder()
                        .setAuthor({
                            name: 'Suggestion Accepted',
                            iconURL: data.author.iconURL
                        })
                        .setColor('Green')
                        .setDescription(`${data.description}`)
                        .setTimestamp()
                        .addFields(
                            { name: 'Status', value: `Accepted:\n${accMessage}` }
                        )

                    await interaction.reply({ content: `Suggestion Accepted` })
                    await suggestionEmbed.edit({ embeds: [accEmbed] })
                } catch (error) {
                    await interaction.reply({ content: `An Error Occured, Maybe Message Is Wrong Or Couldn't Edit Embed` })
                    console.log(error)
                }
                break;

            case 'decline':
                try {
                    const decEmbed = new EmbedBuilder()
                        .setAuthor({
                            name: 'Suggestion Declined',
                            iconURL: data.author.iconURL
                        })
                        .setColor('Red')
                        .setDescription(`${data.description}`)
                        .setTimestamp()
                        .addFields(
                            { name: 'Status', value: `Declined:\n${decMessage}` }
                        )

                    await interaction.reply({ content: `Suggestion Declined` })
                    await suggestionEmbed.edit({ embeds: [decEmbed] })
                } catch (error) {
                    await interaction.reply({ content: `An Error Occured, Maybe Message Is Wrong Or Couldn't Edit Embed` })
                    console.log(error)
                }
                break;
        }
    }
}
