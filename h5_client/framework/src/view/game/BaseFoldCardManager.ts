
class BaseFoldCardManager {
    constructor() {

    }
	public _foldType = 0
    public foldCardsViews = {};
	public _foldClass
    private static _instance: BaseFoldCardManager;
	public static get instance(): BaseFoldCardManager {
		if (this._instance == undefined) {
			this._instance = new BaseFoldCardManager();
		}
		return this._instance;
	}

	public registerClass(foldClass){
		this._foldClass = foldClass
	}

public addFoldCardView(seatid,dir){
	if(this._foldType > 0){
		this.foldCardsViews[0] = new this._foldClass(seatid, dir)
		return this.foldCardsViews[0]
	}else if (!this.foldCardsViews[seatid]){
		let view = new this._foldClass(seatid, dir)
		this.foldCardsViews[seatid] = view
		return view
    }
}

public addFoldCard(seatid,cardid){
	if(this._foldType > 0){
		this.foldCardsViews[0].addFoldCard(cardid)
	}else{
		if(this.foldCardsViews[seatid])
		this.foldCardsViews[seatid].addFoldCard(cardid)
	}
	// HandCardManager:getInstance():updateHandCardSize(seatid,self.holdCardsViews[seatid].width,self.holdCardsViews[seatid].height)
}



public updateFoldCards(seatid,cards){
	this.foldCardsViews[seatid].updateFoldCards(cards)
	// HandCardManager:getInstance():updateHandCardSize(seatid,self.holdCardsViews[seatid].width,self.holdCardsViews[seatid].height)
}



public clearAll(){
	for (var k in this.foldCardsViews){
        let view = this.foldCardsViews[k]
        view.removeSelf()
		view = null
    }
	this.foldCardsViews = {}
}

public getFoldCardPos(seatid){
	if(this._foldType > 0){
		return this.foldCardsViews[0].getLastFlagPos()
	}else{
		if(this.foldCardsViews[seatid])
		return this.foldCardsViews[seatid].getLastFlagPos()
	}
}

public getFoldPosition(seatid){
	if(this._foldType > 0){
		return this.foldCardsViews[0].getFoldCardPos()
	}else{
		return this.foldCardsViews[seatid].getFoldCardPos()
	}
}

public removeFoldCard(seatid){
	if(this._foldType > 0){
		this.foldCardsViews[0].removeFoldCard()
	}else{
		this.foldCardsViews[seatid].removeFoldCard()
	}
	
}

public removeCard(seatid, card){
	if(this._foldType > 0){
		this.foldCardsViews[0].removeCard(card)
	}else{
		if(this.foldCardsViews[seatid]){
			this.foldCardsViews[seatid].removeCard(card)
		}
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
	public hideLastFlag(seatid){
		if(this.foldCardsViews[seatid]){
			this.foldCardsViews[seatid].hideLastFlag()
		}
	}

    public showLastFlag(seatid){
		if(this.foldCardsViews[seatid]){
			return this.foldCardsViews[seatid].getLastFlagPos()
		}
	}

}