/*
 * @author seacole
 * 顶层弹窗
*/
class AlertCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "AlertCtrl";
    }
    protected _loadData: Array<any>;
    protected _ui: ui.panel.AlertUI;
    protected _title: string;
    private _msg: string;
    protected _size: number;
    private _leftTime: number;
    protected _needCancel: boolean;
    private _callBack: Function;
    private _btnName: Array<string>;
    protected _params:Array<any>;

    public static CONFIRM: number = 1;
    public static CANCEL: number = 2;


    protected static _instance: AlertCtrl;
    public static get instance(): AlertCtrl {
        // if (!this._instance)
        //     this._instance = new AlertCtrl();
        // return this._instance;
        return null;
    }

    /**
     * show
     * @param msg 具体内容
     * @param callBack 回调
     * @param leftTime 倒计时 默认为0
     * @param needCancel 是否需要取消 默认需要
     * @param title 标题
     */
    public show(msg: string, callBack: Function = null, leftTime: number = 0, needCancel: boolean = true, title: string = GameConfig.language.alert_title_normal, params: Array<any> = null, btnName: Array<string
        > = ["tongyong/tongyong_btn_queding.png", "tongyong/tongyong_btn_quxiao.png"]): void {
        var id: number = Number(msg);
        // if (!isNaN(id)) {
        //     var tmp: any = U3dPosiUtils.getInfoFromU3dHint(id, params);
        //     this._msg = tmp.msg;
        //     if (tmp.hasOwnProperty("size") && tmp.size)
        //         this._size = tmp.size;
        //     else
        //         this._size = 40;
        // }
        // else {
        this._params = params
        this._msg = msg;
        // this._size = 34;
        // }

        this._title = title;
        this._callBack = callBack;
        this._leftTime = leftTime;
        this._needCancel = needCancel;
        this._btnName = btnName;

        this.showself();
    }

    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.AlertUI();
            this._ui._labMsg.style.align = "center";
            this._ui._labMsg.style.color = "#45483e";
            var btnArr: Array<Laya.ScaleButton> = [this._ui._btnConfirm, this._ui._btnCancel];
            for (var i: number = 0; i < btnArr.length; i++) {
                btnArr[i].label = this._btnName[i];
            }
            EventManager.instance.registerOnObject(this, this._ui._btns, Laya.Event.CLICK, this, this.onTouch);
            this._autoHide = false;
        }
        super.beforeShow();
        this.onShow();
    }

    public onShow(): void {
        super.onShow(2);
        if (this._ui._labTitle)
            this._ui._labTitle.text = this._title;
        this._ui._labMsg.style.fontSize = this._size;
        this._ui._labMsg.style.leading = 10;
        this._ui._labMsg.style.valign = "middle";
        this._ui._labMsg.innerHTML = this._msg;
        this._ui._labMsg.y = 68 + (110 - this._ui._labMsg.contextHeight) * 0.5;
        if (this._needCancel) {
            this._ui._btnConfirm.centerX = 120;
            this._ui._btnCancel.visible = true;
            if (this._btnName && this._btnName.length)
                this._ui._btnConfirm.skin = this._btnName[0];
            if (this._btnName && this._btnName.length>1)
                this._ui._btnCancel.skin = this._btnName[1];
        }
        else {
            this._ui._btnConfirm.centerX = 0;
            this._ui._btnCancel.visible = false;
            if (this._btnName && this._btnName.length)
                this._ui._btnConfirm.skin = this._btnName[0];
        }
        if (this._leftTime <= 0) {
            this._ui._labTime.visible = false;
            Laya.timer.clear(this, this.onTimer);
        }
        else {
            this._ui._labTime.visible = true;
            this.setLabTime();
            Laya.timer.loop(1000, this, this.onTimer);
        }
        LoadingUI.instance.hide();

    }



    public afterShow(): void {
        super.afterShow();
        Laya.timer.clear(this, this.onTimer);
    }

    private onMouseDown(e: Laya.Event): void {

    }

    protected onTouch(e: Laya.Event): void {
        switch (e.target.name) {
            case "close":
                this.cancel();
                break;
            case "confirm":
                this.confirm();
                break;
            case "cancel":
                this.cancel();
                break;
        }
    }

    private confirm(): void {
        if (this._callBack)
            this._callBack(AlertCtrl.CONFIRM);
        this.hide();
    }

    private cancel(): void {
        if (this._callBack)
            this._callBack(AlertCtrl.CANCEL);
        this.hide();
    }

    /**
     * 设置倒计时
     */
    private setLabTime(): void {
        this._ui._labTime.text = StringUtils.format(GameConfig.language.alert_time, this._leftTime);
    }

    /**
     * 倒计时timer
     */
    private onTimer(e: Laya.Event): void {
        this._leftTime--;
        this.setLabTime();
        if (this._leftTime <= 0) {
            this._leftTime = 0;
            Laya.timer.clear(this, this.onTimer);
            if (this._needCancel)
                this.cancel();
            else
                this.confirm();
        }
    }
}