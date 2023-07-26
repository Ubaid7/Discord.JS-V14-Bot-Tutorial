const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const Canvas = require('canvas')
const welcomeSchema = require('../../../Models/welcome')

module.exports = {
    name: 'guildMemberAdd',

    async execute(member, client) {
        const data = await welcomeSchema.findOne({
            Guild: member.guild.id
        })
        if (!data) return

        const canvas = Canvas.createCanvas(1024, 500) // Create Canvas
        const ctx = canvas.getContext('2d')
        // const background = await Canvas.loadImage('D:/Ubaid7/Coding/JavaScript/Discord Bots/Tutorial Bots/Tutorial Bot V14/Images/welcome1.jpg') // Locate To Your Image
        const background = await Canvas.loadImage('https://i.imgur.com/umLOhA3.png') // Using Link
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height) // Setting Background Image
        ctx.strokeStyle = '#4F82F5' // Keeping Stroke Color

        // Making A Circle Around Avatar
        ctx.beginPath()
        ctx.arc(512, 166, 128, 0, Math.PI * 2, true)
        ctx.stroke()
        ctx.fillStyle = '#4F82F5'
        ctx.fill()

        // Welcome Text
        ctx.font = '72px sans-serif' // Font For Welcome Text
        ctx.fillStyle = '#FFFFFF' // Colour For Welcome Text
        ctx.fillText('Welcome', 360, 360) // Display Welcome Text On Image

        // Username
        const name = `${member.user.username}` // Username Of User
        if (name.length >= 16) { // If Name Is Greater Than 16
            ctx.font = '42px sans-serif' // Font For Displaying Name
            ctx.textAlign = 'center' // Keeping The Text In Center
            ctx.fillStyle = '#0FEEF3' //Colour Of Name
            ctx.fillText(name, 512, 410) // Displaying Name On Image
        } else { // If Name Is Less Than 16
            ctx.font = '47px sans-serif' // Font For Displaying Name
            ctx.textAlign = 'center' // Keeping The Text In Center
            ctx.fillStyle = '#0FEEF3' //Colour Of Name
            ctx.fillText(name, 512, 410) // Displaying Name On Image
        }

        // Member Count
        const member_count = `You Are Our #${member.guild.memberCount}th Member`
        ctx.font = '34px sans-serif' // Font For Displaying Member Count
        ctx.textAlign = 'center' // Keeping The Text In Center
        ctx.fillStyle = '#21FBA1' //Colour Of Member Count
        ctx.fillText(member_count, 512, 455) // Displaying Member Count On Image

        // Avatar
        ctx.beginPath()
        ctx.arc(512, 166, 119, 0, Math.PI * 2, true) // Avatar Of User
        ctx.closePath()
        ctx.clip() // Making Avatar Circle
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' })) // getting Users Avatar
        ctx.drawImage(avatar, 393, 47, 238, 238) // Adjusting Avatar In Circle

        const attachment = new AttachmentBuilder(await canvas.toBuffer(), {
            name: 'welcome.png'
        }) // Sending Image As Attachment

        const channel = member.guild.channels.cache.get(data.Channel)
        if (!channel) return
        let message = data.Message
        if (!message || message === null) message = `Welcome To ${member.guild.name}`
        let rule = data.Rule
        if (!rule || rule === null) rule = `#NotSetYet`

        const welcomeEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTimestamp()
            .setAuthor({
                name: `Welcome To ${member.guild.name}`,
                iconURL: member.guild.iconURL()
            })
            .setImage('attachment://welcome.png')
            .setDescription(`
        Welcome To **${member.guild.name}** <@${member.id}>
        Make Sure To Check <#${rule}>
                `)
        await channel.send({ content: `<@${member.id}>\n${message}`, embeds: [welcomeEmbed], files: [attachment] }) // Send Embed, Image And Mess

        let role = data.Role
        if (!role || role === null) return
        await member.roles.add(role) // Add Role To User

        //  //

        //         const canvas = Canvas.createCanvas(1770, 635) // Create Canvas
        //         const ctx = canvas.getContext('2d')
        //         // const background = await Canvas.loadImage('D:/Ubaid7/Coding/JavaScript/Discord Bots/Tutorial Bots/Tutorial Bot V14/Images/welcome.png') // Locate To Your Image
        //         const background = await Canvas.loadImage('https://i.imgur.com/Az8bMjq.png') // Using Link
        //         ctx.drawImage(background, 0, 0, canvas.width, canvas.height) // Setting Background Image
        //         ctx.strokeStyle = '#FFFFFF' // Keeping Colour As Nothing

        //         ctx.strokeRect(0, 0, canvas.width, canvas.height)

        //         // Username
        //         const name = `${member.user.username}` // Username Of User
        //         if (name.length >= 16) { // If Name Is Greater Than 16
        //             ctx.font = 'bold 100px Sans' // Font For Displaying Name
        //             ctx.fillStyle = '#0FEEF3' //Colour Of Name
        //             ctx.fillText(name, 680, canvas.height / 2 + 40) // Displaying Name On Image
        //         } else { // If Name Is Less Than 16
        //             ctx.font = 'bold 130px Sans' // Font For Displaying Name
        //             ctx.fillStyle = '#0FEEF3' //Colour Of Name
        //             ctx.fillText(name, 680, canvas.height / 2 + 40) // Displaying Name On Image
        //         }

        //         // Message
        //         const server = `Welcome To ${member.guild.name}`
        //         ctx.font = 'bold 80px Sans' // Font For Displaying Message
        //         ctx.fillStyle = '#21FBA1' //Colour Of Message
        //         ctx.fillText(server, 670, canvas.height / 2 - 115) // Displaying Message On Image

        //         // Member Count
        //         const member_count = `Member #${member.guild.memberCount}th`
        //         ctx.font = 'bold 86px Sans' // Font For Displaying Member Count
        //         ctx.fillStyle = '#21FBA1' //Colour Of Member Count
        //         ctx.fillText(member_count, 680, canvas.height / 2 + 155) // Displaying Member Count On Image

        //         ctx.beginPath()
        //         ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true) // Avatar Of User
        //         ctx.closePath()
        //         ctx.clip() // Making Avatar Circle

        //         // Avatar
        //         const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'jpg' })) // getting Users Avatar
        //         ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500) // Adjusting Avatar In Circle

        //         const attachment = new AttachmentBuilder(await canvas.toBuffer(), {
        //             name: 'welcome.png'
        //         }) // Sending Image As Attachment

        //         const channel = member.guild.channels.cache.get(data.Channel)
        //         if (!channel) return
        //         let message = data.Message
        //         if (!message || message === null) message = `Welcome To ${member.guild.name}`
        //         let rule = data.Rule
        //         if (!rule || rule === null) rule = `#NotSetYet`

        //         const welcomeEmbed = new EmbedBuilder()
        //             .setColor('Random')
        //             .setTimestamp()
        //             .setAuthor({
        //                 name: `Welcome To ${member.guild.name}`,
        //                 iconURL: member.guild.iconURL()
        //             })
        //             .setImage('attachment://welcome.png')
        //             .setDescription(`
        // Welcome To **${member.guild.name}** <@${member.id}>
        // Make Sure To Check <#${rule}>
        //         `)
        //         await channel.send({ content: `<@${member.id}>\n${message}`, embeds: [welcomeEmbed], files: [attachment] }) // Send Embed, Image And Mess

        //         let role = data.Role
        //         if (!role || role === null) return
        //         await member.roles.add(role) // Add Role To User
    }
}