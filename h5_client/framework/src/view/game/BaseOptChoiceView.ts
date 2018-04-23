class BaseOptChoiceView extends Laya.View{
     constructor(callback:Function) {
        super();
        // this.init()
		if (callback){
			this.optCallBack = callback
		}
    }
private ting
private optCallBack:Function
private OPT_TYPE_RES_NORMAL = ["","opt/button_1_1.png","opt/button_2_1.png",
							"opt/button_3_1.png","opt/button_3_1.png","opt/button_3_1.png",
							"opt/button_6_1.png","opt/button_4_1.png"]
private OPT_TYPE_RES_PRESSED = ["","button/button_1_2.png","button/button_2_2.png","button/button_3_2.png",
							"button/button_3_2.png","button/button_3_2.png","button/button_6_2.png",
							"button/button_4_2.png"]
private _buttons = []
private _choiceType = {}
private _pengCards = []
private _pengCardsType = []
public _optNode
private _choice
protected _tingBtn

public showOptChoice(opt){
	//opt = [{opttype : 2,cards : [1,3,2,4,5,6]},{opttype : 3,cards : [2]},{opttype = 6,cards = [2]},{opttype = 4,cards = [3]}]
	if (!this._optNode){
		this._optNode = new Laya.Sprite()
		this.addChild(this._optNode)
		this._optNode.pos(0,0)
	}
	this._buttons = []
	this._choiceType = {}
	this._pengCards = []
	this._pengCardsType = []
	
	let callbacks = [this.ChiChoice,this.PengChoice,this.GangChoice,this.GangChoice,this.GangChoice,this.TingChoice,this.HuChoice,this.QiChoice]
	
				
	let cancelButton:Laya.Image = new Laya.Image("opt/button_5_1.png")
	this._optNode.addChild(cancelButton)
	cancelButton.on(Laya.Event.CLICK,this,this.QiChoice)
	// EventManager.instance.registerOnObject(this, cancelButton, Laya.Event.CLICK, this, this.QiChoice);
	
  	let offset = 1
	for (var k in opt){
		let v = opt[k]
		if (v.opttype > GameDef.OptType.MJ_DRAW && v.opttype < GameDef.OptType.MJ_MISS_HU){
			let _image = this.OPT_TYPE_RES_NORMAL[v.opttype-1]
	  		this._choiceType[v.opttype] = v.cards
	  		if (v.opttype == GameDef.OptType.MJ_MNGANG || v.opttype == GameDef.OptType.MJ_ANGANG || v.opttype == GameDef.OptType.MJ_PENGGANG){
	  			if (this._pengCards.length == 0){
					let btn = new Laya.Image(_image)
					this._optNode.addChild(btn)
					btn.pos(-120*offset,0)
					btn.on(Laya.Event.CLICK,this,callbacks[v.opttype-2])
					// EventManager.instance.registerOnObject(this, btn, Laya.Event.CLICK, this, callbacks[v.opttype-2]);
					this._buttons.push(btn)
	  				// this._buttons[#self.buttons+1] = ht.ui.HTPushButton.new(images):addTo(self.optNode):pos(-120*offset,0):onButtonClicked(handler(self, callbacks[v.opttype-1]))
	  				offset = offset + 1
				  }
	  			for (var i in v.cards){
					  let card = v.cards[i]
	  				  this._pengCards.push(card)
					  this._pengCardsType.push(v.opttype)
				  }

			  }else{
				  let btn = new Laya.Image(_image)
				  this._optNode.addChild(btn)
				  btn.pos(-120*offset,0)
				  btn.on(Laya.Event.CLICK,this,callbacks[v.opttype-2])
				  this._buttons.push(btn)
	  				offset = offset + 1
				if(v.opttype == GameDef.OptType.MJ_TING){
					this._tingBtn = btn
					BaseGameData.tingCards = []
					BaseGameData.tingInfo = {}
					let length = 0
					let  i = 0
					let tingKey
					let count = 0
					let winIndex
					for (var j in v.cards){
						let info = v.cards[j]
						if(j == "0" || parseInt(j) == count+length+1){
							length = info
							i = 0
							count = parseInt(j)
						}else if(parseInt(j) < count+length+1){
							if(i == 0){
								tingKey = info%100
								BaseGameData.tingCards.push(tingKey)
								BaseGameData.tingInfo[tingKey] = []
							}else{
								BaseGameData.tingInfo[tingKey].push(info)
							}
							i++
						}
					}
					BaseHandCardManager.instance.showArror(BaseGameData.selfSeatid)
				}
	  		}
	  		// if (v.opttype == MJ_TING) then
	  		// 	_handCardManager:tingCard()
	  		// end
		}
	}
}

public hideButtons(){
	
	this._optNode.visible = false
}

public ChiChoice(){
	console.log("chi==========================")
	BaseTingCardManager.instance.clearAll()
	if (this._choiceType[GameDef.OptType.MJ_CHI].length == 3){

		this.optCallBack(GameDef.OptType.MJ_CHI, this._choiceType[GameDef.OptType.MJ_CHI])
		this.clearUI()
	}else{
		this.hideButtons()
		this._choice = new ChoiceView(this._choiceType[GameDef.OptType.MJ_CHI], GameDef.OptType.MJ_CHI, this.optCallBack, this.cancelChoice.bind(this));
		this.addChild(this._choice)
		this._choice.pos(0,0)
	}
}

public PengChoice(){
	this.clearOpt()
	this.optCallBack(GameDef.OptType.MJ_PENG,[this._choiceType[GameDef.OptType.MJ_PENG][0]])
}

public GangChoice(){
	BaseTingCardManager.instance.clearAll()
	this.clearChoice()
	this.hideButtons()
	if (this._pengCards.length > 1){
		this._choice = new ChoiceView(this._pengCards,this._pengCardsType,this.optCallBack, this.cancelChoice.bind(this))
		this.addChild(this._choice)
		this._choice.pos(0,0)
	}else{
		this.optCallBack(this._pengCardsType[0],this._pengCards)
		this.clearUI()
	}
}

public TingChoice(){
	BaseTingCardManager.instance.clearAll()
	this.clearChoice()
	this.hideButtons()
	if(BaseGameData.tingCards.length > 1){
		this.ting = true
		this._choice = new ChoiceView([],GameDef.OptType.MJ_TING,function(){
			Dispatcher.dispatch("choose_ting",[true])
		}.bind(this), this.cancelChoice.bind(this))
		this.addChild(this._choice)
		this._choice.pos(0,0)
		Dispatcher.dispatch("choose_ting",[true])
	}else{
		
		this.optCallBack(GameDef.OptType.MJ_TING,BaseGameData.tingCards)
	}// _handCardManager:darkTingTiles(_gameDataMgr.selfInfo.seatid, true)
	// self.choice = ChoiceView.new(self.choiceType[MJ_TING],MJ_TING):addTo(self,20):pos(0,100)
	// self.ting = true
	// _gameDataMgr:setTingOpt(_gameDataMgr.selfInfo.seatid)
}

public HuChoice(){
	this.optCallBack(GameDef.OptType.MJ_HU,this._choiceType[GameDef.OptType.MJ_HU])
	this.clearUI()
}

public QiChoice(){
	console.log("----------------------------------------")
	this.optCallBack(GameDef.OptType.MJ_QI)
	this.clearUI()
}

public clearChoice(){
	if (this._choice){
		this._choice.removeSelf()
		this._choice = null
	}
}

public clearUI(){
	this.clearChoice()
	this.clearOpt()
}

public clearOpt(){
	if (this._optNode){
		this._optNode.removeSelf()
		this._optNode = null
	}
}

public cancelChoice(){
	if (this._buttons.length > 1 || this.ting){
		if (this.ting){
			this.ting = null
			Dispatcher.dispatch("choose_ting",[false])
			// _gameDataMgr:clearTingOpt(_gameDataMgr.selfInfo.seatid)
			// this.optCallBack(GameDef.OptType.MJ_TING,[0])
			// _handCardManager:normalTingTiles()
		}			
		this.clearChoice()
		this._optNode.visible = true
	}else{
		this.optCallBack(GameDef.OptType.MJ_QI)
		this.clearUI()
	}
}


}