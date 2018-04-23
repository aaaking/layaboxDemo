
class ChoiceView extends Laya.Sprite{
    private POS = [[0],[-1,1],[-1,0,1]]
    private OFFSET = [[0],[40,80],[-150,0,150]]
    private choiceType
    public callback 
    private count
	private cancelBtn
	private cancelBack
    constructor(cards,choiceType,optcallback,cancelback) {
        super();
		this.init(cards,choiceType,optcallback,cancelback)
    }
    

public init(cards,choiceType,optcallback,cancelback){

	this.choiceType = choiceType

	// this.width = 0
	this.callback = optcallback
	this.cancelBack = cancelback
	let groupCount = 1
	let width = -80
	let offset = -80
	if (choiceType == GameDef.OptType.MJ_CHI){
		groupCount = 3
		width = -170
		offset = -170
    }
	console.info(this.choiceType)
	console.info(cards)
	this.count =  cards.length/groupCount
	let beginPos = width*this.count + offset 
	let card = [] 
	let index = 0
	for (var k in cards){ 
        card.push(cards[k])
		if (parseInt(k+1)%groupCount == 0){
			if (choiceType.length > 1){ 
				let choice = new ChoiceCard(card, this.choiceType[k], optcallback)
				this.addChild(choice)
				choice.pos(beginPos-(parseInt(k)*width+offset),15);
				// this.initView(card,parseInt(k)/groupCount,this.choiceType[k])
            }else{
				let choice = new ChoiceCard(card, this.choiceType, optcallback)
				this.addChild(choice) 
				let x = index*width +offset
				choice.pos(beginPos - x,15)
				index = index + 1
				// choice.pos(this.POS[this.count][k]*115+this.OFFSET[this.count][k],0);
				// this.initView(card,parseInt(k)/groupCount,this.choiceType) 
            }
			card = []  
        }
    }
	
    this.cancelBtn = new Laya.Image("opt/button_cancle_1.png")
	this.addChild(this.cancelBtn)
	this.cancelBtn.pos(0,0)
	this.cancelBtn.on(Laya.Event.CLICK, this, this.cancelBack)

	// EventManager.instance.registerOnObject(this, this.cancelBtn, Laya.Event.CLICK, this, this.onCancel);
    
}

public onCancel(){
	this.cancelBack()
	// this.parent.cancelChoice()
    // self:getParent():cancelChoice()
}

// public initView(cards,k,choiceType){
// 	let width =  230
// 	let height = cards.length == 3 ? 124 : 145
// 	let bg:Laya.Image = new Laya.Image("res/ui/card_border.png");
// 		bg.pos(this.POS[this.count][k]*width/2+this.OFFSET[this.count][k],0);
// 		this.addChild(bg)
// 		bg.mouseEnabled = false
// 		bg.mouseThrough = false
		
// 	// bg.cards = cards
// 	// bg.index = k
// 	// bg.choiceType = choiceType
// 	let showCards = []
// 	let chiCard
// 	if (choiceType == GameDef.OptType.MJ_CHI){
// 		chiCard = cards[3]
// 	}
// 	for (var j in cards){
// 		let v = cards[j]
// 		showCards.push(v)
// 	}
	
// 	if (cards.length == 1){
// 		for (var i=0;i < 3;i++){
// 			showCards.push(cards[0])
// 		}
// 	}
// 	for (var j in showCards){
// 		let v = showCards[j]
// 		let card = new BaseCardView(v,1,false,true)

// 		if (parseInt(j) < 3){
// 			this.addChild(bg)
// 			bg.pos((parseInt(j)-1)*65+50,60)
// 			// card:addTo(bg):align(display.LEFT_CENTER,(k-1)*65+50,60)
// 		}else{
// 			this.addChild(bg)
// 			bg.pos(115, 80)
// 			// card:addTo(bg):align(display.LEFT_CENTER,(2-1)*65+50,80)
// 		}
// 		if (chiCard && v == chiCard){
// 			// card.showChi()
			
// 			// card:setLocalZOrder(10)
// 		}
// 		card.mouseThrough = false
// 	}
	
	
// }

// private onClick(Event){
// 	if (this.callback){
// 		this.callback()
// 	}
// }
}