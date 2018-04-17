/*
* name;
*/
class ShowCard extends ui.showcard.ShowCardUI {
    constructor() {
        super();
        this.initBalance()
        this.initBackBtn()
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize)
    }

    private userBalance(changeCount, callNet: boolean = true) {
        var balance = parseInt(localStorage.getItem("balance"))
        balance += changeCount
        localStorage.setItem("balance", balance + "")
        this._label.text = Utils.toNumberUnit(balance)
    }

    private static _instance: ShowCard;
    public static get instance(): ShowCard {
        if (!this._instance)
            this._instance = new ShowCard();
        return this._instance;
    }

    private initBackBtn() {
        var whiteSpace = (Laya.stage.width - UITools.MAX_BG_WIDTH) >> 1
        whiteSpace = whiteSpace <= 0 ? 0 : whiteSpace
        this._btnBack.anchorX = this._btnBack.anchorY = 0.5
        this._btnBack.x = (this._btnBack.width >> 1) + whiteSpace
        this._btnBack.y = this._btnBack.y + (this._btnBack.height >> 1)
    }

    private _sortType: number;
    private _columeCount: number;

    public show(parent: Laya.Sprite): void {
        if (parent && !ShowCard.instance.parent) {
            parent.addChild(ShowCard.instance);
        }
        Dispatcher.on("userBalance", this, this.userBalance)
        this.mouseEnabled = true;
        // Laya.Tween.clearAll(this._boxWaiting);
        Laya.Tween.clearAll(this._labTip);
        Laya.timer.clearAll(this);
        this._btnOpen.visible = this._imgBg.visible = true;
        this._imgIcon.visible = this._labTip.visible = false//this._boxWaiting.visible = false;
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
                Dispatcher.off("userBalance", this, this.userBalance)
                this.removeSelf();
                e.stopPropagation()
                break;
            case this._btnOpen:
                if (parseInt(localStorage.getItem("balance")) < Constants.PackagePrice) {
                    new CommonDialog("余额不足!")
                    return
                }
                this.showLoading(false)
                UITools.changeGray(this._btnOpen)
                e.stopPropagation()
                Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.personal_unlockAccount, "params": [localStorage.getItem('uuid'), "", null], "id": 67 }, "POST", null, function (data) {
                    console.info(data)
                    if (JSON.parse(data).result) {
                        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_sendTransaction, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x62158099", "value": "0x20" }], "id": 67 }, "POST", null, function (data) {
                            console.info(data)
                            let info = JSON.parse(data)
                            if (info.error) {
                                this._wait.text = "交易失败"
                                Laya.timer.once(1000, this, function () {
                                    this.onNetError(info)
                                })
                            } else {
                                this.getReceiptByLoop(info)// looper search receipt
                            }
                        }.bind(this), this.onNetError.bind(this))
                    } else {
                        this.onNetError(data)
                    }
                }.bind(this), this.onNetError.bind(this))
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
        var whiteSpace = (Laya.stage.width - UITools.MAX_BG_WIDTH) >> 1
        whiteSpace = whiteSpace <= 0 ? 0 : whiteSpace
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this._balanceBox.x = Laya.stage.width - this._balanceImg.width - 16 - whiteSpace
        this._btnBack.x = (this._btnBack.width >> 1) + whiteSpace
        //
        this._btnBack.on(Laya.Event.CLICK, this, this.onTouch)
        this._btnBack.on(Laya.Event.MOUSE_DOWN, this, menu.MenuCard.normalSmall, [this._btnBack]);
        this._btnBack.on(Laya.Event.MOUSE_UP, this, menu.MenuCard.normalBig, [this._btnBack]);
        this._btnBack.on(Laya.Event.MOUSE_OUT, this, menu.MenuCard.normalBig, [this._btnBack]);
        this._btnOpen.anchorX = this._btnOpen.anchorY = 0.5
        this._btnOpen.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnOpen.on(Laya.Event.MOUSE_DOWN, this, menu.MenuCard.normalSmall, [this._btnOpen]);
        this._btnOpen.on(Laya.Event.MOUSE_UP, this, menu.MenuCard.normalBig, [this._btnOpen]);
        this._btnOpen.on(Laya.Event.MOUSE_OUT, this, menu.MenuCard.normalBig, [this._btnOpen]);
    }

    private testOpenCard(): number {
        return Math.floor(Math.random() * 25) + 0;
    }

    private showLoading(success: boolean) {
        if (success) {
            this.requestNum = 0
            this.requestIng = false
            UITools.resetGray(this._btnOpen)
            this.mouseEnabled = true;
            // this._boxWaiting.visible = false;
            Laya.timer.clearAll(this)
            Loading.instance.hide()
        } else {
            // if (!this._boxWaiting.visible) {
            //     this.mouseEnabled = false;
            //     this._boxWaiting.visible = true;
            //     this._boxWaiting.alpha = 0;
            //     Laya.Tween.to(this._boxWaiting, { alpha: 1 }, 500, null);
            // }
            if (!Loading.instance.parent) {
                // this.mouseEnabled = false
                Loading.instance.show()
            }
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
                    Laya.timer.clearAll(this)
                    Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_call, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x179a074f" }, "latest"], "id": 67 }, "POST", null, function (data) {
                        console.info(data)
                        var info = JSON.parse(data)
                        let result = info.result.substring(130)
                        result = "0x" + result
                        let result1 = this.toAscii(result)
                        let cards = result1.split(",")
                        cards.pop()
                        for (var k in cards) {
                            let v = cards[k]
                            let arr = v.split(":")
                            var id: number = parseInt(arr[0]);
                            var cfg: any = GameConfig.getCfgHeroById(id);
                            var count = arr[1]
                            var t: any = {
                                id, count, cfg, isHave: Math.random() > 0.5
                            }
                            if (parseInt("" + count) - CardPackageManager.instance.getCountByID(id) == 1) {//新开的比原有的多一张的话就是开的这张卡
                                this.showLoading(true);
                                this.showCard(id);
                                CardPackageManager.instance.addCountByID(id, t)
                                Dispatcher.dispatch("userBalance", [-Constants.PackagePrice])
                                break
                            }
                        }
                    }.bind(this), this.onNetError.bind(this))
                } else {
                    this.requestIng = false
                }
            }.bind(this), this.onNetError.bind(this))
        })
    }

    private onNetError(error?: any) {
        this.requestNum = 0
        this.requestIng = false
        this.mouseEnabled = true;
        // this._boxWaiting.visible = false;
        UITools.resetGray(this._btnOpen)
        Loading.instance.hide()
        Laya.timer.clearAll(this)
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

    _balanceBox: Laya.Box
    _balanceImg: Laya.Image
    _label: Laya.Label
    private initBalance() {
        var whiteSpace = (Laya.stage.width - UITools.MAX_BG_WIDTH) >> 1
        whiteSpace = whiteSpace <= 0 ? 0 : whiteSpace
        this._balanceImg = new Laya.Image("menu/menu_icon_balance.png")
        this._balanceBox = new Laya.Box()
        this._balanceBox.pos(Laya.stage.width - this._balanceImg.width - 16 - whiteSpace, 40)
        this._balanceBox.size(this._balanceImg.width, this._balanceImg.height)
        this._balanceBox.addChild(this._balanceImg)
        this.addChild(this._balanceBox)
        this._label = new Laya.Label(Utils.toNumberUnit(parseInt(localStorage.getItem('balance'))))
        this._label.fontSize = 18
        this._label.color = "#ffffff"
        this._label.centerY = this._label.centerX = 0
        this._balanceBox.addChild(this._label)
    }
}