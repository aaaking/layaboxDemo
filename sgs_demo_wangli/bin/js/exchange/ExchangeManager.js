/*
* name;
*/
var ExchangeManager = /** @class */ (function () {
    function ExchangeManager() {
    }
    Object.defineProperty(ExchangeManager, "instance", {
        get: function () {
            if (!this._instance)
                this._instance = new ExchangeManager();
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    ExchangeManager.prototype.toAscii = function (hex) {
        // Find termination
        var str = "";
        var i = 0, l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i += 2) {
            var code = parseInt(hex.substr(i, 2), 16);
            str += String.fromCharCode(code);
        }
        return str;
    };
    ;
    ExchangeManager.prototype.testInitCards = function (callback) {
        // if (this._cards)
        //     callback();
        // else {
        this._cards = [];
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_call", "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x3ded315b" }, "latest"], "id": 67 }, "POST", null, function (data) {
            console.info(data);
            var info = JSON.parse(data);
            var result = info.result.substring(130);
            result = "0x" + result;
            var result1 = this.toAscii(result);
            var cards = result1.split(";");
            cards.pop();
            for (var k in cards) {
                var v = cards[k];
                var arr = v.split(",");
                var id = parseInt(arr[0]);
                var cfg = GameConfig.getCfgHeroById(parseInt(arr[1]));
                var price = arr[2];
                if (parseInt(price) <= 0)
                    continue;
                var isself = arr[3] == 1;
                var t = {
                    id: id, price: price, cfg: cfg, isself: isself
                };
                this._cards.push(t);
            }
            console.info(this._cards);
            callback();
        }.bind(this));
        // }
        // for (var i: number = 0; i < 20; i++) {
        //     var id: number = i;
        //     var cfg: any = GameConfig.getCfgHeroById(id);
        //     var t: any = {
        //         id, cfg,isHave: Math.random() > 0.5
        //     } 
        //     this._cards.push(t);
        // }
        // callback()
    };
    Object.defineProperty(ExchangeManager.prototype, "cards", {
        get: function () {
            return this._cards;
        },
        enumerable: true,
        configurable: true
    });
    ExchangeManager.prototype.getCardsByCamp = function (camp) {
        if (camp == 5)
            return this.cards;
        else
            return this._cards.filter(function (item) {
                var cfg = GameConfig.getCfgHeroById(item.id);
                return cfg.camp == camp;
            });
    };
    return ExchangeManager;
}());
//# sourceMappingURL=ExchangeManager.js.map