/**
 * @author seacole 
 * 层级管理器
 */
class AppStage {
    private loadingLevel: Laya.Sprite;
    private systemLevel: Laya.Sprite;
    private toolTipLevel: Laya.Sprite;
    private popupLevel: Laya.Sprite;
    private guiLevel: Laya.Sprite;
    private mainLevel: Laya.Sprite;
    private threeDLevel: Laya.Scene;
    private bgLevel: Laya.Sprite;
    /**
     * 存放要随着屏幕变化而调整自身尺寸的容器
     */
    private sprites: Array<Laya.Sprite>;

    public constructor(main: Laya.Sprite) {
        this.bgLevel = main.addChild(new Laya.Sprite()) as Laya.Sprite;

        // this.threeDLevel = main.addChild(new Laya.Scene()) as Laya.Scene;
        this.mainLevel = main.addChild(new Laya.Sprite()) as Laya.Sprite;
        this.guiLevel = main.addChild(new Laya.Sprite()) as Laya.Sprite;
        this.popupLevel = main.addChild(new Laya.Sprite()) as Laya.Sprite;
        this.toolTipLevel = main.addChild(new Laya.Sprite()) as Laya.Sprite;
        this.systemLevel = main.addChild(new Laya.Sprite()) as Laya.Sprite;
        this.loadingLevel = main.addChild(new Laya.Sprite()) as Laya.Sprite;

        this.sprites = [this.bgLevel, this.mainLevel, this.guiLevel, this.popupLevel, this.toolTipLevel, this.systemLevel, this.loadingLevel];
        main.on(Laya.Event.RESIZE, this, this.onResize);
        // this.onResize(null);
    }

    public registUnauthorized(): void {
        Dispatcher.on(EventNames.UNAUTHORIZED, this, this.onUnauthorized);
    }

     private unregistUnauthorized(): void {
        Dispatcher.off(EventNames.UNAUTHORIZED, this, this.onUnauthorized);
    }


    private onUnauthorized(e: Laya.Event): void {
        server.code = "";
        if (!AppControl.getInstance().currentPage)
            AppControl.getInstance().showPage(LoginPage, LoginPage.PARAMS0_FIRST_ENTER);
        else
            AppControl.getInstance().showPage(LoginPage);
        this.unregistUnauthorized();
    }

    public onResize(e: Laya.Event): void {
        // log("onResize1. "+ Laya.stage.screenMode);
        // if (Laya.stage.screenMode == Laya.Stage.SCREEN_HORIZONTAL) {
        //     if (Laya.Browser.width < Laya.Browser.height)
        //         Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
        //     else
        //         Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        // }
        // else if (Laya.stage.screenMode == Laya.Stage.SCREEN_VERTICAL) {
        //     if (Laya.Browser.width > Laya.Browser.height)
        //         Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
        //     else
        //         Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        // }
        // log("onResize2. "+ Laya.stage.screenMode+" w:"+Laya.Browser.width +" h:" + Laya.Browser.height);
        var i: number;
        var l: number;
        for (i = 0, l = this.sprites.length; i < l; i++) {
            this.sprites[i].width = AppControl.getInstance().stage.width;
            this.sprites[i].height = AppControl.getInstance().stage.height;
            this.sprites[i].mouseEnabled = true;
            this.sprites[i].mouseThrough = true;
        }
        if (this.bgLevel.numChildren)
            (this.bgLevel.getChildAt(0) as Laya.Image).x = AppControl.getInstance().stage.width - ResourceConfig.BG_WIDTH >> 1;

        for (i = 0, l = this.guiLevel.numChildren; i < l; i++) {
            var child: Laya.Sprite = this.guiLevel.getChildAt(i) as Laya.Sprite;
            child.width = AppControl.getInstance().stage.width;
            child.height = AppControl.getInstance().stage.height;
        }
    }


    public clear(): void {
        // this.threeDLevel.removeChildren();
        this.mainLevel.removeChildren();
        this.guiLevel.removeChildren();
        this.popupLevel.removeChildren();
        this.toolTipLevel.removeChildren();
        // this.systemLevel.removeChildren();
    }

    public get BGLevel(): Laya.Sprite { return this.bgLevel; }
    // public get ThreeDLevel(): Laya.Scene { return this.threeDLevel; }
    public get MainLevel(): Laya.Sprite { return this.mainLevel; }
    public get GUILevel(): Laya.Sprite { return this.guiLevel; }
    public get PopupLevel(): Laya.Sprite { return this.popupLevel; }
    public get ToolTipLevel(): Laya.Sprite { return this.toolTipLevel; }
    public get SystemLevel(): Laya.Sprite { return this.systemLevel; }
    public get LoadingLevel(): Laya.Sprite { return this.loadingLevel; }

}
