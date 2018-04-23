/*
* @author seacole
* 弱提示
*/
class HintCtrl {
    constructor() {

    }

    private _ui: ui.components.hint.HintUI;


    private static _instance: HintCtrl;
    public static get instance(): HintCtrl {
        if (!this._instance)
            this._instance = new HintCtrl();
        return this._instance;
    }

    public start(loadData: any): void {

    }

    /**
     * show
     * @param msg 具体内容
     */
    public show(msg: string): void {
        this.beforeShow({ msg });
    }

    /**
    * show
    * @param msg 具体内容
    */
    // public showById(id: number, params: Array<any> = null): void {
    //     this.beforeShow(U3dPosiUtils.getInfoFromU3dHint(id, params));
    // }

    private beforeShow(data: any): void {
        if (!this._ui) {
            this._ui = new ui.components.hint.HintUI();
        }
        this.onShow(data);
    }

    private onShow(data: any): void {
        Laya.Tween.clearTween(this._ui);
        this._ui._lab.width = AppControl.getInstance().stage.width - 40;
        this._ui.width = this._ui._lab.width;
        this._ui._lab.style.align = "center";
        if (data.hasOwnProperty("size") && data.size)
            this._ui._lab.style.fontSize = data.size;
        else
            this._ui._lab.style.fontSize = 24;

        this._ui._lab.style.color = "#ffffff";
        this._ui._lab.innerHTML = data["msg"];

        if (!this._ui.parent)
            AppControl.getInstance().addToPopup(this._ui);

        this._ui._back.width = this._ui._lab.contextWidth + 40;
        this._ui._back.height = this._ui._lab.contextHeight + 30;

        this._ui.x = AppControl.getInstance().stage.width - this._ui.width >> 1;
        this._ui.y = AppControl.getInstance().stage.height - 500;

        this._ui.alpha = 0;
        // var idArr: Array<number> = GameConfig.getConfigIdByEffectId(EffectConfig.EFFECT_HINT);
        // EffectManager.instance.addEffect(this._hint, idArr[0],'','',this._hint.width * 0.5, this._hint._lab.y+  this._hint._lab.contextHeight* 0.5);
        Laya.Tween.to(this._ui, { alpha: 1 }, 500, Laya.Ease.linearNone, Laya.Handler.create(this, this.step1));
        AppControl.getInstance().stage.on(Laya.Event.RESIZE, this, this.onResize);
    }

    private onResize(): void {
        this._ui.x = AppControl.getInstance().stage.width - this._ui.width >> 1;
    }

    private step1(): void {
        Laya.Tween.to(this._ui, { alpha: 0 }, 1000, Laya.Ease.linearNone, Laya.Handler.create(this, this.step2), 1500);
    }

    private step2(): void {
        Laya.Tween.clearTween(this._ui);
        this._ui.removeSelf();
    }


}