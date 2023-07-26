const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info') // Name Of Slash Command
        .setDescription('Get Info Of A Server') // Description Of Slash Command
        .setDMPermission(false),

    async execute(interaction, client) {
        const { guild } = interaction

        const { createdTimestamp, ownerId, memberCount, emojis, roles, stickers, channels } = guild
        const icon = guild.iconURL() // Icon Of Server
        const totEmoji = 'None' || emojis.cache.map(e => e.toString()) // All Emojis Of Server
        const totRoles = 'None' || roles.cache.map(e => e.toString()) // All Roles Of Server

        const serverinfoEmbed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({
            name: `${guild.name} Info`,
            iconURL: icon
        })
        .setThumbnail(icon)
        // Info About Server
        .addFields(
            { name: `**Server Name**`, value: guild.name, inline: true },
            { name: `**Server ID**`, value: guild.id, inline: true },
            { name: `**Server Owner**`, value: `<@${ownerId}>`, inline: true },
            { name: `**Server Created**`, value: `<t:${parseInt(createdTimestamp / 1000)}:R>`, inline: true },
            { name: `**Members In Server**`, value: `${memberCount}`, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true }, // We Will This As Empty So It Won't Look Messed Up In Embed
            { name: `**Boost Count**`, value: `${guild.premiumSubscriptionCount}`, inline: true },
            { name: `**Boost Tier**`, value: `${guild.premiumTier}`, inline: true },
            { name: `\u200B`, value: `\u200B`, inline: true }, // We Will This As Empty So It Won't Look Messed Up In Embed
            { name: `**Emojis In Server**`, value: `${'0' || emojis.cache.size}\nAnimated: ${'0' || emojis.cache.filter(emoji => emoji.animated).size}\nNormal: ${'0' || emojis.cache.filter(emoji => !emoji.animated).size}`, inline: true },            
            { name: `**Emojis**`, value: `${totEmoji}`, inline: true },
            { name: `Stickers In Server`, value: `${'0' || stickers.cache.size}`, inline: true }, // We Will This As Empty So It Won't Look Messed Up In Embed
            { name: `**Roles In Server**`, value: `${roles.cache.size - 1}`, inline: true }, // -1 To Remove @everyone
            { name: `**Roles**`, value: `${totRoles}`, inline: true },
            { name: `**Highest Role**`, value: `${roles.highest}`, inline: true },
            { name: `**Server Stats:**`, value: `Total: ${channels.cache.size}\n${channels.cache.filter(channel => channel.type === ChannelType.GuildText).size} ⌨️\n${channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size} 🔈\n${channels.cache.filter(channel => channel.type === ChannelType.GuildAnnouncement).size} 📢\n${channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size} 📁`}, // You Can Add More Options
            // You Can Add More Options
        )
        .setFooter({
            text: guild.name,
            iconURL: icon
        })

        await interaction.deferReply({ fetchReply: true })
        await interaction.editReply({ embeds: [serverinfoEmbed] })

    }
}