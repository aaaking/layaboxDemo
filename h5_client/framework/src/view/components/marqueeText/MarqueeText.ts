/*
* @author seacole
* 跑马灯
*/
class MarqueeText {
    public constructor() {
    }
    private _ui: ui.components.marqueeText.MarqueeTextUI;

    private static _instance: MarqueeText;
    public static get instance(): MarqueeText {
        if (!this._instance)
            this._instance = new MarqueeText();
        return this._instance;
    }

    private _msgs: Array<string>;
    private step: number = 3;
    private _selfParent:any
    public start(loadData: any): void {

    }

    public set selfParent(p:any)
    {
        this._selfParent=p;
    }

    /**
     * show
     * @param msg 具体内容
     */
    public show(msg: string): void {
        if (!this._ui) {
            this._ui = new ui.components.marqueeText.MarqueeTextUI();
            this._msgs = [];
            this._ui.y = 112;
            this._ui._lab.style.color = "#fcecd3";
            this._ui._lab.style.valign = "middle";
            this._ui._lab.style.fontSize = 22;
            AppControl.getInstance().stage.on(Laya.Event.RESIZE, this, this.onResize);
        }
        this._msgs.push(msg);
        if (!this._ui.parent) {
            this._selfParent.addChild(this._ui);
            this.onResize();
            this.checkNext();
        }
    }

    private onResize(): void {
        this._ui.width = AppControl.getInstance().stage.width;
        // this._ui.x = AppControl.getInstance().stage.width - this._ui.width >> 1;
        this._ui._imgBg.width = this._ui.width;
        // this._ui._mask.width = this._ui.width;
        // this._ui._mask.visible=false;
        // this._ui._mask._renderType=256;
        //  this._ui._imgBg.mask=this._ui._mask;
    }

    private showOne(str: string): void {
        this._ui._lab.innerHTML = str;
        this._ui._lab.width = 9999;
        this._ui._lab.x = this._ui.width;
        var endX: number = - this._ui._lab.contextWidth;
        var time: number = Math.floor((this._ui._lab.x - endX) / this.step) * 50;
        Laya.Tween.to(this._ui._lab, { x: endX }, time, null, Laya.Handler.create(this, this.checkNext));
    }

    private checkNext(): void {
        var str: string = this.getNextText();
        if (str == "") {
            this.hide();
        }
        else {
            this.showOne(str);
        }
    }

    private getNextText(): string {
        if (this._msgs && this._msgs.length)
            return this._msgs.shift();
        else
            return "";
    }

    public stop(): void {
        Laya.Tween.clearTween(this._ui._lab);
    }

    public clear():void
    {
        this._msgs=[];
    }

    private hide(): void {
        this._ui.removeSelf();
    }
}
