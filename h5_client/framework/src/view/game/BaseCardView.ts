
class BaseCardView extends Laya.View{
    constructor(card, dir, optcallback?) {
        super();
		this.init(card, dir, optcallback)
		if(dir == 1){
			// Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
		}
    }

    protected HIGH_LIGHT_ZORDER = 1
    protected UPDELAY = 30
    protected OFFSET_Y = -30
    protected MOVE_CARDS_T = 0.1
    protected RES_PATH = "card/"
    protected SHIFTER_NUM = 0
    protected dir:number
    protected back:Laya.Image
    protected ishand:boolean
    protected callback:Function
	protected card:number
	protected front:Laya.Image
	protected isShow:boolean
	public bSelected:boolean
	public view
	protected getModel(){
		switch(this.dir){
			case 1: return ui.mj.HandCard.Card_1UI;
			case 2: return ui.mj.HandCard.Card_2UI;
			case 3: return ui.mj.HandCard.Card_3UI;
			case 4: return ui.mj.HandCard.Card_4UI;
		}
	}


    public onResize(){
		if(Laya.stage.width/Laya.stage.height < 8/5 && this.dir == 1){
			let scale = Laya.stage.width/1024
			this.view.scale(scale,scale)
		}else{
			this.view.scale(1,1)
		}
	}
    protected init(card, dir, optcallback?){


        this.dir = dir
        
        
        if (optcallback){
            this.callback = optcallback
        }
		let model = this.getModel()
		this.view = new model()
		// if(Laya.stage.width/Laya.stage.height < 8/5 && dir == 1){
		// 	let scale = Laya.stage.width/1024
		// 	this.view.scale(scale,scale)
		// }
		this.addChild(this.view)
		if (card > 0){
			this.view._bg.visible = true
			this.view._back.visible = false
			this.view._bg.skin = "card/"+this.view.name+"/"+(card%100)+".png"
			this.card = card
			if(card%100 == BaseGameData.SHIFTER_NUM%100){
				this.view._god.visible = true
			}
			// if(this.dir == 1){
			// 	this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
			// }
		}else{
			this.view._bg.visible = false
		}
        
    }


	public updateFront(card){
		if (card > 0){
			this.view._back.visible = false
			this.view._bg.visible = true
			this.view._bg.skin = "card/"+this.view.name+"/"+(card%100)+".png"
			this.card = card
			if(card%100 == BaseGameData.SHIFTER_NUM%100){
				this.view._god.visible = true
			}
		}
	}

	public shuffle(){
		if(this.card > 0){
			if(this.view._bg.visible == true){
				this.view._bg.visible = false
				this.view._back.visible = true
			}else{
				this.view._bg.visible = true
				this.view._back.visible = false
			}
		}
	}

public isSelected(){
	return this.bSelected
}

public upAction(){
	if (this.bSelected) return 
	this.bSelected = true
	this.y = this.y + this.OFFSET_Y
}

public downAction(){

	if (!this.bSelected)  return 

	this.bSelected = false

	this.y = this.y - this.OFFSET_Y
	if(this.y < 0) this.y = 0
}

public showFoldBg(){
	let bg = new Laya.Image("card/fold_bg.png")
	bg.sizeGrid = "10,10,10,10"
	bg.width = 96
	bg.height = 126
	bg.centerX = -14
	bg.centerY = -12
	this.addChildAt(bg,0)
}


}