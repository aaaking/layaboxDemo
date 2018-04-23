module jinyun_mj {
    export class HoldCardView extends BaseHoldCardView{
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

        public addHoldCard(info){
            let target_dir = Utils.getDir(info.fromSeatid)
            console.log("info.fromSeatid"+info.fromSeatid+"target_dir"+target_dir+"this.dir"+this.dir+"selfseatid"+BaseGameData.selfSeatid)
            let view = this.getHoldModel(target_dir)
            let hold_card = new view()
            hold_card.scale(this._scale, this._scale)
            this.addChild(hold_card)
            
            hold_card.pos(this.posX,this.posY)  
            if(this.dir == 1){
                this.width = 400
                this.posX = this.posX + hold_card.width + 10
            }else if(this.dir == 2){
                this.width = 36
                this.posY = this.posY - hold_card.height - 5
                hold_card.zOrder = 5 - this.cards.length
                
            }else if(this.dir == 3){
                this.width = 360
                this.posX = this.posX - hold_card.width - 6
            }else if(this.dir == 4){
                this.width = 36
                this.posY = this.posY + hold_card.height
                
            }
            // for(var j in info.cards){
            //     let v = info.cards[j]
            //     hold_card["card_"+(parseInt(j)+1)]._front.skin = "card/"+ v + ".png"
            // }
            let cards = info.cards
            console.info(cards)
            if(info.opttype == GameDef.OptType.MJ_CHI){
                cards = [cards[2],cards[0],cards[1]]
            }
            console.log("chipenggang ============================")
            for(var i=0;i<4;i++){
                let v = cards[i]
                if (v){
                    hold_card["card_"+(i+1)]._bg.skin = "card/"+hold_card["card_"+(i+1)].name+"/"+ (this.replace_card(v)%100) + ".png"
                }else if(v == 0){
                    hold_card["card_"+(i+1)]._back.visible = true
                }else{
                    hold_card["card_"+(i+1)].visible = false
                }
                if (info.opttype == GameDef.OptType.MJ_ANGANG && BaseGameData.isGameing){
                    hold_card["card_"+(i+1)]._back.visible = true
                    if(i == 3 && this.dir == 1){
                         hold_card["card_"+(i+1)]._back.visible = false
                    }
                }

            }
            this.cardsView.push(hold_card)
            this.cards.push(info)
            // if(this.dir == 2){
            //     this.updateIndex()
            // }
        }

        public pengGang(card){
            for (var k in this.cards){
                let info = this.cards[k]
                if (info.opttype == GameDef.OptType.MJ_PENG){
                    for(var j in info.cards){
                        if (info.cards[j]%100 == card % 100){
                            let view = this.cardsView[k]
                            view["card_4"]._bg.skin = "card/"+view["card_4"].name+"/"+(this.replace_card(card)%100)+".png"
                            view["card_4"].visible = true
                            info.opttype = GameDef.OptType.MJ_PENGGANG					
                            return
                        }
                    }
                }
            }
        }

    }
}