
// 程序入口
function aaa() {
	var span = document.createElement("button");
	span.setAttribute("data-clipboard-text","ddyx18");
	span.setAttribute("class", "copy"); 
	span.setAttribute("id", "test");  
	span.setAttribute("display", "none");  		

	document.body.appendChild(span);
	
	var e = new Clipboard("#test");
	e.on("success",
	function(e) {
		alert("☺ 复制成功")
	}),
	e.on("error",
	function(e) {
		alert("浏览器不支持复制")
	});    
};

aaa();