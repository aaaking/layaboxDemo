/*
* @author seacole
* ani特效基础类;
*/
class AnimationEffect extends BaseEffect {
    constructor() {
        super();
    }
    private _roleAni: Laya.Animation;
    private _lab:Laya.Label;
    private _tweenArr:Array<any>;
    private _lastFrame:number;
    public show(effectData: EffectData): Laya.Animation {
        super.show(effectData);
        this._tweenArr = [];
        if (!this._roleAni) {
            this._roleAni = new Laya.Animation();
            this._roleAni.source = effectData.url;
        }
        this._id = effectData.id;
        this._index = effectData.index;
        this._roleAni.pos(effectData.posX, effectData.posY);
        this._roleAni.scale(effectData.scaleX, effectData.scaleY);
        if (effectData.blendMode)
            this._roleAni.blendMode = "lighter";
        this._roleAni.visible = false;
        if (effectData.delay) {
            this._roleAni.visible = effectData.delayShow;
            if (this._roleAni.visible)
                this._roleAni.play(effectData.start, effectData.loop);
            Laya.timer.once(effectData.delay, this, this.play.bind(this), [effectData]);
        }
        else
            this.play(effectData);
        
        if(!this._lab)
        {
            this._lab = new Laya.Label();
            this._lab.anchorX = 0.5;
            this._lab.anchorY = 0.5;
            this._lab.align = "center";
            this._lab.width = 300;
        }
        this._lab.text = '';
        this._lastFrame = 0;
         if(effectData.hasOwnProperty('tween'))
         {
            this._lab.font = effectData.fontStyle == ''?'Arial':effectData.fontStyle;
            this._lab.text = effectData.text;
            if(effectData.tween.length ==0)
                return this._roleAni;
             
             for(var item in effectData.tween)
             {
                  this._tweenArr.push(effectData.tween[item]);
             }
            
            var obJect:any = (this._tweenArr.splice(0,1))[0];
            for (var item in obJect)
             {
                if(item != 'frame')            
                    this._lab[item]= obJect[item];
                else
                    this._lastFrame = obJect[item];
            }

            this._roleAni.addChild(this._lab);
            this.onNextAction();
              
         }

        return this._roleAni;
    }

    private onNextAction():void
    {
        if(this._tweenArr.length<=0)
            return;
        var next:any = (this._tweenArr.splice(0,1))[0];
        var nextData:any={};
        var durTime:number = 1000*(next.frame-this._lastFrame)/60;
        for (var item in next)
        {
            if(item != 'frame')
                nextData[item]=next[item];
            else
                this._lastFrame = next[item];
        }
        Laya.Tween.to(this._lab,nextData,durTime,null,Laya.Handler.create(this,this.onNextAction,null,true));
    }

    protected play(effectData: EffectData): void {
        if (!this._roleAni.visible) {
            this._roleAni.visible = true;
            this._roleAni.play(effectData.start, effectData.loop);
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
        this._roleAni.off(Laya.Event.COMPLETE, this, this.hide);
        super.hide();
    }

    public removeSelf(): void {
        super.removeSelf();
        Laya.timer.clear(this, this.play);
        this._roleAni.stop();
        this._roleAni.removeSelf();
        this._lab.removeSelf();
        Laya.Tween.clearAll(this._lab);
    }
}