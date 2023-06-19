const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { hexCheck } = require('tech-tip-cyber') // npm i tech-tip-cyber@latest

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-role') // Name Of Slash Command
        .setDescription('Create A Role In Server')  // Description Of Slash Command
        // Name Of Role
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name Of Role You Want To Create')
                .setRequired(true))
        // Color Of Role
        .addStringOption(option =>
            option
                .setName('color')
                .setDescription('Color Of Role')
                .setRequired(true))
        // Position Of Role
        .addNumberOption(option =>
            option
                .setName('position')
                .setDescription('Position Of Role')
                .setRequired(true))
        // Mentionalbe
        .addStringOption(option =>
            option
                .setName('mention')
                .setDescription('Should The Role Be Mention By Everyone Or Not')
                .addChoices(
                    { name: 'Yes', value: 'true' },
                    { name: 'No', value: 'false' }
                )
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles) // Permission To Use Command
        .setDMPermission(false)
    ,
    async execute(interaction, client) {
        const name = interaction.options.getString('name') // Get Name Of Role From Options
        const position = interaction.options.getNumber('position') // Get Position Of Role From Options
        const mention = interaction.options.getString('mention') // Role Mentionable Or Not
        let color = interaction.options.getString('color') // Get Color Of Role From Options

        const part1 = color.slice(0, 1) // Get First Part Of `3cb` i.e: 3
        const part2 = color.slice(1, 2) // Get Second Part Of `3cb` i.e: c
        const part3 = color.slice(2, 3) // Get First Part Of `3cb` i.e: b

        if (color.length > 6 || color.length < 3 || color.length === 1 || color.length === 2 || color.length === 4 || color.length === 5) return await interaction.reply({ content: `Color Hex Code Can't Be More Than 6 Digits Or Less Than 3 Digits`, ephemeral: true }) // If Hex Code Is Wrong
        if (color.length === 3) color = `${part1}${part1}${part2}${part2}${part3}${part3}` // If Color Provided Is 3 Digits // `3cb` Then It Will Take As `33ccbb`
        const checkColor = hexCheck().test(`#${color}`) // Check If Color Provided Is Valid
        if (checkColor === false) return await interaction.reply({ content: `Color Hex Code Isn't Correct`, ephemeral: true }) // If Provided Color Is Wrong

        const CreateRoleembed = new EmbedBuilder()
            .setTitle('Create Role')
            .setDescription(`You Wanted To Create A Role Named ${name} With Color #${color}`)
            .setColor('Random')

        const CreateRoleSuccessembed = new EmbedBuilder()
            .setTitle('Created Role')
            .setDescription(`You Created A Role Named ${name} With Color #${color}`)
            .setColor('Green')

        const buttons = new ActionRowBuilder()
            .addComponents( // Yes And No Buttons
                new ButtonBuilder()
                    .setLabel('Yes')
                    .setCustomId('yes')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel('No')
                    .setCustomId('no')
                    .setStyle(ButtonStyle.Danger)
            )

        const msg = await interaction.reply({ embeds: [CreateRoleembed], components: [buttons], fetchReply: true })

        // Button Collector
        const collector = msg.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 40000 // Time WithIn You Have To React To Buttons // 40 Seconds
        })

        collector.on('collect', async i => {
            const id = i.customId
            const value = id

            if (value === 'yes') { // If Yes Button Is Selected
                await interaction.followUp({ content: `Successfully Created A Role With Name **${name}**` })
                interaction.guild.roles.create({ // Create Role With Below Data
                    name: name, // Name Of Role
                    color: color, // Color Of Role
                    position: position, // Position Of Role
                    mentionable: mention, // Role Mentionable Or Not
                    permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageChannels]  // Permissions Of Role // You Can Keep Any Permissions Which You Want
                })
                collector.stop()
                i.update({ content: `Interaction Completed`, embeds: [CreateRoleSuccessembed], components: [] })
            } else if (value === 'no') { // If No Button Is Selected
                await interaction.followUp({ content: `Cancelled`, ephemeral: true })
                collector.stop()
                i.update({ content: `Interaction Completed`, embeds: [CreateRoleembed], components: [] })
            }
        })

        collector.on('end', async collected => { // If Buttons Are Not Reacted In Time
            await interaction.editReply({ content: `Buttons Not Used In Time`, embeds: [CreateRoleembed], components: [] })
            collector.stop()
        })

    }
}