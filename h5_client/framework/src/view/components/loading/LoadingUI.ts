/**
 * @author seacole
 * 加载UI
 */
class LoadingUI extends BasePanel {
    private _detail: ui.page.LoadingUI;
    private _loadCircle: LoadingCircle;
    private _bg: ui.components.MaskUI;
    private _type: number;
    private _hideTime: number;

    //有背景情况下 200毫秒后出菊花，再1000毫秒后菊花消失，出加载页面，没有进度条，再500毫秒后，进度条出现
    //无背景情况下 200毫秒后出菊花
    private _circleShowTime: number = 200;
    private _detailShowTime: number = 1000;
    private _processShowTime: number = 500;

    public static TYPE_HAS_BG: number = 1;//有背景
    public static TYPE_NO_BG_DELAY: number = 2;//没背景 菊花延时出现
    public static TYPE_NO_BG_ATONCE: number = 3;//没背景 菊花立即出现

    public constructor() {
        super();
        this.mouseEnabled = true;
        this.mouseThrough = false;
    }
    private static _instance: LoadingUI;
    public static get instance(): LoadingUI {
        if (!this._instance)
            this._instance = new LoadingUI();
        return this._instance;
    }

    private load(loadData: any, caller: any, callback: any): void {
        if (loadData)
            Laya.loader.load(loadData, Laya.Handler.create(caller, callback), Laya.Handler.create(this, this.onLoading, null, false));
    }

    public show(type: number = 1, loadData: any = null, caller: any = null, callback: any = null, hideTime: number = 0): void {
        this._type = type;
        this._hideTime = hideTime;
        if (!this._bg) {
            this._bg = new ui.components.MaskUI();
            this._bg.alpha = 0.01;
            this.addChild(this._bg);
        }
        if (!this._loadCircle) {
            this._loadCircle = new LoadingCircle();
            this.addChild(this._loadCircle);
        }
        if (!this._detail) {
            this._detail = new ui.page.LoadingUI();
            this._detail.centerX = 0;
            this._detail.centerY = 0;
            this.addChildAt(this._detail, 1);
        }
        if (!this.parent)
            AppControl.getInstance().addToLoading(this);
        this.checkType();
        if (loadData)
            this.load(loadData, caller, callback);
        this.onResize(null);
    }

    private checkType(): void {
        this.clearShowTime();
        this._loadCircle.visible = false;
        this._detail.visible = false;
        this._detail._processBar.value = 0;
        this._detail._processBar.visible = false;
        this._detail._labelContext.visible = false;
        if (this._type == LoadingUI.TYPE_NO_BG_ATONCE)
            this.showCircle();
        else
            Laya.timer.once(this._circleShowTime, this, this.showCircle);
        if (this._hideTime)
            Laya.timer.once(this._hideTime, this, this.hide);
    }

    private showCircle(): void {
        this._loadCircle.play();
        if (this._type == LoadingUI.TYPE_HAS_BG) {
            Laya.timer.once(this._detailShowTime, this, this.showDetail);
        }
    }

    private showDetail(): void {
        this._detail.visible = true;
        this._loadCircle.stop();
        Laya.timer.once(this._processShowTime, this, this.showProcess);
        var currPage: AppPage = AppControl.getInstance().currentPage;
        if (currPage)
            AppControl.getInstance().screenMode = currPage.screenMode;
        else
            AppControl.getInstance().screenMode = Laya.Stage.SCREEN_VERTICAL;
        if (AppControl.getInstance().screenMode == Laya.Stage.SCREEN_HORIZONTAL) {
            // this._detail._processBar.bottom = 124;
            this._detail._imgH.visible = true;
            this._detail._imgV.visible = false;
        }
        else {
            // this._detail._processBar.bottom = 230;
            this._detail._imgH.visible = false;
            this._detail._imgV.visible = true;
        }
        this.onResize(null);
    }

    private showProcess(): void {
        this._detail._processBar.visible = true;
        this._detail._labelContext.visible = true;
    }

    private clearShowTime(): void {
        Laya.timer.clear(this, this.showCircle);
        Laya.timer.clear(this, this.showDetail);
        Laya.timer.clear(this, this.showProcess);
        Laya.timer.clear(this, this.hide);
    }

    private onLoading(progress): void {
        if (this._detail) {
            progress = progress > 1 ? 1 : progress;
            this._detail._processBar.value = progress;
            var num = Math.floor(progress * 100)
            this._detail._labelContext._labelProcess.text = num + "%";

            this.clearTime();
            Laya.timer.once(15000, this, this.onError);
        }
    }

    private onError(): void {
        alert("网络连接异常，请点击“刷新”重试");
    }

    public clearTime(): void {
        Laya.timer.clear(this, this.onError);
    }

    /**
     * 外部设置进度条
     */
    public set progress(value: number) {
        this.onLoading(value);
    }

    protected onResize(e: Laya.Event): void {
        this.width = AppControl.getInstance().stage.width;
        this.height = AppControl.getInstance().stage.height;
        if (this._bg) {
            this._bg.width = AppControl.getInstance().stage.width;
            this._bg.height = AppControl.getInstance().stage.height;
        }
        if (this._detail) {
            this._detail.width = AppControl.getInstance().stage.width;
            this._detail.height = AppControl.getInstance().stage.height;
        }
        if (this._loadCircle) {
            this._loadCircle.x = AppControl.getInstance().stage.width * 0.5;
            this._loadCircle.y = AppControl.getInstance().stage.height * 0.5;
        }
        AppControl.getInstance().resetScreen();
    }

    public hide(): void {
        if (this._loadCircle)
            this._loadCircle.stop();
        this.clearTime();
        this.clearShowTime();
        super.hide();
    }


}
