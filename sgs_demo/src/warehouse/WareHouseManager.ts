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

    _cards: Array<any>;
    _originalCards: Array<any>;
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
        this._cards = []
        this._originalCards = []
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_call, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x3c3830342cb00000000000000000000000000000" }, "latest"], "id": 67 }, "POST", null, function (data) {
            //POST http://10.225.20.161:8118?{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x2ee0faf9997edfd8bdc5d16939d91d1e3674a59f","to":"0xbbf97981efee7214874c304d7fed9788203cfa33","data":"0x3c3830342cb00000000000000000000000000000"},"latest"],"id":67}
            //"{"jsonrpc":"2.0","id":67,"result":"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000b5303a3130302c313a3230302c323a3330302c333a3430302c343a3530302c353a3630302c363a3730302c373a3830302c383a3930302c393a313030302c31303a313039392c31313a313230302c31323a313239382c31333a313339392c31343a313530302c31353a313539392c31363a313730302c31373a313830302c31383a313930302c31393a313030302c32303a313130302c32313a313230302c32323a313330302c32333a313339392c32343a313030302c0000000000000000000000"}"
            Constants.clearCardStar()
            console.info(data)
            var info = JSON.parse(data)
            let result = info.result.substring(130)
            result = "0x" + result
            let result1 = this.toAscii(result)
            let cards: Array<any> = result1.split(",")
            cards.pop()
            cards = cards.concat(cards)//测试代码 50
            cards = cards.concat(cards)//100
            cards = cards.concat(cards)//200
            // cards = cards.concat(cards)//400
            // cards = cards.concat(cards)//800
            for (var k in cards) {
                let v = cards[k]
                let arr = v.split(":")
                var id: number = parseInt(arr[0]);
                var cfg: any = GameConfig.getCfgHeroById(id);
                var count = arr[1]
                var isHave = false
                var star: number = Math.floor(Math.random() * 8 + 3)
                cfg.star = star
                if (CardPackageManager.instance.cards) {
                    if (CardPackageManager.instance.judgeHaveById(id))
                        isHave = true
                }
                var hasRendered = false
                var originalY = -1
                var t: any = {
                    id, count, cfg, star, isHave, hasRendered, originalY
                }
                Constants.putCard(star, t)
            }
            // CardList._columeCount = 4
            // console.log("CardList._columeCount:" + CardList._columeCount)
            // this._originalCards = (Constants.concatList())//原始数据
            // Constants.fillUp()
            // this._cards = Constants.concatList()//补充空数据后的集合
            // console.info(this._originalCards)
            // console.info(this._cards)
            callback();
        }.bind(this))
    }

    public get cards(): Array<any> {
        return this._cards;
    }

    public getCardsByCamp(camp: number): Array<any> {
        if (camp == Constants.CAMP_ALL) {//5
            return this._cards;
        } else {
            var datas = this._cards.filter((item) => {
                var cfg: any = GameConfig.getCfgHeroById(item ? item.id : -16913);
                return cfg && cfg.camp == camp;
            })
            return Constants.fillUpImplement(datas.filter(t => t.star == 10))
                .concat(Constants.fillUpImplement(datas.filter(t => t.star == 9)))
                .concat(Constants.fillUpImplement(datas.filter(t => t.star == 8)))
                .concat(Constants.fillUpImplement(datas.filter(t => t.star == 7)))
                .concat(Constants.fillUpImplement(datas.filter(t => t.star == 6)))
                .concat(Constants.fillUpImplement(datas.filter(t => t.star == 5)))
                .concat(Constants.fillUpImplement(datas.filter(t => t.star == 4)))
                .concat(Constants.fillUpImplement(datas.filter(t => t.star == 3), true))
                .concat(Constants.fillUpImplement(datas.filter(t => t.star == 2)))
                .concat(Constants.fillUpImplement(datas.filter(t => t.star == 1)))
        }
    }
}