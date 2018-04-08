/*
* name;
*/
class WareHouseManager {
    constructor() {

    }

    private static _instance: WareHouseManager;
    public static get instance(): WareHouseManager {
        if (!this._instance)
            this._instance = new WareHouseManager();
        return this._instance;
    }

    private _cards: Array<any>;
    public toAscii(hex) {
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
    public testInitCards(callback): void {
        // if (this._cards)
        //     callback();
        // else {
            this._cards = [];
            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_call, "params": [{"from":localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x3c3830342cb00000000000000000000000000000" }, "latest"], "id": 67 }, "POST", null, function (data) {
                //POST http://10.225.20.161:8118?{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x2ee0faf9997edfd8bdc5d16939d91d1e3674a59f","to":"0xbbf97981efee7214874c304d7fed9788203cfa33","data":"0x3c3830342cb00000000000000000000000000000"},"latest"],"id":67}
                //"{"jsonrpc":"2.0","id":67,"result":"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000b5303a3130302c313a3230302c323a3330302c333a3430302c343a3530302c353a3630302c363a3730302c373a3830302c383a3930302c393a313030302c31303a313039392c31313a313230302c31323a313239382c31333a313339392c31343a313530302c31353a313539392c31363a313730302c31373a313830302c31383a313930302c31393a313030302c32303a313130302c32313a313230302c32323a313330302c32333a313339392c32343a313030302c0000000000000000000000"}"
                console.info(data)
                var info = JSON.parse(data)
                let result = info.result.substring(130)
                result = "0x" + result
                let result1 = this.toAscii(result)
                let cards = result1.split(",")
                cards.pop()
                for (var k in cards) {
                    let v = cards[k]
                    let arr = v.split(":")
                    var id: number = parseInt(arr[0]);
                    var cfg: any = GameConfig.getCfgHeroById(id);
                    var count = arr[1]
                    var isHave = false
                    if(CardPackageManager.instance.cards ){
                        if(CardPackageManager.instance.cards[id] && CardPackageManager.instance.cards[id] > 0)
                        isHave = true
                    }
                    var t: any = {
                        id, count, cfg, isHave
                    }
                    this._cards.push(t);
                }
                console.info(this._cards)
                callback();
            }.bind(this))
        }


        // for (var i: number = 0; i < 20; i++) {
        //     var id: number = Math.floor(Math.random() * 4) + 10001;
        //     var cfg: any = GameConfig.getCfgHeroById(id);
        //     var t: any = {
        //         id, cfg,isHave: Math.random() > 0.5
        //     } 
        //     this._cards.push(t);
        // }
    // }

    public get cards(): Array<any> {
        return this._cards;
    }

    public getCardsByCamp(camp: number): Array<any> {
        if (camp == 5)
            return this.cards;
        else
            return this._cards.filter((item) => {
                var cfg: any = GameConfig.getCfgHeroById(item.id);
                return cfg.camp == camp;
            })
    }
}