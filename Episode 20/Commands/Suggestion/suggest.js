const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js'); // npm i discord.js
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest') // Name Of Slash Command
        .setDescription('Suggest Something') // Description Of Slash Command
        // Suggestion
        .addStringOption(option =>
            option
                .setName('suggestion')
                .setDescription('Suggestion You Want To Give')
                .setRequired(true))
        .setDMPermission(false),
    async execute(interaction, client) {

        const user = interaction.member
        const staffChannel = await interaction.guild.channels.cache.get('1110245221528244296') // Staff Channel ID
        const staffRoleID = '1109155598580330698' // Staff Role ID
        const suggestionChannel = await interaction.guild.channels.cache.get('1110241984188272790') // Suggestion Channel ID
        const suggestion = interaction.options.getString('suggestion') 

        const staffEmbed = new EmbedBuilder()
            .setAuthor({
                name: `Suggestion`,
                iconURL: user.user.displayAvatarURL()
            })
            .setColor('Yellow')
            .setTimestamp()
            .setDescription(`
**Suggestion:**
${suggestion}

Suggestion By:
${user.user.tag}
        `)

        const appStaffButton = new ButtonBuilder()
            .setLabel('Approve')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('app')

        const decStaffButton = new ButtonBuilder()
            .setLabel('Decline')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('dec')

        const buttonRow = new ActionRowBuilder().addComponents(appStaffButton, decStaffButton)

        await interaction.reply({ content: `Suggestion Sent To Staff Channel For Approval\nKeep You DMs On, You Will Get Notified` })
        await wait(5000)
        await interaction.deleteReply()
        const msg = await staffChannel.send({ embeds: [staffEmbed], components: [buttonRow] }) // Send Embed In Staff Channel

        const collector = msg.createMessageComponentCollector({
            filter: (interaction) => {
                const roleID = staffRoleID
                const member = interaction.member
                return member.roles.cache.has(roleID)
            },
            time: 604800000 // 7 Days In Milliseconds
        })

        collector.on('collect', async interaction => {
            const vaule = interaction.customId

            if (vaule === 'app') { // If Suggestion Is Approved
                const appEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: `Suggestion`,
                        iconURL: user.user.displayAvatarURL()
                    })
                    .setColor('Yellow')
                    .setTimestamp()
                    .setDescription(`
**Suggestion:**
${suggestion}
        
Suggestion By:
${user.user.tag}
                `)
                    .addFields(
                        { name: 'Status:', value: `Waiting For Votes` }
                    )

                await suggestionChannel.send({ embeds: [appEmbed] })
                await interaction.reply({ content: `Suggestion Approved` })
                await wait(5000)
                await interaction.deleteReply()
                await user.send({ content: `Suggestion:\n${suggestion}\n\nYour Suggestion **Approved**. Check Out ${suggestionChannel}` })
                collector.stop()
            } else if (vaule === 'dec') { // If Suggestion Is Declined
                await interaction.reply({ content: `Suggestion Declined` })
                await wait(5000)
                await interaction.deleteReply()
                await user.send({ content: `Suggestion:\n${suggestion}\n\nYour Suggestion **Declined**. Check Out ${suggestionChannel}` })
                collector.stop()
            }
        })
    }
}