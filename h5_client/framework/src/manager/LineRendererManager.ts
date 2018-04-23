/*
* @author seacole
* LineRenderer管理类;
*/
class LineRendererManager{
    private _lineRendersPools: Object;
    private _lineRenderers: Array<LineRenderer>;
    constructor(){

    }

    public init(): void {
        this._lineRendersPools = new Object();
        this._lineRenderers = [];
        Dispatcher.on(EventNames.REMOVE_LINE_RENDERER,this,this.onRemoveLineRenderer);
    }

    private static _instance:LineRendererManager;
    public static get instance():LineRendererManager
	{
        if(!this._instance) {
           this._instance = new LineRendererManager();
        }
        return this._instance;
    }
    /**
     * 添加LineRenderer
     */
    public addLineRenderer(effectData: EffectData):LineRenderer
    {
         if (!this._lineRendersPools[effectData.index]) {
             var pool:ObjectPool = ObjectPool.getInstance("LineRenderer" + effectData.index, Laya.ClassUtils.getClass(LineRenderer));
             this._lineRendersPools[effectData.index] = pool;
         }            
        var lineRenderer: LineRenderer = this._lineRendersPools[effectData.index].borrowObject() as LineRenderer;
        lineRenderer.init(effectData);
        this._lineRenderers.push(lineRenderer);
        return lineRenderer;
    }
    /**
     * 移除LineRenderer
     */
     private onRemoveLineRenderer(lineRenderer:LineRenderer): void {
        this._lineRendersPools[lineRenderer.index].returnObject(lineRenderer);         
        if(lineRenderer.parent)
            lineRenderer.parent.removeChild(lineRenderer);
        var idx:number=this._lineRenderers.indexOf(lineRenderer);
        if (idx!=-1)
            this._lineRenderers.splice(idx,1);
    }

    /**
     *移除所有LineRenderer
     */
    public clearAll(): void {
        if (!this._lineRenderers)
            this._lineRenderers = [];
        while(this._lineRenderers.length)
        {
            this.onRemoveLineRenderer(this._lineRenderers[0]);
        }
    }
}