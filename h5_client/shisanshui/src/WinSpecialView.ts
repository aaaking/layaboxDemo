class WinSpecialView extends BaseCtrl{
     constructor(){
            super()
			this._autoHide = false
            this["name"] = "WinSpecialView"
        }
        private static _instance: WinSpecialView;
        public static get instance(): WinSpecialView {
            if (!this._instance)
                this._instance = new WinSpecialView();
            return this._instance;
        }

        public _ui: ui.shisanshui.showspecialUI;
        protected _data
        protected _head:HeadUI;
        public show(data){
            this._data = data
            this.showself();
        }

           /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.shisanshui.showspecialUI();
            this._head = new HeadUI();
            this._ui._avatar.addChild(this._head)
            this._head.nameLimit = 10
            this._head.setImageBounds(73,73)
            this._head._labInfo.visible = false

            // this._head._labName.visible = false
            
        }
        super.beforeShow();
        this.onShow();
    }

    public onShow(){
        super.onShow()
        this.playEffect()
    }

    protected playEffect(){
        let info = this._data.shift()
        if(info){
            if(ShiSanShuiLayOut.typeList[info.info[0].name]){
                let player = BaseGameData.getPlayerDataBySeatid(info.seatid)
                SoundManager.instance.playEffect(info.info[0].name,player.sex)
                this._head.getInfo(player.uid)
                this._head.setLabName({ x: 106, y: 25, align: "left", color: "#0d0d0d", fontSize: 24 });
                for(var k in player.handCards){
                    let v = player.handCards[k]
                    this.setCard(this._ui["_card_"+k], v)
                }
                let score = ShiSanShuiLayOut.typeScore[info.info[0].name] //info.info[0].value
                if (score > 0){
                    this._ui._score.text = "+"+score
                    this._ui._score.font = "font_num_14"
                }else{
                    this._ui._score.text = score
                    this._ui._score.font = "font_num_15"
                }
                
                this._ui._type.skin = ShiSanShuiLayOut.typeList[info.info[0].name]
                this._ui.ani1.play(1, false)
                Laya.timer.once(2000,this,function(){
                    this.playEffect()
                })
            }else{
               this.playEffect() 
            }
        }else{
            this.hide()
            AnimationManager.instance.animationOver()
        }

    }

    protected setCard(card:ui.poker.CardBigUI, value){
                let baseUrl = "pokerCardBig/pokerCardBig_";
                card._imgBack.visible = false;
				card._imgFont.visible = true;
				card._imgNum.visible = true;
				card._imgFlowerBig.visible = true;
				if (card._imgFlowerSmall)
					card._imgFlowerSmall.visible = true;
				if (!card._imgFont.texture)
					card._imgFont.source = Laya.Loader.getRes(baseUrl + "front.png");
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
}