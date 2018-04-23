/**
* @author seacole
 *场景基础类
 */
class AppPage extends laya.ui.View {
    public constructor() {
        super();
    }

    protected static _loadData: any;
    public static register(page: any, loadData: any): void {
        if (!AppPage._loadData)
            AppPage._loadData = {};
        var key: string = Laya.ClassUtils.getClass(page);
        AppPage._loadData[key] = loadData;
    }

    protected _loadDatas: Array<any> = [];

    protected createChild(): void {
        // AppControl.getInstance().screenMode = this._screenMode;//调整到 AppControl.getInstance().showPage执行       
    }

    protected layoutChild(): void {
        EventManager.instance.enableOnObject(this);
        this.onResize(null);
    }

    public destroy(): void {
        EventManager.instance.disableOnObject(this);

    }
    protected init(...params): void {
        EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);
       
    }

    protected initParams: Array<any>;
    public loadRes(key: string, ...params): void {
        this.playBgm();
        this.initParams = params[0];
        if (AppPage._loadData[key])
            LoadingUI.instance.show(LoadingUI.TYPE_HAS_BG, AppPage._loadData[key], this, this.loadComplete);
        else
            this.loadComplete();
    }

    protected loadComplete(): void {
        AppControl.getInstance().AppStage.clear();
        LoadingUI.instance.hide();
        //苹果蛋疼的转屏瞬间画面会拉伸
        if (Native.instance.OS == OSConfig.IOS_WEB) {
            Laya.timer.frameOnce(3, this, () => {
                AppControl.getInstance().screenMode = this.screenMode;
                this.addToStage.apply(this, this.initParams);
                this.updateDisplayObjectList();
            });
        }
        else {
            AppControl.getInstance().screenMode = this.screenMode;
            this.addToStage.apply(this, this.initParams);
            this.updateDisplayObjectList();
        }
    }

    public addToStage(...params): void {
        this.playBgm();
        this.createChild();
        this.init.apply(this, params);
    }

    protected playBgm(): void {
        // GameSoundManager.playBGM();
    }

    public updateDisplayObjectList(): void {
        this.layoutChild();
    }

    public clear(): void {
        this.destroy();
    }

    public add3D(child: Laya.Sprite): void {
        AppControl.getInstance().addTo3D(child);
    }
    public addView(child: Laya.Sprite): void {
        AppControl.getInstance().addToMain(child);
    }
    public addUI(child: Laya.Sprite): void {
        AppControl.getInstance().addToUI(child);
    }
    public addPopup(child: Laya.Sprite): void {
        AppControl.getInstance().addToPopup(child);
    }
    public addTooltip(child: Laya.Sprite): void {
        AppControl.getInstance().addToTooltip(child);
    }
    public removeAChild(child: Laya.Sprite): void {
        if (child && child.parent) {
            child.parent.removeChild(child);
        }
    }

    protected onResize(e: laya.events.Event): void {

    }


    private _screenMode: string = Laya.Stage.SCREEN_HORIZONTAL;
    public set screenMode(value: string) {
        this._screenMode = value;
    }

    public get screenMode(): string {
        return this._screenMode;
    }
}
