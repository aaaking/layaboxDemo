
class OptCardView extends BaseCtrl {
        constructor(){
            super()
            this._autoHide = false
            this["name"] = "OptCardView"
            
        }
        private _timeCirleView:TimeCircleView
        private static _instance: OptCardView;
        public static get instance(): OptCardView {
            if (!this._instance)
                this._instance = new OptCardView();
            return this._instance;
        }

        public _ui: ui.shisanshui.CardViewUI;
        private _lastCard
        private _data
        private _cards
        private _mask
        private _selectType
        private _changeing
        private _cardsTypes
        private _lastChoose
        private _timeout
        private _uiPos = {}
        public show(cards, timeout){
            this._cardsTypes = new shisanshui.AutoSeleCards(cards).typeChoice()
            this._data = cards
            this._cards = cards
            this._timeout = timeout
            this.showself();
            
        }

        /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.shisanshui.CardViewUI();
            for(var i = 0;i < 13;i++){
                // let tet = new Laya.Label(String(i))
                // tet.fontSize = 30
                // this._ui["_card_"+i].addChild(tet)
                this._ui["_card_"+i].on(Laya.Event.CLICK, this, this.click)
                this._uiPos[i] = {x:this._ui["_card_"+i].x,y:this._ui["_card_"+i].y}
            }
            
            this._ui._confirm.on(Laya.Event.CLICK, this, this.confirm)
            this._mask = new Laya.Sprite();
            this._ui._circle.mask = this._mask;
            this._ui._typeList.hScrollBar.visible = false
            EventManager.instance.registerOnObject(this, this._ui._typeList, Laya.Event.CLICK, this, this.onClick);
        }
        super.beforeShow();
        this.onShow();
    }

    protected copyCards(cards){
        let newCards = []
        for(var k in cards){
            let v = cards[k]
            newCards.push(v)
        }
        return newCards
    }

    protected onClick(e:Laya.Event){
        switch(e.target.name){
            case "special":
                    if(this._lastChoose)
                    this._lastChoose._choose.selected = false
                    this._selectType = GameDef.OptType.PA_MAKE_S;
                    let view1 = e.target.parent as SpecialCard
                    view1._choose.selected = true
                    this._lastChoose = view1
                    this.resetCards()
                    for(var k in view1._cards){
                        let card = this._ui["_card_"+k]
                        this.setCard(card, view1._cards[k])
                    }
                    
                    let cards1 = this.copyCards(view1._cards)
                    this._cards = cards1
                    break;
            case "normal" :
                    if(this._lastChoose)
                    this._lastChoose._choose.selected = false
                    this._selectType = GameDef.OptType.PA_MAKE_N;
                    let view = e.target.parent as NormalCard
                    view._choose.selected = true
                    this._lastChoose = view
                    this.resetCards()
                    console.info(view._cards)
                    for(var k in view._cards){
                        let card = this._ui["_card_"+k]
                        this.setCard(card, view._cards[k])
                    }
                    let cards = this.copyCards(view._cards)
                    this._cards = cards
                    break;
        }
    }
    private _angle
    private _maxTime
    private _startTime
    private _time
    public start(): void {
        if(!this._timeCirleView){
            this._timeCirleView = new TimeCircleView()
            this._timeCirleView.centerX = 132
            this._timeCirleView.centerY = -341
            this._ui.addChild(this._timeCirleView)
        }
        this._timeCirleView.start(this._timeout)
        // this._angle = 0;
        // this._maxTime = time;
        // this._time = time
        // this._startTime = Laya.Browser.now();
        // Laya.timer.loop(1000, this, this.onTimer);
        // this.onTimer();
    }

    private onTimer(): void {
        this._time = this._time - 1
        this._ui._time.text = String(this._time)
        var time: number = Laya.Browser.now();
        var multiple: number = (this._maxTime - this._time) / this._maxTime;
        var angle = Math.min(360, multiple * 360);
        this.changeGraphics(angle);
        if (multiple >= 1) {
            this.stop();
        }
    }

    public stop() {
        Laya.timer.clear(this, this.onTimer);
    }

    private changeGraphics(angle: number): void {
        this._mask.graphics.clear();
        this._mask.graphics.drawPie(63.5, 63.5, 75, -90 + angle, 270, "#ffffff");
    }

    public onShow(){
        super.onShow()
        this._selectType = GameDef.OptType.PA_MAKE_N
        console.info(this._cards)
        this.init(this._data)
        this._mask.graphics.clear();
        this.start()
    }

    // this.isSpecial = isSpecial;
    //         this.types = types;
    //         this.cards = cards;

    protected resetCards(){
        for(var i = 0 ;i < 13;i ++){
             this._ui["_card_"+i].x = this._uiPos[i].x
             this._ui["_card_"+i].y = this._uiPos[i].y
        }

    }
    
    private init(cards){
        for(var k in cards){
            let card = this._ui["_card_"+k]
            this.setCard(card, cards[k])
        }
        for(let j in this._cardsTypes){
            let v = this._cardsTypes[j]
            if(v.isSpecial){
                let view = new SpecialCard(v)
               
                view.name = "special"
                this._ui._typeList.addChild(view)
                // view.x = parseInt(j)*50
                view.centerX = parseInt(j)*138 - 230
                AlertInGameCtrl.instance.show("出现特殊牌型"+ShiSanShuiLayOut.typeName[v.types[0]]+",<br>预计赢取每家"+ShiSanShuiLayOut.typeScore[v.types[0]]+"<br>是否按照特殊牌型出牌", (code: number) => {
                if (code == AlertCtrl.CONFIRM) {
                    this._selectType = GameDef.OptType.PA_MAKE_S;
                    this._lastChoose = view
                    view._choose.selected = true
                    for(var k in view._cards){
                        let card = this._ui["_card_"+k]
                        this.setCard(card, view._cards[k])
                    }
                    let cards = this.copyCards(view._cards)
                    this._cards = cards
                    this.confirm()
                } else {
                    this._selectType = GameDef.OptType.PA_MAKE_S;
                    this._lastChoose = view
                    view._choose.selected = true
                    for(var k in view._cards){
                        let card = this._ui["_card_"+k]
                        this.setCard(card, view._cards[k])
                    }
                    let cards = this.copyCards(view._cards)
                    this._cards = cards
                }
            });
            }else{
                let view = new NormalCard(v)
                view.name = "normal"
                
                this._ui._typeList.addChild(view)
                view.centerX = parseInt(j)*138 - 230
                if(parseInt(j) == 0){
                    this._selectType = GameDef.OptType.PA_MAKE_N;
                    this._lastChoose = view
                    view._choose.selected = true
                    this.resetCards()
                    for(var k in view._cards){
                        let card = this._ui["_card_"+k]
                        this.setCard(card, view._cards[k])
                    }
                    let cards = this.copyCards(view._cards)
                    this._cards = cards
                }
            }
        }
        // EventManager.instance.registerOnObject(this, this._box, Laya.Event.CLICK, this, this.click);
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

        public click(e:Laya.Event){
            if(!this._lastCard){
                this._lastCard = e.currentTarget
                this._lastCard._mask.visible = true
            }else{
                if(this._changeing) return
                let card = e.currentTarget
                let toX = card.x
                let toY = card.y
                let lastCard = this._lastCard
                this._changeing = true
                Laya.Tween.to(card, {x:this._lastCard.x,y:this._lastCard.y},200)
                Laya.Tween.to(this._lastCard, {x:toX,y:toY},200,null, Laya.Handler.create(this, function(){
                    console.info(this._cards)
                    
                    let name = card.name
                    let card1 = this._cards[name]
                    card.name = this._lastCard.name
                    this._cards[name] = this._cards[this._lastCard.name]
                    
                    this._cards[this._lastCard.name] = card1
                    
                    this._lastCard._mask.visible = false
                    this._lastCard.name = name
                    this._lastCard = null
                    console.info(this._cards)
                    this._changeing = false
                }))
            }
        }

        protected confirm(){
            if(this._selectType == GameDef.OptType.PA_MAKE_N && shisanshui.AutoSeleCards.checkBadBeat(this._cards)){
                this._ui._baopai.alpha = 1
                Laya.Tween.to(this._ui._baopai,{alpha:0},1000,null,null,1000)
            }else{
                server.playerOptReq({opttype : this._selectType, cards : this._cards || []})
                this.hide()
            }
            
            // server.dispatchMessage("game.ShowInfoNtf",{"type":GameDef.ShowInfoType.SHOW_OPT_END,"info":[1]})
            // server.dispatchMessage("game.ShowCardsNtf",{"showncards":[{"seatid":1,"handcards":[40,41,42,43,50,51,52,53,60,61,62,63,70]},
            // {"seatid":2,"handcards":[40,41,42,43,50,51,52,53,60,61,62,63,70]},
            // {"seatid":3,"handcards":[40,41,42,43,50,51,52,53,60,61,62,63,70]},{"seatid":4,"handcards":[40,41,42,43,50,51,52,53,60,61,62,63,70]}]})
            // server.dispatchMessage("game.DetailNtf",{"detailType":GameDef.DETAIL_TYPE.WIN_DEATIL,"playerInfo":[{"seatid":1,"info":[{"name":1000,"value":1},{"name":4,"value":1},{"name":1001,"value":1},{"name":7,"value":1},{"name":1,"value":1},{"name":9,"value":1}]},
            //                 {"seatid":2,"info":[{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1}]},
            //                 {"seatid":3,"info":[{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1}]},
            //                 {"seatid":4,"info":[{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1}]}]})
            //  server.dispatchMessage("game.DetailNtf",{"detailType":GameDef.DETAIL_TYPE.WIN_SPECIAL,"playerInfo":[{"seatid":1,"info":[{"name":1000,"value":1},{"name":4,"value":1},{"name":1001,"value":1},{"name":7,"value":1},{"name":1,"value":1},{"name":9,"value":1}]},
            //                 {"seatid":2,"info":[{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1}]},
            //                 {"seatid":3,"info":[{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1}]},
            //                 {"seatid":4,"info":[{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1},{"name":1,"value":1}]}]})
            // server.dispatchMessage("game.DetailNtf",{"detailType":GameDef.DETAIL_TYPE.GUN_DETAIL,"playerInfo":[{"seatid":1,"info":[{"name":2,"value":1},{"name":3,"value":1},{"name":4,"value":1}]},
            //                 {"seatid":2,"info":[{"name":1,"value":1},{"name":3,"value":1},{"name":4,"value":1}]},
            //                 {"seatid":3,"info":[{"name":1,"value":1},{"name":2,"value":1},{"name":4,"value":1}]},
            //                 {"seatid":4,"info":[{"name":1,"value":1},{"name":2,"value":1},{"name":3,"value":1}]}]})
            // server.dispatchMessage("game.ShowInfoNtf",{"type":GameDef.ShowInfoType.QUAN_LEI_DA,"info":[1,2,3,4]})
        }

        public hide(): void {
            if (this._ui){
                this._lastCard = null
                if(this._timeCirleView){
                    this._timeCirleView.clear()
                    this._timeCirleView = null
                }
                if (this._uiMask)
                this._uiMask.removeSelf();
                this._ui.removeSelf();
                this._ui = null
               
                this.stop()
                
                this._changeing = false
            }
        }
    }

class NormalCard extends ui.shisanshui.MakeTypeNormalUI{
    public _cards = []
    public _types = []
    public  typeList = {
                            1:["1_1.png","1_1.png","1_1.png"],
                            2:["2_1.png","2_1.png","2_1.png"],
                            3:["3_1.png","3_1.png","1_1.png"],
                            4:["4_1.png","4_1.png","4_3_1.png"],
                            5:["5_1.png","5_1.png","5_1.png"],
                            6:["6_1.png","6_1.png","6_1.png"],
                            7:["7_1.png","7_2_1.png","7_1.png"],
                            8:["8_1.png","8_2_1.png","8_1.png"],
                            9:["9_1.png","9_2_1.png","9_1.png"],
                            10:["10_1.png","10_2_1.png","10_1.png"],
                            
                        }
    constructor(data){
        super()
        this._types = data.types
        this._cards = data.cards
        this.initType(this._types)
    }

    public initType(info){

        for(var k in  info){
            let v = info[k]
            this["_type_"+k].skin = "shisanshui/normal/"+ this.typeList[v][parseInt(k)]
        }
    }
}


class SpecialCard extends ui.shisanshui.MakeTypeSpecialUI{
    public _cards = []
    public _type = 1
    constructor(data){
        super()
        this._type = data.types[0]
        this._cards = data.cards
        this.initType(this._type)
    }

    public initType(type){
        this._typeIcon.skin = "shisanshui/special/"+type+"_1.png"
    }
}
