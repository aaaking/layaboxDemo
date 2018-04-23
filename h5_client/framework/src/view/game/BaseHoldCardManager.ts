
class BaseHoldCardManager {
    constructor() {

    }
    public holdCardsViews = {};
	protected _holdClass
	private static _instance: BaseHoldCardManager;
	public static get instance(): BaseHoldCardManager {
		if (this._instance == undefined) {
			this._instance = new BaseHoldCardManager();
		}
		return this._instance;
	}

	public registerClass(holdClass){
		this._holdClass = holdClass
	}

public addHoldCardView(seatid,dir){
	if (!this.holdCardsViews[seatid]){
		let view = new this._holdClass(seatid, dir)
		this.holdCardsViews[seatid] = view
		return view
    }
}

public addHoldCards(seatid,cardInfo){
	this.holdCardsViews[seatid].addHoldCard(cardInfo)
	// HandCardManager:getInstance():updateHandCardSize(seatid,self.holdCardsViews[seatid].width,self.holdCardsViews[seatid].height)
}



public updateHoldCards(seatid,cardInfo){
	this.holdCardsViews[seatid].updateView(cardInfo)
	// HandCardManager:getInstance():updateHandCardSize(seatid,self.holdCardsViews[seatid].width,self.holdCardsViews[seatid].height)
}



public clearAll(){
	for (var k in this.holdCardsViews){
        let view = this.holdCardsViews[k]
        view.removeSelf()
		view = null
    }
	this.holdCardsViews = {}
}

public getHoldPos(seatid){
	return this.holdCardsViews[seatid].getHoldPos()
	
}

public pengGang(seatid,cards){
	this.holdCardsViews[seatid].pengGang(cards[cards.length-1])
}

public removePengGang(seatid,card){
	if (this.holdCardsViews[seatid]){
		this.holdCardsViews[seatid].removePengGang(card)
	}
}

// public updatePos(seatid,x,y,width,height)
	
// 	if self.holdCardsViews[seatid] then
// 		self.holdCardsViews[seatid]:updatePos(x,y,width,height)
// 	end
// end



// public markSameCard(card)
// 	for k,v in pairs(self.holdCardsViews) do
// 		v:markSameCard(card)
// 	end
// end

// public clearMarkCard()
// 	for k,v in pairs(self.holdCardsViews) do
// 		v:clearMarkCard()
// 	end
// end

}