class ChoiceCard extends Laya.Image {
     constructor(cards, choiceType, optcallback) {
        super();
		this.init(cards, choiceType, optcallback)
    }
    private bg
    private choiceType 
    private callback
    private cards
    private _replace_function

    public replace_card(cardid){
        if(cardid%100 == BaseGameData.SHIFTER_NUM){
            cardid = 78
        }else if(cardid%100 == 78){
            cardid = BaseGameData.SHIFTER_NUM
        }
        return cardid
    }

    private init(cards, choiceType, optcallback){
        this.callback = optcallback
        this.choiceType = choiceType
        this.cards = cards

        var B = function(C, D) {
            return C > D;
        };
        this.cards.sort(B);
        this.bg = new Laya.Image("opt/card_border.png")
        this.bg.sizeGrid = "10,10,10,10,0" 
        this.addChild(this.bg)
        // this.bg.sizeGrid = 
        this.bg.width = 20
        for (var k in this.cards){
            let v = this.cards[k]
            let index = parseInt(k)
            let view = new ui.mj.HoldCard.Card_1UI() 
            if(BaseGameData.gameType == GameDef.GAME_TYPE.JINYUN_MJ){
                view._bg.skin = "card/"+view.name+"/"+ (this.replace_card(v)%100) + ".png"  
            }else{
                view._bg.skin = "card/"+view.name+"/"+ (v%100) + ".png"  
            } 
            this.bg.addChild(view)
            view.pos(index*view.width+10,10)
            this.bg.width = this.bg.width + view.width
        }
        // this.bg.width = this.bg.width+20
        this.bg.height = 90
        this.bg.on(Laya.Event.CLICK, this, this.optCard)
    }

    private optCard(){
        this.callback(this.choiceType, this.cards)
    }
}