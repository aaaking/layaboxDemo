module jinyun_mj {
    export class TingCardView extends BaseTingCardView{
        constructor(info){
            super(info)
        }

        protected replace_card(cardid){
            if(cardid%100 == BaseGameData.SHIFTER_NUM){
                cardid = 78
            }else if(cardid%100 == 78){
                cardid = BaseGameData.SHIFTER_NUM
            }
            return cardid
        }

        public addItem(cardid, fanshu, num, width, height){
            // super.addItem(this.replace_card(cardid), fanshu, num, width, height)
            let card = new ui.mj.TingItemUI()
            this.bg.addChild(card)
            card.pos(width,height)
            card._card._back.visible = false
            card._card._bg.skin = "card/"+card._card.name+"/"+this.replace_card(cardid)+".png"
            card._num.text = String(BaseGameData.getLeftCardCount(cardid))
            card._card._ting.visible = false
        }


    }
}