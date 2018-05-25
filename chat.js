const a = require('./chat.json')

let key = []
let res = []
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
	// console.log(find(input))
	if(find(input) === false) return ["Say something else!"]
	return(res[find(input)])
}
