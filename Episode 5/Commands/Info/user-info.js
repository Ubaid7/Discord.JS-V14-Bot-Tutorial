const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info') // Name Of Slash Command
        .setDescription('Get Info Of A User') // Description Of Slash Command
        // Seletcting User Whom You Want Info(Optional)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User You Want To Get Info Of')
        )
        .setDMPermission(false),

    async execute(interaction, client) {
        const member = interaction.options.getMember('user') || interaction.member // Get Info Of User Whom You Want Or YouSelf

        const userinfoEmbed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({
                name: `${member.user.username} Info`,
                iconURL: member.user.displayAvatarURL()
            })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            // Details Of User
            .addFields(
                { name: `**User Name:**`, value: `${member.user.username}#${member.user.discriminator}`, inline: true },
                { name: `**User ID:**`, value: member.user.id, inline: true },
                { name: `\u200B`, value: `\u200B`, inline: true }, // We Will This As Empty So It Won't Look Messed Up In Embed
                { name: `**Discord Created:**`, value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: `**Joined Server:**`, value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: `**Roles:**`, value: `${member.roles.cache.map(role => role.toString())}` }
            )
            .setFooter({
                text: `${member.user.username} Info`,
                iconURL: member.user.displayAvatarURL()
            })

        await interaction.deferReply({ fetchReply: true })
        await interaction.editReply({ embeds: [userinfoEmbed] })
    }
}
