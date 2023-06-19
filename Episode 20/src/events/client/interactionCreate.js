module.exports = {
    name: 'interactionCreate',
     async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client
            const { commandName } = interaction
            const command = commands.get(commandName)

            if(!command) return

            try {
                await command.execute(interaction, client)
            } catch (error) {
                console.error(error)
                // If Their Is An Error While Running Slash Command
                await interaction.reply({ content: `Something Went Wrong, Try Again`, ephemeral: true }) // ephemeral: true Mean Only You Can See The Message
            }
        }
     }
}