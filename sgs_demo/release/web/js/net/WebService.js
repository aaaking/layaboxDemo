var WebService=function(){function e(){}return e.prototype.callApi=function(e,i,n,o,t,c){void 0===n&&(n=null),void 0===o&&(o=null),void 0===t&&(t="post"),void 0===c&&(c=[]),o||(o={})},e.prototype.regist=function(e,i,n,o){this.callApi("user","reg",function(e){o(e)},{uname:e,upwd:i,nickname:n})},e}(),webService=new WebService;