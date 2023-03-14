const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban') // Name Of Slash Command
        .setDescription('Ban A Member') // Description Of Slash Command
        // Seletcting User To Ban
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('User You Want To Ban')
                .setRequired(true)
        )
        // Reason For Banning(Optional)
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason For Banning')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Permission User Should Have To Use Command
        .setDMPermission(false),

    async execute(interaction, client) {
        const user = interaction.options.getUser('target')
        const reason = interaction.options.getString('reason') ?? 'No Reason Provided'
        const member = await interaction.guild.members.fetch(user.id)

        const banEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Ban')
        .setDescription(`Banned ${user.username} For ${reason}`)
        
        await interaction.reply({ embeds: [banEmbed] })
        await member.ban({ reason: reason })
    }
}