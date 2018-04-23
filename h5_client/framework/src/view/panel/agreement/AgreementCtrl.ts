/*
* @author seacole
 * 帮助页面
*/
class AgreementCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "AgreementCtrl";
    }

    private static _instance: AgreementCtrl;
    public static get instance(): AgreementCtrl {
        if (!this._instance)
            this._instance = new AgreementCtrl();
        return this._instance;
    }

    protected _ui: ui.panel.AgreeMentUI;
    private iHtml: Laya.HTMLIframeElement;
    public show(): void {
        this.showself();
    }

    /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.AgreeMentUI();
            EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
            // EventManager.instance.registerOnObject(this, this._ui._tab, Laya.Event.CLICK, this, this.checkTab);
            this._ui._close.on(Laya.Event.CLICK, this, this.hide);
            this._ui._panel.vScrollBar.visible = false;
            // this._ui._lab.style.fontSize = 18;
            // this._ui._lab.color = "#925b3d";
            // this._ui._lab.style.leading = 10;

            this.iHtml = new Laya.HTMLIframeElement();//span.normal {color : #925b3d;font-size : 24;font-family:"PingFangSC-Ruglar";line-height:18px}
            this.iHtml.style.fontSize=24;
             this.iHtml.style.color="#925b3d";
              this.iHtml.style.fontFamily="PingFangSC-Ruglar";
              this.iHtml.style.leading=20;
            this._ui._panel.addChild(this.iHtml);
            this.iHtml.width = this._ui._panel.width;
            this.iHtml.href = "res/html/agreement.html";
            Laya.timer.loop(300, this, this.onLoop);
            Laya.timer.once(60000, this, this.clearTimer);
            // this._ui.addChild(iHtml);

        }
        super.beforeShow();
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow();
        // this.tweenSelf();
        // if (!this.cfg)
        // this.cfg = Laya.loader.getRes(ResourceConfig.CONFIG_HELP);
        // this._ui._lab.innerHTML = this.cfg["0"];
        // this._ui._lab.size(this._ui._lab.width, this._ui._lab.contextHeight);

    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

    private onLoop(): void {
        if (this.iHtml.height > this._ui._panel.height) {
            this._ui._panel.vScrollBar.stopScroll();
            this._ui._panel.vScrollBar.setScroll(0, this.iHtml.height - this._ui._panel.height, 0);
            this.clearTimer();
        }
    }

    private clearTimer(): void {
        Laya.timer.clear(this, this.onLoop);
        Laya.timer.clear(this, this.clearTimer);
    }

}