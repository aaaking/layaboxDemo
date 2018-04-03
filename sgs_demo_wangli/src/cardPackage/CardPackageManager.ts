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
    public getCountByID(cardid){
        for(var k in this._cards){
            let v = this._cards[k]
            if(v.id == cardid){
                return parseInt(v.count)
            }
        }
        return null
    }
    
    public addCountByID(cardid){
        for(var k in this._cards){
            let v = this._cards[k]
            if(v.id == cardid){
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
        for (; i < l; i+=2) {
            var code = parseInt(hex.substr(i, 2), 16);
            str += String.fromCharCode(code);
        }

        return str;
    };

    public testInitCards(callback): void {

        this._cards = [];
        Ajax.callNet(GameConfig.RPC_URL,{"jsonrpc":"2.0","method":"eth_call","params":[{"from":localStorage.getItem('uuid'),"to":GameConfig.RPC_ADDRESS, "data":"0x179a074f"}, "latest"],"id":67},"POST",null,function(data){
            console.info(data)
            var info = JSON.parse(data)
            let result = info.result.substring(130)
            result = "0x"+ result
            let result1 = this.toAscii(result)
            let cards = result1.split(",")
            cards.pop()
            for(var k in cards){
                let v = cards[k]
                let arr = v.split(":")
                var id: number = parseInt(arr[0]);
                var cfg: any = GameConfig.getCfgHeroById(id);
                var count = arr[1]
                var t: any = {
                    id, count, cfg, isHave: Math.random() > 0.5
                } 
                if(count > 0){
                    this._cards.push(t);
                }
            }
            console.info(this._cards)
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
        if(!this._cards) return [];
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


}