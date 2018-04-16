/*
* name;
*/
class ExchangeCard extends Card {
    private _btnBuy: Laya.Button
    constructor() {
        super();
        this._labCount = new Laya.Label();
        this._labCount.right = 20;
        this._labCount.bottom = 20;
        this._labCount.fontSize = 30;
        this._labCount.color = "#ffffff";
        this._labCount.stroke = 5;
        this._labCount.strokeColor = "0000000";
        this.addChild(this._labCount);
        this._btnBuy = new runtime.RuntimeClickBtn("menu/btn_buy.png")
        this._btnBuy.stateNum = 2
        this._btnBuy.anchorX = this._btnBuy.anchorY = 0.5
        this.addChild(this._btnBuy)
        this._btnBuy.centerX = 0
        this._btnBuy.y = 250 + (this._btnBuy.height >> 1)
        this.height = this._btnBuy.y + (this._btnBuy.height >> 1)//360
        this._labPrice = new Laya.Label("200")
        this._btnBuy.addChild(this._labPrice)
        this._labPrice.color = "#ffffff"
        this._labPrice.centerY = 0
        this._labPrice.fontSize = 20
        this._labPrice.stroke = 2
        this._labPrice.strokeColor = "#000000"
        this._labPrice.x = 80
        // this._labPrice.y = this._btnBuy.height - this._labPrice.height >> 1
        // this._labPrice.anchorX = this._labPrice.anchorY = 0.5
        this._btnBuy.on(Laya.Event.CLICK, this, this.buyCard)
        this._mask.visible = false
    }
    private _labCount: Laya.Label;
    private _labPrice: Laya.Label;
    public updata(): void {
        super.updata()
        this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png";
        this._labPrice.text = Utils.toNumberUnit(this.dataSource.price)
        if (this.dataSource && this.dataSource.isself) {
            this._btnBuy.skin = "menu/btn_undo.png"
            this._labPrice.visible = false
        } else {
            this._btnBuy.skin = "menu/btn_buy.png"
            this._labPrice.visible = true
        }
    }

    public buyCard() {
        if (!this.dataSource.isself && parseInt(localStorage.getItem("balance")) < this.dataSource.price) {
            new CommonDialog("余额不足!")
            return
        }
        let baseID = "0000000000000000000000000000000000000000000000000000000000000000"
        let param = baseID.substring(0, 64 - this.dataSource.id.toString(16).length) + this.dataSource.id.toString(16)
        this.showLoading(false)
        UITools.changeGray(this._btnBuy)
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.personal_unlockAccount, "params": [localStorage.getItem('uuid'), "", null], "id": 67 }, "POST", null, function (data) {
            console.info(data)
            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_sendTransaction, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0xc70f5eaa" + param, "value": "0x" + parseInt(this.dataSource.price).toString(16) }], "id": 67 }, "POST", null, function (data) {
                console.info(data)
                this.getReceiptByLoop(JSON.parse(data))
            }.bind(this), this.onNetError.bind(this))
        }.bind(this), this.onNetError.bind(this))
    }

    static cancelIng = "正在撤销中..."
    static buyIng = "正在购买中..."
    _boxWaiting: Laya.Box
    _wait: Laya.Label
    private initBoxWaiting() {
        this._boxWaiting = new Laya.Box()
        this._boxWaiting.centerX = this._boxWaiting.centerY = 0
        var img = new Laya.Image("menu/img_3.png")
        this._boxWaiting.addChild(img)
        this._wait = new Laya.Label(ExchangeCard.buyIng)
        this._wait.centerX = this._wait.centerY = 0
        this._wait.color = "#Ceb589"
        this._wait.fontSize = 30
        this._boxWaiting.addChild(this._wait)
    }

    private showLoading(success: boolean) {
        Exchange.instance.loading(success)
        if (!this._boxWaiting) {
            this.initBoxWaiting()
        }
        if (success) {
            UITools.resetGray(this._btnBuy)
            this.requestNum = 0
            this.requestIng = false
            // Exchange.instance.mouseEnabled = true;
            this._boxWaiting.removeSelf()
            Laya.timer.clearAll(this)
            // this.removeSelf()
        } else {
            if (!this._boxWaiting.parent) {
                // Exchange.instance.mouseEnabled = false;
                this._wait.text = (this.dataSource && this.dataSource.isself) ? ExchangeCard.cancelIng : ExchangeCard.buyIng
                Laya.stage.addChild(this._boxWaiting)
            }
        }
    }

    private onNetError(error?: any) {
        UITools.resetGray(this._btnBuy)
        Laya.timer.clearAll(this)
        this.requestNum = 0
        this.requestIng = false
        // Exchange.instance.mouseEnabled = true;
        Exchange.instance.loading(true)
        if (this._boxWaiting) {
            this._boxWaiting.removeSelf()
        }
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
                    Dispatcher.dispatch("updateInfo")
                    Dispatcher.dispatch("userBalance", [this.dataSource.isself ? 0 : -this.dataSource.price])
                } else {
                    this.requestIng = false
                }
            }.bind(this), this.onNetError.bind(this))
        })
    }
}