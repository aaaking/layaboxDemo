/*
 * @author seacole
 * 顶层弹窗 游戏中
*/
class AlertDissolveCtrl extends AlertInGameCtrl {
    constructor() {
        super();
        this["name"] = "AlertDissolveCtrl";
    }

    protected _ui: ui.panel.AlertInGameUI;
    protected _list: Laya.Image


    protected static _instanceDissolve: AlertDissolveCtrl;
    public static get instance(): AlertDissolveCtrl {
        if (!this._instanceDissolve)
            this._instanceDissolve = new AlertDissolveCtrl();
        return this._instanceDissolve;
    }

    public beforeShow(): void {
        console.log("beforeShow==================================")
        if (!this._ui) {
            this._ui = new ui.panel.AlertInGameUI();
            this._ui._labMsg.style.align = "center";
            this._ui._labMsg.style.color = "#423016";
            // this._ui._labMsg.style.strokeColor = "#3b6374";
            // this._ui._labMsg.style.stroke = 3;
            EventManager.instance.registerOnObject(this, this._ui._btns, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);
            EventManager.instance.registerOnObject(this, this._ui, Laya.Event.REMOVED, this, this.afterShow);
            this._autoHide = false;
             this._size = 22;
        }
        this.onShow();

    }

    public onShow(): void {
        console.log("onShow==================================")       
        super.onShow();
        this._ui._imgTitle.source = Laya.Loader.getRes(this._title);
        // if (this._needCancel) {
        //     this._ui._btnConfirm.centerX = 120;
        //     this._ui._btnCancel.visible = true;
        // }
        // else {
        //     this._ui._btnConfirm.centerX = 0;
        //     this._ui._btnCancel.visible = false;
        // }
        if (this._params) {
            this.update(this._params)
        }
    }

    public update(info) {
        console.log("update==================================")
        let has = true
        let refusePlayer
        for (var k in info) {
            let player = info[k]
            if (BaseGameData.getPlayerDataByUid(player.uid) && BaseGameData.getPlayerDataByUid(player.uid).seatid == BaseGameData.selfSeatid) {
                this.waitDis(info)
                if (player.result > 0) {
                    has = false
                }
                break
            }
            if (player.result == 2) {
                this.showRefuse(BaseGameData.getPlayerDataByUid(player.uid))
                has = false
            }
        }
        if (has) {
            this.chooseDis(info)
        }
    }

    public waitDis(info) {
        this._ui._btnCancel.visible = false
        this._ui._btnConfirm.visible = false
        this._ui._labMsg.innerHTML = "您已经同意房间解散,<br />等待其他玩家选择,<br />超过三分钟默认同意";
         this._ui._labMsg.y = 68;
        if (!this._list) {
            this._list = new Laya.Image("table/vote_bg.png")
            this._list.sizeGrid = "12,13,15,12"
            this._list.width = 490
            this._list.centerX = 0
            this._list.height = 110
            this._ui.addChild(this._list)
            this._list.centerY = 75
        }
        console.log("this._list remove-============================")
        this._list.removeChildren()
        this._list.visible = true
        for (var k in BaseGameData.players) {
            let player = BaseGameData.players[k]
            let text = new Laya.Label("-玩家"+ Utils.getFitNickName(player.nickname,10)+"等待选择")
            text.fontSize = 20
            text.color = "#502718"
            this._list.addChild(text)
            text.centerX = 0
            text.y = parseInt(k) * 24 + 10
            for (var m in info) {
                let v = info[m]
                if (v.uid == player.uid) {
                    if (v.result == 1) {
                        text.text = "--玩家" +  Utils.getFitNickName(player.nickname,10) + "同意--"
                        let img = new Laya.Image("table/agree.png")
                        img.y = parseInt(k) * 24 + 10
                        img.centerX = -text.width / 2 - 10
                        this._list.addChild(img)
                    } else if (v.result == 2) {
                        text.text = "--玩家" +  Utils.getFitNickName(player.nickname,10) + "不同意--"
                        Laya.timer.once(1000, this, this.showRefuse, [player])
                    }
                }
            }
        }

    }

    public showRefuse(player) {
        this._ui._imgTitle.skin = "table/tishi.png"
        this._ui._labMsg.innerHTML = "玩家" + player.nickname + "已拒绝,<br />房间解散失败,继续游戏";
        this._ui._btnConfirm.visible = true
        this._ui._btnConfirm.centerX = 0;
        this._ui._btnConfirm.skin = "tongyong/tongyong_btn_queding.png"
        this._ui._btnCancel.skin = "tongyong/tongyong_btn_quxiao.png"
        this._ui._btnCancel.visible = false
        if (this._list) {
            this._list.visible = false
        }

    }

    public chooseDis(info) {
        if (info.length == 0) return
        let player = BaseGameData.getPlayerDataByUid(info[0].uid)
        if (this._list) {
            this._list.visible = false
        }
        if (player) {
            this._ui._btnConfirm.centerX = 120;
            this._ui._btnConfirm.visible = true;
            this._ui._btnCancel.visible = true;

            this._ui._labMsg.innerHTML = "玩家" + player.nickname + "申请解散房间,<br />是否同意,<br />超过3分钟默认同意";
            this._ui._btnCancel.skin = "tongyong/jujue.png"
            this._ui._btnConfirm.skin = "tongyong/tongyi.png"
        }
    }


}