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
        let count = parseInt(this._input.text)
        let baseID = "0000000000000000000000000000000000000000000000000000000000000000"
        let baseCount = "0000000000000000000000000000000000000000000000000000000000000000"
        this._boxNormal.mouseEnabled = false;
        this._boxWaiting.visible = true;
        this._boxWaiting.alpha = 0;
        console.log("count: " + count)
        console.log(this._data.id.toString(16))
        console.log(count.toString(16).length)
        console.log(baseCount.substring(0, 64 - this._data.id.toString(16).length) + this._data.id.toString(16))
        let idstr = baseCount.substring(0, 64 - this._data.id.toString(16).length) + this._data.id.toString(16)
        console.log(count.toString(16))
        console.log(count.toString(16).length)
        console.log(baseCount.substring(0, 64 - count.toString(16).length) + count.toString(16))
        let countstr = baseCount.substring(0, 64 - count.toString(16).length) + count.toString(16)
        console.log("countstr: " + countstr)
        let param = String(idstr) + String(countstr)//param参数是0x+8位的方法名+价格的十六进制
        console.log(param)
        if (!count) {//if放到这里只是为了看log // todo
            Laya.Tween.clearTween(this._labTip);
            this._labTip.visible = true;
            this._labTip.alpha = 0;
            Laya.Tween.to(this._labTip, { alpha: 1 }, 500, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(this._labTip, { alpha: 0 }, 500, null, null, 1000);
            }));
            return
        }
        Laya.Tween.to(this._boxWaiting, { alpha: 1 }, 500, null);
        Ajax.callNet(GameConfig.RPC_URL, {
            "jsonrpc": "2.0", "method": Urls.personal_unlockAccount, "params": [localStorage.getItem('uuid'), "", null], "id": 67
        }, "POST", null, function (data) {
            console.info(data)
            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_sendTransaction, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x95bf05a4" + param }], "id": 67 }, "POST", null, function (data) {
                console.info(data)
                var info = JSON.parse(data)
                Laya.timer.loop(10000, this, function () {
                    Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_getTransactionReceipt, "params": [info.result], "id": 67 }, "POST", null, function (data) {
                        console.info(data)
                        let cardsinfo = JSON.parse(data)
                        if (cardsinfo.result) {
                            Laya.timer.clearAll(this)
                            this._boxNormal.mouseEnabled = true;
                            this._boxWaiting.visible = false;
                            this.removeSelf();
                            Dispatcher.dispatch("updateBag");
                        }
                    }.bind(this))
                })
            }.bind(this))
        }.bind(this))
    }

    private showLoading(success: boolean) {
        if (success) {
            this.requestNum = 0
            this.requestIng = false
        } else {
            if (!this._boxWaiting.visible) {
                this.mouseEnabled = false;
                this._boxWaiting.visible = true;
                this._boxWaiting.alpha = 0;
                Laya.Tween.to(this._boxWaiting, { alpha: 1 }, 500, null);
            }
        }
    }

    private onNetError(error?: any) {
        this.requestNum = 0
        this.requestIng = false
        this.mouseEnabled = true;
        this._boxWaiting.visible = false
    }

    requestNum = 0
    requestIng: boolean = false
    private getReceiptByLoop(info: any) {//轮询查询收据
    }
}