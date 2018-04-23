/**
* @author seacole
 * 总控制
 */
class AppControl {
    public constructor() {
    }

    private static instance: AppControl;
    public static getInstance(): AppControl {
        if (!this.instance) {
            this.instance = new AppControl();
        }
        return this.instance;
    }

    private appStage: AppStage;
    private curPage: AppPage;
    private pageCache: Object;
    private mainStage: Laya.Sprite;
    public start(mainStage: Laya.Sprite): void {
        this.mainStage = mainStage;
        this.pageCache = new Object();
        this.appStage = new AppStage(mainStage);
        AppControl.getInstance().stage.on(Laya.Event.RESIZE, this, this.onResize);
    }

    private onResize(): void {
        log("onResize:" + Laya.stage.scaleMode);
    }


    public showPage(page: any, ...params): void {
        if (this.curPage != null) {
            this.curPage.clear();
        }

        // this.appStage.clear();
        this.curPage = null;

        var key: string = Laya.ClassUtils.getClass(page);

        if (this.pageCache.hasOwnProperty(key)) {
            this.curPage = this.pageCache[key];
        }

        if (this.curPage == null) {
            this.curPage = new page();
            this.pageCache[key] = this.curPage;
            this.curPage.loadRes.apply(this.curPage, [key, params]);
        }
        else {
            this.appStage.clear();
            AppControl.getInstance().screenMode = this.curPage.screenMode;
            //苹果蛋疼的转屏瞬间画面会拉伸
            if (Native.instance.OS == OSConfig.IOS_WEB) {
                Laya.timer.frameOnce(3, this, () => {
                    this.curPage.addToStage.apply(this.curPage, params);
                    this.curPage.updateDisplayObjectList();
                });
            }
            else {
                this.curPage.addToStage.apply(this.curPage, params);
                this.curPage.updateDisplayObjectList();
            }
        }
    }


    public addBg(url: string): void {
        var child: Laya.Image;
        if (this.appStage.BGLevel.numChildren)
            child = this.appStage.BGLevel.getChildAt(0) as Laya.Image;
        else {
            child = new Laya.Image();
            child.width = ResourceConfig.BG_WIDTH;
            child.height = ResourceConfig.BG_HEIGHT;
            // child.anchorX = 0.5;
            // child.anchorY = 0.5;
            // child.centerX = 0;
            // child.centerY = 0;
            child.x = AppControl.getInstance().stage.width - ResourceConfig.BG_WIDTH >> 1;
            this.appStage.BGLevel.addChild(child);
        }
        child.source = Laya.loader.getRes(url);
    }

    public addTo3D(child: any): void {
        // this.appStage.ThreeDLevel.addChild(child);
    }
    public addToMain(child: Laya.Sprite): void {
        this.appStage.MainLevel.addChild(child);
    }

    public addToUI(child: Laya.Sprite): void {
        this.appStage.GUILevel.addChild(child);
    }
    public addToPopup(child: Laya.Sprite): void {
        this.appStage.PopupLevel.addChild(child);
    }
    public addToTooltip(child: Laya.Sprite): void {
        this.appStage.ToolTipLevel.addChild(child);
    }
    public addToSystem(child: Laya.Sprite): void {
        this.appStage.SystemLevel.addChild(child);
    }
    public addToLoading(child: Laya.Sprite): void {
        this.appStage.LoadingLevel.addChild(child);
    }

    public get stage(): Laya.Sprite {
        return this.mainStage;
    }

    public get AppStage(): AppStage {
        return this.appStage;
    }

    public isInStage(posX: number, posY: number, offsetX: number = 0, offsetY: number = 0): boolean {
        if (posX > (this.stage.width - offsetX) || posX < offsetX || posY > (this.stage.height - offsetY) || posY < offsetY)
            return false;
        else
            return true;
    }

    public set screenMode(value: string) {
        if (Laya.stage.screenMode != value) {
            if (value == Laya.Stage.SCREEN_HORIZONTAL) {
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
                AppControl.getInstance().stage.height = 640;
                NativeHelper.instance.setOrientationLandscape();
            } else if (value == Laya.Stage.SCREEN_VERTICAL) {
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
                AppControl.getInstance().stage.width = 640;
                NativeHelper.instance.setOrientationPortrait();
            }
            Laya.stage.screenMode = value;
            Laya.stage.setScreenSize(Laya.Browser.clientWidth * Laya.Browser.pixelRatio, Laya.Browser.clientHeight * Laya.Browser.pixelRatio);
        }
    }

    public get screenMode(): string {
        return Laya.stage.screenMode;
    }

    public get currentPage(): AppPage {
        return this.curPage;
    }


    public resetScreen(): void {
        var per: number;
        if (AppControl.getInstance().stage.width > AppControl.getInstance().stage.height)
            per = AppControl.getInstance().stage.width / AppControl.getInstance().stage.height;
        else
            per = AppControl.getInstance().stage.height / AppControl.getInstance().stage.width;
        if (per <= 1.15) {
            Laya.timer.once(200, this, () => {
                Laya.stage.setScreenSize(Laya.Browser.clientWidth * Laya.Browser.pixelRatio, Laya.Browser.clientHeight * Laya.Browser.pixelRatio);
            });
        }

    }
}
