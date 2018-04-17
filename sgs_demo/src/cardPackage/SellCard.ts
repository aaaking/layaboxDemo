/*
* name;
*/
class SellCard extends ui.cardPackage.SellCardUI {
    static UINT32_MAX: number = 4294967295//Math.pow( 2, 32 ) - 1  SellCard.UINT32_MAX
    constructor() {
        super();
        // this._btnClose.anchorX = this._btnClose.anchorY = 0.5
        // this._btnClose.x = this._btnClose.x + (this._btnClose.width >> 1)
        // this._btnClose.y = this._btnClose.y + (this._btnClose.height >> 1)
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
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
        this._input.maxChars = ("" + SellCard.UINT32_MAX).length
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
        this._btnClose.on(Laya.Event.CLICK, this, this.onTouch)
        this._btnClose.on(Laya.Event.MOUSE_DOWN, this, menu.MenuCard.normalSmall, [this._btnClose]);
        this._btnClose.on(Laya.Event.MOUSE_UP, this, menu.MenuCard.normalBig, [this._btnClose]);
        this._btnClose.on(Laya.Event.MOUSE_OUT, this, menu.MenuCard.normalBig, [this._btnClose]);
        this._btnConfirm.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnConfirm.on(Laya.Event.MOUSE_DOWN, this, menu.MenuCard.normalSmall, [this._btnConfirm]);
        this._btnConfirm.on(Laya.Event.MOUSE_UP, this, menu.MenuCard.normalBig, [this._btnConfirm]);
        this._btnConfirm.on(Laya.Event.MOUSE_OUT, this, menu.MenuCard.normalBig, [this._btnConfirm]);
        this._mask.on(Laya.Event.CLICK, this, this.onTouch)
    }

    private sell(): void {
        let count = parseInt(this._input.text)
        let baseID = "0000000000000000000000000000000000000000000000000000000000000000"
        let baseCount = "0000000000000000000000000000000000000000000000000000000000000000"
        console.log(this._data)
        console.log("this._data.id: " + this._data.id + "   十六进制: " + this._data.id.toString(16))
        console.log("count: " + count + "   十六进制: " + count.toString(16))
        let idstr = baseCount.substring(0, 64 - this._data.id.toString(16).length) + this._data.id.toString(16)
        console.log("idstr: " + idstr)
        let countstr = baseCount.substring(0, 64 - count.toString(16).length) + count.toString(16)
        console.log("countstr: " + countstr)
        let param = String(idstr) + String(countstr)//param参数是0x+8位的方法名+价格的十六进制，而且param长度必须是偶数位
        console.log("param: " + param)
        if (!count || count > SellCard.UINT32_MAX) {//if放到这里只是为了看log // todo
            Laya.Tween.clearTween(this._labTip);
            this._labTip.visible = true;
            this._labTip.alpha = 0;
            Laya.Tween.to(this._labTip, { alpha: 1 }, 500, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(this._labTip, { alpha: 0 }, 500, null, null, 1000);
            }));
            return
        }
        this.showLoading(false)
        UITools.changeGray(this._btnConfirm)
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.personal_unlockAccount, "params": [localStorage.getItem('uuid'), "", null], "id": 67 }, "POST", null, function (data) {
            console.info(data)
            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_sendTransaction, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x95bf05a4" + param }], "id": 67 }, "POST", null, function (data) {
                console.info(data)
                this.getReceiptByLoop(JSON.parse(data))// looper search receipt
            }.bind(this), this.onNetError.bind(this))
        }.bind(this), this.onNetError.bind(this))
    }

    private showLoading(success: boolean) {
        if (success) {
            UITools.resetGray(this._btnConfirm)
            Dispatcher.dispatch("updateBag")
            this.requestNum = 0
            this.requestIng = false
            this._boxNormal.mouseEnabled = true;
            this._boxWaiting.visible = false;
            Laya.timer.clearAll(this)
            this.removeSelf()
        } else {
            if (!this._boxWaiting.visible) {
                this._boxNormal.mouseEnabled = false;
                this._boxWaiting.visible = true;
                this._boxWaiting.alpha = 0;
                Laya.Tween.to(this._boxWaiting, { alpha: 1 }, 500, null);
            }
        }
    }

    private onNetError(error?: any) {
        UITools.resetGray(this._btnConfirm)
        Laya.timer.clearAll(this)
        this.requestNum = 0
        this.requestIng = false
        this._boxNormal.mouseEnabled = true;
        this._boxWaiting.visible = false
    }

    requestNum = 0
    requestIng: boolean = false
    private getReceiptByLoop(info: any) {//轮询查询收据
        Laya.timer.loop(1000, this, function () {
            if (this.requestNum > 180) {
                this.onNetError()
                this.requestNum = 0
                return
            }
            if (this.requestIng) {
                return
            }
            this.requestNum++
            this.requestIng = true
            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_getTransactionReceipt, "params": [info.result], "id": this.requestNum }, "POST", null, function (data) {
                console.info(data)
                let cardsinfo = JSON.parse(data)
                if (cardsinfo.result) {
                    this.showLoading(true)
                    Dispatcher.dispatch("userBalance", [0])
                } else {
                    this.requestIng = false
                }
            }.bind(this), this.onNetError.bind(this))
        })
    }
}