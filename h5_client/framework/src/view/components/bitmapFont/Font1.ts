/*
* @author seacole
* 捕鱼场景鱼死亡时金币数字;
*/
class Font1 extends BPFont {
    constructor() {
        super();
        this._fontName="Font1";
    }

    protected onAddToStage(e: Laya.Event): void {
        super.onAddToStage(e);
        this.pos(this._posX,this._posY);
        this.play();
    }

    protected onRemoveFromStage(e: Laya.Event): void {

    }

    private play():void
    {
        // Laya.Tween.clearTween(this);
        // this.anchorX=0.5;
        // this.anchorY=0.5;
        // this.scaleX=0;
        // this.scaleY=0;
        // Laya.Tween.to(this,{scaleX:1,scaleY:1},FontConfig.FONT_GOLD_DUA,Laya.Ease.linearIn,Laya.Handler.create(this,this.step1));
    }

    private step1():void
    {
        //  Laya.Tween.to(this,{scaleX:0,scaleY:0},FontConfig.FONT_GOLD_DUA,Laya.Ease.linearIn,Laya.Handler.create(this,this.step2),FontConfig.FONT_GOLD_DELAY);
    }

    private step2():void
    {
        Dispatcher.dispatch(EventNames.REMOVE_FONT,this);
    }

}