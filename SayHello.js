const {testServiceguildId} = require('./config.json')
module.exports = (client) =>{
        var channel = client.channels.cache.get(testServiceguildId);
        console.log(channel);
        channel.send("เช็คชื่อจ้า")
    
}

