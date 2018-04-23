module shisanshui{
    export class DealCardView extends Laya.View{
        public callBack
        constructor(callback){
            super()
            this.callBack = callback
            this.width = Laya.stage.width
            this.height = Laya.stage.height
        }

        public dealCards(info){
            SoundManager.instance.playEffect("fapai",1)
            for (let k in info){
                // let index = k
                // let view = new shisanshui.HandCardView(parseInt(index),Utils.getDir(parseInt(index)))
                // this._handCardView[index] = view
                // view.init()
                // this._table.addChild(view)
                // let pos = ShiSanShuiLayOut.HAND_VIEW_LAYOUT[index]
                // Utils.injectProp(view,pos)
                for(let i = 0; i< info[k]; i++){
                    let card = poker.CardBigUI.borrowCard()
                    card.init(false,{scaleX:0.67,scaleY:0.67})
                    card.card = 0
                    this.addChild(card)
                    card.pos(Laya.stage.width/2, Laya.stage.height/2)
                    let posX = ShiSanShuiLayOut.DEAL_VIEW_LAYOUT[BaseGameData.maxPlayer-1][k].x
                    let posY = ShiSanShuiLayOut.DEAL_VIEW_LAYOUT[BaseGameData.maxPlayer-1][k].y
                    Laya.Tween.to(card,{x:posX+i*10,y:posY},200,null,Laya.Handler.create(this,function(){
                        poker.CardBigUI.returnCard(card)
                        if(i == 12 && parseInt(k) == BaseGameData.maxPlayer-1 ){
                             if(this.callBack){
                                 Laya.timer.once(1000,this,this.callBack)
                             }
                        }
                    }),i*100)
                }
            }
        }

        public clear(){
            Laya.Tween.clearAll(this)
        }
    }
}