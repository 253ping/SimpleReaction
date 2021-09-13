const Discord   = require('discord.js');
const {Intents} = Discord; 
const intents   = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS];
const bot       = new Discord.Client({ intents: intents});

const package   = require('../package.json');
const config    = require('./config.json');
const {token}   = require('./token.json');

bot.on('ready', ()=>{
    console.info(`\x1b[33m${package.name} V${package.version} by ${package.author}\x1b[0m is ready!`)
    console.info('-------------------');
    console.info('Logged in as ' + `\x1b[33m${bot.user.tag}\x1b[0m`);
	console.info('Discord.js API version:', `\x1b[33m${Discord.version}\x1b[0m`);
    console.info('NodeJS version:', `\x1b[33m${process.version}\x1b[0m`);
    console.info("Invite Link:", `\x1b[33mhttps://discord.com/oauth2/authorize?client_id=${bot.application.id}&scope=bot&permissions=2112\x1b[0m`);
    console.info('-------------------');
    bot.user.setActivity('Simple Reactions!');
});

bot.on('messageCreate', (msg) => {
    /**@type {Discord.Message]*/
    const message = msg;
    if(message.channel.id.toString() == config.suggestionChannelID) {
        if(!message.channel.permissionsFor(message.guild.me).has(Discord.Permissions.FLAGS.ADD_REACTIONS)) {
            if(message.channel.permissionsFor(message.guild.me).has(Discord.Permissions.FLAGS.SEND_MESSAGES)) {
                message.channel.send('I dont have permissions to add reactions');
            } else {
                console.log('I dont have permissions to add reactions in channel ' + message.channel.name);
            }
            return;
        } else {
            config.reactions.forEach((reaction)=> {
                if(reaction.startsWith('!')) {
                    const emoji = message.guild.emojis.cache.find(emoji => emoji.name === reaction.substring(1));
                    if(!emoji) {
                        console.log('Invalid Emoji Name: ' + reaction.substring(1));
                        return;
                    }
                    message.react(emoji);
                } else {
                    message.react(reaction).catch(_err => console.log('Invalid Emoji Name: ' + reaction));
                }
            });
        }
    }
});

bot.login(token);