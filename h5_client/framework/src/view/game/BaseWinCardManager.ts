
class BaseWinCardManager {
    constructor() {

    }
    public winCardsViews = {};
	protected _winClass
    private static _instance: BaseWinCardManager;
	public static get instance(): BaseWinCardManager {
		if (this._instance == undefined) {
			this._instance = new BaseWinCardManager();
		}
		return this._instance;
	}

	public registerClass(winClass){
		this._winClass = winClass
	}

public addWinCardView(seatid,dir){
	if (!this.winCardsViews[seatid]){
		let view = new this._winClass(seatid, dir)
		this.winCardsViews[seatid] = view
		return view
    }
}

public addWinCards(seatid,card){
	this.winCardsViews[seatid].addCard(card)
	// HandCardManager:getInstance():updateHandCardSize(seatid,self.holdCardsViews[seatid].width,self.holdCardsViews[seatid].height)
}



public updateWinCards(seatid,cards){
	this.winCardsViews[seatid].updateView(cards)
	// HandCardManager:getInstance():updateHandCardSize(seatid,self.holdCardsViews[seatid].width,self.holdCardsViews[seatid].height)
}



public clearAll(){
	for (var k in this.winCardsViews){
        let view = this.winCardsViews[k]
        view.removeSelf()
		view = null
    }
	this.winCardsViews = {}
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