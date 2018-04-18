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
            this._cards = ParseData.parseExchangeData(data)
            callback()
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