/*
* name;
*/
class SceneLogin extends Laya.View {
    public _bgLogin: Laya.Image;
	public _btnLogin: runtime.RuntimeClickBtn;
    constructor() {
        super();
        this.initBg()
        this.initLoginBtn()
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize)
    }

    private static _instance: SceneLogin;
    public static get instance(): SceneLogin {
        // localStorage.removeItem("uuid")
        if (!this._instance)
            this._instance = new SceneLogin();
        return this._instance;
    }

    public show(): void {
        this.onResize();
        Laya.stage.addChild(SceneLogin.instance);
    }

    resLoaded: boolean = false
    netCompleted: boolean = false
    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._btnLogin:
                this.showLoading(false)
                Laya.loader.load([menu.SceneMenu.bgMenu,
                menu.SceneMenu._skinWareHouse,
                menu.SceneMenu._skinOpenCard,
                menu.SceneMenu._skinMyCard,
                menu.SceneMenu.MENU_AVATOR,
                menu.SceneMenu.MENU_ICON_BALANCE,
                menu.SceneMenu._skinExchange], Laya.Handler.create(this, function () {
                    this.resLoaded = true
                    this.gotoMenuScene()
                }))
                this._btnLogin.mouseEnabled = false
                UITools.changeGray(this._btnLogin)
                var uuid: string = localStorage.getItem('uuid');
                var balance: number = parseInt(localStorage.getItem('balance'))
                if (!uuid || !balance) {
                    Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.personal_newAccount, "params": [""], "id": 67 }, "POST", null, function (data) {
                        //POST http://10.225.20.161:8118?{"jsonrpc":"2.0","method":"personal_newAccount","params":[""],"id":67}
                        //{"jsonrpc":"2.0","id":67,"result":"0x24479b7f771d6d0d6d4003257ca1043661af7bd7"}
                        console.info(data)
                        var info = JSON.parse(data)
                        var uuid = info.result
                        localStorage.setItem('uuid', uuid);
                        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.personal_unlockAccount, "params": [GameConfig.BASE_COIN, GameConfig.BASE_PASS, null], "id": 67 }, "POST", null, function (data) {
                            //POST http://10.225.20.161:8118?{"jsonrpc":"2.0","method":"personal_unlockAccount","params":["0xb398fd7be01eb6b9aca4288a8675be80568f9c4a","00",null],"id":67}
                            //{"jsonrpc":"2.0","id":67,"result":true}
                            console.info(data)
                            let info = JSON.parse(data)
                            if (info.result) {
                                Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_sendTransaction, "params": [{ "from": GameConfig.BASE_COIN, "to": uuid, "value": "0x4563918244F40000" }], "id": 67 }, "POST", null, function (data) {
                                    //POST http://10.225.20.161:8118?{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0xb398fd7be01eb6b9aca4288a8675be80568f9c4a","to":"0x24479b7f771d6d0d6d4003257ca1043661af7bd7","value":"0x4563918244F40000"}],"id":67}
                                    //{"jsonrpc":"2.0","id":67,"result":"0x6703694f6263004fa905a0470685ea41e7c77c7bc4f8cc5276d550220de9a250"}
                                    console.info(data)
                                    this.userBalance(uuid)
                                }.bind(this),
                                    this.onerror.bind(this))
                            }
                        }.bind(this),
                            this.onerror.bind(this))
                    }.bind(this),
                        this.onerror.bind(this))
                } else {
                    this.netCompleted = true
                    this.gotoMenuScene()
                }
                break;
        }
    }

    private onerror() {
        this.loadingBox.visible = false
        Laya.timer.clearAll(this)
        this._btnLogin.mouseEnabled = true
        UITools.resetGray(this._btnLogin)
    }

    private gotoMenuScene() {
        if (this.resLoaded && this.netCompleted) {
            this._bgLogin.skin = menu.SceneMenu.bgMenu
            this.removeChild(this._btnLogin)
            this.removeChild(this.loadingBox)
            menu.SceneMenu.instance
        }
    }

    requestNum = 0
    requestBalance: boolean = false
    private userBalance(uuid: any) {//查询余额,余额小于等于0禁止进入menu页
        Laya.timer.loop(1000, this, function () {
            if (this.requestNum > 300) {
                this.onerror()
                this.requestNum = 0
                return
            }
            if (this.requestBalance) {
                return
            }
            this.requestNum++
            this.requestBalance = true
            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_getBalance, "params": [uuid, "latest"], "id": this.requestNum }, "POST", null, function (data) {
                // {"id":67,"jsonrpc": "2.0","result": "0x0234c8a3397aab58" }// 158972490234375000
                console.info(data)
                var info = JSON.parse(data)
                var balance = parseInt(parseInt(info.result, 16).toString(10))
                if (balance > 0) {
                    localStorage.setItem('balance', balance + "");
                    Laya.timer.clearAll(this)
                    this.showLoading(true)
                    this.netCompleted = true
                    this.gotoMenuScene()
                } else {
                    this.requestBalance = false
                }
            }.bind(this),
                this.onerror.bind(this))
        })
    }

    loadingBox: Laya.Box;
    loadingBg: Laya.Image;
    loadingLabel: Laya.Label;
    private showLoading(success: boolean) {
        if (!this.loadingBox) {
            this.initLoading()
        }
        if (success) {
            this.loadingBox.removeSelf()
        } else {
            this.loadingBox.visible = true
            this.loadingLabel.text = "正在登录中..."
        }
    }
    private initLoading() {
        this.loadingBox = new Laya.Box()
        this.loadingBox.centerX = this.loadingBox.centerY = 0
        this.loadingBg = new Laya.Image("menu/img_3.png")
        this.loadingBg.centerX = this.loadingBox.centerY = 0
        this.loadingLabel = new Laya.Label("")
        this.loadingLabel.fontSize = 30
        this.loadingLabel.color = "#Ceb589"
        this.loadingLabel.centerX = this.loadingLabel.centerY = 0
        this.loadingBox.addChild(this.loadingBg)
        this.loadingBox.addChild(this.loadingLabel)
        this.addChild(this.loadingBox)
    }

    private onResize(e: Laya.Event = null): void {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this._btnLogin.on(Laya.Event.CLICK, this, this.onTouch);
    }

    private initBg() {
        this._bgLogin = new Laya.Image("login/bg_login.jpg")
        this._bgLogin.centerX = this._bgLogin.centerY = 0
        this.addChild(this._bgLogin)
    }
    private initLoginBtn() {
        this._btnLogin = new runtime.RuntimeClickBtn()
        this._btnLogin.skin = "login/btn_guest.png"
        this._btnLogin.anchorX = this._btnLogin.anchorY = 0.5
        this._btnLogin.stateNum = 1
        this._btnLogin.centerX = 0
        this._btnLogin.y = Laya.stage.height - 100 - (this._btnLogin.height >> 1)
        this.addChild(this._btnLogin)
    }

    /**
* 获取设备唯一ID
* @param callback
* @param prefix
* @param makeNew
*/
    getDeviceUUID(): string {

        var uuid: string = localStorage.getItem('uuid');
        if (!uuid) {
            uuid = StringUtils.makeRandomString(32);
            localStorage.setItem('uuid', uuid);
        }
        return uuid;
    }
}