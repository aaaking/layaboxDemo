/*
* @author seacole
* 粒子特效基础类;
*/
class ParticleEffect extends BaseEffect {
    constructor() {
        super();
    }

    private _sp: Laya.Particle2D;
    private _setting: Laya.ParticleSetting;

    public show(effectData: EffectData): Laya.Particle2D {
        super.show(effectData);
        if (!this._sp) {
            this._setting = Laya.Loader.getRes(effectData.url);
            // this._setting.blendState = 1;
            this._sp = new Laya.Particle2D(this._setting);
        }
        this._id = effectData.id;
        this._index = effectData.index;
        this._sp.pos(effectData.posX, effectData.posY);
        this._sp.scale(effectData.scaleX, effectData.scaleY);
        if (effectData.delay) {
            this._sp.visible = false;
            Laya.timer.once(effectData.delay, this, this.play, [effectData]);
        }
        else
            this.play(effectData);

        return this._sp;
    }

    protected play(effectData: EffectData): void {
        this._sp.visible = true;
        this._sp.emitter.start();
        this._sp.play();
        if (!effectData.loop)
            Laya.timer.once(this._setting.duration * 1000, this, this.hide);

        var ease: Function = Laya.Ease.linearIn;
        if (effectData.needTween)
            Laya.Tween.to(this._sp, { x: effectData.toPosX, y: effectData.toPosY }, effectData.duation, ease, Laya.Handler.create(this, this.hide));
    }

    public hide(): void {
        Laya.Tween.clearTween(this._sp);
        Laya.timer.clear(this, this.hide);
        super.hide();
    }

    public removeSelf(): void {
        super.removeSelf();
        this._sp.emitter.stop();
        this._sp.stop();
        this._sp.removeSelf();
    }
}