/*
* @author seacole
 * 加入桌子
*/
class JoinTableCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "JoinTableCtrl";
    }

    private static _instance: JoinTableCtrl;
    public static get instance(): JoinTableCtrl {
        if (!this._instance)
            this._instance = new JoinTableCtrl();
        return this._instance;
    }

    protected _ui: ui.panel.JoinTableUI;
    private _labs: Array<BPFont>;
    private _keyboard: KeyBoardNumUI;
    private _input: string;

    public show(): void {
        this.showself();
    }

    /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.JoinTableUI();

            var fontData: FontData = new FontData();
            fontData.init(FontConfig.FONT_JOIN_TABLE_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_JOINTABLE1_JSON),
                Laya.loader.getRes(ResourceConfig.BITMAP_FONT_JOINTABLE1_PNG), 70, BPFont.CENTER);

            this._labs = [];
            for (var i: number = 1; i <= 6; i++) {
                var bpFont: BPFont = FontManager.instance.addFont(fontData);
                this._ui["_img" + i].addChild(bpFont);
                bpFont.pos(0, 28);
                // bpFont.text="";
                this._labs.push(bpFont);
            }
            this._keyboard = new KeyBoardNumUI();
            this._keyboard.centerX = 0;
            this._keyboard.bottom = 40;
            this._ui._box.addChildAt(this._keyboard, this._ui.numChildren - 1);
        }
        super.beforeShow();
        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.KEYBOARD_NUM, this, this.onChanged);
        EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.onTouch);
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow();
        this._ui._lab.text = GameConfig.language.join_table_1;
        this._ui._boxTips.visible=false;
        this.clear();
        this.tweenSelf();
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

    private onChanged(key: string): void {
        var num: number;
        switch (key) {
            case "10":
                this._input = "";
                break;

            case "12":
                this._input = this._input.substr(0, this._input.length - 1);
                break;

            case "11":
                if (this._input.length >= 6)
                    return;
                this._input += "0";
                break;
            default:
                if (this._input.length >= 6)
                    return;
                this._input += key;
                break;
        }
        if (this._input.length > 6)
            this._input = this._input.substr(0, 6);
        var i: number;
        for (i = 0; i < 6; i++) {
            this._labs[i].text = "";
            this._labs[i].visible = false;
        }
        for (i = 0; i < this._input.length; i++) {
            this._labs[i].text = this._input[i];
            this._labs[i].visible = true;
        }

        if (this._input.length == 6) {
            this.join();
        }
        else{
            this._ui._lab.text = GameConfig.language.join_table_1;
            this._ui._boxTips.visible=false;
        }
            
    }

    private join(): void {
        if (this._input) {
            webService.joinTable(this._input, (response: any) => {
                if (response.code == 0) {
                    // this._ui._labRoom.focus = false;
                    GameConfig.setServerUrl(response.ip);
                    GameConfig.joinTable(response);
                    this.hide();
                }
                else {
                    // HintCtrl.instance.show(GameConfig.language.join_table_fail + " code:" + response.code);                    
                    this.clear();
                    // this._ui._lab.text = GameConfig.language.join_table_2;
                    this._ui._boxTips.alpha=0;
                    Laya.Tween.to(this._ui._boxTips, { alpha: 1 }, 500);
                    this._ui._boxTips.visible=true;
                    GameLogic.selfData.game_code = 0
                }
            });
        }
    }

    private onTouch(e:Laya.Event):void
    {
        switch(e.currentTarget)
        {
            case this._ui._close:
                this.hide();
                break;
        }
    }

    private clear(): void {
        this._input = "";
        var i: number;
        for (i = 0; i < 6; i++) {
            this._labs[i].text = "";
            this._labs[i].visible = false;
        }
    }

}