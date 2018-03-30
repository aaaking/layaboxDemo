var http = require("http");
var sever = http.createServer(function (req, res) {
    res.end("test.GameMain.testJsonpComplete()");//这句话的意思是服务器回传给客户端LayaSample.onComplete()并且执行这个函数。
});
sever.listen(9090)