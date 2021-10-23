const {Client,Intents, Interaction, MessageButton, MessageActionRow} = require('discord.js');
const dotenv = require('dotenv');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const _ = require('underscore');
const moment = require('moment');

const commands = [
	new SlashCommandBuilder().setName('checkwar').setDescription('Check check'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

dotenv.config();

const client = new Client(
    {
        intents:[
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        ],
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    }
)
var messageId;
var thisweekMessage = "";
var handup;
var MessageAskwhoWar = `<@&706907362153332787> ใครวอบ้างค้าบวันนี้ยกมือเลยย\n`
MessageAskwhoWar += String(moment().format('DD/MM/YYYY')) +"\n";
var warPerson = [];
var PersonModel = {
    id:"",
    username:"",
}
client.on('ready',()=>{
    console.log("I'm Ready");
    console.log(moment().format('DD/MM/YYYY'));
    var today = moment().format('DD/MM/YYYY');
    thisweekMessage += today + "\n";
})

client.on('messageReactionAdd',async (reaction,user)=>{
    console.log("Add");
    console.log(reaction);
    console.log("User\n\n");
    console.log(user);
    console.log("Message Id Before Check : "+ messageId);
    if(reaction.message.id == messageId && !user.bot){
        PersonModel = [];
        PersonModel.id = user.id;
        PersonModel.username = user.username;
        warPerson.push(PersonModel);
        console.log("WarPerson\n\n");
        console.log(warPerson);
        console.log("Yeah Same Id \n\n\n");
        var count = 1;
        var Allwar = "";
        for(var person of warPerson){
            console.log(person);
            Allwar += `${count}. <@${person.id}> \n`;
            count ++;
        }
        
        handup.edit(MessageAskwhoWar + Allwar);
        //var hellomesId = hellomes.id;
        //hellomes.edit(thisweekMessage);
        
    }

    if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
    }
    
})
client.on('messageReactionRemove',async (reaction,user)=>{
    if(reaction.message.id == messageId && !user.bot){
        PersonModel = [];
        PersonModel.id = user.id;
        PersonModel.username = user.username;
        var delete_index = _.findIndex(warPerson,(item)=>{return item.id == user.id })
        warPerson.splice(delete_index,1)
        console.log("WarPerson\n\n");
        console.log(warPerson);
        console.log("Yeah Same Id \n\n\n");
        var count = 1;
        var Allwar = "";
        for(var person of warPerson){
            console.log(person);
            Allwar += `${count}. <@${person.id}> \n`;
            count ++;
        }
        
        handup.edit(MessageAskwhoWar + Allwar);
        //var hellomesId = hellomes.id;
        //hellomes.edit(thisweekMessage);
        
    }

    if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
    }
})

client.on('interactionCreate', async (interaction)=>{
    if(!interaction.isCommand()){
        return
    }
    const {commandName , options } = interaction;
    console.log("\n\n\nlog command\n\n\n");
    console.log(interaction);
    
    if(commandName == 'checkwar'&& interaction.user.id=="310400435678609439"){
        warPerson =[]
        handup = await interaction.reply({content:MessageAskwhoWar,fetchReply: true});
        console.log("\n\nhandup\n\n");
        console.log(handup);
        handup.react('🙋‍♂️');
        messageId = handup.id;
        console.log("Message Id : "+ messageId);
        
    }else{
        interaction.reply("อย่าซนดิ");
    }
    
})




client.login(process.env.TOKEN)