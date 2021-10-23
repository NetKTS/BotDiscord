module.exports={
    name:'war',
    description:'Check team',
    async execute(message, args, Discord,client){
        const channel = "774943743844548642";
        const gethandup = "";

        const handupEmo = '🙋‍♂️';
        let embed = new Discord.MessageEmbed()
            .setTitle('Hand Up')
            .setDescription("Press Hand up");

        let messageEmbed = await message.channel.send(embed);
        messageEmbed.react(handupEmo);
    }

}