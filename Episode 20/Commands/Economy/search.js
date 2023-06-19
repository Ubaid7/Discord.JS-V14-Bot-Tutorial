const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js'); // npm i discord.js
const { QuickDB } = require('quick.db'); // npm i quick.db
const db = new QuickDB();
const { ms, Capitalize } = require('tech-tip-cyber') // npm i tech-tip-cyber@latest

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search') // Name Of Slash Command
        .setDescription('Search For Money') // Description Of Slash Command
        .setDMPermission(true),
    async execute(interaction, client) {

        const user = interaction.member

        const timeout = 1 //  120000 Milli Second = 2 Minutes
        const searchtime = await db.get(`search-time_${user.id}`)

        // Check For Cool Down
        if (searchtime !== null && timeout - (Date.now() - searchtime) > 0) {
            const timeleft = ms(timeout - (Date.now() - searchtime))

            const cooldownEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${user.user.username} Search CoolDown`,
                    iconURL: user.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp()
                .setColor('Random')
                .setDescription(`
Already Searched For Money, Search Again In **${timeleft.minutes}** Minutes **${timeleft.seconds} Seconds**
            `)
            await interaction.reply({ embeds: [cooldownEmbed] })
        } else { // If No Cool Down

            const locations = [ // Locations To Search For Money
                'office',
                'grass',
                'room',
                'laptop'
            ]
            let location = locations.sort(() =>
                Math.random() - Math.random()
            ).slice(0, 3) // Get 3 Location From locations

            const location1 = location[0] // Get First Location
            const location2 = location[1] // Get Second Location
            const location3 = location[2] // Get Third Location

            const searched1 = Capitalize({
                Capital: location1
            })
            const searched2 = Capitalize({
                Capital: location2
            })
            const searched3 = Capitalize({
                Capital: location3
            })

            const amount = Math.floor(Math.random() * 1000) + 500 // Min Is 1000 And Max Is 1500(1000+500)

            const searchEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${user.user.username} Search`,
                    iconURL: user.user.displayAvatarURL({ dynamic: true })
                })
                .setColor('Random')
                .setTimestamp()
                .setDescription(`
Where Do You Want To Search Money?
Use Buttons To Search Money
            `)

            const searchedEmbed1 = new EmbedBuilder()
                .setAuthor({
                    name: `${user.user.username} Searched`,
                    iconURL: user.user.displayAvatarURL({ dynamic: true })
                })
                .setColor('Random')
                .setTimestamp()
                .setDescription(`
You Search In **${searched1}** And Found **${amount.toLocaleString()}**
            `)

            const searchedEmbed2 = new EmbedBuilder()
                .setAuthor({
                    name: `${user.user.username} Searched`,
                    iconURL: user.user.displayAvatarURL({ dynamic: true })
                })
                .setColor('Random')
                .setTimestamp()
                .setDescription(`
You Search In **${searched2}** And Found **${amount.toLocaleString()}**
            `)

            const searchedEmbed3 = new EmbedBuilder()
                .setAuthor({
                    name: `${user.user.username} Searched`,
                    iconURL: user.user.displayAvatarURL({ dynamic: true })
                })
                .setColor('Random')
                .setTimestamp()
                .setDescription(`
You Search In **${searched3}** And Found **${amount.toLocaleString()}**
            `)

            const searchButton1 = new ButtonBuilder() // First Button
                .setLabel(`${location1}`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId('first')

            const searchButton2 = new ButtonBuilder() // Second Button
                .setLabel(`${location2}`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId('second')

            const searchButton3 = new ButtonBuilder() // Third Button
                .setLabel(`${location3}`)
                .setStyle(ButtonStyle.Primary)
                .setCustomId('third')

            const searchButtons = new ActionRowBuilder().addComponents(searchButton1, searchButton2, searchButton3)

            const msg = await interaction.reply({ embeds: [searchEmbed], components: [searchButtons], fetchReply: true })

            const collector = msg.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                time: 40000 // 40 Seconds
            })

            collector.on('collect', async i => {
                const vaule = i.customId

                if (vaule === 'first') { // If First Button Is Clicked
                    searchButton1.setDisabled(true)
                    searchButton2.setDisabled(true)
                    searchButton3.setDisabled(true)

                    searchButton2.setStyle(ButtonStyle.Secondary)
                    searchButton3.setStyle(ButtonStyle.Secondary)

                    i.update({ embeds: [searchedEmbed1], components: [searchButtons] })

                    await db.add(`money_${user.id}`, amount)
                    await db.set(`search-time_${user.id}`, Date.now())
                    collector.stop()
                } else if (vaule === 'second') { // If Second Button Is Clicked
                    searchButton1.setDisabled(true)
                    searchButton2.setDisabled(true)
                    searchButton3.setDisabled(true)

                    searchButton1.setStyle(ButtonStyle.Secondary)
                    searchButton3.setStyle(ButtonStyle.Secondary)

                    i.update({ embeds: [searchedEmbed2], components: [searchButtons] })

                    await db.add(`money_${user.id}`, amount)
                    await db.set(`search-time_${user.id}`, Date.now())
                    collector.stop()
                } else if (vaule === 'third') { // If Third Button Is Clicked
                    searchButton1.setDisabled(true)
                    searchButton2.setDisabled(true)
                    searchButton3.setDisabled(true)

                    searchButton1.setStyle(ButtonStyle.Secondary)
                    searchButton2.setStyle(ButtonStyle.Secondary)

                    i.update({ embeds: [searchedEmbed3], components: [searchButtons] })

                    await db.add(`money_${user.id}`, amount)
                    await db.set(`search-time_${user.id}`, Date.now())
                    collector.stop()
                }
            })
        }
    }
}