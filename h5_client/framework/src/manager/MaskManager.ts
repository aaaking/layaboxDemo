/*
* @author seacole
*遮罩管理
*/
class MaskManager{
    private _maskPool: ObjectPool;
    private _masks: Array<PanelMask>;
    constructor(){

    }

    public init(): void {
        this._maskPool = ObjectPool.getInstance("PanelMask",Laya.ClassUtils.getClass(PanelMask));
        this._masks = [];
        Dispatcher.on(EventNames.REMOVE_MASK,this,this.onRemoveMask);
    }

    private static _instance:MaskManager;
    public static get instance():MaskManager
	{
        if(!this._instance) {
           this._instance = new MaskManager();
        }
        return this._instance;
    }
    /**
     * 添加遮罩
     */
    public addMask():PanelMask
    {
        var panelMask: PanelMask = this._maskPool.borrowObject() as PanelMask;
        panelMask.reset();
        this._masks.push(panelMask);
        return panelMask;
    }
    /**
     * 移除遮罩
     */
     private onRemoveMask(panelMask:PanelMask): void {
        this._maskPool.returnObject(panelMask);         
        if(panelMask.parent)
            panelMask.parent.removeChild(panelMask);
        var idx:number=this._masks.indexOf(panelMask);
        if (idx!=-1)
            this._masks.splice(idx,1);
    }

    /**
     *移除所有遮罩
     */
    public clearAll(): void {
        if (!this._masks)
            this._masks = [];
        while(this._masks.length)
        {
            this.onRemoveMask(this._masks[0]);
        }
    }
}