const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick') // Name Of Slash Command
        .setDescription('Kick A Member') // Description Of Slash Command
        // Seletcting User To Ban
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('User You Want To Kick')
                .setRequired(true)
        )
        // Reason For Kicking(Optional)
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason For Kicking')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers) // Permission User Should Have To Use Command
        .setDMPermission(false),

    async execute(interaction, client) {
        const user = interaction.options.getUser('target')
        const reason = interaction.options.getString('reason') ?? 'No Reason Provided'
        const member = await interaction.guild.members.fetch(user.id)

        const kickEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Kick')
        .setDescription(`Kicked ${user.username} For ${reason}`)
        
        await interaction.reply({ embeds: [kickEmbed] })
        await member.kick({ reason: reason })
    }
}