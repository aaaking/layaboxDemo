/*
* @author seacole
 * 设置
*/
class SetupCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "SetupCtrl";
    }

    private static _instance: SetupCtrl;
    public static get instance(): SetupCtrl {
        if (!this._instance)
            this._instance = new SetupCtrl();
        return this._instance;
    }

    protected _ui: ui.panel.SetupUI;
    private _hasBtnExit: boolean;
    public show(hasBtnExit: boolean): void {
        this._hasBtnExit = hasBtnExit;
        this.showself();
    }

    /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.SetupUI();
            // EventManager.instance.registerOnObject(this, this._ui._btnMusicOn, Laya.Event.CLICK, this, this.onTouch);
            // EventManager.instance.registerOnObject(this, this._ui._btnMusicOff, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._sliMusic, Laya.Event.CHANGED, this, this.onMusicChange);
            EventManager.instance.registerOnObject(this, this._ui._sliSound, Laya.Event.CHANGED, this, this.onSoundChange);
            // EventManager.instance.registerOnObject(this, this._ui._btnSound, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._btnExit, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._btnCardBigClose, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._btnCardBigOpen, Laya.Event.CLICK, this, this.onTouch);

            this._ui._labVerApp.text = "";
            this._ui._labVerRes.text = "";
            this._ui._sliMusic.showLabel = false;
            this._ui._sliMusic.allowClickBack = false;
            this._ui._sliSound.showLabel = false;
            this._ui._sliSound.allowClickBack = false;
            // this._ui._btnCardBigClose.hitArea = new Laya.Rectangle(95, 9, 75, 51);
            // this._ui._btnCardBigOpen.hitArea = new Laya.Rectangle(15, 9, 75, 51);

            if (Native.instance.isNative) {
                if (GameConfig.APP_VER)
                    this._ui._labVerApp.text = StringUtils.format(GameConfig.language.ver1, GameConfig.APP_VER);
                if (GameConfig.RES_VER)
                    this._ui._labVerRes.text = StringUtils.format(GameConfig.language.ver2, GameConfig.RES_VER);
            }
            else {
                if (GameConfig.RES_VER)
                    this._ui._labVerRes.text = StringUtils.format(GameConfig.language.ver3, GameConfig.RES_VER);
            }
        }
        super.beforeShow();
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow();
        this._ui._btnExit.visible = this._hasBtnExit;
        this._ui._boxBig.visible = BaseGameData.gameType && GameDef.isMaJiang(BaseGameData.gameType);


        this.checkBigCard();
        this.checkMusic();
        this.checkSound();
        this.tweenSelf();
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            // case this._ui._btnMusicOn:
            // case this._ui._btnMusicOff:
            //     SoundManager.instance.switchMusic();
            //     this.checkMusic();
            //     break;

            // case this._ui._btnSoundOn:
            // case this._ui._btnSoundOff:
            //     SoundManager.instance.switchEffect();
            //     this.checkSound();
            //     break;

            case this._ui._btnCardBigOpen:
                this._ui._btnCardBigOpen.visible = false;
                this._ui._btnCardBigClose.visible = true;
                GameConfig.bigcard = 1
                break;

            case this._ui._btnCardBigClose:
                this._ui._btnCardBigClose.visible = false;
                this._ui._btnCardBigOpen.visible = true;
                GameConfig.bigcard = 0
                break;

            case this._ui._close:
                this.hide();
                break;

            case this._ui._btnExit:
                AlertInGameCtrl.instance.show("确定退出登录", (code: number) => {
                    if (code == AlertCtrl.CONFIRM) {
                        server.code = "";
                        AppControl.getInstance().showPage(LoginPage);
                        server.close();
                    } else {

                    }
                });
                // server.code = "";
                // AppControl.getInstance().showPage(LoginPage);
                // server.close();
                break;
        }
    }

    private checkBigCard(): void {
        var value = GameConfig.bigcard
        this._ui._btnCardBigOpen.visible = value == 1 ? false : true
        this._ui._btnCardBigClose.visible = value == 1 ? true : false
    }

    private checkMusic(): void {
        var value: number = SoundManager.instance.musicVolume;
        this._ui._sliMusic.value = value * 100;
    }

    private checkSound(): void {
        var value: number = SoundManager.instance.soundVolume;
        this._ui._sliSound.value = value * 100;
    }

    private onMusicChange(e: Laya.Event): void {
        SoundManager.instance.musicVolume = this._ui._sliMusic.value / 100;
        // log(this._ui._sliMusic.value);
    }

    private onSoundChange(e: Laya.Event): void {
        SoundManager.instance.soundVolume = this._ui._sliSound.value / 100;
        // log(this._ui._sliMusic.value);
    }

}
