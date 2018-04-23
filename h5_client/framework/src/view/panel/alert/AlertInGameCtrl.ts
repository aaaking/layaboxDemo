/*
 * @author seacole
 * 顶层弹窗 游戏中
*/
class AlertInGameCtrl extends AlertCtrl {
    constructor() {
        super();
        this["name"] = "AlertInGameCtrl";
    }

    protected _ui: ui.panel.AlertInGameUI;

    protected static _instanceInGame: AlertInGameCtrl;
    public static get instance(): AlertInGameCtrl {
        if (!this._instanceInGame)
            this._instanceInGame = new AlertInGameCtrl();
        return this._instanceInGame;
    }

    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.AlertInGameUI();
            this._ui._labMsg.style.align = "center";
            this._ui._labMsg.style.color = "#9b5036";
            // this._ui._labMsg.style.strokeColor = "#3b6374";
            // this._ui._labMsg.style.stroke = 3;
            EventManager.instance.registerOnObject(this, this._ui._btns, Laya.Event.CLICK, this, this.onTouch);
            this._autoHide = false;
        }
        EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);
        EventManager.instance.registerOnObject(this, this._ui, Laya.Event.REMOVED, this, this.afterShow);
        this._size = 24;
        this.onShow();
    }

    public onShow(): void {
        super.onShow();
        var a: Object; 
        if (this._title == "提示")
            this._ui._imgTitle.source = Laya.Loader.getRes(ResourceConfig.ALERT_TISHI);
        else
            this._ui._imgTitle.source = Laya.Loader.getRes(this._title);
        this._ui._imgTitle.centerX = 0;
        
        // if (this._needCancel) {
        //     this._ui._btnConfirm.centerX = 120;
        //     this._ui._btnCancel.visible = true;
        // }
        // else {
        //     this._ui._btnConfirm.centerX = 0;
        //     this._ui._btnCancel.visible = false;
        // }
    }
}