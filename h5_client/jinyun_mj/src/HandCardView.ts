module jinyun_mj{
   export  class HandCardView extends BaseHandCardView{
        constructor(seatid, dir, callback){
            super(seatid, dir, callback)
            this.registerCardView(jinyun_mj.CardView)
        }

        // public updateHandCards(cards, count, optcallback){
        //     let newCards = []
        //     for(var k in cards){
        //         let v = cards[k]
        //         newCards.push(this.replace_card(v))
        //     }
        //     super.updateHandCards(newCards, count, optcallback)
            
        // }

        public sortCards(cards){
            let length = cards.length
            for (var i=0;i<length-1;i++){
                for (var j=i+1;j<length;j++){
                    if (78 == (cards[i]%100) || 78 == (cards[j]%100)){
                        if (78 == (cards[i]%100) && 78 != (cards[j]%100)){
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
                    if (78 == (this.cardsViews[i].card%100) || 78 == (this.cardsViews[j].card%100)){
                        if (78 == (this.cardsViews[i].card%100) && 78 != (this.cardsViews[j].card%100)){
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

        public compareCard(card1, card2){
            if (BaseGameData.SHIFTER_NUM == 78){
                return card1 < card2
            }else{
                if (card1%100 == BaseGameData.SHIFTER_NUM)
                    card1 = 78
                if (card2%100 == BaseGameData.SHIFTER_NUM)
                    card2 = 78
            
                return card1 < card2
            }
        }

    }
    
}
