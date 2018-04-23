/*
* @author seacole
* 特效管理类;
*/
class EffectManager {
    private _effectPools: Object;
    private _effects: Array<BaseEffect>;
    constructor() {

    }

    private static _instance: EffectManager;
    public static get instance(): EffectManager {
        if (!this._instance) {
            this._instance = new EffectManager();
        }
        return this._instance;
    }

    public init(): void {
        this._effectPools = new Object();
        this._effects = [];

        Dispatcher.on(EventNames.REMOVE_EFFECT, this, this.onRemoveEffect);
    }

    /**
    *添加特效 
    */
    private setEfect(effectData: EffectData, isReturnEffect: boolean = false): any {
        if (!this._effectPools[effectData.index]) {
            var pool: ObjectPool;
            if (effectData.type == EffectConfig.EFFECT_TYPE_SEQUENCE)
                pool = ObjectPool.getInstance("SequenceEffect" + effectData.index, Laya.ClassUtils.getClass(SequenceEffect));
            else if (effectData.type == EffectConfig.EFFECT_TYPE_PARTICLE)
                pool = ObjectPool.getInstance("ParticleEffect" + effectData.index, Laya.ClassUtils.getClass(ParticleEffect));
            else if (effectData.type == EffectConfig.EFFECT_TYPE_ANIMATION)
                // if (effectData.id == EffectConfig.EFFECT_NORMAL_UPGRADE) {
                //     pool = ObjectPool.getInstance("VipUpgradeEffect" + effectData.index, Laya.ClassUtils.getClass(VipUpgradeEffect));
                // }
                // else {
                    pool = ObjectPool.getInstance("AnimationEffect" + effectData.index, Laya.ClassUtils.getClass(AnimationEffect));
                // }

            else {
                console.warn("特效配置不对，id:" + effectData.index + "type:" + effectData.type);
                return new Laya.Sprite();
            }
            this._effectPools[effectData.index] = pool;
        }
        var effect: BaseEffect = this._effectPools[effectData.index].borrowObject() as BaseEffect;
        this._effects.push(effect);
        if (isReturnEffect)
            return effect;
        else
            return effect.show(effectData);
    }

    /**
     *移除特效
     */
    private onRemoveEffect(effect: BaseEffect): void {
        this._effectPools[effect.index].returnObject(effect);
        effect.removeSelf();
        var idx: number = this._effects.indexOf(effect);
        if (idx != -1)
            this._effects.splice(idx, 1);
    }

    /**
    *移除所有特效
    */
    public clearAll(): void {
        if (!this._effects)
            this._effects = [];
        while (this._effects.length) {
            this.onRemoveEffect(this._effects[0]);
        }
    }
    /**
     * 增加特效
     * @param container 父容器
     * @param id 特效id
     * @param text 特效要添加的文字内容
     * @param fontStyle 文字的样式 
     */
    public addEffect(container: Laya.Sprite, id: number, text: string = '', fontStyle: any = '', posX: number = -1, posY: number = -1, toPosX: number = -1, toPosY: number = -1, isReturnEffect: boolean = false): any {
        var effectData = new EffectData();
        effectData.setInfo(id, text, fontStyle, posX, posY, toPosX, toPosY);
        var sp: any = this.setEfect(effectData, isReturnEffect);
        if (isReturnEffect)
            return [sp,effectData];
        else {
            container.addChild(sp);
            return sp;
        }
    }
}