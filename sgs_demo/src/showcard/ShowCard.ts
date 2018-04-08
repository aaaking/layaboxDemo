/*
* name;
*/
class ShowCard extends ui.showcard.ShowCardUI {
    constructor() {
        super();
        this._mask.width = Laya.stage.width;
        this._mask.height = Laya.stage.height;
        this._mask.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnOpen.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnBack.on(Laya.Event.CLICK, this, this.onTouch);
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
    }

    private static _instance: ShowCard;
    public static get instance(): ShowCard {
        if (!this._instance)
            this._instance = new ShowCard();
        return this._instance;
    }

    private _sortType: number;
    private _columeCount: number;

    public show(parent: Laya.Sprite): void {
        if (parent && !ShowCard.instance.parent)
            parent.addChild(ShowCard.instance);

        this.mouseEnabled = true;
        Laya.Tween.clearAll(this._boxWaiting);
        Laya.Tween.clearAll(this._labTip);
        Laya.timer.clearAll(this);
        this._btnOpen.visible = this._imgBg.visible = true;
        this._imgIcon.visible = this._labTip.visible = this._boxWaiting.visible = false;
        this.off(Laya.Event.CLICK, this, this.onTouch);
        this.onResize(null);
    }
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

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._btnBack:
                this.removeSelf();
                e.stopPropagation();
                break;

            case this._btnOpen:
                this.mouseEnabled = false;
                this._boxWaiting.visible = true;
                this._boxWaiting.alpha = 0;
                Laya.Tween.to(this._boxWaiting, { alpha: 1 }, 500, null);
                // Laya.timer.once(5000, this, () => {
                //     this.mouseEnabled = true;
                //     var id: number = this.testOpenCard();
                //     this.showCard(id);
                //     this._boxWaiting.visible = false;
                // })
                Laya.timer.loop(5000,this, () =>{

                })
                e.stopPropagation();
                Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.personal_unlockAccount, "params": [localStorage.getItem('uuid'), "", null
                ], "id": 67 }, "POST", null, function (data) {
                    console.info(data)
                    if(JSON.parse(data).result){
                    Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_sendTransaction, "params": [{"from":localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x62158099", "value":"0x20" }], "id": 67 }, "POST", null, function (data) {
                        console.info(data)
                        let info  = JSON.parse(data)
                        if(info.error){
                            this._wait.text = "交易失败"
                            Laya.timer.once(2000,this,function(){
                                this.mouseEnabled = true;
                                        // this.showCard(id);
                                this._boxWaiting.visible = false;
                            })
                            
                        }else{
                            this._wait.text = "正在开卡中请等待..."
                        Laya.timer.loop(10000,this,function(){
                            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_getTransactionReceipt, "params": [info.result], "id": 67 }, "POST", null, function (data) {
                            console.info(data)
                                let cardsinfo = JSON.parse(data)
                                if(cardsinfo.result){
                                    Laya.timer.clearAll(this)
                                        this.mouseEnabled = true;
                                        // this.showCard(id);
                                        this._boxWaiting.visible = false;
                                        Ajax.callNet(GameConfig.RPC_URL,{"jsonrpc":"2.0","method":Urls.eth_call,"params":[{"from":localStorage.getItem('uuid'),"to":GameConfig.RPC_ADDRESS, "data":"0x179a074f"}, "latest"],"id":67},"POST",null,function(data){
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
                                                if(parseInt(count) > 0 ){
                                                    if(CardPackageManager.instance.getCountByID(id) >= 0){
                                                        if(parseInt(count) - CardPackageManager.instance.getCountByID(id) == 1){
                                                            this.showCard(id);
                                                            CardPackageManager.instance.addCountByID(id)
                                                            break
                                                        }
                                                    }
                                                    // }else{
                                                    //     this.showCard(id);
                                                    //     break
                                                    // }
                                                    
                                                }
                                                
                                            }
                                            
                                        }.bind(this))

                                }
                            }.bind(this))
                        })
                        }
                    }.bind(this))
                    } 
                }.bind(this))
                
                break;

            case this:
                Laya.Tween.clearAll(this._labTip);
                this.off(Laya.Event.CLICK, this, this.onTouch);
                this._btnOpen.visible = this._imgBg.visible = true;
                this._imgIcon.visible = this._labTip.visible = false;
                break;
        }
    }

    private onResize(e: Laya.Event = null): void {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }

    private testOpenCard(): number {
        return Math.floor(Math.random() * 25) + 0;
    }

    private showCard(id: number): void {
        var cfg: any = GameConfig.getCfgHeroById(id);
        this._imgIcon.skin = "showcards/" + cfg.icon + ".png";
        this._btnOpen.visible = this._imgBg.visible = false;
        this._imgIcon.visible = true;
        Laya.timer.once(1000, this, () => {
            this._labTip.visible = true;
            this.on(Laya.Event.CLICK, this, this.onTouch);
        })
    }
}