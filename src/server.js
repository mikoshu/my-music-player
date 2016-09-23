var express = require('express');
var app = express();

app.listen('8888',function(){
	console.log('服务器开启成功！')
})

app.get('/folder',function(req,res,next){
	
})