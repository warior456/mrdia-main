const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const {show_q} = require('../commands/music/queue')
const Discord = require('discord.js')
const fs = require('fs');
const File = require('../File');


module.exports = (client, interaction) => {
    
    try {
        if (!interaction.isButton()) return;
        let message = interaction.message
        let guildQueue = client.player.getQueue(interaction.message.guild.id);
        let pages = Math.ceil((guildQueue.songs.length-1)/10)
        switch (interaction.customId) {
            case 'next': 
                if(!guildQueue) return
                guildQueue.data.page++
                if(guildQueue.data.page > pages ) guildQueue.data.page = pages;
                show_q(message, client, Discord, guildQueue)
                interaction.deferUpdate()
                break;
            case 'back':
                if(!guildQueue) return
                guildQueue.data.page--
                if(guildQueue.data.page <= 0) guildQueue.data.page = 1;
                show_q(message, client, Discord, guildQueue)
                interaction.deferUpdate()
                break;
            case 'end':
                interaction.deferUpdate()
                let row = interaction.message.components[0]
                let queEmbed = interaction.message.embeds[0]
                for (let i = 0; i < row.components.length; i++) {
                    row.components[i].setDisabled(true);
                }
                message.edit({ embeds: [queEmbed], components: [row] });
                break;
            default:
                return
    }
    } catch (error) {
        console.log(error)
    }
    
};