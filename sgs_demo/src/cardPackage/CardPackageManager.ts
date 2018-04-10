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
        return null
    }

    public addCountByID(cardid) {
        for (var k in this._cards) {
            let v = this._cards[k]
            if (v.id == cardid) {
                v.count = v.count + 1
            }
        }
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
        this._cards = [];
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_call, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x179a074f" }, "latest"], "id": 67 }, "POST", null, function (data) {
            //POST http://10.225.20.161:8118?{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x24479b7f771d6d0d6d4003257ca1043661af7bd7","to":"0xbbf97981efee7214874c304d7fed9788203cfa33","data":"0x179a074f"},"latest"],"id":67}
            //{"jsonrpc":"2.0","id":67,"result":"0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000073303a302c313a302c323a302c333a302c343a302c353a302c363a302c373a302c383a302c393a302c31303a302c31313a302c31323a302c31333a302c31343a302c31353a302c31363a302c31373a302c31383a302c31393a302c32303a302c32313a302c32323a302c32333a302c32343a302c00000000000000000000000000"}
            console.info(data)
            var info = JSON.parse(data)
            let result = info.result.substring(130)
            result = "0x" + result
            let result1: string = this.toAscii(result)
            let cards: any[] = result1.split(",")
            cards.pop()
            // cards = cards.concat(cards)//测试代码
            // cards = cards.concat(cards)
            // cards = cards.concat(cards)
            // cards = cards.concat(cards)
            for (var k in cards) {
                let v = cards[k]
                let arr = v.split(":")
                var id: number = parseInt(arr[0]);
                var cfg: any = GameConfig.getCfgHeroById(id);
                var count = arr[1]
                var t: any = {
                    id, count, cfg, isHave: Math.random() > 0.5
                }
                if (count > 0) {
                    this._cards.push(t);
                }
            }
            console.info(this._cards)//[]
            callback();
        }.bind(this))
        // for (var i: number = 0; i < 20; i++) {
        //     var id: number = Math.floor(Math.random() * 25) + 0;
        //     var cfg: any = GameConfig.getCfgHeroById(id);
        //     var t: any = {
        //         id, cfg
        //     }
        //     this._cards.push(t);
        // }
    }

    public get cards(): Array<any> {
        if (!this._cards) return [];
        this.deleteNull();
        return this._cards.sort(this.sortOnNormal);
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
        if (a.cfg.id < b.cfg.id)
            return -1;
        else if (a.cfg.id == b.cfg.id)
            return 0;
        else
            return 1;
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
            return this.cards;
        else
            return this._cards.filter((item) => {
                var cfg: any = GameConfig.getCfgHeroById(item.id);
                return cfg.camp == camp;
            })
    }

    judgeHaveById(id: number): boolean {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].id == id) {
                return true
            }
        }
        return false
    }

}