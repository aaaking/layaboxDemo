/*
* name;
*/
class CardPackageManager {
    constructor() {
    }
    private static _instance: CardPackageManager;
    public static get instance(): CardPackageManager {
        if (!this._instance)
            this._instance = new CardPackageManager();
        return this._instance;
    }
    public getCountByID(cardid) {
        for (var k in this._cards) {
            let v = this._cards[k]
            if (v.id == cardid) {
                return parseInt(v.count)
            }
        }
        return 0
    }

    public addCountByID(cardid, card) {
        for (var k in this._cards) {
            let v = this._cards[k]
            if (v.id == cardid) {
                v.count = card ? card.count : (v.count + 1)
            }
        }
        if (card) {
            this._cards.push(card)
        }
    }
    private _cards: Array<any>;

    public testInitCards(callback): void {
        this._cards = [];
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_call, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x179a074f" }, "latest"], "id": 67 }, "POST", null, function (data) {
            this._cards = ParseData.parseCardPackage(data)
            this.deleteNull()
            this._cards.sort(this.sortOnReduce)
            callback();
        }.bind(this))
    }

    public get cards(): Array<any> {
        if (!this._cards) return [];
        return this._cards
    }

    private deleteNull(): void {
        for (var i: number = 0; i < this._cards.length;) {
            if (!this._cards[i])
                this._cards.splice(i, 1);
            else
                i++
        }
    }

    public get sortOnCampCards(): Array<any> {
        this.deleteNull();
        return this._cards.sort(this.sortOnCamp);
    }

    private sortOnNormal(a: any, b: any): number {
        return a.cfg.id - b.cfg.id
    }
    private sortOnReduce(a: any, b: any): number {
        return b.cfg.id - a.cfg.id
    }

    private sortOnCamp(a: any, b: any): number {
        if (a.cfg.camp < b.cfg.camp)
            return -1;
        else if (a.cfg.camp == b.cfg.camp)
            return 0;
        else
            return 1;
    }

    public getCardsByCamp(camp: number): Array<any> {
        if (camp == 5)
            return this._cards;
        else
            return this._cards.filter((item) => {
                var cfg: any = GameConfig.getCfgHeroById(item && item.cfg ? item.cfg.id : -16913);
                return cfg && cfg.camp == camp;
            })
    }

    judgeHaveById(id: number): boolean {
        for (var i = 0; i < this.cards.length; i++) {
            if (this._cards[i].id == id) {
                return true
            }
        }
        return false
    }
}