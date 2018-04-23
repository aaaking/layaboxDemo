class BaseWinCardView extends Laya.View{
    public seatid:number;
    public dir;
    public cardsViews = [];
    public wOffset:number;
    public hOffset:number;
    public cards = []
    public optCallBack:Function;
    
    public CARD_WIDTH = [-64,0,44,0]
    public CARD_HEIGHT = [0,22,0,-22]
    public CARD_WIDTH_OFFSET = [-100,0,50,0]
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
    private _cardView

    constructor(seatid, dir ) {
        super();
        this.init(seatid, dir)
    }

    protected registerCardView(cardView){
        this._cardView = cardView
    }

    public init(seatid, dir){
        this.seatid = seatid
        this.dir = dir
        this.wOffset = 0
        this.hOffset = 0
        this.cards = []
        this.cardsViews = []
        
        this.width = TableLayout.HAND_CARD[dir-1].width
        this.height = TableLayout.HAND_CARD[dir-1].height
    }

    public addCard(cardid:number,callback:Function){
        var cardid = cardid || 0
        var length = this.cardsViews.length
        var index = length //+ 2
        
        
        var card = new this._cardView(cardid,this.dir,null)
        this.addChildAt(card, index)
        // card.pos(length*this.CARD_WIDTH[this.dir-1]+this.CARD_WIDTH_OFFSET[this.dir-1],length*this.CARD_HEIGHT[this.dir-1]+this.CARD_HEIGHT_OFFSET[this.dir-1])
        this.cardsViews.push(card)
        this.cards.push(cardid)
        if (cardid == this.SHIFTER_NUM){
            // card.showGod()
        }
       
    }

   
   
  

    





public clearUI(){
	for (var k in this.cardsViews) {
        let view = this.cardsViews[k]
		view.removeSelf()
		view = null
    }
	this.cardsViews = []
	this.cards = []
}




}