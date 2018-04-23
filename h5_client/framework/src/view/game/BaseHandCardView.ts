class BaseHandCardView extends Laya.View{
    public seatid:number;
    public dir;
    public cardsViews = [];
    public wOffset:number;
    public hOffset:number;
    public cards = []
    public optCallBack:Function;
    protected _cardView
    public CARD_WIDTH = [-70,0,32,0]
    public CARD_HEIGHT = [0,29,0,-29]
    public CARD_WIDTH_OFFSET = [-95,0,50,0]
    public CARD_HEIGHT_OFFSET = [0,50,0,-50]
    public TOUCH_CARD_WIDTH = 76
    public TOUCH_CARD_HEIGHT = 110
    public UPDELAY = 15
    public CARD_SCALE =  [0.67,1,1,1]
    public SHOWCARD_SCALE = [0.67,0.55,0.65,0.55]
    public SPACE = 2
    public SHIFTER_NUM = 81
    public RECT_X = 145
    public RECT_Y = 30
    public touchIndex = 0
    public beginX = 0
    public beginY = 0
    public touchRect:Laya.Rectangle;
    private operatArea:Laya.Sprite;
    private catch;
    private _cardX;
    private _cardY;
    protected _cardWidth;
    protected _cardHeight;
    private _scale
    private _isMoveing

    constructor(seatid, dir, callback) {
        super();
        this.init(seatid, dir, callback)
    }
    public init(seatid, dir, optCallBack){
        this.seatid = seatid
        this.dir = dir
        this._scale = 1
        // if(Laya.stage.width/Laya.stage.height < 8/5 && dir == 1){
        //     this._scale = Laya.stage.width/1024
        // }
        this.wOffset = this.CARD_WIDTH_OFFSET[dir-1]*this._scale
        this.hOffset = this.CARD_HEIGHT_OFFSET[dir-1]*this._scale
        this._cardWidth = this.CARD_WIDTH[dir-1]*this._scale
        this._cardHeight = this.CARD_HEIGHT[dir-1]*this._scale
        this.cards = []
        this.cardsViews = []
        if (optCallBack){
            this.optCallBack = optCallBack
        }
        if(this.dir == 1){
            this.width = 946
        }else if(this.dir == 2){
            this.height = 454
        }else if(this.dir == 3){
            this.width = 500
        }else if(this.dir == 4){
            this.height = 424
        }
        
        
        this.initData()
        this.width = TableLayout.HAND_CARD[dir-1].width
        this.height = TableLayout.HAND_CARD[dir-1].height
    }

    protected registerCardView(cardView){
        this._cardView = cardView
    }

    protected onResize(): void {
         if (this.dir == 1 && Utils.checkSeatid(BaseGameData.selfSeatid)) {
            // this.operatArea.width = Laya.stage.width
            // this.operatArea.height = Laya.stage.height
           
            // this.operatArea.pos(-point.x,-point.y)
            this.touchRect.width = Laya.stage.width
            this.touchRect.y = Laya.stage.height - 150
            
            // if(Laya.stage.width/Laya.stage.height < 8/5 && this.dir == 1){
            //     this._scale = Laya.stage.width/1024
            //     this.wOffset = this.CARD_WIDTH_OFFSET[this.dir-1]*this._scale
            //     this.hOffset = this.CARD_HEIGHT_OFFSET[this.dir-1]*this._scale
            //     this._cardWidth = this.CARD_WIDTH[this.dir-1]*this._scale
            //     this._cardHeight = this.CARD_HEIGHT[this.dir-1]*this._scale
                
            // }else if(this._scale < 1 && Laya.stage.width/Laya.stage.height > 8/5){
            //     this._scale = 1
            //     this.wOffset = this.CARD_WIDTH_OFFSET[this.dir-1]*this._scale
            //     this.hOffset = this.CARD_HEIGHT_OFFSET[this.dir-1]*this._scale
            //     this._cardWidth = this.CARD_WIDTH[this.dir-1]*this._scale
            //     this._cardHeight = this.CARD_HEIGHT[this.dir-1]*this._scale
                
            // }
            // if(this._isMoveing){
            //     this.catch = null
            //     Laya.Tween.clearAll(this)
            // }
            //     if(this.catch){
            //         this.cards.shift()
            //         this.cardsViews.shift()
            //     }
            //     this.updatePos()
            //     if(this.catch){
            //         let card = this.catch.card
            //         this.catch.removeSelf()
            //         this.catch = null
            //         this.setCatchCard(card)
            //     }
           
            
         }
    }

    public initTouch(){
        if (this.dir == 1 && Utils.checkSeatid(BaseGameData.selfSeatid)) {

            Dispatcher.on("handview", this, this.onMouseDown);
            Dispatcher.on("choose_ting", this, this.ChooseTing);

            this.touchRect = new Laya.Rectangle(0, Laya.stage.height-150, Laya.stage.width, 120)
            
             Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        }
    }
    private _isting
    private ChooseTing(isting){
        this._isting = isting
        if(isting){
            for(var k in this.cardsViews){
                let view = this.cardsViews[k]
                let index = BaseGameData.tingCards.indexOf((view.card%100))
                if(index >= 0){
                    view.view._ting.visible = true
                }else{
                    view.view._mask.visible = true
                }
            }
        }else{
            for(var k in this.cardsViews){
                let view = this.cardsViews[k]
                view.view._mask.visible = false
            }
        }
    }

    private initData(){
        
    }

    private onMouseDown(e: Laya.Event){
        if (!BaseGameData.isGameing) return
        if (BaseGameData.isRecord == 1) return
        
        if (this.cards.length <= 0){
            return false
        }
        if (!Utils.checkSeatid(BaseGameData.selfSeatid)){
            return
        }
        let compareX = e.currentTarget.mouseX
        let compareY = e.currentTarget.mouseY
        
        if (!this.touchRect.contains(e.currentTarget.mouseX, e.currentTarget.mouseY)){ 
            this.unSelectCards()
            BaseTingCardManager.instance.clearAll()
            Dispatcher.dispatch("clear_same_card")
            // this.operatArea.y = this.operatArea.y + 50
            // _holdCardManager:clearMarkCard()
            // _foldCardManager:clearMarkCard()
            // return false 
        }else{
            var count = this.cards.length
            var touchFlag = false
            for (var i = count; i > 0; i--) {
                let view = this.cardsViews[i-1]
                let point = view.localToGlobal(new laya.maths.Point(0,0))
                let rect = view.getBounds()
                let newRect = new Laya.Rectangle(point.x, point.y, rect.width, rect.height+50)
                if (view && newRect.contains(compareX, compareY)){
                    this.touchIndex = i
                    this.beginX = e.currentTarget.mouseX
                    this.beginY = e.currentTarget.mouseY
                    touchFlag = true
                    break
                }
            }
            if (!touchFlag){
                // return false
                this.touchIndex = null
                return
            }
            if(this.touchIndex && this.touchIndex > 0){
                let view = this.cardsViews[this.touchIndex-1]
                if(this._isting){
            
                    let index = BaseGameData.tingCards.indexOf((view.card%100))
                    if(index >= 0){
                        
                    }else{
                        return
                    }
                }
                this.onClickCard(view)
                this.changeArrowByIndex(this.touchIndex-1)
            }
        }
        
        
    }

    private onTouchMoved(e: Laya.Event){
        // if  (!_gameController.optSeatid || _gameController.optSeatid != _gameDataMgr.selfInfo.seatid) return
        
        // var offset = e.currentTarget.mouseX - (Laya.stage.width-295-this.cards.length*this.TOUCH_CARD_WIDTH)
        // var index = Math.floor(offset/this.TOUCH_CARD_WIDTH) 
        if (this.beginY){
            if (this.beginY - e.currentTarget.mouseY > this.UPDELAY){
                if (this.cards.length%3 == 1){
                    return
                }
                // if (!BaseGameData.moveCard){
                //     BaseGameData.moveCard = new BaseCardView(this.cardsViews[this.touchIndex].card,1,null)
                //     this.parent.addChild(BaseGameData.moveCard)
                //     let card = this.cardsViews[this.touchIndex]
                //     let cardX = this.cardsViews[this.touchIndex].x
                //     let cardY = this.cardsViews[this.touchIndex].y
                //     BaseGameData.moveCard.pos(cardX,cardY)
                //     this._cardX = cardX
                //     this._cardY = cardY
                //     // this.cardsViews[this.touchIndex].alpha = 0.5
                //     // _holdCardManager:markSameCard(this.cardsViews[this.touchIndex].card)
                //     // _foldCardManager:markSameCard(this.cardsViews[this.touchIndex].card)
                // }
            }
            if (BaseGameData.moveCard && this._cardX){
                var tx = e.currentTarget.mouseX - this.beginX
                var posX = this._cardX + tx
                var ty = e.currentTarget.mouseY - this.beginY
                var posY = this._cardY + ty
                BaseGameData.moveCard.pos(posX,posY)
                return
            }
        }

        if (this.beginX && Math.abs(e.currentTarget.mouseX - this.beginX) < this.UPDELAY){
            return
        }
        var count = this.cards.length 
        for (var i = count; i > 0; i-- ){
            let view = this.cardsViews[i-1]
            let point = view.localToGlobal(new laya.maths.Point(0,0))
            let rect = view.getBounds()
            let newRect = new Laya.Rectangle(point.x, point.y, rect.width, rect.height)
            if (view && newRect.contains(e.currentTarget.mouseX, e.currentTarget.mouseY)){ 
                this.touchIndex = i
                this.beginX = point.x
                this.beginY = point.y
                break
            }
        }
    }

    public onTouchEnd(e: Laya.Event){
        if(!this.touchRect.contains(e.currentTarget.mouseX,e.currentTarget.mouseY)){
            this.unSelectCards()
            this.off(Laya.Event.MOUSE_MOVE, this, this.onTouchMoved);
            return
        }
        if(this.touchIndex && this.touchIndex > 0){
            let view = this.cardsViews[this.touchIndex-1]
            this.onClickCard(view)
            this.off(Laya.Event.MOUSE_MOVE, this, this.onTouchMoved);
            this.changeArrowByIndex(this.touchIndex-1)
        }
        // for (var index = 0; index < this.cards.length; index++) {
        //     let card = this.cards[index];
        //     if (card.getBounds().contains(e.currentTarget.mouseX, e.currentTarget.mouseY)) {
        //         log("card index:" + index + " id:" + this.cards[index]._cardID)
        //         this.onClickCard(card)
        //         break;
        //     }
        // }
        
    }


    private onClickCard(card): void {
        
        if (card.y == 0) {
            this.unSelectCards();
            card.upAction()
            Dispatcher.dispatch("mask_same_card",card.card)
            // Laya.Tween.to(card, { y: -30 }, 50);
        } else {
            if(BaseGameData.optSeatid == this.seatid){
                this.onDropCard(card)
            }
        }
    }

    private onDropCard(card): void {
        // Laya.Tween.to(card, { y: -100 }, 50);
        let point = card.localToGlobal(new laya.maths.Point(0,0))
        let cardid = card.card
        let opttype = this._isting ? GameDef.OptType.MJ_TING: GameDef.OptType.MJ_DISCARD
        this.optCallBack(opttype,cardid)
        // card.removeSelf()
    }

    public addCard(cardid:number,callback:Function){
        var cardid = cardid || 0
        var length = this.cardsViews.length
        var index = length //+ 2
        var isShowShu = true
        var showFront = (cardid > 0) ? true : false
        if (this.dir == 1){
            if (Utils.checkSeatid(BaseGameData.selfSeatid)){
                showFront = true
            }
            isShowShu= true
        }else{
            if (cardid > 0 && cardid != 99){
                isShowShu = false
            }
        }
        // if (this.dir == 4){
        //     index = 15 - length
        // }
        var card:Laya.View = new this._cardView(cardid,this.dir,null)
        card.hitArea = new Laya.Rectangle(0,0,card.width,card.height + 50)
        this.addChildAt(card, index)
        card.pos(length*this._cardWidth+this.wOffset,length*this._cardHeight+this.hOffset)
        this.cardsViews.push(card)
        this.cards.push(cardid)
        if (cardid == BaseGameData.SHIFTER_NUM){
            // card.showGod()
        }
       
    }

    public updateCardIndex(){
        let length = this.cardsViews.length - 1
        for(var k in this.cardsViews){
            let view = this.cardsViews[k]
            this.setChildIndex(view, length-parseInt(k))
        }
    }

   

     public updatePos(){
        if ((this.dir == 1 && Utils.checkSeatid(BaseGameData.selfSeatid)) || BaseGameData.isRecord == 1){
            this.sortCardsViews()
            this.sortCards(this.cards)
        }
        let catchIndex: number = -1
        // let width = this.CARD_WIDTH[this.dir-1]
        // let widthOffset = this.CARD_WIDTH_OFFSET[this.dir-1]
        // let height = this.CARD_HEIGHT[this.dir-1]
        // let heightOffset = this.CARD_HEIGHT_OFFSET[this.dir-1]
        this._isMoveing = true
        if (BaseGameData.isRecord == 1){
            for (var k in this.cardsViews){
                let view = this.cardsViews[k]
                let toX = parseInt(k)*this._cardWidth + this.wOffset
                let toY = parseInt(k)*this._cardHeight + this.hOffset
                Laya.Tween.to(view,{x : toX, y : toY},20)
                // v:runAction(cc.MoveTo:create(0.2,cc.p((k-1)*CARD_WIDTH[this.dir]+CARD_WIDTH_OFFSET[this.dir],(k-1)*CARD_HEIGHT[this.dir]+CARD_HEIGHT_OFFSET[this.dir])))
                view.bSelected = false
                if (this.dir == 4){
                    view.zOrder =  12-parseInt(k)
                }else{
                    view.zOrder = parseInt(k)
                }
            }
        }else{
            let cardsNum = this.cardsViews.length
            for (var k in this.cardsViews){
                let view = this.cardsViews[k]
                if (this.catch && this.catch == view) {
                    view.bSelected = false
                    catchIndex = parseInt(k)
                }else{
                    // v:runAction(cc.MoveTo:create(0.2,cc.p((k-1)*CARD_WIDTH[this.dir]+CARD_WIDTH_OFFSET[this.dir],(k-1)*CARD_HEIGHT[this.dir]+CARD_HEIGHT_OFFSET[this.dir])))
                    let toX = parseInt(k)*this._cardWidth + this.wOffset
                    let toY = parseInt(k)*this._cardHeight + this.hOffset
                    Laya.Tween.to(view,{x : toX, y : toY},20)
                    view.bSelected = false
                }
            }
            if (catchIndex >= 0){
                if (catchIndex == 0){
                    Laya.Tween.to(this.catch,{x:this.wOffset},20,null,Laya.Handler.create(this,function(){
                        this.catch = null
                        this._isMoveing = false
                    }))
                }else{
                    TweenUtils.get(this.catch).to({ y: -110 }, 200 ).to({ x: catchIndex*this._cardWidth + this.wOffset }, 200).to({ y: 0 }, 200, null, Laya.Handler.create(this,function(){
                        this.catch = null
                        this._isMoveing = false
                    }));
                }
            }
            // this.touchRect = cc.rect(display.width-RECT_X-#this.cards*TOUCH_CARD_WIDTH, RECT_Y, 100+#this.cards*TOUCH_CARD_WIDTH, TOUCH_CARD_HEIGHT)
            // this.lastTouchTime = nil
        }
     }

    private moveCatch(index){
       this.cardsViews[index] = this.catch
       this.catch = null
       this.touchRect = new Laya.Rectangle()
    }

    public moveCardsToRight(noAni?: boolean){
        let cardsNum: number = this.cardsViews.length
        let width = this.CARD_WIDTH[this.dir-1]
        let widthOffset = this.CARD_WIDTH_OFFSET[this.dir-1]
        for (var k in this.cardsViews){
            let view = this.cardsViews[k];
            view.bSelected = false
            if (parseInt(k) == 0){
                if (noAni){
                    view.pos(0, 0)
                }else{
                    Laya.Tween.to(view, {x:0, y:0},20)
                }
                this.catch = view
            }else{
                if (noAni){
                    let toX = (parseInt(k)-1)*this._cardWidth + this.wOffset
                    let toY = (parseInt(k)-1)*this._cardHeight + this.hOffset
                    view.pos(toX, toY)
                    
                }else{
                    let toX = (parseInt(k)-1)*this._cardWidth + this.wOffset
                    let toY = (parseInt(k)-1)*this._cardHeight + this.hOffset
                    Laya.Tween.to(view,{x:toX,y:toY},20)
                }
            }
        }
    }

public removeCards(cards, noAni?){
    if(cards.length == 0) return
	this.unSelectSelfCards()
	let index:number = -1
	for (var k in cards){
        let v = cards[k]
		if ((this.dir == 1 && Utils.checkSeatid(BaseGameData.selfSeatid)) || BaseGameData.isRecord == 1){
			index = this.cards.indexOf(v)
			if (index >= 0){
                this.cards.splice(index,1)
				let view = this.cardsViews[index]
                this.cardsViews.splice(index,1)
                view.removeSelf()
          
            }
        }else{
            if(this.catch){
                this.cardsViews.shift()
                this.cards.shift()
                this.catch.removeSelf()
                this.catch = null
            }else{
                let view = this.cardsViews[this.cardsViews.length-1]
                this.cardsViews.pop()
                this.cards.pop()
                if(view)
                view.removeSelf()
            }
		}
    }
    if(noAni) return
	if (cards.length > 2 || cards.length == 1){
		this.updatePos()
    }else{
		this.moveCardsToRight()
    }
}

    

public removeCard(card){
	// for k,v in pairs(this.cardsViews) do
	// 	v:setVisible(true)
	// 	v:setOpacity(255)
	// end
	if (BaseGameData.isRecord == 0){
		if ((this.catch && this.catch.card == card) || this.dir != 1 || (this.dir == 1 &&  !Utils.checkSeatid(BaseGameData.selfSeatid))){ 
			let view = this.cardsViews[0]
			this.cardsViews.shift()
            this.cards.shift()
			view.removeSelf()
			view = null
			this.catch = null
			return
		}
	}
	let index = this.cards.indexOf(card)
	if(BaseGameData.isRecord == 0){
		if (this.dir != 1 || !BaseGameData.selfSeatid){
			index = this.cardsViews.length
        }
    }
	
	if (index >= 0){
        this.cards.splice(index,1)

		let view = this.cardsViews[index]
        this.cardsViews.splice(index,1)
		view.removeSelf()
		this.updatePos()
    }
}

public setCatchCard(catch_card):void{
	if (this.cards.length%3 == 2){
        return  
    } 
	this.unSelectCards()

	// this.clearCurrentOpt()
	let cardid = catch_card || 0
	let showFront = false
	if (cardid > 0 && cardid != 99){ 
		showFront = true 
    }
	let isShowShu = true
	// let scale = (cardid > 0 && cardid != 99) ? this.SHOWCARD_SCALE[this.dir-1] : this.CARD_SCALE[this.dir-1]
	let index = this.cardsViews.length
	if (this.dir == 1){
		isShowShu = true
    }else{
		if (cardid > 0 && cardid != 99){
			isShowShu = false
        }
	}
	if (this.dir == 2){
		index = 0
    }
	let card = new this._cardView(cardid,this.dir,null)
    this.addChildAt(card, index)
        card.pos(0,-30)
	// card.index = this.cards.length

	let cards = [cardid]
	let cardView = [card]
    this.cards = cards.concat(this.cards)
    this.cardsViews = cardView.concat(this.cardsViews)
	
	let catchCard = card
	this.catch = catchCard
    Laya.Tween.to(card,{y:0},20)
	
}



public shuffleCards(callback){
    let width = this.CARD_WIDTH[this.dir-1]
    let widthOffset = this.CARD_WIDTH_OFFSET[this.dir-1]
    let height = this.CARD_HEIGHT[this.dir-1]
    let heightOffset = this.CARD_HEIGHT_OFFSET[this.dir-1]
	let callF = Laya.Handler.create(this,function(){
		for (var k in this.cardsViews){
			let view = this.cardsViews[k]
            view.shuffle()
			// if (view.card == this.SHIFTER_NUM){
			// 	view.hideGod()
            // }
		}
		
		if (this.dir == 1){
			this.sortCardsViews()
			this.sortCards(this.cards)
        }
		for (var k in this.cardsViews){
            let view = this.cardsViews[k]
            Laya.Tween.to(view,{x:parseInt(k)*this._cardWidth+this.wOffset,y:parseInt(k)*this._cardHeight+this.hOffset},20)
        }
    })
	// let delay = cc.DelayTime:create(0.4)
	let callF2 = Laya.Handler.create(this,function(){
		for (var k in this.cardsViews){
			let view = this.cardsViews[k]
            view.shuffle()
			// if (view.card == this.SHIFTER_NUM){
			// 	view.hideGod()
            // }
		}
    })
    let callF3 = Laya.Handler.create(this,function(){
		for (var k in this.cardsViews){
			let view = this.cardsViews[k]
            view.shuffle()
            if(parseInt(k) == (this.cardsViews.length-1)){
                callback()
            }
			// if (view.card == this.SHIFTER_NUM){
			// 	view.hideGod()
            // }
		}
    })
    TweenUtils.get(this).to({},0,null,callF,400).to({},0,null,callF3,400)//.to({},0,null,callF2,400).to({},0,null,callF2,400).to({},0,null,callF3,400)
}

// public showCard( index, callback ){
// 	let cardView = this.cardsViews[index]
// 	if (cardView && cardView.front && !cardView.isShow)
// 		let callF = cca.callFunc(callback)
// 		card:runAction(cca.seq(cardView:flipAction(), callF))
// 		cardView.isShow = true
// 	elseif callback then
// 		callback()
// 	end
// end

public removeAllCards(){
	for (var k in this.cardsViews){
        let view = this.cardsViews[k]
		view.removeSelf()
		view = null
    }
	this.cardsViews = []
	this.cards = []
}

public showAllCards( cards ){
	let hasCalled:boolean = false
    this.sortCards(cards)
    this.cards = cards
	for (var k in this.cardsViews){
        let view = this.cardsViews[k];
		view.updateFront(cards[k]);
    }

}

// public setCardsOpacity( opac )
// 	let cardViews = self:getCardViews()
// 	for k,v in pairs(cardViews) do
// 		v:setOpacity(opac)
// 	end
// end

// public setCardsScale( scale )
// 	for k,v in pairs(this.cardsViews) do
// 		v:setScale(scale)
// 	end
// end

public unSelectCards(){
	// _tingCardManager:clearAll()
	for (var k in this.cardsViews) {
        let view = this.cardsViews[k]
		view.downAction()
    }
}

public unSelectSelfCards(){
	for (var k in this.cardsViews){
		let view = this.cardsViews[k]
		if (view.isSelected()){  
			view.downAction()
        }
	}
}

public sortCards(cards){
    let length = cards.length
	for (var i=0;i<length-1;i++){
		for (var j=i+1;j<length;j++){
			if (BaseGameData.SHIFTER_NUM == (cards[i]%100) || BaseGameData.SHIFTER_NUM == (cards[j]%100)){
				if (BaseGameData.SHIFTER_NUM == (cards[i]%100) && BaseGameData.SHIFTER_NUM != (cards[j]%100)){
					let a = cards[i]
					cards[i] = cards[j]
					cards[j] = a
                }
            }else if ((cards[i]%100) < (cards[j]%100)){
				let a = cards[i]
				cards[i] = cards[j]
				cards[j] = a
            }
		}
    }
}

public sortCardsViews(){
    let length = this.cardsViews.length
	for (var i=0;i<length-1;i++){
		for (var j=i+1;j<length;j++){
			if (BaseGameData.SHIFTER_NUM == (this.cardsViews[i].card%100) || BaseGameData.SHIFTER_NUM == (this.cardsViews[j].card%100)){
				if (BaseGameData.SHIFTER_NUM == (this.cardsViews[i].card%100) && BaseGameData.SHIFTER_NUM != (this.cardsViews[j].card%100)){
					let a = this.cardsViews[i]
					this.cardsViews[i] = this.cardsViews[j]
					this.cardsViews[j] = a
                }
            }else if ((this.cardsViews[i].card%100) < (this.cardsViews[j].card%100)){
				let a = this.cardsViews[i]
				this.cardsViews[i] = this.cardsViews[j]
				this.cardsViews[j] = a
            }
        }
    }
}

public updateFlower(cards, count){
    if (cards && cards.length > 0){
		this.sortCards(cards)
		for (var k in cards){
			let v = cards[k]
            this.addCard(v, null)
        }
    }else{
		for (var i=0;i<count;i++){
			this.addCard(0, null)
        }
    }

	if (this.cards.length%3 == 2){
		this.moveCardsToRight(true)
    }

    if(this.dir == 4){
        this.updateCardIndex()
    }
}

public updateHandCards(cards, count, optcallback){
	// if (this.cards.length > 0){
	// 	return
    // }
    if(this.cardsViews.length > 0) return
	if (cards && cards.length > 0){
		this.sortCards(cards)
		for (var k in cards){
			let v = cards[k]
            this.addCard(v,optcallback)
        }
    }else{
		for (var i=0;i<count;i++){
			this.addCard(0, null)
        }
    }

	if (this.cards.length%3 == 2){
		this.moveCardsToRight(true)
    }

    if(this.dir == 4){
        this.updateCardIndex()
    }
}

public getCardSizeAndPos(){
	let x:number = (this.cards.length-1)*this.CARD_WIDTH[this.dir]+this.CARD_WIDTH_OFFSET[this.dir]
	let y:number = (this.cards.length-1)*this.CARD_HEIGHT[this.dir]+this.CARD_HEIGHT_OFFSET[this.dir]
    let width = this.CARD_WIDTH[this.dir]
    let height = this.CARD_HEIGHT[this.dir]
    return {x : x, y : y, width : width, height : height }
}

// public clearCurrentOpt()
// 	if _gameController.moveCard then
// 		_gameController.moveCard:removeSelf()
// 		_gameController.moveCard = nil
// 		if this.touchIndex then
// 			this.cardsViews[#this.cards+1-this.touchIndex]:setVisible(true)
// 		end
// 		this.cardX,this.cardY,this.beginX,this.beginY = nil,nil,nil,nil
// 	end
// end

// public clearMoveCard()
// 	if _gameController.moveCard then
// 		_gameController.moveCard:removeSelf()
// 		_gameController.moveCard = nil
// 	end
// end

public clearUI(){
	for (var k in this.cardsViews) {
        let view = this.cardsViews[k]
		view.removeSelf()
		view = null
    }
	this.cardsViews = []
	this.cards = []
}

public showArror(){
    if(this.dir != 1) return
    for(var k in this.cardsViews){
        let view = this.cardsViews[k]
        let index = BaseGameData.tingCards.indexOf((view.card%100))
        if(index >= 0){
            view.view._ting.visible = true
        }else{
            view.view._ting.visible = false
        }
    }
}

public clearArror(){
    if(this.dir != 1) return
    for(var k in this.cardsViews){
        let view = this.cardsViews[k]
        let index = BaseGameData.tingCards.indexOf(view.card%100)
        if(view){
            view.view._ting.visible = false
        }
    }
}

public changeArrowByIndex(k){
	if (!BaseGameData.optSeatid || BaseGameData.optSeatid != BaseGameData.selfSeatid){
		return
    }

	BaseTingCardManager.instance.clearAll()
	if (this.cardsViews && this.cardsViews[k]){
		if (this.cardsViews[k].bSelected){
			BaseTingCardManager.instance.tingCard(this.cardsViews[k].card%100)
		}
    }
}

// public tingCard()
// 	let info = _gameDataMgr:tingCard()
// 	if not info then return end
// 	this.arrows = {}
// 	for k,v in ipairs(this.cardsViews) do
// 		for i,j in pairs(info) do
// 			if i == v.card then
// 				v:showArraw()
// 			end
// 		end
// 	end
// end

public clearArrow(){
	for (var k in this.cardsViews) {
        let view = this.cardsViews[k]
    	view.hideArraw()
    }
	// _tingCardManager:clearAll()
}

    public clearTouch(){
        for(var k in this.cardsViews){
            let view = this.cardsViews[k]
            view.view._mask.visible = true
        }
        Dispatcher.off("handview", this, this.onMouseDown)
    }
}