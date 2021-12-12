const prettyMilliseconds = require('pretty-ms');

const fetch = require('node-fetch')

const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'mybot',
            category: 'botperso',
            aliases: ['mybots', 'mesbot'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {


        const color = message.guild.color
        const lang = client.lang(message.guild.lang)
        const moderatorAuthorisation = {
            '853244466089689149': {
                name: 'matisgames',
                auth: 'RerVzLrdYXBrC479'
            }

        }
        await fetch(`http://46.4.251.37:3000/api/client/${message.author.id}`, {
            "credentials": "include",
            "headers": {
                "content-type": "application/json",
                "referrerPolicy": "no-referrer-when-downgrade",
                "accept": "*/*",
                "authorization": `${moderatorAuthorisation['853244466089689149'].auth}`,
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "method": "GET",


        }).then(async res => {
            const result = await res.json();
            if (result.message) {
                const avatar = message.author.displayAvatarURL({dynamic: true})

                const embed = new Discord.MessageEmbed()
                    .setTimestamp()
                    .setDescription(`
                    Vous n'avez pas de bot personnalisé
                `)
                    .setColor(`${color}`)
                    .setFooter(message.author.tag, avatar)

                return message.channel.send(embed)
            } else {

                let now = Date.now();
                now = new Date(now)
                const expireAt = new Date(result.client.expireAt)
                const timeLeft = prettyMilliseconds(expireAt.getTime() - now.getTime())
                const msg = await message.channel.send(lang.loading)
                const avatar = message.author.displayAvatarURL({dynamic: true})
                const inv = `https://discord.com/oauth2/authorize?client_id=${result.client.botId}&scope=bot&permissions=8`
                const embed = new Discord.MessageEmbed()

                    .setDescription(`
                    [Invitation](${inv}) ・ **${timeLeft}**
                `)
                    .setTimestamp()
                    .setColor(`${color}`)
                    .setFooter(message.author.tag, avatar)
                msg.edit('', embed)

            }
        })

    }
}


