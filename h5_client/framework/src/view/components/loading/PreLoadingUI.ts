/**
 * @author seacole
 * 一开始的加载UI
 */
class PreLoadingUI extends BasePanel {
    constructor() {
        super();
    }
    private _detail: ui.page.PreLoadingUI;
    private static _instance: PreLoadingUI;
    public static get instance(): PreLoadingUI {
        if (!this._instance)
            this._instance = new PreLoadingUI();
        return this._instance;
    }

    private load(loadData: any, caller: any, callback: any): void {
        if (loadData)
            Laya.loader.load(loadData, Laya.Handler.create(caller, callback), Laya.Handler.create(this, this.onLoading, null, false));
    }

    /**
     * 显示完整加载页面
     */
    public onShowDetail(): void {
        if (!this._detail) {
            this._detail = new ui.page.PreLoadingUI();
            this._detail._imgLogo.skin = "preload/preload_logo_" + GameConfig.APPAREA + ".png";
            this.addChild(this._detail);
        }
        this.clearTime();
        Dispatcher.dispatch(EventNames.PRELOADING_FINISH);
    }

    public show(loadData: any = null, caller: any = null, callback: any = null): void {
        var currPage: AppPage = AppControl.getInstance().currentPage;
        AppControl.getInstance().screenMode = Laya.Stage.SCREEN_VERTICAL;
        if (!this.parent) {
            AppControl.getInstance().addToLoading(this);
        }
        this.onResize(null);
        if (loadData)
            this.load(loadData, caller, callback);
    }

    private onLoading(progress): void {
        this.clearTime();
        Laya.timer.once(10000, this, this.onError);
    }

    private onError(): void {
        alert("网络连接异常，请点击“刷新”重试");
    }

    public clearTime(): void {
        Laya.timer.clear(this, this.onError);
    }



    protected onResize(e: Laya.Event): void {
        this.width = AppControl.getInstance().stage.width;
        this.height = AppControl.getInstance().stage.height;
        if (this._detail) {
            this._detail.width = AppControl.getInstance().stage.width;
            this._detail.height = AppControl.getInstance().stage.height;
            this._detail._imgLogo.bottom = AppControl.getInstance().stage.height * 0.52;
        }
        AppControl.getInstance().resetScreen();
    }

    public hide(): void {
        this.clearTime();
        super.hide();
        if (Laya.Browser.window.loadingView) {
            Laya.Browser.window.conch.showLoadingView(false);
        }
    }
}