const { ActivityType } = require('discord.js')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} Is Ready`)

        // Bot Status
        const activities = [
            `Tech Tip Cyber's Video`,
            `Tech Tip Cyber's Discord`,
            `YouTube`
        ]

        setInterval(() => {
            const status = activities[Math.floor(Math.random() * activities.length)]
            client.user.setPresence({ activities: [{ name: `${status}`, type: ActivityType.Watching }] })
        })
    }
}