/*
* @author seacole
* 我的页签;
*/
class MenuPersonUI extends ui.components.menu.MenuPersonUI {
    constructor() {
        super();
        this.name = "MenuPersonUI";
        this._head = new HeadUI();
        this._head.nameLimit = 20
        this._head.setImageBounds(110, 110)
        this._head.setLabName({ centerX: 12, y: 120, width : 200, align: "center", color: "#000000", fontSize: 26 });
        this._head.setLabInfo(HeadUI.TYPE_UID, { x: 0, y: 158, align: "center", color: "#bee7fe", fontSize: 26 });
        this._head.centerX = 0
        this._head.y = 50
        this.addChild(this._head);
        // this._btnBack.visible=!Native.instance.isWeiXin;

        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.REFRESH_ROLE_INFO, this, this.onRefreshRoleInfo);
        EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);
        EventManager.instance.registerOnObject(this, this._btnBack, Laya.Event.CLICK, this, this.onBack);
        EventManager.instance.registerOnObject(this, this._btnHelp, Laya.Event.CLICK, this, this.onHelp);
        EventManager.instance.registerOnObject(this, this._btnClub, Laya.Event.CLICK, this, this.onClub);
        EventManager.instance.registerOnObject(this, this._btnRecharge, Laya.Event.CLICK, this, this.onCharge);
        EventManager.instance.registerOnObject(this, this._btnSet, Laya.Event.CLICK, this, this.onSet);
        EventManager.instance.registerOnObject(this, this._btnShare, Laya.Event.CLICK, this, this.onShare);
        EventManager.instance.registerOnObject(this, this._btnShop, Laya.Event.CLICK, this, this.onCharge);
        EventManager.instance.registerOnObject(this, this._btnKefu, Laya.Event.CLICK, this, this.onKeFu);

        if (GameConfig.IS_BANSHU) {
            this._btnShare.removeSelf();
            this._btnKefu.removeSelf();
            this._btnSet.x = this._btnShare.x;
        }


    }


    private onKeFu() {
        KeFuCtrl.instance.show("本游戏仅供休闲娱乐使用，游戏中有任何问题请联系客服微信<br>微信号：ddyx18")
    }
    private onShare() {
        Dispatcher.dispatch("show_share");
    }

    private onSet() {
        SetupCtrl.instance.show(true)
    }

    private onCharge() {
        ShopCtrl.instance.show();
    }
    private _head: HeadUI;
    public addListener(): void {
        GameLogic.selfData.getInfo(true);

        EventManager.instance.enableOnObject(this);
        this.onResize();
    }

    public removeListener(): void {
        EventManager.instance.disableOnObject(this);
    }

    private onResize(): void {
        this.width = AppControl.getInstance().stage.width;
        this.height = AppControl.getInstance().stage.height - 80
    }

    private onRefreshRoleInfo(): void {
        this._head.data = GameLogic.selfData;
        this._diamond.text = StringUtils.format(GameConfig.language.diamond, GameLogic.selfData.diamond)
    }

    private onBack(e: Laya.Event): void {
        AppControl.getInstance().showPage(LoginPage);
    }

    private onHelp(e: Laya.Event): void {
        HelpCtrl.instance.show(false,GameDef.currentGames);
    }
    private _date : DateUI;

    private onClub(e: Laya.Event): void {
    }
}