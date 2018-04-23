/*
* @author seacole
* 序列帧特效基础类;
*/
class SequenceEffect extends BaseEffect {
    constructor() {
        super();
    }
    private _urls: Array<string>;
    private _roleAni: Laya.Animation;



    public show(effectData: EffectData): Laya.Animation {
        super.show(effectData);
        if (!this._urls) {
            this._urls = [];
            for (var i: number = 1; i <= effectData.length; i++) {
                this._urls.push(effectData.url + i + ".png");
            }
            this._roleAni = new Laya.Animation();
        }
        this._id = effectData.id;
        this._index = effectData.index;
        //创建动画模板dizziness
        Laya.Animation.createFrames(this._urls, effectData.url);
        this._roleAni.pos(effectData.posX, effectData.posY);
        this._roleAni.scale(effectData.scaleX, effectData.scaleY);
        this._roleAni.visible = false;
        if (effectData.delay) {
            this._roleAni.visible = effectData.delayShow;
            if (this._roleAni.visible)
                this._roleAni.play(effectData.start, effectData.loop, effectData.url);
            Laya.timer.once(effectData.delay, this, this.play, [effectData]);
        }
        else
            this.play(effectData);

        return this._roleAni;
    }

    protected play(effectData: EffectData): void {
        if (!this._roleAni.visible) {
            this._roleAni.visible = true;
            this._roleAni.play(effectData.start, effectData.loop, effectData.url);
        }
        if (effectData.loop) {
            if (effectData.duation)
                Laya.timer.once(effectData.duation, this, this.hide);
        }
        else
            this._roleAni.on(Laya.Event.COMPLETE, this, this.hide);

        if (effectData.needTween) {
            var ease: Function = Laya.Ease.linearIn;
            if (effectData.tweenType == 1) {
                Laya.Tween.to(this._roleAni, { x: effectData.toPosX }, effectData.duation, ease);
                Laya.Tween.to(this._roleAni, { y: effectData.toPosY }, effectData.duation, Laya.Ease.quadOut, Laya.Handler.create(this, this.hide));
            }
            else
                Laya.Tween.to(this._roleAni, { x: effectData.toPosX, y: effectData.toPosY }, effectData.duation, ease, Laya.Handler.create(this, this.hide));
        }
    }

    public hide(): void {
        Laya.Tween.clearTween(this._roleAni);
        Laya.timer.clear(this, this.play);
        super.hide();
    }

    public removeSelf(): void {
        this._roleAni.stop();
        if (this._roleAni.parent)
            this._roleAni.parent.removeChild(this._roleAni);
    }


}