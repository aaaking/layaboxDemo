class BaseFoldCardView extends Laya.View{

    private CARD_WIDTH = [42,53,-42,-53]
    private CARD_HEIGHT = [55,-35,-55,35]
    private SCALE_LIST =[0.62,0.62,0.62,0.62]
    private MAX_NUM = 12
    private cards = []
    private cardsViews = []
    private dir
    private foldView
    private seatid
        constructor(seatid,dir) {
            super();
            this.init(seatid,dir)
        }

        private init(seatid,dir){
            this.seatid = seatid
            this.dir = dir
            this.cards = []
            this.cardsViews = []
            this.initData()
            if(BaseFoldCardManager.instance._foldType > 0){
                this.foldView = new ui.mj.FoldCard.FoldCardAllUI()
                this.addChild(this.foldView)
                for(var i = 1;i < 115; i++){
                    this.foldView["card_"+i].visible = false
                }
            }else{
                if(BaseGameData.maxPlayer == 2){
                    if(dir == 1){
                        this.foldView = new ui.mj.FoldCard.FoldCard_5UI()
                        this.addChild(this.foldView)
                    }else{
                        this.foldView = new ui.mj.FoldCard.FoldCard_6UI()
                        this.addChild(this.foldView)
                    }
                    for(var i = 1;i < 56; i++){
                        this.foldView["card_"+i].visible = false
                    }
                }else{
                    if (dir == 1){
                        this.foldView = new ui.mj.FoldCard.FoldCard_1UI()
                        this.addChild(this.foldView)
                    }else if(dir == 2){
                        this.foldView = new ui.mj.FoldCard.FoldCard_2UI()
                        this.addChild(this.foldView)
                    }else if(dir == 3){
                        this.foldView = new ui.mj.FoldCard.FoldCard_3UI()
                        this.addChild(this.foldView)
                    }else if(dir == 4){
                        this.foldView = new ui.mj.FoldCard.FoldCard_4UI()
                        this.addChild(this.foldView)
                    }
                    for(var i = 1;i < 34; i++){
                        this.foldView["card_"+i].visible = false
                    }
                }
            }
            this.width = this.foldView.width
            this.height = this.foldView.height
            Dispatcher.on("mask_same_card",this,this.markSameCard)
            Dispatcher.on("clear_same_card",this,this.clearMarkCard)
        }


    public initData(){
        
    }

    private getCardModel(){
        switch(this.dir){
            case 1: return ui.mj.HoldCard.Card_1UI;
            case 2: return ui.mj.HoldCard.Card_2UI;
            case 3: return ui.mj.HoldCard.Card_3UI;
            case 4: return ui.mj.HoldCard.Card_4UI;
        }
    }

    public addFoldCard(cardid){
        let index = this.cards.length + 1
        let view = this.foldView["card_"+index]
        view.visible = true
        if(cardid > 0){
            view._bg.skin = "card/"+view.name+"/"+(cardid%100)+".png"
        }else{
            view._back.visible = true
        }
        this.cards.push(cardid)
    }

    public updateFoldCards(cards){
        if (this.cards.length > 0){
            return
        }
        for (var k in cards){
            let v = cards[k]
            this.addFoldCard(v)
        }
        // this.updateCardIndex()
    }

   

    
    public removeFoldCard(){
        if(this.cards.length){
        let index = this.cards.length

        this.foldView["card_"+index].visible = false
        this.cards.pop()
        }
    }

    public removeAllCards(){
        for (var i = 1; i < 37; i ++){
            this.foldView["card_"+i].visible = false
        }
        this.cards = []
    }

    public removeCard(cardid){
        let index = this.cards.length
        if(this.cards[index-1] == cardid){
             this.foldView["card_"+index].visible = false
             this.cards.pop()
        }

    }

    public showLastFlag(seatid){
         let view = this.cardsViews[this.cardsViews.length]
        if (view){
            return view.showLastFlag()
        }
        // let index = this.cards.length
        // if (index > 0){
        //     this.foldView["card_"+index]._arror.play()
        // }
        
    }

    public hideLastFlag(){
        let index = this.cards.length
        if (index > 0){
            this.foldView["card_"+index]._arror.stop()
        }
    }

    public getLastFlagPos(){
        let length = this.cards.length
        let index = length
        if(index<1) return
        let view = this.foldView["card_"+ index]
        return view.localToGlobal(new laya.maths.Point(view.width/2,15))
    }

    public getFoldCardPos(){
        let length = this.cards.length
        let index = length + 1
        let view = this.foldView["card_"+ index]
        return view.localToGlobal(new laya.maths.Point(0,0))
        // let width = this.CARD_WIDTH[this.dir - 1]
        // let height = this.CARD_HEIGHT[this.dir -1]
        // let x,y
        // if (this.dir == 1){
        //     y = Math.floor(length/this.MAX_NUM)*height
        //     x = (length%this.MAX_NUM)*width
            
        // }else if (this.dir == 2){
        //     x = Math.floor(length/this.MAX_NUM)*width
        //     y = (length%this.MAX_NUM)*height
            
        // }else if (this.dir == 3){
        //     y = Math.floor(length/this.MAX_NUM)*height
        //     x = (length%this.MAX_NUM)*width
            
        // }else if (this.dir == 4){
        //     x = Math.floor(length/this.MAX_NUM)*width
        //     y = (length%this.MAX_NUM)*height
        // }
        // if (BaseGameData.max_player == 2){
        //     x = x + 130 * (this.dir-2.4)
        // }
        // return {x:x,y:y,index:index,scale:this.SCALE_LIST[this.dir-1]}
    }

   

    public updateFoldCardFrame(cards){
        this.removeAllCards()
        this.updateFoldCards(cards)
    }

    public markSameCard(card:number){
        if (!card){
            return
        }
        for (var k in this.cards){
            let v = this.cards[k]
            if ( v % 100 == card % 100){ 
                this.foldView["card_"+(parseInt(k)+1)]._mask.visible = true
            }else{
                this.foldView["card_"+(parseInt(k)+1)]._mask.visible = false
            }
        }
    }

    public clearMarkCard(){
        for (var k in this.cards){
            this.foldView["card_"+(parseInt(k)+1)]._mask.visible = false
        }
    }

}
