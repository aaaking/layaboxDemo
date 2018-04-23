/*
*  @author seacole
* 账号登录;
*/
class AccountLoginCtrl extends BaseCtrl {
    constructor() {
        super();
    }

    protected _ui: ui.panel.AccountLoginUI;

    private static _instance: AccountLoginCtrl;
    public static get instance(): AccountLoginCtrl {
        if (!this._instance)
            this._instance = new AccountLoginCtrl();
        return this._instance;
    }

    public show(): void {
        this.showself();
    }

    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.AccountLoginUI();
            this._ui._inputPassword.type = "password";
            EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._btnLogin, Laya.Event.CLICK, this, this.onTouch);
        }
        super.beforeShow();
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow();
        LoadingUI.instance.hide();
        this.tweenSelf();
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

    protected onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._ui._btnLogin:
                if (!this._ui._inputAccount.text)
                    HintCtrl.instance.show(GameConfig.language.account_input_fail1);
                else if (!this._ui._inputPassword.text)
                    HintCtrl.instance.show(GameConfig.language.account_input_fail2);
                else
                    // LoginManager.instance.passportLogin(this._ui._inputAccount.text, this._ui._inputPassword.text);
                    AppControl.getInstance().showPage(MenuPage)
                break;

            case this._ui._close:
                this.hide();
                break;
        }
    }

}