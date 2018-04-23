module jinyun_mj {
    export class FoldCardView extends BaseFoldCardView{
        constructor(seatid, dir){
            super(seatid, dir)
        }

         protected replace_card(cardid){
            if(cardid%100 == BaseGameData.SHIFTER_NUM){
                cardid = 78
            }else if(cardid%100 == 78){
                cardid = BaseGameData.SHIFTER_NUM
            }
            return cardid
        }

        public addFoldCard(cardid){
            super.addFoldCard(this.replace_card(cardid))
        }
    }
}