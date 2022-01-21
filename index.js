const {Client,Intents, Interaction, MessageButton, MessageActionRow, MessageEmbed, MessageAttachment} = require('discord.js');
const dotenv = require('dotenv');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token,testServiceguildId,PaKapawJanChannelId,ServerKapawGuildId,testbotChannelId } = require('./config.json');
const _ = require('underscore');
const moment = require('moment');
const CronJob = require('cron').CronJob;
const SayHello = require('./SayHello');
const startRandom = require('./commands/RandomPosition');


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
const EverySaterDayAt12AM = "0 13 * * 6";
var job = new CronJob(EverySaterDayAt12AM,()=>{doingJobInCronJob()},null,true,'Asia/Bangkok');
job.start();


const commands = [
	new SlashCommandBuilder().setName('checkwar').setDescription('Check check'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
	new SlashCommandBuilder().setName('say').setDescription('say!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, ServerKapawGuildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

dotenv.config();


const handupEmoji = '🙋‍♂️';
const RandomEmoji = '🎲';
var $scope = [];

client.on('ready', ()=>{
    console.log("I'm Ready");
    console.log(moment().format('DD/MM/YYYY'));
    var today = moment().format('DD/MM/YYYY');
    init();
    
})

client.on('messageCreate',async (message)=>{
    if(message.author.id=="342170391936237569"){
        //message.reply("บ่นไรไอแมว");
    }
    if(message.channelId == "901812970466738197"){
        console.log(message);
    }
    if(message.author.bot && message.content == "เช็คชื่อค้าบ"){
        init()
        $scope.handupMessage = await message.reply({content:$scope.MessageAskwhoWar,fetchReply: true});
        $scope.handupMessage.react(handupEmoji);
    }
    if(message.content.startsWith("-g say ")){
        var channel = client.channels.cache.get(message.channelId);
        if(message.author.id== "310400435678609439"){
            let newmessage = message.content.split("-g say ").pop();
            message.delete();
            channel.send(newmessage);
            
        }else {
            channel.send(`อย่าซนๆ <@${message.author.id}>`)
            message.delete();
        }
    }

    if(message.content.toLowerCase().startsWith("randomteam&position")){
        var channel = client.channels.cache.get(message.channelId);
        if(message.author.id== "310400435678609439" || message.content.toLowerCase().includes("active")){
            let newmessage = "ลงชื่อสุ่มทีมและตำแหน่งค้าบ"
            message.delete();
            $scope.RandomTeamAndPositionMessage = await channel.send(newmessage);
            $scope.RandomTeamAndPositionMessage.react(RandomEmoji);
            
        }else {
            channel.send(`อย่าซนๆ <@${message.author.id}>`)
            message.delete();
        }
    }

    if(message.content.toLowerCase().startsWith("endrandomteamandposition")){
        var channel = client.channels.cache.get(message.channelId);
        if(message.author.id== "310400435678609439" || message.content.toLowerCase().includes("active")){
            let newmessage = EndRandomTeamAndPosition();
            message.delete();
            channel.send("ปิดสุ่มทีมค้าบ");
            $scope.EndRandomTeamAndPositionMessage = channel.send(newmessage);
            $scope.RandomTeamAndPositionMessage.delete();
        }else {
            channel.send(`อย่าซนๆ <@${message.author.id}>`)
            message.delete();
        }
    }
    if(message.content.toLocaleLowerCase().startsWith("guide")){
        var channel = client.channels.cache.get(message.channelId);
        var Embed = {
            title:"Some title",
            image:{
                url:"attachments://warpic.png"
            }
        }
        const file = new MessageAttachment("./assets/warpic.png");
        var msg = PlayGuide();
        console.log(msg)
        channel.send(msg);
        channel.send({files:["./assets/warpic.png"]})
        message.delete();
    }

})

client.on('messageReactionAdd',async (reaction,user)=>{
    console.log("add");
    if($scope.handupMessage != null){
        if(reaction.message.id == $scope.handupMessage.id && !user.bot && reaction.emoji.name == handupEmoji){
            AddorDeleteMention(user,true)
        }
    }
    
    if($scope.RandomPositionMessage != null){
        if(reaction.message.id == $scope.RandomPositionMessage.id && !user.bot && reaction.emoji.name == RandomEmoji){
            startRandom($scope,user)
        }
    }

    if($scope.RandomTeamAndPositionMessage != null){
        if(reaction.message.id == $scope.RandomTeamAndPositionMessage.id && !user.bot && reaction.emoji.name == RandomEmoji){
            AddorDeleteMentionInRandomTeamAndPosition(user,true);
        }
    }
    
})
client.on('messageReactionRemove',async (reaction,user)=>{
    console.log("remove");
    if($scope.handupMessage != null){
        if(reaction.message.id == $scope.handupMessage.id && !user.bot && reaction.emoji.name == handupEmoji){
            AddorDeleteMention(user,false);
        }
    }
    if($scope.RandomPositionMessage != null){
        if(reaction.message.id == $scope.RandomPositionMessage.id && !user.bot && reaction.emoji.name == RandomEmoji){
            //
        }
    }
    if($scope.RandomTeamAndPositionMessage != null){
        if(reaction.message.id == $scope.RandomTeamAndPositionMessage.id && !user.bot && reaction.emoji.name == RandomEmoji){
            AddorDeleteMentionInRandomTeamAndPosition(user,false);
        }
    }
})

client.on('interactionCreate', async (interaction)=>{
    if(!interaction.isCommand()){
        return
    }
    const {commandName , options } = interaction;
    if(commandName == 'checkwar'&& interaction.user.id=="310400435678609439"){
        $scope.warPerson =[]
        $scope.handupMessage = await interaction.reply({content:$scope.MessageAskwhoWar,fetchReply: true});
        $scope.handupMessage.react(handupEmoji);
        
    }else if(commandName == 'say' && interaction.user.id=="310400435678609439"){
        console.log(options);
        let text = args.join(" ");
        interaction.delete();
        interaction.channel.send(text);
    }
    else{
        interaction.reply("อย่าซนดิ");
    }
    
    
})

function doingJobInCronJob(){
    console.log("client");
    var channel = client.channels.cache.get(PaKapawJanChannelId);
    channel.send("เช็คชื่อค้าบ")
}

function init(){
    $scope.handupMessage;
    $scope.MessageAskwhoWar = `<@&706907362153332787> ใครวอบ้างค้าบวันนี้ยกมือเลยย ช้าอด\n`
    $scope.MessageAskwhoWar += String(moment().format('DD/MM/YYYY')) +"\n";
    $scope.MessageRandomPosition = "คนวอครบแล้ว!!! มาสุ่มตำแหน่งกันดีกว่า\n"
    $scope.warPerson = [];
    $scope.AllRandomPerson = [];
    $scope.RandomPositionMessage = null;
    $scope.PersonModel = {
        id:"",
        username:"",
    }
    $scope.AllPosition =[
        {
            position:"หน้าบ้านเรา",
            item:[0],
            press:["แท่นหน้าบ้านเรา","แท่นกลางซ้าย"]
        },
        {
            position:"ซ้าย",
            item:[10,11],
            press:["แท่นซ้ายบน","แท่นซ้ายล่าง"]
        },
        {
            position:"กลาง",
            item:[1,2],
            press:["ถ้ายึดกลางได้ก็ดูเซ็ตกลาง"]
        },
        {
            position:"ขวา",
            item:[6,9,12],
            press:["แท่นขวาล่าง","แท่นขวาบน"]
        },
        {
            position:"ซ้ายบนสุด",
            item:[7,8],
            press:["แท่นซ้ายบนสุด"]
        },
        {
            position:"ขวาล่างสุด",
            item:[3],
            press:["แท่นขวาล่างสุด"]
        },
        {
            position:"โรม",
            item:[5,14],
            press:["แท่นกลางขวา"]
        },
        {
            position:"หน้าบ้านมัน",
            item:[4,13],
            press:["แท่นหน้าบ้านมัน","ถ้าว่างก็ไปช่วยแท่นกลางขวา"]
        }
    ]
    console.log("init Function");
}

function AddorDeleteMentionInRandomTeamAndPosition(user,IsAdd){
    var RandomPerson = [];
    RandomPerson.id = user.id;
    RandomPerson.username = user.username;
    var count = 1;
    var message = "ลงชื่อสุ่มทีมและตำแหน่งค้าบ\n\n";
    if(IsAdd){
        $scope.AllRandomPerson.push(RandomPerson);
    }else if(!IsAdd){
        var delete_index = _.findIndex($scope.warPerson,(item)=>{return item.id == user.id })
        $scope.AllRandomPerson.splice(delete_index,1)
    }
    for(var p of $scope.AllRandomPerson){
        message += `${count}. <@${p.id}> \n`;
        count++;
    }
    $scope.RandomTeamAndPositionMessage.edit(message);
}

function EndRandomTeamAndPosition(){
    $scope.AllRandomPerson = _.shuffle($scope.AllRandomPerson);
    var count = 1;
    var team1 = [];
    var team2 = [];
    var EndRandomMessage = "";
    for(var person of $scope.AllRandomPerson){
        if(count % 2 != 0){
            team1.push(person);
        }else{
            team2.push(person);
        }
        count++;
    }
    console.log("team1");
    console.log(team1);
    console.log("team2");
    console.log(team2);
    EndRandomMessage += "Team 1\n"
    var AllPosition = getAllPosition();
    AllPosition = _.shuffle(AllPosition);
    count = 1;
    for(var one of team1){
        var position = AllPosition.pop();
        EndRandomMessage += `${count}. <@${one.id}> ${position.position}\n`;
        count++;
    }
    AllPosition = getAllPosition();
    AllPosition = _.shuffle(AllPosition);
    EndRandomMessage += "Team 2\n"
    count = 1;
    for(var two of team2){
        var position = AllPosition.pop();
        EndRandomMessage += `${count}. <@${two.id}> ${position.position}\n`;
        count++;
    }

    return EndRandomMessage;
}
function getAllPosition(){
    var AllPosition =[
        {
            position:"หน้าบ้านเรา",
            item:[0],
            press:["แท่นหน้าบ้านเรา","แท่นกลางซ้าย"]
        },
        {
            position:"ซ้าย",
            item:[10,11],
            press:["แท่นซ้ายบน","แท่นซ้ายล่าง"]
        },
        {
            position:"กลาง",
            item:[1,2],
            press:["ถ้ายึดกลางได้ก็ดูเซ็ตกลาง"]
        },
        {
            position:"ขวา",
            item:[6,9,12],
            press:["แท่นขวาล่าง","แท่นขวาบน"]
        },
        {
            position:"ซ้ายบนสุด",
            item:[7,8],
            press:["แท่นซ้ายบนสุด"]
        },
        {
            position:"ขวาล่างสุด",
            item:[3],
            press:["แท่นขวาล่างสุด"]
        },
        {
            position:"โรม",
            item:[5,14],
            press:["แท่นกลางขวา"]
        },
        {
            position:"หน้าบ้านมัน",
            item:[4,13],
            press:["แท่นหน้าบ้านมัน","ถ้าว่างก็ไปช่วยแท่นกลางขวา"]
        }
    ]
    return AllPosition;
}

function AddorDeleteMention(user,IsAdd){
    $scope.PersonModel = [];
    $scope.PersonModel.id = user.id;
    $scope.PersonModel.username = user.username;
    var count = 1;
    var Allwar = "";
    if(IsAdd){
        $scope.warPerson.push($scope.PersonModel);
    }else if(!IsAdd){
        var delete_index = _.findIndex($scope.warPerson,(item)=>{return item.id == user.id })
        $scope.warPerson.splice(delete_index,1)
    }

    for(var person of $scope.warPerson){
        console.log(person);
        if(count>8){
            Allwar += "คนวอครบแล้ว เป็นสำรองไปก่อนนะงับ\n"
        }
        Allwar += `${count}. <@${person.id}> \n`;

        count ++;
    }
    if(count >= 9){
        TeamReady();
    }
    $scope.handupMessage.edit($scope.MessageAskwhoWar + Allwar);
}
function PlayGuide(){
    var Allposition = getAllPosition();
    var message = "";
    for(var p of Allposition){
        message += `ตำแหน่ง : ${p.position}
    ไอเท่ม : ${getItemToString(p.item)}
    เหยียบแท่น : ${getItemToString(p.press)}\n\n`
    }
    
    return message;
}

async function TeamReady(){
    if($scope.RandomPositionMessage == null){
        $scope.RandomPositionMessage =  await $scope.handupMessage.reply({content:$scope.MessageRandomPosition,fetchReply: true});
        $scope.RandomPositionMessage.react(RandomEmoji);
    }
    
}

function getRandomNumber(min,max) {
    let length = (max+1)-min;
    return min+(Math.floor(Math.random() * length));
}
  
function getItemToString (allitem){
    var result = "";
    _.each(allitem,(item,index)=>{
        if(index > 0){
            result += ", ";
        }
        result += String(item);
    });
    return result
}

client.login(process.env.TOKEN)