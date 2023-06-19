const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { QuickDB } = require('quick.db') // npm i quick.db
const db = new QuickDB()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance') // Name Of Slash Command
        .setDescription('Get Balance') // Description Of Slash Command
        // Seletcting User Whom You Want To Get Balance(Optional)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User You Want To Get Balance Of')
        )
        .setDMPermission(false),

    async execute(interaction, client) {
        const user = interaction.options.getMember('user') || interaction.member // Get Balance Of User Whom You Want Or YouSelf
        // User Selected Is Bot
        if (user.user.bot) return await interaction.reply({ content: `Bots Don't Support Economy System`, ephemeral: true })

        let bal = await db.get(`money_${user.id}`) // You Can Keep `money_${message.guild.id}_${user.id}` If You Want Different Amount In, Eg:- If I Am In 2 Servers And You Keep `money_${user.id}` I Will Have Same Money In Both Servers But If you Keep `money_${message.guild.id}_${user.id}` Then I Will Have Different Amount In Both Servers
        if (bal === null || !bal) bal = '0' // If No Balance In Wallet

        let bank = await db.get(`bank_${user.id}`) // You Can Keep `bank_${message.guild.id}_${user.id}` If You Want Different Amount In, Eg:- If I Am In 2 Servers And You Keep `bank_${user.id}` I Will Have Same Money In Both Servers But If you Keep `bank_${message.guild.id}_${user.id}` Then I Will Have Different Amount In Both Servers
        if (bank === null || !bank) bank = '0' // If No Balance In Bank
        
        const total = parseInt(bank) + parseInt(bal)

        const balanceEmbed = new EmbedBuilder()
            .setAuthor({
                name: `Balance`,
                iconURL: user.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp()
            .setColor('Random')
            .setDescription(`
💸 Wallet:- **$${bal.toLocaleString()}**
🏦 Bank:- **$${bank.toLocaleString()}**

💰 Total:- **$${total.toLocaleString()}**
        `)

        await interaction.reply({ embeds: [balanceEmbed] })
    }
}