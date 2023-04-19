const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban') // Name Of Slash Command
        .setDescription('UnBan A Member') // Description Of Slash Command
        // Seletcting User To UnBan
        .addStringOption(option =>
            option
                .setName('userid')
                .setDescription('User ID You Want To Ban')
                .setRequired(true)
        )
        // Reason For UnBanning(Optional)
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason For UnBanning')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Permission User Should Have To Use Command
        .setDMPermission(false),

    async execute(interaction, client) {
        const user = interaction.options.getString('userid')
        const reason = interaction.options.getString('reason') ?? 'No Reason Provided'

        try {
            const unbanEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('UnBan')
            .setDescription(`UnBanned ${user.user.username} For ${reason}`)
            
            await interaction.reply({ embeds: [unbanEmbed] })
            await interaction.guild.members.unban(user)
        } catch (err) {
            const errorunbanEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('UnBan Error')
            .setDescription(`Provide Valid User ID`)
            
            await interaction.reply({ embeds: [errorunbanEmbed] })
            console.log(err)
        }
    }
}