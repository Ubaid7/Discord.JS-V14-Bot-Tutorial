const fs = require('fs')

module.exports = (client) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync('./src/events')
        for (const folder of eventFolders) {
            const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith('.js')) // Read Folders In Events Folder
            switch (folder) {
                case 'client':
                    for (const file of eventFiles) {
                        const event = require(`../../events/${folder}/${file}`) // Read Files Of Event Folder
                        if (event.once) client.once(event.name, (...args) => event.execute(...args, client)) // Register Event
                        else client.on(event.name, (...args) => event.execute(...args, client)) // Register Event
                    }
                    break;

                default:
                    break;
            }
        }
    }
}