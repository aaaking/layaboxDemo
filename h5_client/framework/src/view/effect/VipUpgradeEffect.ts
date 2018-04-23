class VipUpgradeEffect extends BaseEffect{
    constructor() {
        super();
    }
    private _roleAni: Laya.Animation;
    public show(effectData: EffectData): Laya.Animation {
        super.show(effectData);
        if (!this._roleAni) {
            this._roleAni = new Laya.Animation();
            this._roleAni.source = effectData.url;
        }
        this._id = effectData.id;
        this._index = effectData.index;
        this._roleAni.pos(effectData.posX, effectData.posY);
        this._roleAni.scale(effectData.scaleX, effectData.scaleY);
        this._roleAni.frames;
        this._roleAni.autoAnimation;
        var nod:any = this._roleAni.getChildByName("_effect");
        if (effectData.blendMode)
            this._roleAni.blendMode = "lighter";
        
        if (effectData.delay)
        {
            this._roleAni.visible=false;
            Laya.timer.once(effectData.delay, this, this.play.bind(this), [effectData]);
        }            
        else
            this.play(effectData);

        return this._roleAni;
    }

    protected play(effectData: EffectData): void {
        this._roleAni.visible=true;
        this._roleAni.play(effectData.start, effectData.loop);
        if (effectData.loop) {
            if (effectData.duation)
                Laya.timer.once(effectData.duation, this, this.hide);
        }
        else
            this._roleAni.on(Laya.Event.COMPLETE, this, this.hide);

    }

    public hide(): void {
        Laya.timer.clear(this, this.play);
        this._roleAni.off(Laya.Event.COMPLETE, this, this.hide);
        super.hide();
    }

    public removeSelf(): void {
        super.removeSelf();
        Laya.timer.clear(this, this.play);
        this._roleAni.stop();
        if (this._roleAni.parent)
            this._roleAni.parent.removeChild(this._roleAni);
    }
}