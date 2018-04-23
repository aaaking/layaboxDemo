// import HandCardView = require("./shanxi_mj")


class BaseHandCardManager {
    constructor() {

    }
    public handCardsViews = [];
    private static _instance: BaseHandCardManager;
	protected _handClass
	public static get instance(): BaseHandCardManager {
		if (this._instance == undefined) {
			this._instance = new BaseHandCardManager();
		}
		return this._instance;
	}

	public registerClass(handClass){
		this._handClass = handClass
	}

	
    public addHandCardView(seatid,dir,callback){
		
        if (!this.handCardsViews[seatid]){
            var view = new this._handClass(seatid, dir, callback)
            this.handCardsViews[seatid] = view
            return view
        }
        // if not this.handCardsViews[seatid] then
        //     var view = HandCardsView.new(seatid, dir,callback)
        //     this.handCardsViews[seatid] = view
        //     return view
        // end
    }

    public addCard(seatid,cardid,callback){
	    this.handCardsViews[seatid].addCard(cardid,callback)
    }

public removeCard(seatid,cardid){
	var card = cardid || 0
	this.handCardsViews[seatid].removeCard(card)
}

 public setCatchCard(seatid,catchCard){
	 if (this.handCardsViews[seatid]){
		 this.handCardsViews[seatid].setCatchCard(catchCard)
	 }
 }

public updatePos(seatid){
	if (!Utils.checkSeatid(seatid)) return
	
	this.handCardsViews[seatid].updatePos()
}

public shuffleCards(seatid,callback){
	if (this.handCardsViews[seatid].dir == 1){
		this.handCardsViews[seatid].shuffleCards(callback)
    }
}

public getHandCardViews(seatid){
	if (this.handCardsViews[seatid]){
		return this.handCardsViews[seatid].cardsViews.length
    }
}

public showHandCards(seatid,cards){
	var view = this.handCardsViews[seatid]
	if(view){
		// var cards = view.setCardsFront(cards,wincard)
		view.showAllCards(cards)
	}
}

public getHandCardPosition(seatid,card){
	var views = this.handCardsViews[seatid].cardsViews
	if (!Utils.checkSeatid(BaseGameData.selfSeatid) || this.handCardsViews[seatid].dir != 1){
		let x = views[0].x
        let y = views[0].y
		let pos = this.handCardsViews[seatid].localToGlobal(new laya.maths.Point(x,y))
		return pos
    }else{
		for (var k in views){
            let v = views[k]
			if (v.card == card){
				var x = v.x
                var y = v.y
				var pos = this.handCardsViews[seatid].localToGlobal(new laya.maths.Point(x,y))
				return pos
            }
		}
	}
}

public updateHandCards(seatid,cards,count){
	if (this.handCardsViews[seatid]){
		// if(count > 1){
			this.handCardsViews[seatid].updateHandCards(cards,count)
		// }else{
		// 	this.setCatchCard(seatid, cards[0])
		// }
	}
}

public updateFlower(seatid, cards, count){
	if (this.handCardsViews[seatid]){
		// if(count > 1){
			this.handCardsViews[seatid].updateFlower(cards,count)
		// }else{
		// 	this.setCatchCard(seatid, cards[0])
		// }
	}
}

// public addFlowerCards(seatid,cards,count)

public updateHandCardSize(seatid,width,height){
	this.handCardsViews[seatid].wOffset = width
	this.handCardsViews[seatid].hOffset = height
}

public clearCurrentOpt(){
	if (Utils.checkSeatid(BaseGameData.selfSeatid)){
		this.handCardsViews[BaseGameData.selfSeatid].clearCurrentOpt()
    }
}

public removeCards(seatid,cards,noAni?){
	this.handCardsViews[seatid].removeCards(cards,noAni)
}

public updateHoldPos(seatid){
	if (this.handCardsViews[seatid]){
		var cardsViews = this.handCardsViews[seatid].cardsViews
		var x,y,width,height = this.handCardsViews[seatid].getCardSizeAndPos()
		var pos = this.handCardsViews[seatid].convertToWorldSpace(x,y)
		// _holdCardManager:updatePos(seatid,pos.x,pos.y,width,height)
    }
}

public clearAll(){
	for (var k in this.handCardsViews){
		let view = this.handCardsViews[k]
        view.clearUI()
		view.removeSelf()
		view = null
    }
	this.handCardsViews = null
	this.handCardsViews = []
}

public tingCard(){
	// if (!_gameController.optSeatid || _gameController.optSeatid != BaseGameData.self_seatid) return

	if (Utils.checkSeatid(BaseGameData.selfSeatid)){
		this.handCardsViews[BaseGameData.selfSeatid].tingCard()
    }
}

public clearArrow(){
	if (Utils.checkSeatid(BaseGameData.selfSeatid) && this.handCardsViews[BaseGameData.selfSeatid].clearArrow){
		this.handCardsViews[BaseGameData.selfSeatid].clearArrow()
    }
}

public unSelectCards(){
	if (Utils.checkSeatid(BaseGameData.selfSeatid) && this.handCardsViews[BaseGameData.selfSeatid]){
		this.handCardsViews[BaseGameData.selfSeatid].unSelectCards()
    }
}

public removeFlowerCards(seatid,cards){
	this.handCardsViews[seatid].removeFlowerCards(cards)
}

public addFlowerCards(seatid,cards){
	if (Utils.checkSeatid(seatid) && seatid == BaseGameData.selfSeatid){
		for (var k in cards){
            let v = cards[k]
        	if (v == 99) return
        }
	}
	this.handCardsViews[seatid].addFlowerCards(cards)
}

public darkTingTiles(seatid, ting){
	if (Utils.checkSeatid(seatid) && seatid == BaseGameData.selfSeatid){
		this.handCardsViews[seatid].darkTingTiles(ting)
    }
}

public normalTingTiles(){
	if (Utils.checkSeatid(BaseGameData.selfSeatid)){
		this.handCardsViews[BaseGameData.selfSeatid].normalTingTiles()
    }
}

// public setTouchable(seatid, touchable)
// 	if checkSeatid(seatid) and seatid == BaseGameData.self_seatid then
// 		this.handCardsViews[seatid]:setTouchable(touchable)
// 	end	
// end

public updateFrame(){
	if (Utils.checkSeatid(BaseGameData.selfSeatid) && this.handCardsViews[BaseGameData.selfSeatid]){
		// this.handCardsViews[BaseGameData.self_seatid].updateHandCardFrame(_gameDataMgr.selfInfo.handCards)
    }
}

public showGodCards(){
	for (var k in this.handCardsViews){
		let view = this.handCardsViews[k]
        view.showGods()
    }
}

public initTouch(seatid){
	if (this.handCardsViews[seatid]){
		this.handCardsViews[seatid].initTouch()
	}
}

public showArror(seatid){
	if (this.handCardsViews[seatid]){
		this.handCardsViews[seatid].showArror()
	}
}

public clearArror(seatid){
	if (this.handCardsViews[seatid]){
		this.handCardsViews[seatid].clearArror()
	}
}
	public clearTouch(seatid){
		if(this.handCardsViews[seatid]){
			this.handCardsViews[seatid].clearTouch()
		}
	}


}