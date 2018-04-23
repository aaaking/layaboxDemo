  

class BaseDealCardsView extends Laya.Sprite{
    private cards = {}
    private cardsViews = {}
    private cardsPos = {}
    constructor() {
        super();
        
		this.cards = {}
        this.cardsViews = {}
        this.cardsPos = {}
    }


private DIRLIST = [
                    [[1]],
                    [[1,3],[3,1],[3,1]],
                    [[1,2,4],[2,4,1],[2,4,1],[4,1,2]],
                    [[1,4,3,2],[2,1,4,3],[3,2,1,4],[4,3,2,1]]
                  ]
private BEGINX = [-216,350,148,-350]
private BEGINY = [190,-94,-254,162]
private BEGIN_SIGNALX = [175,350,-90,-350]
private BEGIN_SIGNALY = [200,110,-245,-16]

private CATCH_SIGNALX = [250,350,-150,-350]
private CATCH_SIGNALY = [200,140,-245,-90]

private CARD_WIDTH_BIG = [130,0,-87,0]
private CARD_HEIGHT_BIG = [0,68,0,-68]
private CARD_WIDTH = [43,0,43,0]
private CARD_HEIGHT = [0,27,0,27]
private callback

protected getCard(dir,index){
	let card

	if (index < 4){
		let num = dir
		if (num == 4) { num = 2 }
		card = new Laya.Image("card/deal_card_"+num+".png")
		if (dir == 1){
			card.scaleX = 0.6
            card.scaleY = 0.6
        }
    }else{
		if (dir == 1 || dir == 3){
			card = new Laya.Image("card/bg_3.png")
            card.scaleX = 0.6
            card.scaleY = 0.6
            if (dir == 3){
                card.scaleX = 0.4
                card.scaleY = 0.4
            }
        }else{
			card = new Laya.Image("card/bg_2.png")
            card.scaleX = 0.38
            card.scaleY = 0.38
        }
	}
	return card
}

private getDealcardSound(index){
    let list = [
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
        "deal_card_a",
        "deal_card_b",
    ]
    return list[index]

}

public dealCards(index,callback){
	this.callback = callback
	let duration = 120
	let dir = Utils.getDir(index)
	let list = this.DIRLIST[BaseGameData.maxPlayer-1][dir-1]
	let cardIndex 
    let rightIndexArray = []
	for (var k in list){
        let v = list[k]
		for (var i = 1;i<=4;i++){
			cardIndex = i
			if (v == 2){
				cardIndex = 5 - i
            }
            let card  = this.getCard(v,i)
            this.addChildAt(card,i-1)
			this.cards[parseInt(k)+(i-1)*BaseGameData.maxPlayer] = card
            
            card.alpha = 0
            if(v == 4){
                rightIndexArray.push(parseInt(k)+(i-1)*BaseGameData.maxPlayer)
            }
			if (i < 4){
				this.cardsPos[parseInt(k)+(i-1)*BaseGameData.maxPlayer] = {x:this.BEGINX[v-1]+(i-1)*this.CARD_WIDTH_BIG[v-1],y:this.BEGINY[v-1]+(i-1)*this.CARD_HEIGHT_BIG[v-1]}
            }else{
				this.cardsPos[parseInt(k)+(i-1)*BaseGameData.maxPlayer] = {x:this.BEGIN_SIGNALX[v-1],y:this.BEGIN_SIGNALY[v-1]}
            }
        }
    }
    let card = this.getCard(list[0],5)
    card.alpha = 0
    this.addChild(card)
    // card.alpha = 0
	this.cards[16] = card
	this.cardsPos[16] = ({x:this.CATCH_SIGNALX[list[0]-1],y:this.CATCH_SIGNALY[list[0]-1]})
	
	//  逆时针发牌
    // let rightIndexArray = [index+2,index+6,index+10,index+14]
    let rightIndex = 3
	for (var k in this.cards){
        let view = this.cards[k]
		let dealCardsPos = this.cardsPos[k]
		let times = k
		let delay = duration*parseInt(times)
        if(rightIndexArray.indexOf((parseInt(k))) >= 0){
            this.setChildIndex(view,rightIndex);
            rightIndex--;
        }
		// let audio = cc.CallFunc:create(function()
		// 	_app.soundMgr:playGameSound(getDealcardSound(k))
		// end)
		// let show = cc.Show:create()
		// let move = cc.MoveTo:create(duration, dealCardsPos)
		// let callF
		// let delay2
		// if k == #self.cards then
		// 	delay2 = cc.DelayTime:create(0.5)
		// 	callF = cc.CallFunc:create(function()
		// 		self:cleanup()
		// 		self.callback()
		// 	end)
		// end
		// let sequence = cc.Sequence:create(delay,  show,  cc.Spawn:create(audio,move),  delay2, callF)
        if (parseInt(k) == 16){
            TweenUtils.get(view).to({x:dealCardsPos.x,y:dealCardsPos.y,alpha:1},duration,null,null,delay)
            .to({},10,null,Laya.Handler.create(this,this.clean),500)
        }else{
            if(BaseGameData.selfSeatid && parseInt(k)%4 == BaseGameData.selfSeatid){
                TweenUtils.get(view).to({x:dealCardsPos.x,y:dealCardsPos.y,alpha:1},duration,null,null,delay)
            }else{
                TweenUtils.get(view).to({x:dealCardsPos.x,y:dealCardsPos.y,alpha:1},duration,null,Laya.Handler.create(this,function(){
                    SoundManager.instance.playEffect("deal_card_a", 0, 1, false, 1, true)
                }),delay)
            }
        }
    }

}

public clean(){
	for (var k in this.cards){
		let view = this.cards[k]
        view.removeSelf()
        view = null
    }
	this.cards = []
    if(this.callback){
        this.callback()
    }
}

}