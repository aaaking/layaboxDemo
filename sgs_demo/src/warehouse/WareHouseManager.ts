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
        ParseData.parseWareHouseData(this, callback)
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