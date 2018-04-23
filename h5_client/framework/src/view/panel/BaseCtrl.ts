/*
* @author seacole
* 基础ctrl;
*/
class BaseCtrl implements ICtrl {
    constructor() {

    }

    protected _loadData: Array<any>;
    protected _ui: View;
    protected _autoHide: boolean = true;
    protected _uiMask: Laya.Image;

    public start(loadData: any): void {
        this._loadData = loadData;
    }

    /**
     * 加载自身需要资源
     */
    protected showself(): void {
        if (!this._ui) {
            if (this._loadData)
                LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, this._loadData, this, this.beforeShow);
            else
                this.beforeShow();
        }
        else
            this.onShow(1);
    }

    /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);
        EventManager.instance.registerOnObject(this, this._ui, Laya.Event.REMOVED, this, this.afterShow);
    }

    /**
     * 开启监听，配置宽高，添加到舞台
     * @param type 1 addToUI 2 addToPopUp 3 addToSystem
     */
    public onShow(type: number = 1): void {
        EventManager.instance.enableOnObject(this);
        this._ui.width = AppControl.getInstance().stage.width;

        this._ui.height = AppControl.getInstance().stage.height > 1280 ? 1280 : AppControl.getInstance().stage.height;
        this._ui.y = (AppControl.getInstance().stage.height - this._ui.height) / 2;
        this._ui.mouseThrough = true;
        if (!this._uiMask && this._ui.hasOwnProperty("_mask")) {
            this._uiMask = this._ui["_mask"];
            this._uiMask.width = AppControl.getInstance().stage.width;
            this._uiMask.height = AppControl.getInstance().stage.height > 1280 ? 1280 : AppControl.getInstance().stage.height;;

            if (this._autoHide)
                this._uiMask.on(Laya.Event.CLICK, this, this.hide)
            // if (this._ui["_mask"].parent == this._ui) {
            //     AppControl.getInstance().addToUI(this._ui["_mask"]);
            // }
        }
        if (!this._ui.parent) {
            if (type == 1) {
                if (this._uiMask)
                    AppControl.getInstance().addToUI(this._uiMask);
                AppControl.getInstance().addToUI(this._ui);
            }
            else if (type == 2) {
                if (this._uiMask)
                    AppControl.getInstance().addToPopup(this._uiMask);
                AppControl.getInstance().addToPopup(this._ui);
            }
            else if (type == 3) {
                if (this._uiMask)
                    AppControl.getInstance().addToSystem(this._uiMask);
                AppControl.getInstance().addToSystem(this._ui);
            }
        }
        this.onResize();
        LoadingUI.instance.hide();
    }

    protected tweenSelf(): void {
        this._ui.pos(AppControl.getInstance().stage.width * 0.5, AppControl.getInstance().stage.height * 0.5);
        this._ui.scale(0, 0);
        Laya.Tween.clearTween(this._ui);
        Laya.Tween.to(this._ui, { scaleX: 1, scaleY: 1, x: 0, y: (AppControl.getInstance().stage.height - this._ui.height) / 2 }, 200, Laya.Ease.backOut);

    }

    /**
     * 离开时调度
     */
    public afterShow(): void {
        EventManager.instance.disableOnObject(this);
    }

    protected onResize(): void {
        this._ui.width = AppControl.getInstance().stage.width;
        this._ui.height = AppControl.getInstance().stage.height > 1280 ? 1280 : AppControl.getInstance().stage.height;
        if (this._uiMask) {
            this._uiMask.width = AppControl.getInstance().stage.width;
            this._uiMask.height = AppControl.getInstance().stage.height > 1280 ? 1280 : AppControl.getInstance().stage.height;
        }
    }

    public hide(): void {
        if (this._ui)
            this._ui.removeSelf();
        if (this._uiMask)
            this._uiMask.removeSelf();
    }

    public get parent():any{
        if (this._ui && this._ui.parent)
            return this._ui.parent;
        else
            return null;
    }
}