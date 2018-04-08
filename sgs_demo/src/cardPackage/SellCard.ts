/*
* name;
*/
class SellCard extends ui.cardPackage.SellCardUI {
    constructor() {
        super();
        this._mask.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnClose.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnConfirm.on(Laya.Event.CLICK, this, this.onTouch);
    }

    private static _instance: SellCard;
    public static get instance(): SellCard {
        if (!this._instance)
            this._instance = new SellCard();
        return this._instance;
    }

    private _data: any;

    public show(parent: Laya.Sprite, data: any): void {
        if (parent && !SellCard.instance.parent)
            parent.addChild(SellCard.instance);
        this._data = data;
        this._imgIcon.skin = "cards/" + this._data.cfg.icon + ".png";
        this._input.text = "";
        this._labTip.visible = this._boxWaiting.visible = false;
        this._boxNormal.mouseEnabled = true;
        Laya.Tween.clearTween(this._labTip);
        Laya.Tween.clearTween(this._boxWaiting);
        Laya.timer.clearAll(this);
        this.onResize(null);
    }

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._btnClose:
                this.removeSelf();
                break;

            case this._btnConfirm:
                this.sell();
                break;
        }
    }

    private onResize(e: Laya.Event = null): void {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }

    private sell(): void {
        let baseID = "0000000000000000000000000000000000000000000000000000000000000000"
        let baseCount = "0000000000000000000000000000000000000000000000000000000000000000"
        if (this._input.text == "") {
            Laya.Tween.clearTween(this._labTip);
            this._labTip.visible = true;
            this._labTip.alpha = 0;
           
            Laya.Tween.to(this._labTip, { alpha: 1 }, 500, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(this._labTip, { alpha: 0 }, 500, null, null, 1000);
            }));
        }
        else {
            this._boxNormal.mouseEnabled = false;
            this._boxWaiting.visible = true;
            this._boxWaiting.alpha = 0;
             let count = parseInt(this._input.text)
            console.log(this._data.id.toString(16))
            console.log(count.toString(16).length)
            console.log(baseCount.substring(0,64-this._data.id.toString(16).length)+this._data.id.toString(16))
            let idstr = baseCount.substring(0,64-this._data.id.toString(16).length)+this._data.id.toString(16)
            console.log(count.toString(16))
            console.log(count.toString(16).length)
            console.log(baseCount.substring(0,64-count.toString(16).length)+count.toString(16))
            let countstr = baseCount.substring(0,64-count.toString(16).length)+count.toString(16)
            let param = String(idstr) + String(countstr)
            console.log(param)
            Laya.Tween.to(this._boxWaiting, { alpha: 1 }, 500, null);
            // Laya.timer.once(5000, this, () => {
            //     this._boxNormal.mouseEnabled = true;
            //     this._boxWaiting.visible = false;
            // })

             Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.personal_unlockAccount, "params": [localStorage.getItem('uuid'), "", null
                ], "id": 67 }, "POST", null, function (data) {
                    console.info(data)
                    Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_sendTransaction, "params": [{"from":localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x95bf05a4"+param }], "id": 67 }, "POST", null, function (data) {
                        console.info(data)
                        var info = JSON.parse(data)
                        Laya.timer.loop(10000,this,function(){
                            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_getTransactionReceipt, "params": [info.result], "id": 67 }, "POST", null, function (data) {
                            console.info(data)
                                let cardsinfo = JSON.parse(data)
                                if(cardsinfo.result){
                                    Laya.timer.clearAll(this)
                                        this._boxNormal.mouseEnabled = true;
                                        // this.showCard(id);
                                        this._boxWaiting.visible = false;
                                        this.removeSelf();
                                         Dispatcher.dispatch("updateBag");
                                }
                            }.bind(this))
                        })
                    }.bind(this))
                }.bind(this))
            
        }
    }
}