module shanxi_mj{
   export  class HandCardView extends BaseHandCardView{
        constructor(seatid, dir, callback){
            super(seatid, dir, callback)
            this.registerCardView(BaseCardView)
        }

        
    }

}
