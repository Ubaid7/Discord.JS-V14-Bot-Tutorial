const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db'); // npm i quick.db
const db = new QuickDB();
const { ms, randomName } = require('tech-tip-cyber') // npm i tech-tip-cyber@latest

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg') // Name Of Slash Command
        .setDescription('Beg For Money') // Description Of Slash Command
        .setDMPermission(false),

    async execute(interaction, client) {

        const user = interaction.member

        const random = (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min
        } // Getting Random Options

        let options = [
            'Success',
            'Fail'
        ]
        let begged = random(0, parseInt(options.length))
        let final = options[begged]

        const timeout = 60000 // 1 Min In Millisecond
        const begtime = await db.get(`beg-time_${user.id}`)


        // Check For Cool Down
        if (begtime !== null && timeout - (Date.now() - begtime) > 0) {
            const timeleft = ms(timeout - (Date.now() - begtime))

            const cooldownEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${user.user.username} Begged`,
                    iconURL: user.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp()
                .setColor('Random')
                .setDescription(`
Already Begged, Beg Again In **${timeleft.seconds} Seconds**
            `)
            await interaction.reply({ embeds: [cooldownEmbed] })
        } else { // If No Cool Down

            const amount = Math.floor(Math.random() * 900) + 100 // Min Is 100 And Max Is 1000(100+900)
            const name = randomName() // Get Random Name

            if (final === 'Success') { // If Begging Is Successed

                let gave = [
                    'Gave',
                    'Donated'
                ]
                const give = Math.floor(Math.random() * gave.length)

                const begEmbedSuccess = new EmbedBuilder()
                    .setAuthor({
                        name: `${user.user.username} Begged`,
                        iconURL: user.user.displayAvatarURL({ dynamic: true })
                    })
                    .setTimestamp()
                    .setColor('Random')
                    .setDescription(`
**${name}**: ${gave[give]} **$${amount}** To <@${user.user.id}>
                `)
                await interaction.reply({ embeds: [begEmbedSuccess] })

                await db.add(`money_${user.id}`, amount) // Add Money To User
                await db.set(`beg-time_${user.id}`, Date.now()) // For Cool Down
            } else if (final === 'Fail') { // If Begging Is Failed

                let notgave = [
                    `I Don't Have Money`,
                    `I Am Also Poor`,
                    `I Already Gave Money Last Beggar`,
                    `Go Away`,
                    `Stop Begging`,
                    `Look For Other`
                ]
                const notgive = Math.floor(Math.random() * notgave.length)

                const begEmbedFail = new EmbedBuilder()
                    .setAuthor({
                        name: `${user.user.username} Begged`,
                        iconURL: user.user.displayAvatarURL({ dynamic: true })
                    })
                    .setTimestamp()
                    .setColor('Random')
                    .setDescription(`
**${name}**: ${notgave[notgive]}
                `)
                await interaction.reply({ embeds: [begEmbedFail] })

                await db.set(`beg-time_${user.id}`, Date.now()) // For Cool Down
            }
        }
    }
} 