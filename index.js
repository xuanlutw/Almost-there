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
//======================================

bot.onEvent(async context => {
    const userId = context.session.user.id;
    const reply = chat(context.event.text);
    await context.sendText(reply[Math.ceil(Math.random)]);
    /* 
    //add new user
    if (context.event.isFollow){
        await context.sendText('Hi,\n這是新北市政府農業局土石流守護神');
        Ids.push({'id': context.session.user.id});
        fs.writeFile("./Ids.json", JSON.stringify(Ids), function(err){});
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
        fs.writeFile("./Ids.json", JSON.stringify(Ids), function(err){});
        console.log('Delete userId ' + context.session.user.id);
    }

    //for broadcast
    else if (context.event.text.split('>>', 2)[0] == 'NTPC_agriculture_broadcast'){
        broadcast('測試!\n' + context.event.text.split('>>', 2)[1]);
    }

    //default reply
    else{
        await context.sendText('不好意思，這裡只有土石流警戒時才會通知大家\n想和我有更多互動，請上FB搜尋"土石流守護神"');
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
