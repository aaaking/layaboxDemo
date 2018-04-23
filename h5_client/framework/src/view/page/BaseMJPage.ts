class BaseMJPage extends MatchPage {
    constructor() {
        super();
        this.name = "BaseMJPage";
         this._loadDatas=this._loadDatas.concat([{ url: ResourceConfig.SHEET_OPT, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_TIME_LIMIT, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_CARD, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_CARD_1, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_CARD_2, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_CARD_3, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_CARD_4, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_CARD_5, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_DICE, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_GAME_END, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_TING, type: Laya.Loader.ATLAS }
        ]);
        AppPage.register(BaseMJPage, this._loadDatas);
    }
    private _timeLimit:TimeLimitView;
    private _arror:Laya.Animation;
    protected _foldBigCard:BaseCardView;
    private _chooseView:BaseChooseScore;
    private _ruleView:RuleInfoView;
    protected _lastSeatid
    protected _lastCard
    private _ArrorcenterX
    private _ArrorcenterY
    protected _dealCardsView
    private _scale
    protected _leftView
    protected _waitTips
    protected _dice
    protected _drawShifter
    protected _liuju
    protected init(...params): void {
        BaseGameData.tablelayout = MaJiangLayOut
        super.init.apply(this, params);
        // this.initGameUI()
        this.initEvent()
        if(BaseGameData.isRecord){
            this.PlaySheet()
        }
        BaseFoldCardManager.instance._foldType = 0
        // if(Laya.stage.width/Laya.stage.height < 8/5){
        //     Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        //     AppControl.getInstance().stage.width = 1024;
            
        // }else{
        //     Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
        //     AppControl.getInstance().stage.height = 640;
        // }
        // Laya.stage.setScreenSize(Laya.Browser.clientWidth * Laya.Browser.pixelRatio, Laya.Browser.clientHeight * Laya.Browser.pixelRatio);
    }

    protected initGameUI(){
        this.initCardLayout()
        this.initGameView()
    }

    protected initGameView(){
        
        this.clearGameUI()
        this.clearGame()
        this.initCardsView()
        if(!this._leftView){
            this._leftView = new LeftCardView()
            this._table.addChild(this._leftView)
            this._leftView.centerX = -250
            this._leftView.centerY = -180
            if(!BaseGameData.isTableStart)
                this._leftView.visible = false
        }
    }

    protected showDice(dices){
        SoundManager.instance.playEffect("saizi", 0, 1, false, 1, true)
        this._dice = new ui.mj.DiceViewUI()
        this._table.addChild(this._dice)
        this._dice.pos(Laya.stage.width/2, Laya.stage.height/2)
        this._dice.ani1.play(1,false)
        this._dice._dice_1.play()
        this._dice._dice_2.play()
        Laya.timer.once(1000,this,function(){
            this._dice.ani1.stop()
            this._dice._dice_1.stop()
            this._dice._dice_1.visible = false
            let dice1 = new Laya.Image("dice/Dice_"+dices[0]+".png")
            this._dice.addChild(dice1)
            dice1.pos(this._dice._dice_1.x,this._dice._dice_1.y)
            this._dice._dice_2.stop()
            this._dice._dice_2.visible = false
            let dice2 = new Laya.Image("dice/Dice_"+dices[1]+".png")
            this._dice.addChild(dice2)
            dice2.pos(this._dice._dice_2.x,this._dice._dice_2.y)
            Laya.timer.once(1000,this,function(){
                this._dice.removeChildren()
                this._dice.removeSelf()
                AnimationManager.instance.animationOver()
            })
        })
        
    }
    protected clearGameUI(){
        // GameEndCtrl.instance.hide()
        DialogManager.instance.clearAll()
        this.clearCardsView()
        if(this._liuju){
            this._liuju.ani1.stop()
            this._liuju.removeSelf()
            this._liuju = null
        }
        if(this._foldBigCard){
            this._foldBigCard.removeSelf()
            this._foldBigCard = null
        }
        if(this._timeLimit){
            this._timeLimit.clean()
            this._timeLimit.removeSelf()
            this._timeLimit = null
        }
        if(this._arror){
            this._arror.stop()
            this._arror.removeSelf()
            this._arror = null
        }
        if(this._optChoice){
            this._optChoice.clearUI()
            this._optChoice.removeSelf()
            this._optChoice = null
        }
        if(this._foldBigCard){
            this._foldBigCard.removeSelf()
            this._foldBigCard = null
        }
        if(this._chooseView){
            this._chooseView.removeSelf()
            this._chooseView = null
        }
        if(BaseGameData.moveCard){
            BaseGameData.moveCard.removeSelf()
            BaseGameData.moveCard = null
        }
        if(this._waitTips){
            this._waitTips.removeSelf()
            this._waitTips = null
        }
        // if(this._ruleView){
        //     this._ruleView.removeSelf()
        //     this._ruleView = null
        // }
        
    }

    protected clearGame(){
        BaseGameData.optSeatid = 0
        
        BaseGameData.winDetailArr = []
        BaseGameData.winDetailObj = {}
        BaseGameData.loseDetailArr = []
        BaseGameData.loseDetailObj = {}
        BaseGameData.winCard = 0
        BaseGameData.winSeatid = 0
        this._lastCard = null
        this._lastSeatid = null

    }

    public optCardReq(opttype,cardsInfo){
        // if _gameDataMgr.clearTingCard then
        //     _gameDataMgr:clearTingCard()
        // end
        if(opttype == GameDef.OptType.MJ_TING){
            let handCards = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid).handCards
            for(var k in handCards){
                let card = handCards[k]
                if(card%100 == cardsInfo[0]%100){
                    cardsInfo[0] = card
                    break
                }
            }
        }
        BaseTingCardManager.instance.clearAll()
        BaseHandCardManager.instance.clearArror(BaseGameData.selfSeatid)
        if(this._optChoice){
            this._optChoice.clearUI()
        }
        this.hideFoldBigCard()
        server.playerOptReq({opttype : opttype,cards : cardsInfo || []})
    }

    public foldCard(opttype,card){
        if (!BaseGameData.optSeatid) return 
        console.log(BaseHandCardManager.instance.getHandCardViews(BaseGameData.optSeatid)%3)
        if(opttype == GameDef.OptType.MJ_DISCARD){
            if (BaseHandCardManager.instance.getHandCardViews(BaseGameData.optSeatid)%3 == 2){
                this.foldCardAni(BaseGameData.optSeatid,card)
                this.optCardReq(0, [card])
                BaseGameData.optSeatid = null
            }
        }else{
            this.optCardReq(opttype, [card])
        }
    }

    protected initCardLayout(){
            TableLayout.foldCardLayouts = [[],[{x:0,y:127.5},
                {x:169.5,y:-130},
                {x:0,y:-160},
                {x:-179,y:98.5},],
                [{x:135,y:134},
                {x:161,y:-134},
                {x:-126,y:-160},
                {x:-160,y:105},],[
                {x:135,y:134},
                {x:161,y:-134},
                {x:-134,y:-166},
                {x:-160,y:105},
            ]
            ]
            TableLayout.handCardLayouts = [
                {x:900,y:20},
                {x:106,y:-100},
                {x:-20,y:40},
                {x:127,y:300},
            ]
            TableLayout.holdCardLayouts = [
                {x:-270,y:20},
                {x:110,y:Laya.stage.height - 150},
                {x:320,y:33},
                {x:102,y:40},
            ]

            TableLayout.winCardLayouts = [
                {x:890,y:20},
                {x:106,y:23},
                {x:-20,y:40},
                {x:127,y:300},
            ]

            TableLayout.FOLD_BIG_CARD = [
                {x:360,y:Laya.stage.height/2-100},
                {x:0,y:100},
                {x:-340,y:Laya.stage.height/2-100},
            ]

            TableLayout.OTHER_OPT_POS = [
                {x:0,y:Laya.stage.height-200},
                {x:350,y:Laya.stage.height/2},
                {x:0,y:100},
                {x:-340,y:Laya.stage.height/2},
            ]
    }

    protected clearCardsView(){
        BaseHandCardManager.instance.clearAll()
        BaseFoldCardManager.instance.clearAll()
        BaseHoldCardManager.instance.clearAll()
        BaseWinCardManager.instance.clearAll()
      
        // WinCardManager:clearAll()
        // TingCardManager:clearAll()
        // FlowerCardManager:clearAll()
    }

    protected initCardsView(){
        if(BaseFoldCardManager.instance._foldType > 0){
            let foldView  = BaseFoldCardManager.instance.addFoldCardView(0,0)
            if (foldView){
                this._table.addChild(foldView)
                foldView.centerX = 0
                foldView.centerY = 2
                foldView.zOrder = GameZorder.HandCardView1 - 1
                // foldView.pos(foldPos.x, foldPos.y)
                // foldView:addTo(self,FOLD_CARD_ZORDER):pos(foldCardLayouts[v.dir].x, foldCardLayouts[v.dir].y)
            }
        }
        for (var k in BaseGameData.players){
            let player = BaseGameData.players[k]
            let handPos = TableLayout.handCardLayouts[player.dir-1]
            let foldPos = TableLayout.foldCardLayouts[BaseGameData.maxPlayer-1][player.dir-1]
            let holdPos = TableLayout.holdCardLayouts[player.dir-1]
            let winPos = TableLayout.winCardLayouts[player.dir-1]
            if(BaseFoldCardManager.instance._foldType == 0){
                let foldView  = BaseFoldCardManager.instance.addFoldCardView(player.seatid,player.dir)
                if (foldView){
                    this._table.addChild(foldView)
                    foldView.centerX = foldPos.x
                    foldView.centerY = foldPos.y
                    foldView.zOrder = 6 - player.dir
                    if(player.dir == 4){
                        foldView.zOrder = 6
                    }
                    // foldView.pos(foldPos.x, foldPos.y)
                    // foldView:addTo(self,FOLD_CARD_ZORDER):pos(foldCardLayouts[v.dir].x, foldCardLayouts[v.dir].y)
                }
            }

            let handView = BaseHandCardManager.instance.addHandCardView(player.seatid,player.dir,this.foldCard.bind(this))
            if (handView){
                this._table.addChild(handView)
                if(player.dir == 1){
                    if (Laya.stage.width/Laya.stage.height < 8/5){
                        // handView.scale(0.8,0.8)
                        // let scale = Laya.stage.width/1024
                        let scale = 1
                        handView.bottom = handPos.y
                        handView.centerX = handPos.x*(1-(1-scale)/2)
                    }else{
                        handView.centerX = handPos.x
                        handView.bottom = handPos.y
                    }
                    handView.zOrder = GameZorder.HandCardView1
                }else if(player.dir == 2){
                    handView.right = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + handPos.x : handPos.x
                    handView.centerY = handPos.y
                }else if(player.dir == 3){
                    handView.centerX = handPos.x
                    handView.y = handPos.y
                    let index = this._table.getChildIndex(handView)
                    // this._table.setChildIndex(handView,index-9)
                }else{
                    handView.left = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + handPos.x : handPos.x
                    handView.centerY = handPos.y
                }   
                if(player.dir == 1 && BaseGameData.isRecord == 0){
                    handView.initTouch()
                }
                // handView.pos(handPos.x,handPos.y)
                // handView.pos()
                // handView:addTo(self,HAND_CARD_ZORDER):pos(handCardLayouts[v.dir].x, handCardLayouts[v.dir].y)
            }
            

             let holdView = BaseHoldCardManager.instance.addHoldCardView(player.seatid,player.dir)
            if (holdView){
                this._table.addChild(holdView)
                // holdView.centerX = holdPos.x
                // holdView.y = holdPos.y
                if(player.dir == 1){
                    if (Laya.stage.width/Laya.stage.height < 8/5){
                // handView.scale(0.8,0.8)
                        let scale = Laya.stage.width/1024
                        holdView.left = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + 10 : 10
                    }else{
                        holdView.centerX = holdPos.x
                    }
                    holdView.bottom = holdPos.y
                }else if(player.dir == 2){
                    holdView.right = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + holdPos.x : holdPos.x
                    holdView.y = holdPos.y
                }else if(player.dir == 3){
                    holdView.centerX = holdPos.x
                    holdView.y = holdPos.y
                }else{
                    holdView.left = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + holdPos.x : holdPos.x
                    holdView.y = holdPos.y
                }   
                // let order = v.dir == 4 and FOLD_CARD_ZORDER or HAND_CARD_ZORDER
                // holdView:addTo(self,order):pos(holdCardLayouts[v.dir].x, holdCardLayouts[v.dir].y)
            }

           
            let winView = BaseWinCardManager.instance.addWinCardView(player.seatid,player.dir)
            if(winView){
                this._table.addChild(winView)
                if(player.dir == 1){
                    if (Laya.stage.width/Laya.stage.height < 8/5){
                        // handView.scale(0.8,0.8)
                        // let scale = Laya.stage.width/1024
                        let scale = 1
                        winView.bottom = handPos.y
                        winView.centerX = winPos.x*(1-(1-scale)/2)
                    }else{
                        winView.centerX = winPos.x
                        winView.bottom = winPos.y
                    }
                }else if(player.dir == 2){
                    if(Laya.stage.width <= 1280){
                        winView.right = winPos.x
                        winView.y = winPos.y
                    }else{
                        winView.centerX = 512
                        winView.y = winPos.y
                    }
                }else if(player.dir == 3){
                    winView.centerX = winPos.x
                    winView.y = winPos.y
                }else{
                    winView.left = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + winPos.x : winPos.x
                    winView.centerY = handPos.y
                }   
                
            }
        }
        BaseTingCardManager.instance.initBaseView(this._table)
    }

    private _optChoice:BaseOptChoiceView
    protected initEvent() :void{
        super.initEvent()
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_PLAYER_OPT_NTF, this, this.onPlayerOptNtfHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_PLAYER_OPT_REP, this, this.onPlayerOptRepHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_CARD_MOVE_NTF, this, this.onCardMoveNtfHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_GAME_START_NTF, this, this.onGameStartNtfHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_GAME_END_NTF, this, this.onGameEndNtfHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_SHOW_CARDS_NTF, this, this.onShowCardsNtfHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_RECONNECT_INFO, this, this.onReconnectNtfHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_SHOW_INFO_NTF, this, this.onShowInfoNtfHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_DETAIL_NTF, this, this.onDetailNtfHandler)
        EventManager.instance.registerOnObject(this, server, "game.updateTable", this, this.updateTable);
        // EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);
    }
    protected onResize(e: laya.events.Event): void {
        super.onResize(e)
        if(this._ruleView){
            this._ruleView.width = this._table.width
            this._ruleView.height = this._table.width
        }
         if (!this._scale || Laya.stage.width / Laya.stage.height != this._scale) {
            if (!this._scale)
                this._scale = Laya.stage.width / Laya.stage.height
            if (Laya.stage.width / Laya.stage.height < 8 / 5) {
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
                AppControl.getInstance().stage.width = 1024;

            } else {
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
                AppControl.getInstance().stage.height = 640;
            }
            this._scale = Laya.stage.width / Laya.stage.height;
            Laya.stage.setScreenSize(Laya.Browser.clientWidth * Laya.Browser.pixelRatio, Laya.Browser.clientHeight * Laya.Browser.pixelRatio);
        }       
        this.updateArrorPos(BaseGameData.lastSeatid)
        for(var k in BaseGameData.players){
            let player = BaseGameData.players[k]
            if(player.dir == 2){
                let handview2 = BaseHandCardManager.instance.handCardsViews[player.seatid]
                if(handview2){
                    let handPos = TableLayout.handCardLayouts[1]
                    handview2.right = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + handPos.x : handPos.x
                    console.log("handview2==================="+handview2.right)
                }
                let holdview2 = BaseHoldCardManager.instance.holdCardsViews[player.seatid]
                if(holdview2){
                    let holdPos = TableLayout.holdCardLayouts[1]
                    holdview2.right = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + holdPos.x : holdPos.x
                }

                let winview2 = BaseWinCardManager.instance.winCardsViews[player.seatid]
                if(winview2){
                    let winPos = TableLayout.winCardLayouts[1]
                    winview2.right = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + winPos.x : winPos.x
                }
            }
            if(player.dir == 4){
        
                let handview4 = BaseHandCardManager.instance.handCardsViews[player.seatid]
                if(handview4){
                    let handPos = TableLayout.handCardLayouts[3]
                    handview4.left = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + handPos.x : handPos.x
                    console.log("handview4==================="+handview4.left)

                }
                let holdview4 = BaseHoldCardManager.instance.holdCardsViews[player.seatid]
                if(holdview4){
                    let holdPos = TableLayout.holdCardLayouts[3]
                    holdview4.left = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + holdPos.x : holdPos.x
                }

                let winview4 = BaseWinCardManager.instance.winCardsViews[player.seatid]
                if(winview4){
                    let winPos = TableLayout.winCardLayouts[3]
                    winview4.left = Laya.stage.width > 1280 ? (Laya.stage.width-1280)/2 + winPos.x : winPos.x
                }
            }
        
        //  let holdview1 = BaseHoldCardManager.instance.holdCardsViews[1]
        // if(holdview1){
        //     let holdPos = TableLayout.holdCardLayouts[0]

        //      if (Laya.stage.width/Laya.stage.height < 8/5){
        //         // handView.scale(0.8,0.8)
        //         let scale = Laya.stage.width/1024
        //         holdview1.centerX = NaN
        //         holdview1.left = 10
        //     }else{
        //         holdview1.left = NaN
        //         holdview1.centerX = holdPos.x
        //     }
        // }

           
            
        }
        // let handView = BaseHandCardManager.instance.handCardsViews[1]
        // if(handView){
        //     let handPos = TableLayout.handCardLayouts[0]
         
        //     if (Laya.stage.width/Laya.stage.height < 8/5){
        //         let scale = Laya.stage.width/1024
        //         handView.bottom = 0
        //         handView.centerX = handPos.x*(1-(1-scale)/2)
        //     }else{
        //         handView.centerX = handPos.x
        //         handView.bottom = handPos.y
        //     }
        // }
        
    }


    protected onTableInfoNtfHandler(msg: any): void {
        if(!BaseGameData.isRecord){
            super.onTableInfoNtfHandler(msg)
        }
        
        if(this._timeLimit){
            this._timeLimit.clean()
            this._timeLimit.removeSelf()
            this._timeLimit = null
        }
        // if(this._ruleView){
        //     this._ruleView.removeSelf()
        //     this._ruleView = null
        // }
        AnimationManager.instance.endAnimations()
         
        
    }   
    
     
    protected onGameStartNtfHandler(msg : any){
        super.onGameStartNtfHandler(msg)
        this.setTableInfo();//zhc新增
        AnimationManager.instance.endAnimations()
        if(this._ruleView){
            this._ruleView.updateRound()
        }
        this.initGameUI()
        if(this._leftView){
            this._leftView.visible = false
        }
    }

    protected onGameEndNtfHandler(msg: any): void {
        super.onGameEndNtfHandler(msg)
        if(this._waitTips){
            this._waitTips.alpha = 0
        }
        if(this._timeLimit){
            this._timeLimit.clean()
            this._timeLimit.removeSelf()
            this._timeLimit = null
        }
        if(this._foldBigCard){
            this._foldBigCard.removeSelf()
            this._foldBigCard = null
        }
        Laya.timer.once(150, this, function(){
            let dialog = DialogManager.instance.callDialog("GAME_END", msg.scores, msg.tableEnd, msg.winType)
            dialog.show(msg.scores, msg.tableEnd, msg.winType)
        })
    }

    protected setHandCards(){
        for (var k in BaseGameData.players){ 
            let player = BaseGameData.players[k]
            if (player.handCards){
                // if (player.seatid == BaseGameData.selfSeatid || BaseGameData.isRecord == 1){
                    BaseHandCardManager.instance.updateHandCards(player.seatid,player.handCards,player.handCards.length)
                // }else
                //     _handCardManager:updateHandCards(v.seatid,_gameDataMgr:getHandCardsCount(v.seatid))
                // end
            }
        }
    }

    protected setFoldCards(){
        if(BaseFoldCardManager.instance._foldType > 0){
            BaseFoldCardManager.instance.updateFoldCards(0, BaseGameData.discards)
        }else{
            for (var k in BaseGameData.players){ 
                let player = BaseGameData.players[k]
                if (player.foldCards && player.foldCards.length > 0){
                    BaseFoldCardManager.instance.updateFoldCards(player.seatid,player.foldCards)
                }
            }
        }
    }

protected setHoldCards(){
    for (var k in BaseGameData.players){ 
        let player = BaseGameData.players[k]
        if (player.holdCards && player.holdCards.length > 0){
            BaseHoldCardManager.instance.updateHoldCards(player.seatid,player.holdCards)
        }
    }
}

    protected onShowInfoNtfHandler(msg: any): void {
     
        switch(msg.type){
            case GameDef.ShowInfoType.SHOW_DICE: 
                        if(msg.animation == 1 && !msg.noAni){
                            AnimationManager.instance.addAnimation(() => {
                                this.showDice(msg.info)
                            }, null)
                        }else{

                        }
                        break;
            case GameDef.ShowInfoType.SHUFFLE_CARD:
                    if(msg.noAni) return
                    if(BaseGameData.selfSeatid == msg.seatid[0]){
                        AnimationManager.instance.addAnimation(() => {
                            BaseHandCardManager.instance.shuffleCards(BaseGameData.selfSeatid, function(){
                                AnimationManager.instance.animationOver()
                            })
                        }, null)
                    }
                    break;
            case GameDef.ShowInfoType.DEAL_CARDS:
                this.playDealCard(msg)
                break;
            case GameDef.ShowInfoType.WIN_DEATIL:
                this.playWinDetail(msg)
                break;
            case GameDef.ShowInfoType.WIN_TYPE:
                this.playWinType(msg.info)
                break;
            case GameDef.ShowInfoType.CALL_SCORE:
                this.updatePao(msg.info)
                break;
            case GameDef.ShowInfoType.DRAW_SHIFTER:
                this.showDrawShifter(msg)
                break;
            case GameDef.ShowInfoType.GEN_PAI:
                if(msg.animation){
                    this.genpai(msg.info);
                }
                break;
            case GameDef.ShowInfoType.ZUIHOU4:
                HintCtrl.instance.show("最后四张")
                break;
            case GameDef.ShowInfoType.MNGANG:
                break;
            case GameDef.ShowInfoType.ANGANG:
                break;
            case GameDef.ShowInfoType.PENGGANG:
                break;
            case GameDef.ShowInfoType.CANCELGANG:
                break;  
            case GameDef.ShowInfoType.BAO_TING:
                let index = msg.info.indexOf(BaseGameData.selfSeatid)
                if(index >= 0){
                    BaseHandCardManager.instance.clearTouch(BaseGameData.selfSeatid)
                }
                for(var k in msg.info){
                    let v = msg.info[k]
                    PlayerManager.instance._players[v].showTing()
                }
                if(msg.animation){
                    this.playOptSound(GameDef.OptType.MJ_TING,msg.info[0])
                    this.playOtherOptAni(GameDef.OptType.MJ_TING,msg.info[0])
                }
                break;
        }
    }

    protected genpai(info){
        
            let genpai = new Laya.Animation();
            let res = ""
            if(info[0] == 2){
                // genpai.loadAnimation(ResourceConfig.ANI_GEN_PAI);
                res = ResourceConfig.ANI_GEN_PAI
            }else if(info[0] == 1){
                // genpai.loadAnimation(ResourceConfig.ANI_GEN_CAI_SHEN);
                res = ResourceConfig.ANI_GEN_CAI_SHEN
            }
            // genpai.zOrder = GameZorder.Ani
            // this._table.addChild(genpai)
            // genpai.pos(Laya.stage.width/2,Laya.stage.height/2)
            // genpai.play(1,false)
            // Laya.timer.once(1000,this,function(){
            //     genpai.stop()
            //     genpai.removeSelf()
            // })
            AniEffectManager.instance.playEffectOnce(this._table, res,1000,{x:Laya.stage.width/2, y:Laya.stage.height/2},function(){
                AnimationManager.instance.animationOver()
            }.bind(this))
        // HintCtrl.instance.show("跟圈")
    }

    protected showDrawShifter(info){
        BaseGameData.SHIFTER_NUM = info.info[0]%100
        if (info.noAni){
             if(this._leftView){
                this._leftView.visible = true
                this._leftView.updateShifter()
            }else{
                this._leftView = new LeftCardView()
                this._table.addChild(this._leftView)
                this._leftView.centerX = -250
                this._leftView.centerY = -180
                this._leftView.updateShifter()
            }
            return
        }
        if(info.animation){
            BaseGameData.leftCard = BaseGameData.leftCard - 1
            AnimationManager.instance.addAnimation(() => {
                this._drawShifter = new ui.mj.CaishenUI()
                this._drawShifter._cai._bg.skin = "card/5/"+(info.info[0]%100)+".png"
                this._drawShifter._cai._back.visible = false
                this._drawShifter.centerX = 0
                this._drawShifter.centerY = -100
                this._table.addChild(this._drawShifter)
                this._drawShifter.zOrder = GameZorder.Ani
                this._drawShifter.ani1.play(1,false)
                Laya.timer.once(1500,this, function(){
                    this._leftView.visible = true
                    this._leftView.updateShifter()
                    this._drawShifter.ani1.stop()
                    this._drawShifter.removeSelf()
                    AnimationManager.instance.animationOver()
                })
            },null)
            
        }else{
            if(this._leftView){
                this._leftView.visible = true
             this._leftView.updateShifter()
            }else{
                this._leftView = new LeftCardView()
                this._table.addChild(this._leftView)
                this._leftView.centerX = -250
                this._leftView.centerY = -180
                this._leftView.updateShifter()
            }
        }
        
    }

    protected onDetailNtfHandler(msg){
        if(msg.detailType == GameDef.DETAIL_TYPE.WIN_DEATIL){
            this.playWinDetail(msg.playerInfo)
        }else if(msg.detailType == GameDef.DETAIL_TYPE.SHOW_RULE){
            // if(!GameConfig.IS_MATCH)
            this.showRule(msg.playerInfo)
        }else if(msg.detailType == 101){
            this.showRule(msg.playerInfo)
        }else if(msg.detailType == GameDef.DETAIL_TYPE.LOSE_DETAIL){
            BaseGameData.saveLoseDetail(msg.playerInfo)
        }
    }

    protected onStageTouch(e: Laya.Event): void {
        super.onStageTouch(e)
        if (e.type == Laya.Event.CLICK) {
            switch (e.target.name) {
                case "ruleBtn":
                    break;
                default:
                    if(this._ruleView){
                        this._ruleView.hideRule()
                    }
                    break;
            }
        }
        
    }


    protected showRule(info){
        if(BaseGameData.isRecord){
            if(this._ruleView){
                this._ruleView.removeSelf()
                this._ruleView = null
            }
        }
        if(!this._ruleView){
            this._ruleView = new RuleInfoView(info[0].info)
            this._ruleView.centerX = 0
            this._ruleView.width = Laya.stage.width
            this._ruleView.height = Laya.stage.height
            this._tablePop.addChild(this._ruleView);
        }
    }

    protected updatePao(msg){//shuapao
        if(this._chooseView){
            this._chooseView.removeSelf()
            this._chooseView = null
        }
        BaseGameData.updatePao(msg);
        // let view = new BaseChooseScore(this.optCardReq.bind(this), msg)
        // this._table.addChild(view)
    }

    protected playWinType(info){
        AnimationManager.instance.addAnimation(() => {
            if (info[0] > 0){
                if (info[0] == GameDef.MJ_WIN_TYPE.WIN_ALL){
                    SoundManager.instance.playEffect("zimo",1)
                }else{
                    SoundManager.instance.playEffect("hu",1)
                }
                for (var i = 1; i < info.length; i++){
                    
                    let winSeatid = info[i]
                    // let hu = new Laya.Animation();
                    // hu.loadAnimation(ResourceConfig.ANI_HU);
                    // hu.zOrder = GameZorder.Ani
                    // this._table.addChild(hu)
                    let dir = Utils.getDir(winSeatid)
                    // hu.x = this._table.width/2 + TableLayout.OTHER_OPT_POS[dir-1].x
                    // hu.y = TableLayout.OTHER_OPT_POS[dir-1].y
                    // hu.play(1,false)

                    // Laya.timer.once(1000,this,function(){
                    //     hu.stop()
                    //     hu.removeSelf()
                    //     AnimationManager.instance.animationOver()
                    // })
                    AniEffectManager.instance.playEffectOnce(this._table,ResourceConfig.ANI_HU,1000,{x:this._table.width/2 + TableLayout.OTHER_OPT_POS[dir-1].x,y:TableLayout.OTHER_OPT_POS[dir-1].y},function(){
                        AnimationManager.instance.animationOver()
                    }.bind(this))
                }
            }else{
                this._liuju = new ui.mj.HoldCard.liujuUI()
                this._table.addChild(this._liuju)
                // view.width = this._table.width
                // view.height = this._table.height
                this._liuju.centerX = 0
                this._liuju.zOrder = GameZorder.Ani
                this._liuju.ani1.play()
                Laya.timer.once(1000,this,function(){
                    if(this._liuju){
                        this._liuju.ani1.stop()
                        this._liuju.removeSelf()
                        this._liuju = null
                    }
                    AnimationManager.instance.animationOver()
                }.bind(this))
            }
        },null)
    }

    protected playWinDetail(info){
        BaseGameData.saveWinDetail(info)
    }

    protected updateArrorPos(seatid){
        if(!seatid) return
        let posX = this._table.width/2 + this._ArrorcenterX
        let posY = this._table.height/2 + this._ArrorcenterY
        if(this._arror){
            this._arror.pos(posX, posY)
        }
    }

    protected showArror(seatid){
        if(!seatid) return
        BaseGameData.lastSeatid = seatid
        let pos = BaseFoldCardManager.instance.getFoldCardPos(seatid)
        console.info(pos)
        if(!pos) return
        this._ArrorcenterX = pos.x - this._table.width/2
        this._ArrorcenterY = pos.y - this._table.height/2
        if(!this._arror){
            this._arror = new Laya.Animation();
            this._arror.loadAnimation(ResourceConfig.ANI_ARROW);
            this._table.addChild(this._arror)
           
            this._arror.pos(pos.x,pos.y)
            this._arror.play()
            this._arror.zOrder = GameZorder.Ani
        }else{
            this._arror.visible = true
            this._arror.pos(pos.x,pos.y)
            this._arror.zOrder = GameZorder.Ani
        }
    }


    protected hideArror(){
        if(this._arror){
            this._arror.visible = false
        }
    }

    protected onReconnectNtfHandler(msg : any){
         super.onReconnectInfoHandler(msg);
         this.initGameUI()
         this.setFoldCards()
         this.setHandCards()
         this.setHoldCards()
         
        // for (var i: number = 1; i < this._playerUis.length; i++) {
        //     this._playerUis[i].checkIsGameing(true);
        // }
        if(msg.lastSeatid){
            // BaseGameData.optSeatid = msg.lastSeatid
            this.setTimer(msg.lastSeatid,1,true)
            this.showArror(msg.lastSeatid)
            let cards = BaseGameData.getPlayerDataBySeatid(msg.lastSeatid).foldCards
            this.showFoldBigCard(Utils.getDir(msg.lastSeatid), cards[cards.length - 1])
        }
        // if(this._ruleView){
        //     this._ruleView.updateLeftCount()
        // }
        if(this._leftView){
            this._leftView.visible = true
            this._leftView.updateLeftCount()
            if(BaseGameData.SHIFTER_NUM && BaseGameData.SHIFTER_NUM > 0){
                this._leftView.updateShifter()
            }else{
                this._leftView._card._back.visible = true
            }
        }
        this.setTableInfo();

        // this.showRule({})
        // this.updatePao([1,2,3,4])

       
        // let view = new BaseChooseScore(this.optCardReq.bind(this))
        // this.addView(view)
        // view.y = 200
        
        // this.onCardMoveNtfHandler({"cards":[288],"fromSeatid":4,"toSeatid":4,"areaid":4,"opttype":11,"count":1})
        // this.onShowInfoNtfHandler({"type":5,"animation":1})
        // this.onShowCardsNtfHandler({"showncards":[{"seatid":1,"handcards":[201,302,3,203,4,104,6,148,348,48]},{"seatid":2,"handcards":[202,204,243,144,344,47,247]},{"seatid":3,"handcards":[2,303,304,341]},{"seatid":4,"handcards":[121,21,25,342,147,347,248]}]})
        // this.onGameEndNtfHandler({"scores":[{"seatid":1},{"seatid":2},{"seatid":3},{"seatid":4}]})
    //     optional int32 type = 1;
	// repeated int32 info = 2;
	// optional uint32 animation = 3;
//         this.onShowInfoNtfHandler({type:1,info:[1,5],animation:1})
        // this.onShowInfoNtfHandler({type:2,info:[13,13,13,13],animation:1})

// //         message CardMoveNtf {
// // 	repeated uint32 cards = 1;
// // 	optional uint32 from_seatid = 2;
// // 	optional uint32 to_seatid = 3;
// // 	optional uint32 areaid = 4;
// // 	optional uint32 opttype = 5;
// // 	optional uint32 count = 6;
// // }
// this.onCardMoveNtfHandler({"cards":[372,341,305,209,222,342,47,386,85,178,349,263,301],"fromSeatid":4,"toSeatid":4,"areaid":1,"opttype":17})
// this.onCardMoveNtfHandler({"cards":[286,87],"fromSeatid":1,"toSeatid":1,"areaid":4,"opttype":11,"count":2})
// this.onCardMoveNtfHandler({"fromSeatid":1,"toSeatid":1,"areaid":1,"opttype":11,"count":2})
// this.onCardMoveNtfHandler({"cards":[288],"fromSeatid":1,"toSeatid":1,"areaid":4,"opttype":11,"count":1})
// this.onCardMoveNtfHandler({"fromSeatid":1,"toSeatid":1,"areaid":1,"opttype":11,"count":1})
// this.onCardMoveNtfHandler({"cards":[186,287],"fromSeatid":2,"toSeatid":2,"areaid":4,"opttype":11,"count":2})
// this.onCardMoveNtfHandler({"fromSeatid":2,"toSeatid":2,"areaid":1,"opttype":11,"count":2})
// this.onCardMoveNtfHandler({"cards":[385],"fromSeatid":3,"toSeatid":3,"areaid":4,"opttype":11,"count":1})
// this.onCardMoveNtfHandler({"fromSeatid":3,"toSeatid":3,"areaid":1,"opttype":11,"count":1})
// this.onCardMoveNtfHandler({"cards":[386,85],"fromSeatid":4,"toSeatid":4,"areaid":4,"opttype":11,"count":2})
// this.onCardMoveNtfHandler({"cards":[269,201],"fromSeatid":4,"toSeatid":4,"areaid":1,"opttype":11,"count":2})
// this.onShowInfoNtfHandler({"type":3,"animation":1})
// this.onCardMoveNtfHandler({"cards":[0],"toSeatid":2,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":1,"timeout":15,"opts":[{"opttype":7,"cards":[6,4,3,4,5,6,7,3,9,4,5,3,24,4,5,3,26,4,5]},{"opttype":2,"cards":[1,2,3,4,5,6,7,8,9]}]})
// this.onCardMoveNtfHandler({"cards":[22],"fromSeatid":2,"toSeatid":2,"areaid":2,"count":1})
// this.onCardMoveNtfHandler({"cards":[0],"toSeatid":3,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":3,"timeout":15,"opts":[{"opttype":0}]})
// this.onCardMoveNtfHandler({"cards":[109],"fromSeatid":3,"toSeatid":3,"areaid":2,"count":1})
// this.onCardMoveNtfHandler({"cards":[28],"toSeatid":4,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":4,"timeout":15,"opts":[{"opttype":0}]})
// this.onCardMoveNtfHandler({"cards":[28],"fromSeatid":4,"toSeatid":4,"areaid":2,"count":1})
// this.onCardMoveNtfHandler({"cards":[0],"toSeatid":1,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":1,"timeout":15,"opts":[{"opttype":0}]})
// this.onCardMoveNtfHandler({"cards":[101],"fromSeatid":1,"toSeatid":1,"areaid":2,"count":1})
// this.onCardMoveNtfHandler({"cards":[0],"toSeatid":2,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":2,"timeout":15,"opts":[{"opttype":0}]})
// this.onCardMoveNtfHandler({"cards":[75],"fromSeatid":2,"toSeatid":2,"areaid":2,"count":1})
// this.onCardMoveNtfHandler({"cards":[0],"toSeatid":3,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":3,"timeout":15,"opts":[{"opttype":0}]})
// this.onCardMoveNtfHandler({"cards":[66],"fromSeatid":3,"toSeatid":3,"areaid":2,"count":1})
// this.onCardMoveNtfHandler({"cards":[81],"toSeatid":4,"areaid":1,"opttype":1,"count":1})
// this.onCardMoveNtfHandler({"cards":[81],"fromSeatid":4,"toSeatid":4,"areaid":4,"opttype":11,"count":1})
// this.onCardMoveNtfHandler({"cards":[46],"toSeatid":4,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":4,"timeout":15,"opts":[{"opttype":0}]})
// this.onCardMoveNtfHandler({"cards":[46],"fromSeatid":4,"toSeatid":4,"areaid":2,"count":1})
// this.onCardMoveNtfHandler({"cards":[0],"toSeatid":1,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":1,"timeout":15,"opts":[{"opttype":0}]})
// this.onCardMoveNtfHandler({"cards":[123],"fromSeatid":1,"toSeatid":1,"areaid":2,"count":1})
// this.onCardMoveNtfHandler({"cards":[0],"toSeatid":2,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":2,"timeout":15,"opts":[{"opttype":0}]})
// this.onCardMoveNtfHandler({"cards":[163],"fromSeatid":2,"toSeatid":2,"areaid":2,"count":1})
// this.onCardMoveNtfHandler({"cards":[0],"toSeatid":3,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":3,"timeout":15,"opts":[{"opttype":0}]})
//         this.onCardMoveNtfHandler({"cards":[307,206,304,6,275,87,342,260,281,141,107,244,144],"fromSeatid":4,"toSeatid":4,"areaid":1,"opttype":17})
//         this.onCardMoveNtfHandler({cards:[388,184,287,188],fromSeatid:1,toSeatid:1,areaid:4,opttype:11,count:4})
//         this.onCardMoveNtfHandler({"fromSeatid":1,"toSeatid":1,"areaid":1,"opttype":11,"count":4})
//         this.onCardMoveNtfHandler({"cards":[81,83,283],"fromSeatid":2,"toSeatid":2,"areaid":4,"opttype":11,"count":3})
//         this.onCardMoveNtfHandler({"fromSeatid":2,"toSeatid":2,"areaid":1,"opttype":11,"count":3})
// this.onCardMoveNtfHandler({"cards":[383,286],"fromSeatid":3,"toSeatid":3,"areaid":4,"opttype":11,"count":2})
// this.onCardMoveNtfHandler({"fromSeatid":3,"toSeatid":3,"areaid":1,"opttype":11,"count":2})
// this.onCardMoveNtfHandler({"cards":[87,281],"fromSeatid":4,"toSeatid":4,"areaid":4,"opttype":11,"count":2})
// this.onCardMoveNtfHandler({"cards":[24,26],"fromSeatid":4,"toSeatid":4,"areaid":1,"opttype":11,"count":2})
// this.onCardMoveNtfHandler({cards:[0],"toSeatid":1,"areaid":1,"opttype":1,"count":1})
// this.onPlayerOptNtfHandler({"seatid":1,"timeout":15,"opts":[{"opttype":0}]})
        // this.onShowInfoNtfHandler({type:3,info:[],animation:1})
        // this.onCardMoveNtfHandler({cards:[81,82],fromSeatid:2,toSeatid:2,areaid:4,opttype:11,count:2})
        // this.onCardMoveNtfHandler({cards:[44],fromSeatid:1,toSeatid:1,areaid:1,opttype:1,count:1})
//         message Opt {
// 	required uint32 opttype = 1;  //0出牌 1摸牌 2吃 3碰 4明杠 5暗杠 6碰杠 7听牌 8胡牌 9弃牌
// 	repeated uint32 cards = 2;
// }

// //玩家操作通知
// message PlayerOptNtf {
// 	required uint32 seatid = 1;
// 	optional uint32 timeout = 2;
// 	repeated Opt opts = 3;
// }
        // this.onPlayerOptNtfHandler({seatid:1,timeout:15,opts:[{opttype:1,cards:[]}]})
        // this.onCardMoveNtfHandler({cards:[44],fromSeatid:1,toSeatid:1,areaid:2,opttype:0,count:1})
        // this.onCardMoveNtfHandler({cards:[0],fromSeatid:2,toSeatid:2,areaid:1,opttype:1,count:1})
        // this.onPlayerOptNtfHandler({seatid:2,timeout:15,opts:[{opttype:1,cards:[]}]})
        // this.onCardMoveNtfHandler({cards:[0],fromSeatid:2,toSeatid:2,areaid:2,opttype:0,count:1})
    }



    protected setTimer(seatid, duration, isShow){
        if (!this._timeLimit){
            this._timeLimit = new TimeLimitView()
            
            this._table.addChild(this._timeLimit)
            this._timeLimit.zOrder = 1
            this._timeLimit.centerX = -30
            this._timeLimit.centerY = -24
            // this._timeLimit.pos(Laya.stage.width/2,Laya.stage.height/2+5)
            this._timeLimit.updatePos()
        }else{
            this._timeLimit.visible = true
        }
        this._timeLimit.startCount(duration)
    }
    /**
     * 玩家操作通知 游戏自己处理逻辑
     */
    protected askPlayerOpt(seatid, timeout, opt){
        if (!seatid){ 
            AnimationManager.instance.animationOver()
            return 
        }
        BaseGameData.optSeatid = seatid
        console.info(opt)
        if (opt && opt.length > 0){
            if (opt[0].opttype == GameDef.OptType.MJ_DRAW){
                this.hideFoldBigCard()
                if (BaseGameData.isRecord == 1 && opt[0].cards.length == 0){
                    if (BaseGameData.optSeatid &&  BaseGameData.optSeatid > 0){
                        // let duration = Utils.getRealDuration(timeout)
                        this.setTimer(BaseGameData.optSeatid, timeout, true)
                    }
                    AnimationManager.instance.animationOver()
                    return
                }
            }
            if (opt[0].opttype == GameDef.OptType.CALL_SCORE){
                if(!this._chooseView){
                    this._chooseView = new BaseChooseScore(this.optCardReq.bind(this),opt[0].cards)
                    this._table.addChild(this._chooseView)
                    this._chooseView.centerX = 0
                    this._chooseView.bottom = 150
                    this._chooseView.zOrder = GameZorder.ChooseView
                    this.setTimer(BaseGameData.selfSeatid, timeout, true)
                }
                AnimationManager.instance.animationOver()
                return
            }
            if (Utils.checkSeatid(BaseGameData.selfSeatid)){
                let optFlag = false
                let showLast = false
                for (var k in opt){
                    let v = opt[k]
                    if (v.opttype > GameDef.OptType.MJ_DRAW && v.opttype < GameDef.OptType.MJ_MISS_HU){
                        optFlag = true 
                    }
                    if (v.opttype == GameDef.OptType.MJ_CHI || v.opttype == GameDef.OptType.MJ_PENG || v.opttype == GameDef.OptType.MJ_MNGANG){
                        showLast = true
                    }
                    if (v.opttype == GameDef.OptType.MJ_HU && BaseGameData.optSeatid != BaseGameData.selfSeatid){
                        showLast = true
                    }
                    if(v.opttype == GameDef.OptType.POINT_OUT){
                        BaseGameData.tingCards = []
	                    BaseGameData.tingInfo = {}
                        let length = 0
                        let  i = 0
                        let tingKey
                        let count = 0
                        let winIndex
                        for (var j in v.cards){
                            let info = v.cards[j]
                            if(j == "0" || parseInt(j) == count+length+1){
                                length = info
                                i = 0
                                count = parseInt(j)
                            }else if(parseInt(j) < count+length+1){
                                if(i == 0){
                                    tingKey = info%100
                                    BaseGameData.tingCards.push(tingKey)
                                    BaseGameData.tingInfo[tingKey] = []
                                }else{
                                    BaseGameData.tingInfo[tingKey].push(info)
                                }
                                i++
                            }
                        }
                        BaseHandCardManager.instance.showArror(BaseGameData.selfSeatid)
                    }
                }
                if (seatid == BaseGameData.selfSeatid){
                    // _handCardManager:tingCard()
                    if (optFlag){
                        // _handCardManager:clearCurrentOpt()
                        if (!this._optChoice){
                            this._optChoice = new BaseOptChoiceView(this.optCardReq.bind(this))
                            this._table.addChild(this._optChoice)
                            this._optChoice.bottom = 250 
                            this._optChoice.right = 300
                            this._optChoice.zOrder = GameZorder.ChooseView
                            
                        }
                        console.info(opt)
                        this._optChoice.showOptChoice(opt)
                    }
                    if (showLast){
                        this.showLastFoldBigCard()
                    }
                }
            }
            
        
        
            // let duration = Utils.getRealDuration(timeout)
            
        }
        this.setTimer(seatid, timeout, true)
        AnimationManager.instance.animationOver()
    }

    protected showLastFoldBigCard(){

    }

    protected onPlayerOptNtfHandler(msg: any): void {
        let animation_func =  function(){
            if (Utils.checkSeatid(msg.seatid) && BaseGameData.selfSeatid == msg.seatid){
                // _dialogManager:removeDialog("OTHER_PLAYER")
                // _dialogManager:removeDialog("RECORD")
                // SoundManager.instance.play(SoundConfig.SOUND_QIEHUAN_PAOTAI)
            }
            if (msg.opts[0] && msg.opts[0].opttype == GameDef.OptType.MJ_MISS_HU){
                // _tipsManager:showTips("漏胡")
                HintCtrl.instance.show("漏胡")
                if(msg.opts.length == 1){
                    AnimationManager.instance.animationOver()
                    return
                }
            }
            this.askPlayerOpt(msg.seatid, msg.timeout, msg.opts)
        }.bind(this)
        if (this._optChoice && msg.seatid != BaseGameData.selfSeatid ){
            this._optChoice.clearUI()
        }
        AnimationManager.instance.addAnimation(animation_func,null)
    }


    protected onPlayerOptRepHandler(msg: any): void {
        if (msg.result == 1){
            let player = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid)
            if(player && player.handCards && player.handCards.length%3 != 2){
                if(!this._waitTips){
                    this._waitTips = new Laya.Image("table/tips_waiting_paly.png")
                    this._table.addChild(this._waitTips)
                    this._waitTips.alpha = 1
                    this._waitTips.centerX = 0
                    this._waitTips.bottom = 140
                    this._waitTips.zOrder = GameZorder.ChooseView
                    // Laya.Tween.to(this._waitTips,{alpha:1},500)
                }else{
                    this._waitTips.alpha = 1
                }
            }
        }else if (msg.result == 2){
            if(this._optChoice && this._optChoice._optNode) return
            let player = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid)
            if(player && player.handCards && player.handCards.length%3 != 2){
                
                if(!this._waitTips){
                    this._waitTips = new Laya.Image("table/tips_waiting_paly.png")
                    this._table.addChild(this._waitTips)
                    this._waitTips.alpha = 1
                    this._waitTips.centerX = 0
                    this._waitTips.bottom = 140
                    this._waitTips.zOrder = GameZorder.ChooseView
                    // Laya.Tween.to(this._waitTips,{alpha:1},500)
                }else{
                    this._waitTips.alpha = 1
                }
            }
        }
            // HintCtrl.instance.show(GameConfig.language.player_opt_fail);
    }


    protected playDealCard(info){
        AnimationManager.instance.addAnimation(() => {
            this.dealCards(info)
            
        }, null)
        
        
    }

    protected dealCards(info){
        this._dealCardsView = new BaseDealCardsView()
        this._table.addChild(this._dealCardsView)
        this._dealCardsView.pos(Laya.stage.width/2, Laya.stage.height/2)
        let callback = function(){
            this._dealCardsView = null
            for(var k in info.info){
                let count = info.info[k]
                BaseHandCardManager.instance.updateHandCards(parseInt(k)+1,[],count)
            }
            if(!BaseGameData.isRecord){
                if (BaseGameData.selfSeatid){
                    BaseGameData.leftCard = BaseGameData.leftCard - 13*(BaseGameData.maxPlayer-1)
                }else{
                    BaseGameData.leftCard = BaseGameData.leftCard - 13*BaseGameData.maxPlayer
                }
            }
            // if(this._ruleView){
            //     this._ruleView.updateLeftCount()
            // }
            if(this._leftView){
                this._leftView.updateLeftCount()
            }
            AnimationManager.instance.animationOver()
        }.bind(this)
        if(info.noAni){
            callback()
        }else{
            this._dealCardsView.dealCards(BaseGameData.btnSeatid, callback)
        }
    }

    protected showFoldBigCard(dir, card){
        if(!GameConfig.bigcard) return
        if(dir == 1) return 
        if(!this._foldBigCard){
            this._foldBigCard = new BaseCardView(card, 1)
            this._foldBigCard.showFoldBg()
            this._foldBigCard.zOrder = GameZorder.Ani + 1
            this._table.addChild(this._foldBigCard)
        }else{
            this._foldBigCard.visible = true
            this._foldBigCard.updateFront(card)
        }
        if(!card){
            this._foldBigCard.view._back.visible = true
        }else{
            this._foldBigCard.view._back.visible = false
        }
        this._foldBigCard.view._god.visible = false
        this._foldBigCard.centerX = TableLayout.FOLD_BIG_CARD[dir-2].x
        this._foldBigCard.y = TableLayout.FOLD_BIG_CARD[dir-2].y
    }

    protected hideFoldBigCard(){
        if(this._foldBigCard){
            this._foldBigCard.visible = false
        }
    }

    protected moveFoldCard(seatid, cardid, optcallback?){
        if(!BaseGameData.moveCard){
            let beginPos = BaseHandCardManager.instance.getHandCardPosition(seatid,cardid)
            let targetPos = BaseFoldCardManager.instance.getFoldPosition(seatid)
            this._lastSeatid = seatid
            this._lastCard = cardid
            this.hideArror()
            let dir = Utils.getDir(seatid)
            if(BaseFoldCardManager.instance._foldType > 0){
                BaseGameData.moveCard = new ui.mj.FoldCard.Card_1UI()
                BaseGameData.moveCard._bg.skin = "card/1/"+(cardid%100)+".png"
                BaseGameData.moveCard.zOrder = GameZorder.Ani
            }else{
                switch(dir){
                    case 1: BaseGameData.moveCard = new ui.mj.FoldCard.Card_1UI()
                            BaseGameData.moveCard._bg.skin = "card/1/"+(cardid%100)+".png"
                            // targetPos.x = targetPos.x + 20
                            // targetPos.y = targetPos.y + 20
                            break;
                    case 2: BaseGameData.moveCard = new ui.mj.FoldCard.Card_2UI()
                            BaseGameData.moveCard._bg.skin = "card/2/"+(cardid%100)+".png"
                            // targetPos.x = targetPos.x + 20
                            // targetPos.y = targetPos.y - 20
                            break;
                    case 3: BaseGameData.moveCard = new ui.mj.FoldCard.Card_3UI()
                            BaseGameData.moveCard._bg.skin = "card/3/"+(cardid%100)+".png"
                            // targetPos.x = targetPos.x - 20
                            // targetPos.y = targetPos.y - 20
                            break;
                    case 4: BaseGameData.moveCard = new ui.mj.FoldCard.Card_4UI()
                            BaseGameData.moveCard._bg.skin = "card/4/"+(cardid%100)+".png"
                            // targetPos.x = targetPos.x - 20
                            // targetPos.y = targetPos.y + 20
                            break;
                }
            }
            // BaseGameData.moveCard = new BaseCardView(cardid,dir,null)
            if(dir == 2 || dir == 3){

            }else{
                BaseGameData.moveCard.zOrder = GameZorder.Ani
            }
            this._table.addChild(BaseGameData.moveCard)
            BaseGameData.moveCard.pos(beginPos.x, beginPos.y)
            BaseHandCardManager.instance.removeCard(seatid,cardid)
            let callback = function(){
                SoundManager.instance.playEffect("card_out", 0, 1, false, 1, true);
                
                // BaseFoldCardManager.instance.addFoldCard(seatid,cardid)
                // if (BaseGameData.moveCard){
                //     BaseGameData.moveCard.removeSelf()
                //     BaseGameData.moveCard = null
                // }
                // this.showArror(seatid)
                if(BaseGameData.moveCard){
                    let arror = new Laya.Animation();
                    arror.loadAnimation(ResourceConfig.ANI_ARROW);
                    BaseGameData.moveCard.addChild(arror)
                
                    arror.pos(BaseGameData.moveCard.width/2,BaseGameData.moveCard.height/2)
                    arror.play()
                    arror.zOrder = 100
                }
        
                AnimationManager.instance.animationOver()
            }.bind(this)
            SoundManager.instance.playEffect("card_out", 0, 1, false, 1, true);
            Laya.Tween.to(BaseGameData.moveCard,{x:targetPos.x,y:targetPos.y},200,null,Laya.Handler.create(this,callback))
        }else{
            let targetPos = BaseFoldCardManager.instance.getFoldPosition(seatid)
            let callback = function(){
                // SoundManager.instance.playEffect("card_out", 0, 1, false, 1, true);
                // BaseHandCardManager.instance.removeCard(seatid,cardid)
                BaseFoldCardManager.instance.addFoldCard(seatid,cardid)
                if (BaseGameData.moveCard){
                    BaseGameData.moveCard.removeSelf()
                    BaseGameData.moveCard = null
                }
                this.showArror(seatid)
                if(optcallback){
                    optcallback()
                }else
                    AnimationManager.instance.animationOver()
            }.bind(this)
            Laya.Tween.to(BaseGameData.moveCard,{x:targetPos.x,y:targetPos.y},0,null,Laya.Handler.create(this,callback))
        }
    }    
    /**
     * 卡牌移动 游戏自己处理逻辑
     */
    protected foldCardAni(seatid, cardid){
        
        AnimationManager.instance.addAnimation(() => {
            if(seatid == BaseGameData.selfSeatid && this._lastCard && this._lastSeatid == BaseGameData.selfSeatid){
                if(cardid != this._lastCard){
                    console.log("paibudui  zhudong duankai")
                    server.close()
                }
            }
            if (BaseHandCardManager.instance.getHandCardViews(seatid)%3 == 2){
                SoundManager.instance.playEffect(String(cardid%100),BaseGameData.getPlayerSexBySeatid(seatid));
                if (seatid != BaseGameData.selfSeatid){
                    this.showFoldBigCard(Utils.getDir(seatid),cardid)
                }
                this.moveFoldCard(seatid, cardid)
                // // if (!self.moveCard then
                //     let beginPos = BaseHandCardManager.instance.getHandCardPosition(seatid,cardid)
                //     let dir = Utils.getDir(seatid)
                //     let flag = dir == 1 ? true : false
                //     flag = false
                //     BaseGameData.moveCard = new BaseCardView(cardid,dir,null)
                //     this.addView(BaseGameData.moveCard)
                //     BaseGameData.moveCard.pos(beginPos.x, beginPos.y)
                // // else
                // //     let x,y = self.moveCard:getPosition()
                // //     self.moveCard:removeSelf()
                // //     self.moveCard = nil
                // //     let dir = getDir(seatid)
                // //     self.moveCard = CardView.new(card,dir,false,true):addTo(self,MOVECARD_ZORDER):pos(x,y):setScale(0.62)
                // // end
                // let targetPos = BaseFoldCardManager.instance.getFoldPosition(seatid)
                // let callback = function(){
                //     SoundManager.instance.playEffect("card_out",BaseGameData.getPlayerDataBySeatid(seatid).sex || 1);
                //     BaseHandCardManager.instance.removeCard(seatid,cardid)
                //     BaseFoldCardManager.instance.addFoldCard(seatid,cardid)
                //     if (BaseGameData.moveCard){
                //         BaseGameData.moveCard.removeSelf()
                //         BaseGameData.moveCard = null
                //     }
                //     this.showArror(seatid)
                //     AnimationManager.instance.animationOver()
                // }.bind(this)
                // Laya.Tween.to(BaseGameData.moveCard,{x:targetPos.x,y:targetPos.y,scaleX:0.5,scaleY:0.5},200,null,Laya.Handler.create(this,callback))
            }else{
                // if self.moveCard then
                //     self.moveCard:removeSelf()
                //     self.moveCard = nil
                // end
                AnimationManager.instance.animationOver()
            }
        },null)
    }

    protected playCardOpt(opttype, cards, callback){
        let optAni = new ui.mj.OptAcionUI()
        let newCards = cards
        
        if (opttype == GameDef.OptType.MJ_CHI){
            newCards = [cards[2],cards[0],cards[1]]            
        }
        for(var i = 1;i < 5; i++){
            optAni["_card_"+i]._back.visible = false
            let card = newCards[i-1] || 1
            optAni["_card_"+i]._bg.skin = "card/"+optAni["_card_"+i].name+"/"+(card%100)+".png"
            if (opttype < GameDef.OptType.MJ_MNGANG && i == 4){
                optAni["_card_"+i].visible = false
            }

        }
        optAni.zOrder = 30
        this._table.addChild(optAni)
        optAni.pos(Laya.stage.width/2, Laya.stage.height/2)
        optAni.ani1.play(1,false)
        Laya.timer.once(500, this, function(){
            optAni.ani1.stop()
            optAni.removeSelf()
            callback()
            console.log("playCardOpt   AnimationManager.instance.animationOver()===================")
            AnimationManager.instance.animationOver()
        });
    }

    protected playOtherOptAni(opttype, seatid){
        if (opttype > GameDef.OptType.MJ_TING) return
        let dir = Utils.getDir(seatid)
        // let ac = new Laya.Animation()
        let res = ""
        if(opttype == GameDef.OptType.MJ_TING){
            // ac.loadAnimation(ResourceConfig.ANI_PENG)
            res = ResourceConfig.ANI_TING
        }else if(opttype == GameDef.OptType.MJ_PENG){
            // ac.loadAnimation(ResourceConfig.ANI_PENG)
            res = ResourceConfig.ANI_PENG
        }else if(opttype == GameDef.OptType.MJ_CHI){
            // ac.loadAnimation(ResourceConfig.ANI_CHI)
            res = ResourceConfig.ANI_CHI
        }else if(opttype > GameDef.OptType.MJ_PENG){
            // ac.loadAnimation(ResourceConfig.ANI_GANG)
            res = ResourceConfig.ANI_GANG
        }
        // this._table.addChild(ac)
        // ac.zOrder = 30
        // ac.x = Laya.stage.width/2+TableLayout.OTHER_OPT_POS[dir-1].x
        // ac.y = TableLayout.OTHER_OPT_POS[dir-1].y
        // ac.play(1,false)

        // Laya.timer.once(1000,this,function(){
        //     ac.stop()
        //     ac.removeSelf()
        //     // AnimationManager.instance.animationOver()
        // })
        AniEffectManager.instance.playEffectOnce(this._table,res,1000,{x:Laya.stage.width/2+TableLayout.OTHER_OPT_POS[dir-1].x,y:TableLayout.OTHER_OPT_POS[dir-1].y})
    }

    protected playOptSound(opttype, seatid){
        if (opttype == GameDef.OptType.MJ_PENG){
        SoundManager.instance.playEffect("peng",BaseGameData.getPlayerSexBySeatid(seatid))
        
        }else if( opttype == GameDef.OptType.MJ_CHI) {
            SoundManager.instance.playEffect("chi",BaseGameData.getPlayerSexBySeatid(seatid))
        }else if( opttype == GameDef.OptType.MJ_TING ){
            SoundManager.instance.playEffect("baoting",BaseGameData.getPlayerSexBySeatid(seatid))
        }else if(opttype == GameDef.OptType.MJ_TING ){
            SoundManager.instance.playEffect("liang",BaseGameData.getPlayerSexBySeatid(seatid))
        }else if( opttype > GameDef.OptType.MJ_PENG && opttype < GameDef.OptType.MJ_TING ){
            if (opttype == GameDef.OptType.MJ_ANGANG ){
                SoundManager.instance.playEffect("angang",BaseGameData.getPlayerSexBySeatid(seatid))
            }else{
                SoundManager.instance.playEffect("gang",BaseGameData.getPlayerSexBySeatid(seatid))
            }
        }
    }


    protected holdCardAni(info){
        // BaseHoldCardManager.instance.addHoldCards(info.toSeatid, info)
        let position = BaseHoldCardManager.instance.getHoldPos(info.toSeatid)
        let dir = Utils.getDir(info.toSeatid)
        let count = info.cards.length - 1
        if (info.opttype > GameDef.OptType.MJ_MNGANG){
            count = info.cards.length
        }
        if(BaseGameData.moveCard){
            BaseGameData.moveCard.removeSelf()
            BaseGameData.moveCard = null
        }
        // if (info.opttype == GameDef.OptType.MJ_PENGGANG){
        //     count = 1
        // }
        let removeCards = []
        for (var i = 0;i<count;i++){
            removeCards.push(info.cards[i])
        }
        if(info.opttype == GameDef.OptType.MJ_PENGGANG && info.toSeatid != BaseGameData.selfSeatid){
            removeCards = [0]
        }
        let callback = function(){
            if (info.opttype == GameDef.OptType.MJ_PENGGANG){
                BaseHoldCardManager.instance.pengGang(info.toSeatid,info.cards)
            }else{
                BaseHoldCardManager.instance.addHoldCards(info.toSeatid,info)
            }
            // _handCardManager:tingCard()
        }.bind(this)
        AnimationManager.instance.addAnimation(function(){
            BaseHandCardManager.instance.removeCards(info.toSeatid,removeCards)
            if (info.opttype <  GameDef.OptType.MJ_ANGANG){
                this.hideFoldBigCard()
                this.hideArror()
                BaseFoldCardManager.instance.removeCard(info.fromSeatid, info.cards[info.cards.length-1])
            }
            if (dir == 1){
                this.playOptSound(info.opttype, info.toSeatid)
                this.playCardOpt(info.opttype, info.cards, callback.bind(this))
            }else{
                // let pos = self.tableLayout.optAniLayouts[dir]
                // _animationPlay:playOptLabel(OPT_ANIMATION[info.opttype],pos,info.opttype,info.to_seatid)
                this.playOptSound(info.opttype, info.toSeatid)
                this.playOtherOptAni(info.opttype, info.toSeatid)
                callback()
                Laya.timer.once(500,this,function(){
                    console.log("playOtherOptAni ================AnimationManager.instance.animationOver()")
                    AnimationManager.instance.animationOver()
                })
            }
        }.bind(this),null)
    }

    protected onCardMoveNtfHandler(msg: any): void {
        // if(msg) return
        // _gameDataMgr:cardMove(msg)
        BaseGameData.cardMove(msg)
        if(this._optChoice){
            this._optChoice.clearUI()
        }
        if(this._waitTips){
            this._waitTips.alpha = 0
        }
        BaseHandCardManager.instance.clearArror(BaseGameData.selfSeatid)
        BaseTingCardManager.instance.clearAll()
        if (msg.toSeatid == BaseGameData.selfSeatid){
            BaseHandCardManager.instance.unSelectCards()
        }

        if (msg.noAni) return 
            if (msg.areaid == GameDef.AREA_TYPE.HAND_CARD){
                    // this.playDealCard(msg.cards)
                if (msg.opttype == GameDef.OptType.MJ_DEAL){
                    AnimationManager.instance.addAnimation(()=>{
                        BaseHandCardManager.instance.showHandCards(msg.toSeatid, msg.cards)
                        AnimationManager.instance.animationOver()
                    },null)
                }else if(msg.opttype == GameDef.OptType.MJ_FLOWER){
                     AnimationManager.instance.addAnimation(()=>{
                       
                        BaseHandCardManager.instance.updateFlower(msg.toSeatid, msg.cards, msg.count)
                        AnimationManager.instance.animationOver()
                    },null)
                }else if(msg.opttype == GameDef.OptType.MJ_DRAW){
                     AnimationManager.instance.addAnimation(()=>{
                         SoundManager.instance.playEffect("player_opt",BaseGameData.getPlayerSexBySeatid(msg.toSeatid))
                         if(BaseGameData.moveCard){
                            this.moveFoldCard(this._lastSeatid, this._lastCard,function(){
                                BaseHandCardManager.instance.setCatchCard(msg.toSeatid, msg.cards[0])
                                AnimationManager.instance.animationOver()
                            })
                         }else{
                             BaseHandCardManager.instance.setCatchCard(msg.toSeatid, msg.cards[0])
                            AnimationManager.instance.animationOver()
                         }
                        
                    },null)
                }
                if(this._leftView){
                    this._leftView.updateLeftCount()
                }
            }else if(msg.areaid == GameDef.AREA_TYPE.FOLD_CARD){
                BaseGameData.tingCards = []
                BaseGameData.tingInfo = {}
                if (msg.toSeatid == BaseGameData.selfSeatid){
                    if (this._optChoice) {
                        this._optChoice.clearUI()
                    }
                }
                Dispatcher.dispatch("clear_same_card")
                this.foldCardAni(msg.toSeatid,msg.cards[0])
                // if (BaseGameData.selfSeatid == msg.toSeatid){
                //     AnimationManager.instance.addAnimation(()=>{
                //         //刷牌
                //         // BaseHandCardManager.instance.updateFrame()
                //         // BaseFoldCardManager.instance.updateFrame()
                //         AnimationManager.instance.animationOver()
                //     },null)
                // }
        }else if(msg.areaid == GameDef.AREA_TYPE.HOLD_CARD){ 
                if (msg.toSeatid == BaseGameData.selfSeatid){
                    if (this._optChoice){
                        this._optChoice.clearUI()
                    }
                }
                this.holdCardAni(msg)
                //刷牌
                // AnimationManager:getInstance():addAnimation(function()
                //     _foldCardManager:updateFrame(msg)
                //     AnimationManager:getInstance():animationOver()
                // end)
        }else if (msg.areaid == GameDef.AREA_TYPE.FLOWER_CARD){
            AnimationManager.instance.addAnimation(()=>{
                Laya.timer.once(1000,this,function(){
                    console.log("补花----------------------------")
                    SoundManager.instance.playEffect("buhua",BaseGameData.getPlayerSexBySeatid(msg.toSeatid))
                    this.flowerCardAni(msg)
                    AnimationManager.instance.animationOver()
                })
            },null)
        }else if (msg.areaid == GameDef.AREA_TYPE.TING_CARD){
            this.tingCardAni(msg)
        }else if (msg.areaid == GameDef.AREA_TYPE.WIN_CARD){
            this.winCardAni(msg)
        }
    }

    protected flowerCardAni(msg){
        if(msg.opttype == GameDef.OptType.MJ_FLOWER){
            BaseHandCardManager.instance.removeCards(msg.toSeatid,msg.cards,true)
        }
    }

    protected tingCardAni(msg){

    }

    protected winCardAni(msg){
        // BaseHandCardManager.instance.setCatchCard(msg.toSeatid, msg.cards[0])\
        if(BaseGameData.moveCard){
            BaseGameData.moveCard.removeSelf()
            BaseGameData.moveCard = null
        }
        if(msg.toSeatid != msg.fromSeatid && BaseGameData.isGameing){
            BaseFoldCardManager.instance.removeCard(msg.toSeatid, msg.cards[0])
        }
        if (msg.toSeatid == msg.fromSeatid && BaseGameData.isGameing){
            BaseHandCardManager.instance.removeCard(msg.toSeatid, msg.cards[0])
        }
        BaseWinCardManager.instance.addWinCards(msg.toSeatid, msg.cards[0])
        
    }

     /**
     * 展示牌型，游戏自己处理逻辑
     */
    protected onShowCardsNtfHandler(msg: any): void {
        BaseGameData.onShowCardsNtfHandler(msg)
        AnimationManager.instance.addAnimation(()=>{
            for(var k in BaseGameData.players){
                let player = BaseGameData.players[k]
                BaseHandCardManager.instance.showHandCards(player.seatid, player.handCards)
                BaseHoldCardManager.instance.updateHoldCards(player.seatid, player.holdCards)
            }
            AnimationManager.instance.animationOver()
        },null)
        
    }


    public destroy(): void {
        super.destroy();
        Laya.Tween.clearAll(this)
        Laya.timer.clearAll(this)
        if(this._ruleView){
            this._ruleView.removeSelf()
            this._ruleView = null
        }
        if(this._leftView){
            this._leftView.removeSelf()
            this._leftView = null
        }
        if(this._foldBigCard){
            this._foldBigCard.removeSelf()
            this._foldBigCard = null
        }
        this.clearGame()
        this.clearGameUI()
        
    }

    protected clearData(needCheckIsGameing: boolean = true): void {
        if(this._timeLimit){
            this._timeLimit.clean()
        }
        if(this._dealCardsView){
            Laya.Tween.clearAll(this._dealCardsView)
            this._dealCardsView.removeSelf()
        }
        if(this._dice){
            this._dice.removeChildren()
            this._dice.removeSelf()
        }
        if(this._foldBigCard){
            this._foldBigCard.removeSelf()
            this._foldBigCard = null
        }
        if(this._drawShifter){
            this._drawShifter.ani1.stop()
            if(this._drawShifter.parent){
                this._drawShifter.removeSelf()
            }
        }
        Laya.timer.clearAll(this)
        Laya.Tween.clearAll(this)
        AnimationManager.instance.endAnimations()
        super.clearData(needCheckIsGameing)
    }

    protected updateTable(){
        AnimationManager.instance.endAnimations()
        if(this._dealCardsView){
            this._dealCardsView.visible = false
        }
        this.initGameUI()
        // this.removeSeatViews()
        // this.initSeatViews()
         this.setFoldCards()
         this.setHandCards()
         this.setHoldCards()
         if(this._timeLimit){
            this._timeLimit.clean()
            this._timeLimit.removeSelf()
            this._timeLimit = null
        }
        // for (var i: number = 1; i < this._playerUis.length; i++) {
        //     this._playerUis[i].checkIsGameing(true);
        // }
        if(BaseGameData.lastSeatid){
            this.hideArror()
        }
        // if(this._ruleView){
        //     this._ruleView.updateLeftCount()
        // }
        if(this._leftView){
            this._leftView.updateLeftCount()
        }
        DialogManager.instance.removeDialog("gameend")
    }

    
}

