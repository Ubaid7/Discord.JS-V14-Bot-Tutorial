const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const reputationSchema = require('../../Models/reputation')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rep')
        .setDescription('Reputation Command')
        .addSubcommand(subcommand =>
            subcommand
                .setName('give')
                .setDescription('Give Someone Reputation')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('User Whom You Want To Give Reputation')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('message')
                        .setDescription('Why Do You Want To Give Repitaion')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View Someone Reputation')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('User Whose Reputation You Want To See')
                        .setRequired(true)))
        .setDMPermission(false),
    async execute(interaction, client) {

        const user = interaction.options.getMember('user')
        const message = interaction.options.getString('message') || 'N/A'

        const data = await reputationSchema.findOne({
            Guild: interaction.guild.id,
            User: user.id
        })

        if (interaction.options.getSubcommand() === 'give') {
            if (user.id === interaction.member.id) return await interaction.reply({ content: `You Can't Add Reputation To Yourself`, ephemeral: true })
            if (!data) {
                const data = await reputationSchema.create({
                    Guild: interaction.guild.id,
                    User: user.id,
                    Reputation: 1
                })
                await data.save()
                await interaction.reply({ content: `Reputation Added To ${user.user.username} For ${message}` })
            }
            if (data) {
                data.Reputation += 1
                await data.save()
                await interaction.reply({ content: `Reputation Added To ${user.user.username} For ${message}` })
            }
        }

        if (interaction.options.getSubcommand() === 'view') {
            const data = await reputationSchema.findOne({
                Guild: interaction.guild.id,
                User: user.id
            })

            if (!data) {
                await interaction.reply({ content: `${user.user.username} Doesn't Have Any Reputation` })
            }
            if (data) {
                await interaction.reply({ content: `${user.user.username} Has **${data.Reputation}** Reputation` })
            }
        }
    }
}