var express = require('express');
var app = express();
var port = 33520;

console.log(123)

//module.exports = function(){
	app.listen(port,function(){
		console.log('服务器开启成功！')
	})

	app.get('localhost:'+port+'/api/',function(req,res,next){
		var url = req.url;
		console.log(url);
	})
//}