module jinyun_mj {
   export class CardView extends BaseCardView{
        constructor(card, dir, optcallback?){
            super(card, dir, optcallback)
        }

        protected replace_card(cardid){
            if(cardid%100 == BaseGameData.SHIFTER_NUM){
                cardid = 78
            }else if(cardid%100 == 78){
                cardid = BaseGameData.SHIFTER_NUM
            }
            return cardid
        }

        protected init(card, dir, optcallback?){
            this.dir = dir
            
            if (optcallback){
                this.callback = optcallback
            }
            let model = this.getModel()
            this.view = new model()
            // if(Laya.stage.width/Laya.stage.height < 8/5 && dir == 1){
            // 	let scale = Laya.stage.width/1024
            // 	this.view.scale(scale,scale)
            // }
            this.addChild(this.view)
            switch(dir){
                case 1: this.view._god.skin = "card/caishen_big.png";break;
                case 2: this.view._god.skin = "card/caishen_small_left.png";break;
                case 3: this.view._god.skin = "card/caishen_small_top.png";break;
                case 4: this.view._god.skin = "card/caishen_small_right.png";break;
            }
            if (card > 0){
                this.view._bg.visible = true
                this.view._back.visible = false
                this.view._bg.skin = "card/"+this.view.name+"/"+(this.replace_card(card)%100)+".png"
                this.card = card
                if(card%100 == 78){
                    this.view._god.visible = true
                }
                // if(this.dir == 1){
                // 	this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
                // }
                // if(GameConfig.IS_TEST){
                //     let la = new Laya.Label(String(card))
                //     this.view.addChild(la)
                //     la.zOrder = 100
                // }
            }else{
                this.view._bg.visible = false
            }
            
        }


        public updateFront(card){
            if (card > 0){
                this.view._back.visible = false
                this.view._bg.visible = true
                // let la = new Laya.Label(String(card))
                // this.view.addChild(la)
                // la.zOrder = 100
                this.view._bg.skin = "card/"+this.view.name+"/"+(this.replace_card(card)%100)+".png"
                this.card = card
                if(card%100 == 78){
                    this.view._god.visible = true
                }else{
                    this.view._god.visible = false
                }
            }
	    }
    }
}