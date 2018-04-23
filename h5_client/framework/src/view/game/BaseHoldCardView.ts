class BaseHoldCardView extends Laya.View{
     public seatid
     public dir
     public cardsView = []
     public cards = []
     protected posX
     protected posY
     protected _scale
     constructor(seatid, dir) {
        super();
        this.init(seatid, dir)
        if(dir == 1){
			// Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
		}
        Dispatcher.on("mask_same_card",this,this.markSameCard)
        Dispatcher.on("clear_same_card",this,this.clearMarkCard)
    }

    protected onResize(){
        if(Laya.stage.width/Laya.stage.height < 8/5 && this.dir == 1){
            this._scale = Laya.stage.width/1024
        }else{
            this._scale = 1
        }
        let cards = this.cards
        this.cards = []
        this.cardsView = []
        this.updateView(cards)
    }

    public init(seatid, dir){
        this.seatid = seatid
        this.dir = dir
        this.posX = 0
        this.posY = 0
        this._scale = 1
        // if(Laya.stage.width/Laya.stage.height < 8/5 && dir == 1){
        //     this._scale = Laya.stage.width/1024
        // }
        if(dir == 1){
            this.height = 72
        }
    }

    protected getHoldModel(target_dir){
        switch(this.dir){
            case 1 :  
                if (target_dir == 2){
                    return ui.mj.HoldCard.Card_2_1UI
                }else if(target_dir == 3){
                    return ui.mj.HoldCard.Card_3_1UI
                }else if(target_dir == 4){
                    return ui.mj.HoldCard.Card_4_1UI
                }else if(target_dir == 1){
                    return ui.mj.HoldCard.Card_3_1UI
                }
            case 2 :
                if (target_dir == 1){
                    return ui.mj.HoldCard.Card_1_2UI
                }else if(target_dir == 3){
                    return ui.mj.HoldCard.Card_3_2UI
                }else if(target_dir == 4){
                    return ui.mj.HoldCard.Card_4_2UI
                }else if(target_dir == 2){
                    return ui.mj.HoldCard.Card_4_2UI
                }
            case 3 :
                if (target_dir == 1){
                    return ui.mj.HoldCard.Card_1_3UI
                }else if(target_dir == 2){
                    return ui.mj.HoldCard.Card_2_3UI
                }else if(target_dir == 4){
                    return ui.mj.HoldCard.Card_4_3UI
                }else if(target_dir == 3){
                    return ui.mj.HoldCard.Card_1_3UI
                }
            case 4 :
                if (target_dir == 1){
                    return ui.mj.HoldCard.Card_1_4UI
                }else if(target_dir == 2){
                    return ui.mj.HoldCard.Card_2_4UI
                }else if(target_dir == 3){
                    return ui.mj.HoldCard.Card_3_4UI
                }else if(target_dir == 4){
                    return ui.mj.HoldCard.Card_2_4UI
                }
        }
    }

    public addHoldCard(info){
        let target_dir = Utils.getDir(info.fromSeatid)
            console.log("info.fromSeatid"+info.fromSeatid+"target_dir"+target_dir+"this.dir"+this.dir+"selfseatid"+BaseGameData.selfSeatid)
            let view = this.getHoldModel(target_dir)
            let hold_card = new view()
            hold_card.scale(this._scale, this._scale)
            this.addChild(hold_card)
            
            hold_card.pos(this.posX,this.posY)  
            hold_card.zOrder = this.cardsView.length + 1
            if(this.dir == 1){
                this.width = 400
                this.posX = this.posX + hold_card.width + 10
            }else if(this.dir == 2){
                this.width = 36
                this.posY = this.posY - hold_card.height - 1
                hold_card.zOrder = 5 - this.cards.length
                
            }else if(this.dir == 3){
                this.width = 360
                this.posX = this.posX - hold_card.width - 6
            }else if(this.dir == 4){
                this.width = 36
                this.posY = this.posY + hold_card.height + 5
                
            }
            // for(var j in info.cards){
            //     let v = info.cards[j]
            //     hold_card["card_"+(parseInt(j)+1)]._front.skin = "card/"+ v + ".png"
            // }
            let cards = info.cards
            console.info(cards)
            if(info.opttype == GameDef.OptType.MJ_CHI){
                // if(target_dir == 2){
                // }else if(target_dir == 3){
                //     cards = [cards[0],cards[2],cards[1]]
                // }else if(target_dir == 4){
                //     cards = [cards[2],cards[0],cards[1]]
                // }
                cards = [cards[2],cards[0],cards[1]]
            }
            console.log("chipenggang ============================")
            console.info(cards)
            for(var i=0;i<4;i++){
                let v = cards[i]
                if (v){
                    hold_card["card_"+(i+1)]._bg.skin = "card/"+hold_card["card_"+(i+1)].name+"/"+ (v%100) + ".png"
                }else if(v == 0){
                    hold_card["card_"+(i+1)]._back.visible = true
                }else{
                    hold_card["card_"+(i+1)].visible = false
                }
                // if (info.opttype == GameDef.OptType.MJ_ANGANG && i < 3){
                //     hold_card["card_"+(i+1)]._back.visible = true
                // }

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

    public updateIndex(){
        for(var k in this.cardsView){
            let view = this.cardsView[k]
            this.setChildIndex(view, this.cards.length - 1 - parseInt(k))
        }
    }


    public updateView(cardsInfo){
        this.removeChildren()
        this.posX = 0
        this.posY = 0
        for(var k in cardsInfo){
            let info = cardsInfo[k]
            this.addHoldCard(info)
        }
    }

    public clearUI(){
        for (var k in this.cardsView){
            let view = this.cardsView[k]
            view.removeSelf()
            view = null
        }
        this.cardsView = []
        this.cards = []
    }

    public pengGang(card){
        for (var k in this.cards){
            let info = this.cards[k]
            if (info.opttype == GameDef.OptType.MJ_PENG){
                for(var j in info.cards){
                    if (info.cards[j]%100 == card % 100){
                        let view = this.cardsView[k]
                        view["card_4"]._bg.skin = "card/"+view["card_4"].name+"/"+(card%100)+".png"
                        view["card_4"].visible = true
                        info.opttype = GameDef.OptType.MJ_PENGGANG					
                        return
                    }
                }
            }
        }
    }

    public getHoldPos(){
        let pos = this.localToGlobal(new laya.maths.Point(0,0))
        
        if (this.dir == 1){
            pos.x = pos.x + this.width
        }else if (this.dir == 2){
            pos.y = pos.y-this.height
        }else if (this.dir == 3){
            pos.x = pos.x-this.width
        }else if (this.dir == 4){
            pos.y = pos.y+this.height
        }
        
        return pos
    }

    public markSameCard(card){
        for(var k in this.cards){
            let v = this.cards[k]
            let cards = v.cards
            if(v.opttype == GameDef.OptType.MJ_CHI){
                // if(target_dir == 2){
                // }else if(target_dir == 3){
                //     cards = [cards[0],cards[2],cards[1]]
                // }else if(target_dir == 4){
                //     cards = [cards[2],cards[0],cards[1]]
                // }
                cards = [cards[2],cards[0],cards[1]]
            }
            for(var i in cards){
                let m = cards[i]
                if(m%100 == card%100){
                    this.cardsView[k]["card_"+(parseInt(i)+1)]._mask.visible = true
                }else{
                    this.cardsView[k]["card_"+(parseInt(i)+1)]._mask.visible = false
                }
            }
        }
    }

    public clearMarkCard(){
        for(var k in this.cards){
            let v = this.cards[k]
            for(var i in v.cards){
                this.cardsView[k]["card_"+(parseInt(i)+1)]._mask.visible = false
            }
        }
    }
}