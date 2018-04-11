class UITools {
    static canvasWidth = 1280
    static canvasHeight = 720
    private constructor() {
    }
    private static _instance: UITools;
    public static get instance(): UITools {
        if (!this._instance)
            this._instance = new UITools();
        return this._instance;
    }
    static changeGray(sprite: Laya.Sprite) {
        //由 20 个项目（排列成 4 x 5 矩阵）组成的数组，灰图
        var grayscaleMat: Array<number> = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];
        //创建一个颜色滤镜对象，灰图
        var grayscaleFilter: Laya.ColorFilter = new Laya.ColorFilter(grayscaleMat);
        // 灰度猩猩
        sprite.filters = [grayscaleFilter];
    }
    static resetGray(sprite: Laya.Sprite) {
        sprite.filters = null;
    }

    static loadResources(callback, caller): any {
        Laya.loader.load([
            { url: "config/hero.json", type: Laya.Loader.JSON },
            { url: ResourceConfig.comp, type: Laya.Loader.ATLAS },
            { url: ResourceConfig.star, type: Laya.Loader.ATLAS },
            { url: ResourceConfig.menu, type: Laya.Loader.ATLAS },
            { url: ResourceConfig.cards, type: Laya.Loader.ATLAS },
            { url: ResourceConfig.cardsname, type: Laya.Loader.ATLAS },
            { url: LangMgr.mLang, type: Laya.Loader.JSON },
            { url: ResourceConfig.showcards, type: Laya.Loader.ATLAS },
            menu.SceneMenu.bgMenu,
            "star/title_3.png",
            "star/title_4.png",
            "star/title_5.png",
            "star/title_6.png",
            "star/title_7.png",
            "star/title_8.png",
            "star/title_9.png",
            "star/title_10.png",
            menu.SceneMenu._skinOpenCard,
            menu.SceneMenu._skinMyCard,
            menu.SceneMenu.BG,
            menu.SceneMenu.BG2,
            menu.SceneMenu.cards_bottom,
            menu.SceneMenu._skinExchange],
            Laya.Handler.create(caller, function () {
                LangMgr.instance
                GameConfig.getCfg()
                callback()
            }))
    }
}