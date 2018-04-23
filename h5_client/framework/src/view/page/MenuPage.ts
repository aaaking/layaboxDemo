/*
* @author seacole
* 大厅界面;
*/
class MenuPage extends AppPage {
    constructor() {
        super();
        this._loadDatas = this._loadDatas.concat([{ url: ResourceConfig.SHEET_GAMEICON, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_MENU, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_CREATE_TABLE, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.BG_MENU, type: Laya.Loader.IMAGE }, { url: ResourceConfig.SHEET_TONGYONG, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_GAME_NAME, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.PART_MENU_BG, type: Laya.Loader.JSON }, { url: ResourceConfig.PART_MENU_BG2, type: Laya.Loader.IMAGE }]);
        if (GameConfig.IS_BANSHU)
            this._loadDatas = this._loadDatas.concat([{ url: ResourceConfig.SHEET_BANSHU, type: Laya.Loader.ATLAS }]);
        let games = GameDef.currentGames
        for (var k in games) {
            let v = games[k]
            this._loadDatas.push({ url: "res/menu/create_" + v + ".png", type: Laya.Loader.IMAGE })
        }

        AppPage.register(MenuPage, this._loadDatas);
        this.name = "MenuPage";
        this.screenMode = Laya.Stage.SCREEN_VERTICAL;
        Laya.stage.bgColor = "#000000";
        Dispatcher.on("show_share", this, this.showShare.bind(this));
    }

    private _menuUi: ui.page.MenuUI;
    private _tabLobby: MenuLobbyUI;
    private _tabFind: MenuFindUI;
    private _tabScore: MenuScoreUI;
    private _tabPerson: MenuPersonUI;
    private _tabs: Array<Laya.View>;
    private _partBg: Laya.Particle2D;

    protected createChild(): void {
        super.createChild();
    }

    public destroy(): void {
        super.destroy();
        if (this._partBg) {
            if (!Native.instance.isNative)
                this._partBg.emitter.stop();
            this._partBg.stop();
        }
        if (this._tabs) {
            for (var i: number = 0; i < this._tabs.length; i++) {
                if (this._tabs[i])
                    this._tabs[i]["removeListener"]();
            }
        }
        AnnounceManager.instance.stop();
        Laya.timer.clear(this, this.catlikeLoad);
        Laya.timer.clear(this, this.refreshInfo);
        this.stopTimer();
    }

    protected init(...params): void {
        super.init();
        AppControl.getInstance().AppStage.registUnauthorized();
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        AppControl.getInstance().stage.width = 640;
        if (!this._menuUi) {
            this._menuUi = new ui.page.MenuUI();
            // this._tabLobby = new MenuLobbyUI();
            this._tabFind = new MenuFindUI();
            this._tabScore = new MenuScoreUI();
            this._tabPerson = new MenuPersonUI();

            this._menuUi.addChild(this._tabPerson);
            this._menuUi.addChild(this._tabScore);
            this._menuUi.addChild(this._tabFind);
            this._menuUi._tab.zOrder = 2
            this._tabPerson.zOrder = 1
            this._tabScore.zOrder = 1
            this._tabFind.zOrder = 1
            this._menuUi._mask.zOrder = 3;
            this._menuUi._shareBg.zOrder = 4;

            MarqueeText.instance.selfParent = this._tabFind;

            // this._menuUi.addChildAt(this._tabLobby, 2);
            // this._tabs = [this._tabLobby, this._tabFind, this._tabScore,this._tabPerson];
            this._tabs = [this._tabFind, null, this._tabScore, this._tabPerson];
            EventManager.instance.registerOnObject(this, this._menuUi, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._menuUi._tab, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._menuUi._wechat, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._menuUi._pyq, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.MATCH_START_WARN, this, this.onMatchWarn);

            // EventManager.instance.registerOnObject(this, this._menuUi._btnDdz, Laya.Event.CLICK, this, this.onTouch);
            // EventManager.instance.registerOnObject(this, this._menuUi._btnMj, Laya.Event.CLICK, this, this.onTouch);
            // EventManager.instance.registerOnObject(this, this._menuUi._btnJoin, Laya.Event.CLICK, this, this.onTouch);
            var part = new ParticleEffect();
            var effectData: EffectData = new EffectData();
            effectData.loop = true;
            effectData.url = ResourceConfig.PART_MENU_BG;
            effectData.posX = this._menuUi.width * 0.5;
            this._partBg = part.show(effectData);
            this._partBg.rotation = 200;
            this._menuUi.addChildAt(this._partBg, 2);



            Native.instance.deepLinkCallback();
        }
        if (!Native.instance.isNative){
            this._partBg.emitter.start();
            WxWeb.instance.onShare()    
        }
        this._menuUi._mask.visible = false;
        this._partBg.play();
        this.addView(this._menuUi);

        if (this._tabScore.lastGInfo)
            this._menuUi._tab.selectedIndex = 2;
        else if (club.ClubCtrl.instance.lastCid)
            this._menuUi._tab.selectedIndex = 1;
        else
            this._menuUi._tab.selectedIndex = 0;
        this.checkTab();
        Native.instance.checkNewVer();
        AnnounceManager.instance.start();

        if (matchSign.MatchSignData.backCode) {
            webService.joinTable(String(matchSign.MatchSignData.backCode), (response: any) => {
                if (response.code == 0) {
                    GameConfig.setServerUrl(response.ip);
                    GameConfig.joinTable(response);
                }
            });
        }

        if (params && params.length && params[0].match_code) {
            matchSign.MatchSignInfoCtrl.instance.show(params[0].match_code);
        }
        else if (params && params.length && params[0].room_code) {
            LoginManager.instance.checkJoinTable();
        }
        //比赛出来的返回到比赛列表
        else if (GameConfig.IS_MATCH){
             matchSign.MatchSignCtrl.instance.show();
        }
        else
            this.getMatchList();
    }

    protected layoutChild(): void {
        super.layoutChild();
        SoundManager.instance.playBg("bg1");
        for (var i: number = 0; i < this._tabs.length; i++) {
            if (this._tabs[i])
                this._tabs[i]["addListener"]();
        }
        Laya.timer.once(5000, this, this.catlikeLoad);

        Laya.timer.frameOnce(3, this, this.refreshInfo);


        // var t:Array<number>=guanpai.GuanPaiCardsType.getType([50, 52, 53, 60, 61, 62, 70],true,8);
        // log("牌型1："+t) ;
        //  var t:Array<number>=guanpai.GuanPaiCardsType.getType([130,131,132,133,140,141,142,70],true);
        // log("牌型2："+t) ;
        //  var t:Array<number>=guanpai.GuanPaiCardsType.getType([130,131,132,133,70],true);
        // log("牌型3："+t) ;

        // var helper:Array<Array<number>>=guanpai.GuanPaiCardsType.getHelper([51,52,53,61,62,63,31,32,33],[42,41,61,71,81,82,91,100,101,102,103,111,112,113,121,131,132,133,140,141,142],true);
        // log(helper);
        // var helper:Array<Array<number>>=guanpai.GuanPaiCardsType.getHelper([51,52,53,61,62,63,31,32,33],[140,141,142],true);
        // log(helper);
        // var helper:Array<Array<number>>=guanpai.GuanPaiCardsType.getHelper([51,52,53,61,62,63,31,32,33],[120,121,122,130,131,132,133,140],true);
        // log(helper);

        // var helpCards: Array<Array<number>> = guanpai.GuanPaiCardsType.getHelper([30, 31, 41, 42, 43], [141, 142, 143, 91, 92], guanpai.GuanPaiGameData.isBoomAAA);
        // log(helpCards);
        // var helper: boolean = guanpai.GuanPaiCardsType.checkCanUse([30, 31, 32, 40, 41, 42, 43], [141, 142, 143, 91, 92], true, 5, helpCards);
        // log(helper);
        // var helper: boolean = guanpai.GuanPaiCardsType.checkCanUse([30, 31, 41, 42, 43], [141, 142, 143, 91, 92], true, 5, helpCards);
        // log(helper);
    }

    private refreshInfo(): void {
        // GameLogic.selfData.getInfo(true);
        GameLogic.selfData.startQuery();
    }

    public loadRes(key: string, ...params): void {
        this.playBgm();
        this.initParams = params[0];
        if (AppPage._loadData[key]) {
            if (PreLoadingUI.instance.parent)
                PreLoadingUI.instance.show(AppPage._loadData[key], this, this.loadComplete);
            else
                LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, AppPage._loadData[key], this, this.loadComplete);
        }
        else
            this.loadComplete();
    }

    protected loadComplete(): void {
        AppControl.getInstance().AppStage.clear();
        AppControl.getInstance().screenMode = this.screenMode;
        this.addToStage.apply(this, this.initParams);
        this.updateDisplayObjectList();
        PreLoadingUI.instance.hide();
        LoadingUI.instance.hide();
    }

    protected onResize(): void {
        this._menuUi.width = AppControl.getInstance().stage.width;
        this._menuUi.height = AppControl.getInstance().stage.height > 1280 ? 1280 : AppControl.getInstance().stage.height;
        this._menuUi.centerY = AppControl.getInstance().stage.height > 1280 ? 1 : 0
        this._partBg.x = this._menuUi.width * 0.5;
        this._partBg.y = -50;
        this.setTabPos();
        // this._tabLobby.width = AppControl.getInstance().stage.width;
        AppControl.getInstance().resetScreen();
    }

    //左右各留50. tab的宽度为屏幕宽度，最大为640，居中显示
    private setTabPos(): void {
        this._menuUi._tab.width = AppControl.getInstance().stage.width;
        if (this._menuUi._tab.width > 640)
            this._menuUi._tab.width = 640;
        // var tab1: Laya.Button = this._menuUi._tab.getChildAt(0) as Laya.Button;
        // var w: number = tab1.width;
        // var left: number = 50;
        // var len: number = this._menuUi._tab.numChildren;
        // var dis: number = (this._menuUi._tab.width - left * 2 - w * 4) * 0.33;
        // for (var i = 0; i < len; i++) {
        //     (this._menuUi._tab.getChildAt(i) as Laya.Button).x = left + (w + dis) * i;
        // }
    }

    /**
    * 鼠标点击事件
    */
    private onTouch(e: Laya.Event) {
        switch (e.currentTarget) {
            case this._menuUi._tab:
                if (this._tabScore.visible && this._tabScore.isDetailShowing) {
                    this._menuUi._tab.selectedIndex = 2;
                    return;
                }

                this._tabScore.clearLastInfo();
                this.checkTab();
                break;

            case this._menuUi._wechat:
                Native.instance.share(1, 0);
                break;

            case this._menuUi._pyq:
                Native.instance.share(1, 1);
                break;
        }
        if (this._menuUi._shareBg.bottom == 0) {
            switch (e.target) {
                case this._tabFind:
                case this._tabScore:
                case this._tabPerson:
                case this._menuUi._mask:
                    this._menuUi._shareBg.bottom = -185
                    this._menuUi._shareBg.alpha = 0
                    this._menuUi._mask.visible = false;
                    break;
            }
        }
    }

    private showShare() {
        this._menuUi._mask.visible = true;
        Laya.Tween.to(this._menuUi._shareBg, { bottom: 0, alpha: 1 }, 150)
        var buffer = new  Laya.Browser.window.Bytebuffer()
        buffer.atob("")
    }

    private _curretnSelectIdx: number;
    private checkTab(): void {
        // if (this._curretnSelectIdx==this._menuUi._tab.selectedIndex)
        //     return;
        this._curretnSelectIdx = this._menuUi._tab.selectedIndex;
        if (this._tabs[this._curretnSelectIdx] == this._tabScore)
            this._tabScore.getFirstPage();


        // this._tabLobby.visible = selectIdx == 0;
        let toCenterX = this._menuUi["_item" + this._curretnSelectIdx].centerX
        this._tabFind.visible = this._curretnSelectIdx == 0;
        this._tabScore.visible = this._curretnSelectIdx == 2;
        this._tabPerson.visible = this._curretnSelectIdx == 3;
        if (this._tabScore.visible)
            this._tabScore.currentTag = MenuScoreUI.TAG_LIST;
        if (this._curretnSelectIdx == 1)
            club.ClubCtrl.instance.show(this._menuUi);
        else
            club.ClubCtrl.instance.hide();
    }

    private catlikeLoad(): void {
        Laya.loader.load([{ url: ResourceConfig.SHEET_CREATE_TABLE, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_GAME_END, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_CHAT, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_SETUP, type: Laya.Loader.ATLAS }]);
    }

    private getMatchList(): void {
        matchSign.MatchSignData.getMatchList();
        this.startTimer();
    }

    private startTimer(): void {
        this.stopTimer();
        Laya.timer.loop(10 * 1000, this, this.onTimer);
    }

    private stopTimer(): void {
        Laya.timer.clear(this, this.onTimer);
    }

    private onTimer(): void {
        if (!matchSign.MatchSignInfoCtrl.instance.parent && !matchSign.MatchSignCtrl.instance.parent)
            matchSign.MatchSignData.getStatus();
    }

    private onMatchWarn(match: any, type: number): void {
        if (!matchSign.MatchSignInfoCtrl.instance.parent) {
            if (!matchSign.MatchSignData._matchWarn[type][match.code]) {

                matchSign.MatchSignData._matchWarn[type][match.code] = true;
                AlertInGameCtrl.instance.show(StringUtils.format(GameConfig.language.match_start_warn[type], match.mrule.title), (value: number) => {
                    if (value == AlertCtrl.CONFIRM) {
                        webService.joinTable(String(match.code), (response: any) => {
                            if (response.code == 0) {
                                GameConfig.setServerUrl(response.ip);
                                GameConfig.joinTable(response);
                            }
                        });
                    }
                }, 0, true, "提示", null, ["tongyong/tongyong_btn_qianwang.png"]);
            }
        }
    }
}