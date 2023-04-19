const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping') // Name Of Slash Command
    .setDescription('Ping Command'), // Description Of Slash Command
    async execute(interaction, client) {
        const message = await interaction.deferReply({ fetchReply: true }) // .deferReply Will Make The Bot Think For A While Before Send Response
        const pingmsg = `API Latecy: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`
        await interaction.editReply(pingmsg)
    }
}
