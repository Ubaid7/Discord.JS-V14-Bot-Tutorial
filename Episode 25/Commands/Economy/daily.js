const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db'); // npm i quick.db
const db = new QuickDB();
const { ms } = require('tech-tip-cyber') // npm i tech-tip-cyber@latest

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Get Your Daily Money')
        .setDMPermission(false),
    async execute(interaction, client) {

        const user = interaction.member

        const timeout = 86400000 //  86400000 Milli Second = 24 Hours
        const dailytime = await db.get(`daily-time_${user.id}`)

        // Check For Cool Down
        if (dailytime !== null && timeout - (Date.now() - dailytime) > 0) {
            const timeleft = ms(timeout - (Date.now() - dailytime))

            const cooldownEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${user.user.username} Daily Reweard`,
                    iconURL: user.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp()
                .setColor('Random')
                .setDescription(`
Already Claimed Daily Money, Claim Again In **${timeleft.hours}** Hours **${timeleft.minutes}** Minutes **${timeleft.seconds} Seconds**
            `)
            await interaction.reply({ embeds: [cooldownEmbed] })
        } else { // If No Cool Down

            const amount = Math.floor(Math.random() * 8000) + 2000 // Min Is 2000 And Max Is 10000(8000+2000)

            const dailyEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${user.user.username} Daily Reweard`,
                    iconURL: user.user.displayAvatarURL({ dynamic: true })
                })
                .setColor('Random')
                .setTimestamp()
                .setDescription(`
<@${user.id}> Claimed **$${amount.toLocaleString()}** As Daily Reward
            `)
            await interaction.reply({ embeds: [dailyEmbed] })
            await db.add(`money_${user.id}`, amount) // Add Amount To User's Wallet
            await db.set(`daily-time_${user.id}`, Date.now()) // Add Amount To User's Wallet
        }

    }
}