/**
* @author seacole
* 程序入口
*/
class LayaAir3D {
    constructor() {
        //初始化引擎
        // Laya3D.init(960, 640, true);
        Laya.init(640, 960, Laya.WebGL);
        Laya.stage.bgColor = "#ffffff";
        Laya.Stat.show(100,0);
        //适配模式
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;

        if (Laya.Browser.window.conchConfig)
            NativeHelper.instance.init();

        Native.instance.getDeviceUUID((args: any) => {
            webService.uuid = args.uuid;
            log(args);
        }, "");
        AppControl.getInstance().start(Laya.stage);
        Dispatcher.init();
        AppControl.getInstance().AppStage.registUnauthorized();
        this.loadManifest();

        // if (Laya.Browser.window.loadingView) {
        //     Laya.Browser.window.conch.showLoadingView(false);
        // }
    }

    // layacmd resourceVersion -i res -o . -n 1.0.0
    /**
     * 版本管理
     */
    private _manifestUrl: string = "manifest.json?" + Math.random();
    private loadManifest(): void {
        Laya.ResourceVersion.enable(this._manifestUrl, Laya.Handler.create(this, this.onLoadManifestComplete));
    }

    private onLoadManifestComplete(): void {
        this.loadUrlConfig();
    }

    /**
     * 加载url配置信息
     */
    private loadUrlConfig(): void {//+"?v="+GameConfig.randomNum
        GameConfig.randomNum = Math.random();
        Laya.loader.load([{ url: ResourceConfig.URL_CONFIG, type: Laya.Loader.JSON }], Laya.Handler.create(this, this.onLoadUrlConfigComplete));
    }

    private onLoadUrlConfigComplete(): void {
        GameConfig.getCfg();

        Reportor.instance.start();
        this.loadPreload();
    }

    /**
    * 加载Preload LOADING界面所需资源
    */
    private loadPreload(): void {
        PreLoadingUI.instance.show([{ url: ResourceConfig.SHEET_PRELOAD, type: Laya.Loader.ATLAS }], PreLoadingUI.instance, PreLoadingUI.instance.onShowDetail);
        Dispatcher.on(EventNames.PRELOADING_FINISH, this, this.onLoadPreloadComplete);
    }

    /**
    * Preload加载完成
    */
    private onLoadPreloadComplete(): void {
        log("prload load success");
        Dispatcher.off(EventNames.PRELOADING_FINISH, this, this.onLoadPreloadComplete);
        Native.instance.getIOSType(() => {
            this.init();
            this.loadCfg();
        });
    }

    /**
     * 各种初始化
     */
    private init(): void {
        ProtoIDs.init();
        GameLogic.init();
        EffectManager.instance.init();
        FontManager.instance.init();
        MaskManager.instance.init();
        LineRendererManager.instance.init();
        View.regComponent("BaseButton", component.BaseButton);
        View.regComponent("ScaleButton", component.ScaleButton);
        View.regComponent("State4Button", component.State4Button);
        View.regComponent("BasePlayer", component.BasePlayer);

        NativeHelper.instance.wxSetAppId(GameConfig.WX_APPID);
        Native.instance.iapSetVerifyUrl(GameConfig.WEB_SERVICE_URL + "/pay/iap/verify");
    }

    /** 
     * 加载配置文件。
     */
    private loadCfg(): void {
        PreLoadingUI.instance.show([{ url: ResourceConfig.LANG, type: Laya.Loader.JSON }, { url: ResourceConfig.CONFIG_AUDIO, type: Laya.Loader.JSON },
        { url: ResourceConfig.CONFIG_GAME_LIST, type: Laya.Loader.JSON }, { url: ResourceConfig.BG_LOADING, type: Laya.Loader.IMAGE },
        { url: ResourceConfig.SHEET_LOADING, type: Laya.Loader.ATLAS }, { url: ResourceConfig.BG_MENU, type: Laya.Loader.IMAGE }],
            this, this.onLoadLangComplete);
    }
    /**
     * 语言包加载成功callback。
     */
    private onLoadLangComplete(): void {
        log("lang load success");
        PreLoadingUI.instance.clearTime();
        GameConfig.init();
        this.onGetUrlComplete();
    }
    /**
    * URL配置加载完成
    */
    private onGetUrlComplete(): void {
        this.ctrlRegister();
    }

    /**
    * control注册
    */
    private ctrlRegister(): void {
        // var arrMenuPage = [{ url: ResourceConfig.SHEET_MENU, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_ICON, type: Laya.Loader.ATLAS }];
        // var arrLoginPage = [{ url: ResourceConfig.SHEET_LOGIN, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_TONGYONG, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_GAME_NAME, type: Laya.Loader.ATLAS }];
        // var arrTablePage = [{ url: ResourceConfig.SHEET_TABLE, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_GAME_LOGO, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_CHAT, type: Laya.Loader.ATLAS }, { url: ResourceConfig.BG_TABLE, type: Laya.Loader.IMAGE },
        // { url: ResourceConfig.BITMAP_FONT_WAKENG1_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_WAKENG1_PNG, type: Laya.Loader.IMAGE }
        //     , { url: ResourceConfig.SHEET_PLAY_SHEET, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_DIALOG, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.BITMAP_FONT_MENU1_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_MENU1_PNG, type: Laya.Loader.IMAGE },
        // { url: ResourceConfig.BITMAP_FONT_MENU2_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_MENU2_PNG, type: Laya.Loader.IMAGE }];
        // var arrMJPage = arrTablePage.concat([{ url: ResourceConfig.SHEET_OPT, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_TIME_LIMIT, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_CARD, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_CARD_1, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_CARD_2, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_CARD_3, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_CARD_4, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_CARD_5, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_DICE, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_GAME_END, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_TING, type: Laya.Loader.ATLAS }
        // ]);
        // var arrPokerPage = arrTablePage.concat([{ url: ResourceConfig.SHEET_POKER_CARD_BIG, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_POKER_CARD_SMALL, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_POKER, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_GAME_END, type: Laya.Loader.ATLAS }]);
        // var arrWaKengPage = arrPokerPage.concat([{ url: ResourceConfig.SHEET_WAKENG, type: Laya.Loader.ATLAS }, { url: ResourceConfig.BITMAP_FONT_WAKENG2_JSON, type: Laya.Loader.JSON },
        // { url: ResourceConfig.BITMAP_FONT_WAKENG2_PNG, type: Laya.Loader.IMAGE }, { url: ResourceConfig.BITMAP_FONT_WAKENG3_JSON, type: Laya.Loader.JSON },
        // { url: ResourceConfig.BITMAP_FONT_WAKENG3_PNG, type: Laya.Loader.IMAGE }, { url: ResourceConfig.SHEET_EFFECT_BOOM, type: Laya.Loader.ATLAS },
        // { url: ResourceConfig.SHEET_EFFECT_SHUANGSHUN, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_EFFECT_DANSHUN, type: Laya.Loader.ATLAS }]);
        // var totalData = GameConfig.cfgH5Effect;
        // for (var i in totalData) {
        //     var scene: number = parseInt(totalData[i].scene);
        //     var res: string = totalData[i].res;
        //     var type: number = totalData[i].type;
        //     var arr;
        //     switch (scene) {
        //         case ResourceConfig.MenuPage_SCEEN:
        //             arr = arrMenuPage;
        //             break;
        //         case ResourceConfig.LoginPage_SCEEN:
        //             arr = arrLoginPage;
        //             break;
        //         case ResourceConfig.GamePage_SCEEN:
        //             arr = arrGamePage;
        //             break;
        //         default:
        //             break;
        //     }
        //     if (type == 2)
        //         arr.push({ url: totalData[i].url, type: Laya.Loader.JSON });
        //     else if (res != '')
        //         arr.push({ url: totalData[i].res, type: Laya.Loader.ATLAS });
        // }

        // AppPage.register(MenuPage, arrMenuPage);
        // AppPage.register(LoginPage, arrLoginPage);
        // AppPage.register(TablePage, arrTablePage);
        // AppPage.register(BaseMJPage, arrMJPage);
        // AppPage.register(WaKengPage, arrWaKengPage);
        // AppPage.register(ShanXiMjPage, arrMJPage);


        // AlertCtrl.instance.start([]);
        var i: number;
        AlertInGameCtrl.instance.start([{ url: ResourceConfig.SHEET_TONGYONG, type: Laya.Loader.ATLAS }]);
        CreateTableCtrl.instance.start([{ url: ResourceConfig.SHEET_CREATE_TABLE, type: Laya.Loader.ATLAS }]);
        JoinTableCtrl.instance.start([{ url: ResourceConfig.SHEET_JOIN_TABLE, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.BITMAP_FONT_JOINTABLE1_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_JOINTABLE1_PNG, type: Laya.Loader.IMAGE },
        { url: ResourceConfig.BITMAP_FONT_JOINTABLE2_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_JOINTABLE2_PNG, type: Laya.Loader.IMAGE }]);
        ReportCtrl.instance.start([{ url: ResourceConfig.SHEET_REAL_TIME, type: Laya.Loader.ATLAS }]);
        GameEndCtrl.instance.start([{ url: ResourceConfig.SHEET_GAME_END, type: Laya.Loader.ATLAS }]);
        ChatCtrl.instance.start([{ url: ResourceConfig.SHEET_CHAT, type: Laya.Loader.ATLAS }]);
        SetupCtrl.instance.start([{ url: ResourceConfig.SHEET_SETUP, type: Laya.Loader.ATLAS }]);
        TableEndCtrl.instance.start([{ url: ResourceConfig.SHEET_GAME_NAME, type: Laya.Loader.ATLAS }]);
        ShopVCtrl.instance.start([{ url: ResourceConfig.SHEET_SHOP, type: Laya.Loader.ATLAS }, { url: ResourceConfig.BITMAP_FONT_SHOP1_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_SHOP_PNG, type: Laya.Loader.IMAGE }]);
        ShopHCtrl.instance.start([{ url: ResourceConfig.SHEET_SHOP, type: Laya.Loader.ATLAS }, { url: ResourceConfig.BITMAP_FONT_SHOP1_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_SHOP_PNG, type: Laya.Loader.IMAGE }]);
        UpdateCtrl.instance.start([{ url: ResourceConfig.SHEET_TONGYONG, type: Laya.Loader.ATLAS }]);
        club.ClubCtrl.instance.start([{ url: ResourceConfig.SHEET_CLUB, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_JOIN_TABLE, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.BITMAP_FONT_JOINTABLE1_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_JOINTABLE1_PNG, type: Laya.Loader.IMAGE },
        { url: ResourceConfig.BITMAP_FONT_JOINTABLE2_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_JOINTABLE2_PNG, type: Laya.Loader.IMAGE }]);
        // var helpArr: Array<any> = [{ url: ResourceConfig.SHEET_HELP, type: Laya.Loader.ATLAS }];
        // for (i = 0; i < GameConfig.GAMES.length; i++) {
        //     var type: number = GameDef.getGameTypeByGameName(GameConfig.GAMES[i]);
        //     if (type)
        //         helpArr.push("res/rule/ruler_" + type + ".png");
        // }
        // HelpCtrl.instance.start(helpArr);
        var matchSignArr: Array<any> = [{ url: ResourceConfig.SHEET_MATCHSIGN, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_TONGYONG, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_JOIN_TABLE, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_CREATE_TABLE, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.BITMAP_FONT_JOINTABLE1_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_JOINTABLE1_PNG, type: Laya.Loader.IMAGE },
        { url: ResourceConfig.BITMAP_FONT_JOINTABLE2_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_JOINTABLE2_PNG, type: Laya.Loader.IMAGE },
        { url: ResourceConfig.BITMAP_FONT_MATCHSIGN1_JSON, type: Laya.Loader.JSON }, { url: ResourceConfig.BITMAP_FONT_MATCHSIGN1_PNG, type: Laya.Loader.IMAGE }];
        matchSign.MatchSignCtrl.instance.start(matchSignArr);
        matchSign.MatchSignCreateCtrl.instance.start(matchSignArr);
        matchSign.MatchSignInfoCtrl.instance.start(matchSignArr);
        MatchHistoryCtrl.instance.start(matchSignArr);

        //加载位图字体
        Dispatcher.on(EventNames.FONT_BITMMAP, this, this.loadProto);
        FontBitmapManger.instance.loadFontArr();

    }

    /**
     * 加载PTOTO BUFFER
     */
    private loadProto(): void {
        Laya.Browser["window"].protobuf.load([ResourceConfig.PROTO_GAME + "?v=" + Math.random()], this.onProtoLoaded.bind(this));
    }

    /**
     * 加载PTOTO BUFFER完成
     */
    private onProtoLoaded(err: any, root: any): void {
        server.initData(root);
        this.createGameScene();
    }

    /**
    * 初始化完毕，创建场景
    */
    private createGameScene(): void {
        Native.instance.setBatteryCallback();
        Native.instance.setGroundCallback();
        Native.instance.checkUpdata();
        GameConfig.getShopCfg();
        var isAutoLogin: boolean = LoginManager.instance.orderedLogin(true);
        if (!isAutoLogin)
            AppControl.getInstance().showPage(LoginPage, LoginPage.PARAMS0_FIRST_ENTER);
    }
}
new LayaAir3D();