/*
* @author seacole
* 特效基础类;
*/
class BaseEffect {
    constructor() {

    }
    protected _id: number;
    protected _name: string;
    protected _index: number;
    public show(effectData: EffectData): any {
        Dispatcher.on(EventNames.REMOVE_EFFECT_BY_ID,  this,this.onRemoveEffectById);
        Dispatcher.on(EventNames.REMOVE_EFFECT_BY_INDEX,  this,this.onRemoveEffectByIndex);
    }

    private onRemoveEffectById(id: number): void {
        if (this._id == id)
            this.hide();
    }

    private onRemoveEffectByIndex(index: number): void {
        if (this._index == index)
            this.hide();
    }

    public hide(): void {      
        Dispatcher.dispatch(EventNames.REMOVE_EFFECT, [this]);
    }

    public get id(): number {
        return this._id;
    }

    protected play(effectData:EffectData): void {
    }

    public removeSelf(): void {
        Dispatcher.off(EventNames.REMOVE_EFFECT_BY_ID,  this,this.onRemoveEffectById);
        Dispatcher.off(EventNames.REMOVE_EFFECT_BY_INDEX,  this,this.onRemoveEffectByIndex);
    }

    public get index(): number {
        return this._index;
    }


}