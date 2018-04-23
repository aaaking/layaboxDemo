module jinyun_mj {
    export class GameEndDialog extends BaseGameEndDialog{
        constructor() {
            super();
            this["name"] = "GameEndDialog";
        }

        

        
        

       
        protected replace_card(cardid){
            if(cardid%100 == BaseGameData.SHIFTER_NUM){
                cardid = 78
            }else if(cardid%100 == 78){
                cardid = BaseGameData.SHIFTER_NUM
            }
            return cardid
        }
        

        public addHoldCard(info){
            let target_dir = this.getDir(info.fromSeatid)
            let view = this.getHoldModel(target_dir)
            let hold_card = new view()
            
            for(var i=0;i<4;i++){
                let v = info.cards[i]
                if (v){
                    hold_card["card_"+(i+1)]._bg.skin = "card/"+hold_card["card_"+(i+1)].name+"/"+ (this.replace_card(v)%100) + ".png"
                }else{
                    hold_card["card_"+(i+1)].visible = false
                }
            }
            return hold_card
        }
        
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
        protected addLoseItem(player, score){
                let view = new ui.mj.GameEndLoseItemUI()
                let head = new HeadUI();
                view._avatar.addChild(head)
                head.setImageBounds(73,73)
                head.getInfo(player.uid || 0)
                
                head._labInfo.visible = false
                head._labName.visible = false
                if (player.seatid == BaseGameData.btnSeatid){
                    view._zhuang.visible = true
                }
                if (score >= 0){
                    view._score.font = "font_num_4"
                    view._score.text = "+"+score 
                }else{
                    view._score.font = "font_num_3"
                    view._score.text = score
                }
                view._name.text =  Utils.getFitNickName(player.nickname,10)

                let arr = BaseGameData.loseDetailObj[player.seatid]
                
                let toX = 10
                for(var k in arr){
                    let v = arr[k]
                    if (v.name != GameDef.WIN_TYPE.XIAZHUANG){
                        let detail = this.addDetail(v.name,v.value,v.sign)
                        view._detail.addChild(detail)
                        detail.x = toX
                        toX = detail.width + detail.x + 10 
                    }else{
                        let img = new Laya.Image("gameEnd/28.png")
                        view.addChild(img)
                        img.centerY = 0
                        img.right = 150
                    }
                }
                    view._pao.visible = false
                return view
            }

        protected addWinItem(player, score){
            let view = new ui.mj.GameEndWinItenUI()
            let head = new HeadUI();
            view._avatar.addChild(head)
            head._labInfo.visible = false
            head._labName.visible = false
            head.setImageBounds(73,73)
            head.getInfo(player.uid)
            view._name.text =  Utils.getFitNickName(player.nickname,10)
            let index = 1
            let posX = 10
            let posY = 0
            if (player.seatid == BaseGameData.btnSeatid){
                    view._zhuang.visible = true
                }
            for(var j in player.holdCards){
                let holdInfo = player.holdCards[j]
                let holdCard = this.addHoldCard(holdInfo)
                view._card.addChild(holdCard)
                holdCard.scale(0.5,0.5)
                holdCard.pos(posX, posY+12)
                posX = posX + holdCard.width*0.5 + 5
                console.log("posX======================"+posX)
            }
            let cards = player.handCards
            this.sortCards(cards)
            for(var m = cards.length-1; m >= 0 ; m--){
                let cardid = player.handCards[m]
                let handCard = new jinyun_mj.CardView(cardid,1,null)
                handCard.scale(0.5,0.5)
                view._card.addChild(handCard)
                handCard.pos(posX, posY)
                posX = posX + 35
            }
            if (BaseGameData.winSeatid){
                let handCard = new jinyun_mj.CardView(BaseGameData.winCard,1,null)
                handCard.scale(0.5,0.5)
                view._card.addChild(handCard)
                handCard.pos(posX+15, posY)
                posX = posX + 15
            }

            let arr = BaseGameData.winDetailObj[player.seatid]
            
            let toX = 10
            let total = 1
            for(var k in arr){
                let v = arr[k]
                let detail = this.addDetail(v.name,v.value, v.sign)
                view._detail.addChild(detail)
                detail.x = toX
                toX = detail.width + detail.x + 10 
                if(v.sign == 3){
                    total = total * v.value
                }
            }
            let totalfan = new Laya.Label(String(total))
            totalfan.font = "font_num_8"
            view._card.addChild(totalfan)
            totalfan.pos(posX+38, posY+19)
            let img = new Laya.Image("gameEnd/total_fan.png")
            view._card.addChild(img)
            img.pos(posX+38+totalfan.width, posY+18)
            view._pao.visible = false
            
            if (score >= 0){
                view._score.font = "font_num_4"
                view._score.text = "+"+score 
            }else{
                view._score.text = score
                view._score.font = "font_num_3"
            }

            if (this._winType == GameDef.MJ_WIN_TYPE.WIN_ALL){
                view._hu.skin = "gameEnd/zimo.png"
            }else{
                view._hu.skin = "gameEnd/pinghu.png"
            }
            return view
        }
        
       

       
    }
}