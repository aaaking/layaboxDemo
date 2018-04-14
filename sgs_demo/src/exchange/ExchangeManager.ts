/*
* name;
*/
class ExchangeManager {
    constructor() {
    }
    private static _instance: ExchangeManager;
    public static get instance(): ExchangeManager {
        if (!this._instance)
            this._instance = new ExchangeManager();
        return this._instance;
    }

    _cards: Array<any>;
    public testInitCards(callback): void {
        this._cards = [];
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_call, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x3ded315b" }, "latest"], "id": 67 }, "POST", null, function (data) {
            console.info(data)
            var info = JSON.parse(data)
            let result = info.result.substring(130)
            result = "0x" + result
            let result1 = Utils.toAscii(result)
            console.log("result1: " + result1)//交易ID、cardID、price、self
            let cards = result1.split(";")
            cards.pop()
            for (var k in cards) {
                let v = cards[k]
                let arr = v.split(",")
                var id: number = parseInt(arr[0]);
                var cfg: any = GameConfig.getCfgHeroById(parseInt(arr[1]));
                var price = arr[2]
                if (parseInt(price) <= 0)
                    continue
                var isself = arr[3] == "1"
                var t: any = {
                    id, price, cfg, isself
                }
                this._cards.push(t);
            }
            console.info(this._cards)
            callback();
        }.bind(this))
    }

    public get cards(): Array<any> {
        return this._cards;
    }

    public getCardsByCamp(camp: number): Array<any> {
        if (camp == 5)
            return this.cards;
        else
            return this._cards.filter((item) => {
                var cfg: any = GameConfig.getCfgHeroById(item && item.cfg ? item.cfg.id : -16913);
                return cfg && cfg.camp == camp;
            })
    }
}