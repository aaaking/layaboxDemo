/*
* @author seacole
* 登录界面;
*/
class LoginPage extends AppPage {
    constructor() {
        super();
        this._loadDatas = this._loadDatas.concat([
            { url: ResourceConfig.SHEET_LOGIN, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_TONGYONG, type: Laya.Loader.ATLAS },
            { url: ResourceConfig.SHEET_GAME_NAME, type: Laya.Loader.ATLAS }
        ]);
        AppPage.register(LoginPage, this._loadDatas);
        this.name = "LoginPage";
        this.screenMode = Laya.Stage.SCREEN_VERTICAL
    }

    public static PARAMS0_FIRST_ENTER = 1;

    private _loginUi: ui.page.LoginUI;
    protected createChild(): void {
        super.createChild();
    }

    public destroy(): void {
        super.destroy();
    }

    protected init(...params): void {
        super.init();
        Dispatcher.dispatch(EventNames.BACK_TO_LOGIN);
        GameLogic.selfData.clear();
        if (!this._loginUi) {
            this._loginUi = new ui.page.LoginUI();
            this._loginUi.width = AppControl.getInstance().stage.width;
            this._loginUi.height = AppControl.getInstance().stage.height;
            this._loginUi._imgLogo.skin = "login/login_logo_" + GameConfig.APPAREA + ".png";

            EventManager.instance.registerOnObject(this, this._loginUi._btnAccount, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._loginUi._btnGuest, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._loginUi._btnWx, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._loginUi._cheProtocol, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._loginUi._labProtocol, Laya.Event.CLICK, this, this.onTouch);

            this._loginUi._htmlTxt.width = 640;
            this._loginUi._htmlTxt.style.fontSize = 16;
            this._loginUi._htmlTxt.style.color = "#ffffff";
            this._loginUi._htmlTxt.style.leading = 4;
            this._loginUi._htmlTxt.style.letterSpacing = 3;
            this._loginUi._htmlTxt.style.valign = "middle";
            this._loginUi._htmlTxt.style.align = "center";
            // this._loginUi._htmlTxt.innerHTML = "抵制不良游戏，拒绝盗版游戏，注意自我保护，谨防受骗上当<br>适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活<br>本游戏仅供娱乐，禁止赌博，禁止以任何形式私下转账，<br>发红包赌博等非法行为，请文明健康游戏";
            this._loginUi._htmlTxt.innerHTML = "<span style='font-size:18'>抵制不良游戏，拒绝盗版游戏，注意自我保护，谨防受骗上当</span><br><span style='font-size:18'>适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活</span><br>新广出审[2018]885号  ISBN 978-7-498-04290-3<br>著作权人：杭州浩游科技有限公司<br>出版单位：杭州润趣科技有限公司"
            if (!GameConfig.IS_TEST) {
                if (!GameConfig.IS_IOS_EXAMINE && !GameConfig.IS_BANSHU) {
                    this._loginUi._btnGuest.removeSelf();
                    this._loginUi._btnAccount.removeSelf();
                }
                else
                    this._loginUi._btnWx.removeSelf();
            }

        }
        this.checkProtocol();
        this.addView(this._loginUi);
        this.setAllNoSee();
        Native.instance.checkNewVer();
        club.ClubManager.clearAll();
        // AppControl.getInstance().AppStage.registUnauthorized();

        var isAutoLogin: boolean = LoginManager.instance.orderedLogin(false);
        if (!isAutoLogin)
            this.LoginAccountVis = false;

        // LoadingUI.instance.show(2);
    }

    protected layoutChild(): void {
        super.layoutChild();


    }

    public loadRes(key: string, ...params): void {
        this.playBgm();
        this.initParams = params[0];
        if (AppPage._loadData[key]) {
            if (this.initParams && this.initParams.length && this.initParams[0] == LoginPage.PARAMS0_FIRST_ENTER)
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

    protected onResize(e: Laya.Event): void {
        this._loginUi.width = AppControl.getInstance().stage.width;
        this._loginUi.height = AppControl.getInstance().stage.height;
        this._loginUi._imgLogo.bottom = AppControl.getInstance().stage.height * 0.57;
        this._loginUi._btnWx.bottom = AppControl.getInstance().stage.height * 0.28;
        this._loginUi._box.bottom = this._loginUi._btnWx.bottom - this._loginUi._box.height - 20;
        this._loginUi._btnGuest.bottom = this._loginUi._btnWx.bottom;
        this._loginUi._btnAccount.bottom = this._loginUi._btnWx.bottom + this._loginUi._btnWx.height + 20;
        this._loginUi._htmlTxt.x = AppControl.getInstance().stage.width - this._loginUi._htmlTxt.width >> 1;
        this._loginUi._htmlTxt.y = AppControl.getInstance().stage.height - this._loginUi._htmlTxt.contextHeight - 35;
        AppControl.getInstance().resetScreen();
    }

    /**
     * 鼠标点击事件
     */
    private onTouch(e: Laya.Event) {
        switch (e.currentTarget) {
            case this._loginUi._btnAccount:
                AccountLoginCtrl.instance.show();
                // for (var i = 0; i < 100; i++) {
                //    LoginManager.instance.regist("zhc"+(i+100),"123456","zhc"+(i+100));

                // }

                break;

            case this._loginUi._btnGuest:
                LoginManager.instance.touristLogin();
                break;

            case this._loginUi._btnWx:
                if (Native.instance.isNative) {
                    LoginManager.instance.appWxLogin()
                } else {
                    Laya.Browser.window.location.href = webService.getWxLoginUrl();
                }
                break;

            case this._loginUi._cheProtocol:
                this.checkProtocol();
                break;

            case this._loginUi._labProtocol:
                AgreementCtrl.instance.show();
                break;
        }
    }

    private checkProtocol(): void {
        this._loginUi._btnWx.disabled = !this._loginUi._cheProtocol.selected;
        this._loginUi._btnAccount.disabled = !this._loginUi._cheProtocol.selected;
        this._loginUi._btnGuest.disabled = !this._loginUi._cheProtocol.selected;
    }

    /**
     * 设置游客登录的输入页面是否可见
     */
    private set LoginAccountVis(value: boolean) {
        this._loginUi._btnAccount.visible = !value;
        this._loginUi._btnWx.visible = !value;
        this._loginUi._btnGuest.visible = !value;
        this._loginUi._labProtocol.visible = !value;
        this._loginUi._cheProtocol.visible = !value;
    }

    private setAllNoSee() {
        this._loginUi._btnAccount.visible = false;
        this._loginUi._btnWx.visible = false;
        this._loginUi._btnGuest.visible = false;
        this._loginUi._labProtocol.visible = false;
        this._loginUi._cheProtocol.visible = false;
    }
}
