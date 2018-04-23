/**
* @author seacole
 *废弃
 */
class BasePanel extends Laya.Component{
	public constructor() {
    	  super();
    	  this.on(Laya.Event.ADDED,this,this.addToStage);
        this.on(Laya.Event.REMOVED,this,this.removeFromStage);
	}
	
    protected createChildren():void
	{
	    super.createChildren();
	}

    protected addToStage(e:Laya.Event):void
    {      
        AppControl.getInstance().stage.on(Laya.Event.RESIZE,this,this.onResize);  
        this.onResize(e);
    }
    
    protected removeFromStage(e: Laya.Event): void {
        AppControl.getInstance().stage.off(Laya.Event.RESIZE,this,this.onResize);  
    }
    
    protected onBack(event: Laya.Event): void {
      
    }

    public hide(): void {
      this.removeSelf();
    }
    
    protected onResize(e: Laya.Event): void {
        
    }
}
