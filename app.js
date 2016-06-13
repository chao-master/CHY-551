var Discord = require("discord.js");
    BOT = require("./bot-config.js").BOT,
    APP = require("./bot-config.js").APP;

var LOBBY_NAME = "CHY-551-lobby";

var chyssi = new Discord.Client();


function getAddLink(){
    return "https://discordapp.com/oauth2/authorize?scope=bot&permissions=0&client_id="+APP.ID;
}

var gameInfo = {};

var commands = {
    newgame:function(message){
        var user = message.author;
        if(user.voiceChannel === undefined){
            return Promise.resovle("You need to be sitting in a voice chat on the server you wish to play on, otherwise I cannot move you to the room"
        }
        return chyssi.createChannel(user.voiceChannel.server,"CHY-551-gvc","voice")
            .then(channel=>chyssi.moveMember(user,channel))
            .then(_=>"The new game is ready.");
    },begingame:function(message){
    
    }
};

chyssi.on("message", function(message) {
    if(message.content === "ping") {
        chyssi.reply(message, "pong");
    } else {
        if(message.channel.isPrivate && message.author != chyssi.user){
            var sMsg = message.cleanContent.split(" "),
                cmd = commands[sMsg.shift()],
                reply = Promise.resolve("Bad command");
            if(cmd !== undefined){
                sMsg.unshift(message);
                reply = cmd.apply(this,sMsg);
            }
            reply.then(function(r){
                console.log(r);
                if(r !== undefined) return chyssi.sendMessage(message.channel,r)
            }).catch(e=>console.log("Error running command",e));
        }
    }
});

chyssi.loginWithToken(BOT.TOKEN);
