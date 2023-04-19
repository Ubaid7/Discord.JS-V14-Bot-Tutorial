const { Client, GatewayIntentBits, Collection, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { token, openai_api } = require('./config.json')
const fs = require('fs')

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent] })
client.commands = new Collection()
client.commandArray = []

const funtionFolders = fs.readdirSync('./src/functions')
for (const folder of funtionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.js')) // Read Folders
    for (const file of functionFiles) require(`./src/functions/${folder}/${file}`)(client) // Read Files
}

const { Configuration, OpenAIApi } = require('openai') // npm i openai
const configuration = new Configuration({
    apiKey: openai_api
})
const openai = new OpenAIApi(configuration)

client.on('messageCreate', async message => {
    if (message.author.bot) return // If Bot Messages It Wont't Reply

    if (message.channel.id === '1097465886065053797') { // Channel ID For Using ChatGPT

        const msg = message.content // Get The Content Of Message

        try {
            await message.channel.sendTyping() // Bot Will Start Typing

            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo', // You Can Any Model // I Will Provide Models In Description
                messages: [{ role: 'user', content: msg }]
            })

            const reply = response.data.choices[0].message
            if(reply.length > 4000) return message.reply(`Reply To Your Question Is Long`)

            await message.reply(reply) // Send The Message From ChatGPT
        } catch (error) { // If Any Errors
            if (error.response) {
                console.log(error.response.status)
                console.log(error.response.data)
                return
            } else {
                return console.log(error.message)
            }
        }
    }
})

client.handleCommands()
client.handleEvents()

client.login(token)
