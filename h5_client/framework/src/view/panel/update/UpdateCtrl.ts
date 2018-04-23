/*
*  @author seacole
* 检测更新;
*/
class UpdateCtrl extends BaseCtrl {
    constructor() {
        super();
    }

    protected _ui: ui.panel.UpdateUI;

    private static _instance: UpdateCtrl;
    public static get instance(): UpdateCtrl {
        if (!this._instance)
            this._instance = new UpdateCtrl();
        return this._instance;
    }

    private _newVer: string;
    private _url: string;
    private _tips: string;

    public show(newVer: string, url: string, tips: string): void {
        this._newVer = newVer;
        this._url = url;
        this._tips = tips;
        this.showself();
    }

    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.UpdateUI();
            this._ui._labMsg.style.align = "center";
            this._ui._labMsg.style.color = "#45483e";
            this._ui._labMsg.style.fontSize = 26;
             this._ui._labMsg.style.valign = "middle"; 
            EventManager.instance.registerOnObject(this, this._ui._btnConfirm, Laya.Event.CLICK, this, this.onTouch);
            this._autoHide = false;
        }
        super.beforeShow();
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow(3);
        LoadingUI.instance.hide();

        this._ui._labMsg.innerHTML = this._tips;
        this._ui._labMsg.y=100+(210-this._ui._labMsg.contextHeight)*0.5;
        this.tweenSelf();
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

    protected onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._ui._btnConfirm:
                NativeHelper.instance.appUpdate(this._newVer, this._url);
                break;
        }
    }

}