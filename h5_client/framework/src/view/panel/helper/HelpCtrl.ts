/*
* @author seacole
 * 帮助页面
*/
class HelpCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "HelpCtrl";
    }

    private static _instance: HelpCtrl;
    public static get instance(): HelpCtrl {
        if (!this._instance)
            this._instance = new HelpCtrl();
        return this._instance;
    }

    protected _ui: ui.panel.HelperUI;
    private cfg: any;
    private _isMatch: boolean;
    private _ids: Array<number>;
    public show(isMatch: boolean, ids: Array<number>): void {
        if (ids && ids.length) {
            this._isMatch = isMatch;
            this._ids = ids;
            this.showself();
        }
    }

    /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.HelperUI();
            EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
            this._ui._close.on(Laya.Event.CLICK, this, this.hide);
            this._ui._panel.vScrollBar.visible = false;
            this._ui._panTab.hScrollBar.visible = false;
        }
        super.beforeShow();
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow();
        if (this._ids.length > 1) {
            this._ui._panel.top = 154;
            this._ui._panTab.visible = true;
            this._ui._tab.removeChildren();
            this._ui._tab.initItems();
            for (var i: number = 0; i < this._ids.length; i++) {
                var btn: component.BaseButton = new component.BaseButton();
                btn.skin = "tongyong/tongyong_help_btn.png";
                btn.stateNum = 3;
                btn.label = GameConfig.language.game_name[this._ids[i]];
                btn.labelColors = "#674422,#674422,#9b5036";
                btn.labelSize = 24;
                btn.name = "item" + i;
                this._ui._tab.addItem(btn);
                btn.x = (btn.width + 10) * i;
            }
            this._ui._tab.selectHandler = new Laya.Handler(this, this.checkTab);
        }
        else {
            this._ui._panel.top = 98;
            this._ui._panTab.visible = false;
        }
        this._ui._tab.selectedIndex = 0;
        this.checkTab();
        this.tweenSelf();
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

    private checkTab(): void {
        this._ui._img.on(Laya.Event.LOADED, this, this.onComplete);
        if (this._isMatch)
            this._ui._img.skin = "res/rule/ruler_match_" + this._ids[this._ui._tab.selectedIndex] + ".png";
        else
            this._ui._img.skin = "res/rule/ruler_" + this._ids[this._ui._tab.selectedIndex] + ".png";
        // this._ui._panel.vScrollBar.stopScroll();
        // this._ui._panel.vScrollBar.setScroll(0, this._ui._img.height - this._ui._panel.height, 0);
    }

    private onComplete(e:any): void {
        // log("onComplete");
        this._ui._panel.vScrollBar.stopScroll();
        this._ui._panel.vScrollBar.setScroll(0, this._ui._img.height - this._ui._panel.height, 0);
    }

}