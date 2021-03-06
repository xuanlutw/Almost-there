const a = require('./chat.json')

const key = []
const res = []
// console.log(a)
for (var i = 0; i < a.length; i++) {
	// console.log(a[i])
	for(j in a[i]){
		// console.log("j:::::",j, a[i][j]["response"], a[i][j]["concepts"])
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
//=============== Hello message ====================
function welcome(){
	return "感謝您使用Weather x Health小幫手！我是您健康的守護者！您會在天氣開始變化時，收到精選的注意事項。另外，也可以跟我聊聊天喔！"
}

//=================== Broadcast ================

b = require('./activerespond-2.json')
const bc_content = []
for(i in b['active'])for(j in b['active'][i]){
	bc_content.push(b['active'][i][j]['string'])
}

function news() {
	return content[Math.floor((Math.random() * bc_content.length))]
}

//================ ad =======================
c = require('./ad.json')
const sponsor_content = []
for(i in c)for(j in c[i]){
	sponsor_content.push(c[i][j]['0']['string']+c[i][j]['0']['link'])
}
// console.log(sponsor_content)
function sponsor(){
	return sponsor_content[Math.floor((Math.random() * sponsor_content.length))]
}