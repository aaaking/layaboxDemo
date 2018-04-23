module jinyun_mj{
   export  class WinCardView extends BaseWinCardView{
        constructor(seatid, dir, callback){
            super(seatid, dir)
            this.registerCardView(jinyun_mj.CardView)
        }

        
    }

}
