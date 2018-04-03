/*
* name;
*/
var CardPackageManager = /** @class */ (function () {
    function CardPackageManager() {
    }
    Object.defineProperty(CardPackageManager, "instance", {
        get: function () {
            if (!this._instance)
                this._instance = new CardPackageManager();
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    CardPackageManager.prototype.getCountByID = function (cardid) {
        for (var k in this._cards) {
            var v = this._cards[k];
            if (v.id == cardid) {
                return parseInt(v.count);
            }
        }
        return null;
    };
    CardPackageManager.prototype.addCountByID = function (cardid) {
        for (var k in this._cards) {
            var v = this._cards[k];
            if (v.id == cardid) {
                v.count = v.count + 1;
            }
        }
    };
    CardPackageManager.prototype.toAscii = function (hex) {
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
    CardPackageManager.prototype.testInitCards = function (callback) {
        this._cards = [];
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_call", "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x179a074f" }, "latest"], "id": 67 }, "POST", null, function (data) {
            console.info(data);
            var info = JSON.parse(data);
            var result = info.result.substring(130);
            result = "0x" + result;
            var result1 = this.toAscii(result);
            var cards = result1.split(",");
            cards.pop();
            for (var k in cards) {
                var v = cards[k];
                var arr = v.split(":");
                var id = parseInt(arr[0]);
                var cfg = GameConfig.getCfgHeroById(id);
                var count = arr[1];
                var t = {
                    id: id, count: count, cfg: cfg, isHave: Math.random() > 0.5
                };
                if (count > 0) {
                    this._cards.push(t);
                }
            }
            console.info(this._cards);
            callback();
        }.bind(this));
        // for (var i: number = 0; i < 20; i++) {
        //     var id: number = Math.floor(Math.random() * 25) + 0;
        //     var cfg: any = GameConfig.getCfgHeroById(id);
        //     var t: any = {
        //         id, cfg
        //     }
        //     this._cards.push(t);
        // }
    };
    Object.defineProperty(CardPackageManager.prototype, "cards", {
        get: function () {
            if (!this._cards)
                return [];
            this.deleteNull();
            return this._cards.sort(this.sortOnNormal);
        },
        enumerable: true,
        configurable: true
    });
    CardPackageManager.prototype.deleteNull = function () {
        for (var i = 0; i < this._cards.length;) {
            if (!this._cards[i])
                this._cards.splice(i, 1);
            else
                i++;
        }
    };
    Object.defineProperty(CardPackageManager.prototype, "sortOnCampCards", {
        get: function () {
            this.deleteNull();
            return this._cards.sort(this.sortOnCamp);
        },
        enumerable: true,
        configurable: true
    });
    CardPackageManager.prototype.sortOnNormal = function (a, b) {
        if (a.cfg.id < b.cfg.id)
            return -1;
        else if (a.cfg.id == b.cfg.id)
            return 0;
        else
            return 1;
    };
    CardPackageManager.prototype.sortOnCamp = function (a, b) {
        if (a.cfg.camp < b.cfg.camp)
            return -1;
        else if (a.cfg.camp == b.cfg.camp)
            return 0;
        else
            return 1;
    };
    return CardPackageManager;
}());
//# sourceMappingURL=CardPackageManager.js.map