/*
* name;
*/
class SceneLogin extends ui.scene.SceneLoginUI {
    constructor() {
        super();
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
    }

    private static _instance: SceneLogin;
    public static get instance(): SceneLogin {
        localStorage.removeItem("uuid")
        if (!this._instance)
            this._instance = new SceneLogin();
        return this._instance;
    }

    public show(): void {
        this.onResize();
        Laya.stage.addChild(SceneLogin.instance);
    }

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._btnLogin:
                Laya.stage.removeChildren();
                var uuid: string = localStorage.getItem('uuid');
                if (!uuid) {
                    Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "personal_newAccount", "params": [""], "id": 67 }, "POST", null, function (data) {
                        console.info(data)
                        var info = JSON.parse(data)
                        localStorage.setItem('uuid', info.result);
                        SceneMenu.instance.show();
                        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "personal_unlockAccount", "params": [GameConfig.BASE_COIN, GameConfig.BASE_PASS, null], "id": 67 }, "POST", null, function (data) {
                            console.info(data)
                            let info = JSON.parse(data)
                            if (info.result) {
                                Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_sendTransaction", "params": [{ "from": GameConfig.BASE_COIN, "to": localStorage.getItem('uuid'), "value": "0x4563918244F40000" }], "id": 67 }, "POST", null, function (data) {
                                    console.info(data)
                                })
                            }
                        })
                    }.bind(this))
                } else {
                    SceneMenu.instance.show();
                }
                break;
        }
    }

    private onResize(e: Laya.Event = null): void {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this._btnLogin.on(Laya.Event.CLICK, this, this.onTouch);
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