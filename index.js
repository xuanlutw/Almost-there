const { LineBot } = require('bottender');
const { createServer } = require('bottender/express');
const { LineClient } = require('messaging-api-line');
const fs = require('fs');
const jsonfile = require('jsonfile');
const config = require('./config.json');
const a = require('./chat.json')

const client = LineClient.connect(config.accessToken, config.channelSecret);
const bot = new LineBot({
  channelSecret: config.channelSecret,
  accessToken: config.accessToken,
});

let Ids = [];

//=================PK===================
const key = []
const res = []
for (var i = 0; i < a.length; i++) {
	for(j in a[i]){
		key.push(a[i][j]["concepts"])
		res.push(a[i][j]["response"])
	}
}

function find(keyword){
	for(i in key){
		for(j in key[i]){
			if(keyword.match(key[i][j]) != null) {return i;}
		}
	}
	return false
}

function chat(input){
	if(find(input) === false) return ["Say something else!"]
	return(res[find(input)])
}

function welcome(){
	return "感謝您使用Weather x Health小幫手！我是您健康的守護者！您會在天氣開始變化時，收到精選的注意事項。另外，也可以跟我聊聊天喔！"
}


b = require('./activerespond-2.json')
const content = []
for(i in b['active'])for(j in b['active'][i]){
	content.push(b['active'][i][j]['string'])
}

function news() {
	return content[Math.floor((Math.random() * content.length) + 1)]
}
//======================================

bot.onEvent(async context => {
    const userId = context.session.user.id;

    //add new user
    if (context.event.isFollow){
        await context.sendText(welcome());
        Ids.push({'id': context.session.user.id});
        //fs.writeFile("./Ids.json", JSON.stringify(Ids), function(err){});
        console.log('New userId ' + context.session.user.id);
    }
    
    //remove user
    else if (context.event.isUnfollow){
        for (var i = 0;i < Ids.length;++i){
            if (Ids[i]['id'] == context.session.user.id){
                Ids.splice(i,1);
                break;
            }
        }
        //fs.writeFile("./Ids.json", JSON.stringify(Ids), function(err){});
        console.log('Delete userId ' + context.session.user.id);
    }

    //for broadcast
    else if (context.event.text == "AT_TEST"){
        broadcast(news());
    }

    //default reply
    else{
        const reply = chat(context.event.text);
        console.log(reply);
        await context.sendText(reply[Math.ceil(Math.random() * reply.length)]);
    }
    */
});

function broadcast(mes){
    for (var i = 0;i < Ids.length;++i){
        client.pushText(Ids[i]['id'], mes);
    }
    console.log('Broadcast numbers of id = ' + Ids.length);
}

// init server
const server = createServer(bot);

server.listen(process.env.PORT || 5000, () => {
    console.log('server is running on ' + (process.env.PORT || 5000) + ' port...');
;});
