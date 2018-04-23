module shisanshui {
    export class HandCardView extends ui.shisanshui.showcardanimationUI{
        protected _seatid
        protected _dir
        protected _cardList 
        protected _optView:ui.shisanshui.CardViewUI
        protected _lastCard
        protected _scale
        protected _offset
        protected _flag
        protected _heightOffset
        protected _cards
        protected _gunSocre
        constructor(seatid, dir){
            super()
            this._seatid = seatid
            this._dir = dir
            this.width = 209
            // 
            if(dir == 1){
                this._scale = 0.88
                this._offset = -60
                this.height = 288
                this._heightOffset = 70
            }else{
                this.scale(0.67,0.67)
                this._scale = 0.67
                this._offset = -60
                this.height = 225
                this._heightOffset =56
            }

            for (var i = 0; i < 13; i++){
                let card = this["card_"+i]
                card.ani1.gotoAndStop(0)
            }
            this.ani1.gotoAndStop(0)
            this.ani1_0.gotoAndStop(0)
            this.ani1_1.gotoAndStop(0)
            this.visible = false
        }

        public init(){
            this.visible = true
            this._cardList = []

            for (var i = 0; i < 13; i++){
                
                // let card = poker.CardBigUI.borrowCard();
                // card.init(false, { scaleX: 0.67, scaleY: 0.67 });
                // card.card = 0;
                // this.addChild(card)
                // card.x = i*10
                // card.bottom = 0
                let card = this["card_"+i]
                card.ani1.gotoAndStop(0)
                this._cardList.push(card)
            }
            this.ani1.gotoAndStop(0)
            this.ani1_0.gotoAndStop(0)
            this.ani1_1.gotoAndStop(0)
        }

        public updatePos(){
            this.ani1_1.play(1,false)
            // for(var k in this._cardList){
            //     let card = this._cardList[k]
            //     card.scale(this._scale, this._scale)
            //     let toX = parseInt(k) > 9 ? (parseInt(k)-9)*this._offset : parseInt(k)%5*this._offset
            //     let toY = this.height - this._heightOffset - Math.floor(parseInt(k)/5)*this._heightOffset

            //     card.pos(toX, toY)
            //     card.zOrder = 3 - Math.floor(parseInt(k)/5) 
            // }
            this._flag = true
        }

        public showGameEnd(score){
            let s = new Laya.Label(score)
            s.font = "font_num_4"
            this.addChild(s)
            s.pos(this.width/2,this.height/2)
            s.zOrder = 11
        }

        public showCards(cards){
            if(!this._flag) this.updatePos()
            this._cards = cards
            this._gunSocre = 0
            // for(var k in this._cardList){
            //     let card = this._cardList[k]
            //     let index = k
            //     card.skewY = 0
            //     // Laya.Tween.to(card,{skewY:180},2000,function(){
            //         card.card = cards[index]
            //     // })
            // }
        }
        
        
        protected playCardType(name,y,index){
            let v 
            let bg
            if(name > 999){
                v = ShiSanShuiLayOut.typeList[name]
            }else{
                if(name == 4 && index == 2){
                    bg = "shisanshui/showcard_bg_2.png"
                }else if(name == 7 && index == 1 ){
                    bg = "shisanshui/showcard_bg_2.png"
                }else if(name > 7){
                    bg = "shisanshui/showcard_bg_2.png"
                }else{
                    bg = "shisanshui/showcard_bg_1.png"
                }
                v = ShiSanShuiLayOut.typeList[name][index]
            }
            if(v){
                let ani = new ui.shisanshui.showcradtypeUI()
                ani._bg.skin = bg
                ani._type.skin = v
                ani.zOrder = 10
                this.addChild(ani)
                ani.ani1.play(1,false)
                ani.centerX = -this._offset
                ani.y = y
                Laya.timer.once(2000,this,function(){
                    ani.ani1.stop()
                    ani.removeSelf()
                })
            }
        }

        public clear(){
            this.removeChildren()
            this._cardList = []
        }

        public showOpt(cards){
            
            for(var k in this._cardList){
                let card = this._cardList[k]
                card.card = cards[k]
            }
            
        }

        protected showSpecial(){
            this._special.visible = true
        }
        
        protected setCard(card:ui.shisanshui.fanpaiUI, value){
                let baseUrl = "pokerCardBig/pokerCardBig_";
                // card._imgBack.visible = false;
				// card._imgFont.visible = true;
				card._imgNum.visible = true;
				card._imgFlowerBig.visible = true;
				if (card._imgFlowerSmall)
					card._imgFlowerSmall.visible = true;
				// if (!card._imgFont.texture)
				// 	card._imgFont.source = Laya.Loader.getRes(baseUrl + "front.png");
				// if (card._imgOver && !card._imgOver.texture)
				// {
				// 	card._imgOver.source = Laya.Loader.getRes(baseUrl + "mask.png");
				// 	card._imgOver.alpha=0.2;
				// }					
				// if (card._imgMask && !card._imgMask.texture)
				// 	card._imgMask.source = Laya.Loader.getRes(baseUrl + "mask.png");

				var flower: number = value % 10;
				var num: number = Math.floor(value / 10);
				card._imgFlowerBig.source = Laya.Loader.getRes(baseUrl + "flower_big_" + flower + ".png");
				if (card._imgFlowerSmall)
					card._imgFlowerSmall.source = Laya.Loader.getRes(baseUrl + "flower_small_" + flower + ".png");
				var numUrl: string = baseUrl;
				if (this.isBlack(flower))
					numUrl += "black_";
				else
					numUrl += "red_";
                
                var imgNum: number = num;
                if (num == 14)
                    imgNum = 1;
                card._imgNum.source = Laya.Loader.getRes(numUrl + imgNum + ".png");
                if(value == 1){
                    card._imgFlowerBig.source = Laya.Loader.getRes(baseUrl + "flower_big_4.png");
                    card._imgFlowerSmall.source = null
                    card._imgNum.source = Laya.Loader.getRes(baseUrl + "red_14.png");
                }else if(value == 2){
                    card._imgFlowerBig.source = Laya.Loader.getRes(baseUrl + "flower_small_4.png");
                    card._imgFlowerSmall.source = null
                    card._imgNum.source = Laya.Loader.getRes(baseUrl + "black_14.png");
                }
        }

        private isBlack(flower: number): boolean {
			return (flower == poker.CardUI.FLOWER_CLUB || flower == poker.CardUI.FLOWER_SPADE);
		}

        public showWinDetail(info,callback?,noAni?){
            if(!this._cardList){
                if(callback)
                    callback()
            }
            this.showTouDao(info,callback,noAni)
            Laya.timer.once(1500,this,function(){
                this.showZhongDao(info,noAni)
            })
             Laya.timer.once(3000,this,function(){
                this.showWeiDao(info,callback,noAni)
             })
        }

        public showWeiDao(info, callback?, noAni?){
            if(!noAni){
                SoundManager.instance.playEffect("fanpai",1)
                
                this.ani1_0_0.play(0,false)
            }
            let toudao1 = info[0]
            let toudao2 = info[1]
            let cards = BaseGameData.getPlayerDataBySeatid(this._seatid).handCards
            for(let i=0;i<5; i++){
                this.setCard(this._cardList[i], cards[i])
                this._cardList[i].ani1.play(1,false)
                
            }
            // if(this._dir == 1){
                let score1 = toudao1.value || 0
                if(toudao1.value && toudao1.value >= 0){
                    this._score_1.font = "font_num_12"
                    score1 = "+"+score1
                }else{
                    this._score_1.font = "font_num_13"
                }
                this._score_1.text = score1
                let score2 = toudao2.value || 0
                if(toudao2.value && toudao2.value >= 0){
                    this._score_2.font = "font_num_12"
                    score2 = "+"+score2
                }else{
                    this._score_2.font = "font_num_13"
                }
                this._score_2.text = "("+score2+")"
                this._weidao.visible = true
                if(this._dir == 2){
                    this.ani2_0.play(0,false)
                }else
                this.ani2.play(0,false)
                
            // }
            this.playCardType(toudao2.name,190,0)
            if(callback){
                Laya.timer.once(2000,this,callback)
            }
        }

        public showZhongDao(info, noAni?){
            if(!noAni){
                SoundManager.instance.playEffect("fanpai",1)
                this.ani1_0_1.play(0,false)
            }
            let toudao1 = info[2]
            let toudao2 = info[3]
            let cards = BaseGameData.getPlayerDataBySeatid(this._seatid).handCards
            for(let i=5;i<10; i++){
                this.setCard(this._cardList[i], cards[i])
                this._cardList[i].ani1.play(1,false)
            }
            // if(this._dir == 1){
                let score1 = toudao1.value || 0
                if(toudao1.value && toudao1.value >= 0){
                    this._score_3.font = "font_num_12"
                    score1 = "+"+score1
                }else{
                    this._score_3.font = "font_num_13"
                }
                this._score_3.text = score1
                let score2 = toudao2.value || 0
                if(toudao2.value && toudao2.value >= 0){
                    this._score_4.font = "font_num_12"
                    score2 = "+"+score2
                }else{
                    this._score_4.font = "font_num_13"
                }
                this._score_4.text = "("+score2+")"
                this._zhongdao.visible = true
                if(this._dir == 2){
                    this.ani3_0.play(0, false)
                }else
                this.ani3.play(0,false)
                
            // }
            
            this.playCardType(toudao2.name,100,1)
        }
        
        public showTouDao(info,callback?, noAni?){
            if(!noAni){
                SoundManager.instance.playEffect("fanpai",1)
                this.ani1_0.play(0,false)
            }
            let toudao1 = info[4]
            let toudao2 = info[5]
            let player = BaseGameData.getPlayerDataBySeatid(this._seatid)
            if(!player || !player.handCards) {
                if(callback)
                    callback()
            }
            let cards = player.handCards
            for(let i=10;i<13; i++){
                this.setCard(this._cardList[i], cards[i])
                this._cardList[i].ani1.play(1,false)
            }
            // if(this._dir == 1){
                let score1 = toudao1.value || 0
                if(toudao1.value && toudao1.value >= 0){
                    this._score_5.font = "font_num_12"
                    score1 = "+"+score1
                }else{
                    this._score_5.font = "font_num_13"
                }
                this._score_5.text = score1
                let score2 = toudao2.value || 0
                if(toudao2.value && toudao2.value >= 0){
                    this._score_6.font = "font_num_12"
                    score2 = "+"+score2
                }else{
                    this._score_6.font = "font_num_13"
                }
                this._score_6.text = "("+score2+")"
                this._toudao.visible = true
                if(this._dir == 2){
                    this.ani4_0.play(0, false)
                }else
                this.ani4.play(0,false)
                
            // }
            this.playCardType(toudao2.name,20,2)
            // if(callback){
            //     Laya.timer.once(2000,this,callback)
            // }
        }
        private _gunAni
        private gunPos = [[{},{scaleX:-1,rotation:-60},{scaleX:1,rotation:90},{scaleX:1,rotation:60}],[{rotation:-60},{},{scaleX:1,rotation:60},{rotation:0}],[{scaleX:1,rotation:-90},{scaleX:-1,rotation:60},{},{scaleX:1,rotation:-60}],[{scaleX:-1,rotation:60},{scaleX:-1,rotation:0},{scaleX:-1,rotation:-60},{}]]
        public playGun(delay,target,isRemove){
            let targetDir = Utils.getDir(target)
            let removeTag = isRemove
            if(!this._gunAni){
                this._gunAni = new ui.shisanshui.qiangUI()
                this.addChild(this._gunAni)
            }
            Laya.timer.once(1000*parseInt(delay)+500,this,function(){
                
                
                // if(this._dir == 3){
                //     ani.rotation = -90
                // }else if(this._dir == 4){
                //     ani.rotation = 184
                //     ani.scaleY = -1
                // }
                console.log("playgum===========this.dir====="+this._dir+"targetDir========="+targetDir)
                Utils.injectProp(this._gunAni ,this.gunPos[this._dir-1][targetDir-1])
                this._gunAni.zOrder = 10
                this._gunAni.pos(this.width/2+40, this.height/2)
                this._gunAni._ani.play(20,false)
                if(removeTag){
                    Laya.timer.once(1000,this,function(){
                        this._gunAni._ani.stop()
                        this._gunAni.removeSelf()
                        this._gunAni = null
                    })
                }
            }.bind(this))
        }

        public showGunScore(score){
            this._gunSocre = this._gunSocre + score
            this._gun.visible = true
            if(this._dir == 2){
                this._gun.x = -108
            }
            if(this._gunSocre >= 0){
                this._daqiang.font = "font_num_12"
                this._daqiang.text = score = "+"+this._gunSocre
            }else{
                this._daqiang.font = "font_num_13"
                this._daqiang.text = score = this._gunSocre
            }
           
        }

        public playBullet(score,delay,callback?){
            Laya.timer.once(1000*parseInt(delay)+500,this,function(){
                
                let ani = new Laya.Animation()
                ani.loadAnimation(ResourceConfig.ANI_PLAY_BULLET)
                this.addChild(ani)
                ani.zOrder = 10
                ani.pos(this.width/2+50, this.height/2)
                ani.play(23,false)
                this.showGunScore(-score)
                SoundManager.instance.playEffect("daqiang",1)
                Laya.timer.once(2000,this,function(){
                    ani.stop()
                    ani.removeSelf()
                    if(callback){
                        callback()
                    }
                })
            }.bind(this))
        }

        public clearAll(){
            Laya.Tween.clearAll(this)
            Laya.timer.clearAll(this)
        }

    }
}