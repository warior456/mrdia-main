const discord = require('discord.js')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    name: 'party',
    description: "play games or watch together",
    run: (message, args, cmd, client, Discord) => {

        const channel = message.member.voice.channel || message.guild.channels.cache.get(args[0]);
        if (!channel) return message.channel.send(`You have to be in a voice channel!`)
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | I need `CREATE_INSTANT_INVITE` permission");
        let activity_ID = '';
        switch (args[0]) {
            case 'youtube':
                party_ID = '880218394199220334'
                party_type = 'Youtube Together'
                break;

            case 'youtubedev':
                party_ID = '880218832743055411'
                party_type = 'Youtube dev'
                break;

            case 'poker':
                party_ID = '755827207812677713'
                party_type = 'Poker Night'
                break;

            case 'fishington':
                party_ID = '814288819477020702'
                party_type = 'Fishington.io'
                break;

            case 'betrayal':
                party_ID = '773336526917861400'
                party_type = 'Betrayal.io'
                break;

            case 'chess':
                party_ID = '832012774040141894'
                party_type = 'Chess in the Park'
                break;

            case 'chessdev':
                party_ID = '832012586023256104'
                party_type = 'Chess dev.'
                break;

            case 'doodlecrew':
                party_ID = '878067389634314250'
                party_type = 'doodlecrew'
                break;

            default:
                return message.channel.send(`Invalid type | Options[youtube / poker / fishington / betrayal / chess]`)


            // lettertile: '879863686565621790', // Note : First package to offer lettertile, any other package offering it will be clearly inspired by it
            // wordsnack: '879863976006127627', // Note : First package to offer wordsnack any other package offering it will be clearly inspired by it
            // awkword: '879863881349087252', // Note : First package to offer awkword, any other package offering it will be clearly inspired by it
            // spellcast: '852509694341283871', // Note : First package to offer spellcast, any other package offering it will be clearly inspired by it
            // checkers: '832013003968348200
        }
        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: party_ID,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send("❌ | Could not start **party**!");
                message.channel.send(`✅ | Click here to start **${party_type}** in ${channel.name}: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send("❌ | Could not start **party!**");
            })


    }
}