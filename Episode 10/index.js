const { Client, GatewayIntentBits, Collection, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { token } = require('./config.json')
const fs = require('fs')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers] })
client.commands = new Collection()
client.commandArray = []

const funtionFolders = fs.readdirSync('./src/functions')
for (const folder of funtionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.js')) // Read Folders
    for (const file of functionFiles) require(`./src/functions/${folder}/${file}`)(client) // Read Files
}

client.handleCommands()
client.handleEvents()

client.login(token)
