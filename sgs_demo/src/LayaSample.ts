// 程序入口
class GameMain {
    constructor() {
        //初始化引擎
        Laya.init(1280, 720, Laya.WebGL);
        Laya.stage.bgColor = "#ffffff";
        Laya.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        Dispatcher.init();

        Laya.loader.load([{ url: "config/hero.json", type: Laya.Loader.JSON },
        { url: ResourceConfig.comp, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.menu, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.cards, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.login, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.cardsname, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.showcards, type: Laya.Loader.ATLAS }],
            Laya.Handler.create(this, this.onLoadCfgComplete),
            new Laya.Handler(this, this.onLoadCfgProgress, null, false));
        //test code
        // Laya.stage.on(Laya.Event.RESIZE, this, function () {
        //     console.log("browser width: " + Laya.Browser.width + " browser height" + Laya.Browser.height)
        //     console.log("stage width: " + Laya.stage.width + " stage height" + Laya.stage.height)
        // })
    }

    private onLoadCfgComplete(): void {
        GameConfig.getCfg();
        SceneLogin.instance.show();
    }
    private onLoadCfgProgress(progress: any) {
        console.log("onLoadCfgProgress progress: " + progress)
    }
}
new GameMain();