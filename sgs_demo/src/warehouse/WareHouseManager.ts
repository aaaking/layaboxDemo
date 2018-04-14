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
    _originalCards: Array<any>
    public testInitCards(callback): void {
        this._cards = []
        this._originalCards = []
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_call, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x3c3830342cb00000000000000000000000000000" }, "latest"], "id": 67 }, "POST", null, function (data) {
            Constants.clearCardStar()
            ParseData.parseWareHouseData(data)
            callback()
        }.bind(this), function () { }.bind(this))
    }

    public get cards(): Array<any> {
        return this._cards;
    }

    public getCardsByCamp(camp: number): Array<any> {
        if (camp == Constants.CAMP_ALL) {//5
            return this._cards;
        } else {
            var datas = this._cards.filter((item) => {
                var cfg: any = GameConfig.getCfgHeroById(item && item.cfg ? item.cfg.id : -16913);
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