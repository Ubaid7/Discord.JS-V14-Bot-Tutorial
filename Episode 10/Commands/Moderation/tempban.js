const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempban') // Name Of Slash Command
        .setDescription('Temp Ban A Member') // Description Of Slash Command
        // Seletcting User To Ban
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('User You Want To Temp Ban')
                .setRequired(true)
        )
        // Time For You Want To Ban User
        .addStringOption(option =>
            option
                .setName('time')
                .setDescription('Time You Want Ban User For')
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
        const time = interaction.options.getString('time')
        const reason = interaction.options.getString('reason') ?? 'No Reason Provided'
        const member = await interaction.guild.members.fetch(user.id)

        const banEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Temp Ban')
            .setDescription(`Temp Banned ${user.username} For ${reason}`)

        await interaction.reply({ embeds: [banEmbed] })
        await member.ban({ reason: reason })

        // UnBan After Time Is Finished
        setTimeout(async () => {
            const unbanEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Temp UnBan')
                .setDescription(`${user.username} Has Been UnBanned After ${time}`)

            await interaction.channel.send({ embeds: [unbanEmbed] })

            await interaction.guild.members.unban(user)
        }, ms(time))
    }
}