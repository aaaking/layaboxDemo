class ShiSanShuiPage extends TablePage{
    constructor(){
        super()
        this.name = "ShiSanShuiPage";
         this.screenMode = Laya.Stage.SCREEN_VERTICAL;
         this._loadDatas = this._loadDatas.concat([{ url: "res/config/shisanshui.json", type: Laya.Loader.JSON },{ url: ResourceConfig.SHEET_POKER_CARD_BIG, type: Laya.Loader.ATLAS },
          { url: ResourceConfig.SHEET_POKER_CARD_SMALL, type: Laya.Loader.ATLAS },
         { url: ResourceConfig.SHEET_SHISANSHUI, type: Laya.Loader.ATLAS },
         { url: ResourceConfig.SHEET_SHISANSHUI_N, type: Laya.Loader.ATLAS },
         { url: ResourceConfig.SHEET_SHISANSHUI_S, type: Laya.Loader.ATLAS },
         {url: ResourceConfig.SHEET_SHISANSHUI_CHAT, type: Laya.Loader.ATLAS},
         {url: ResourceConfig.SHEET_SHISANSHUI_ANI, type: Laya.Loader.ATLAS},
         { url: ResourceConfig.SHEET_GAME_END, type: Laya.Loader.ATLAS }
       ]);
        AppPage.register(ShiSanShuiPage, this._loadDatas);
    }
    protected _handCardView = []
    protected _dealCardView
    protected _historyBtn:component.BaseButton
    protected _timeCircleView:TimeCircleView
    protected _ruleView:ui.shisanshui.RuleViewUI
    protected _winScore = []
    protected init(...params): void {
        GameDef.CHAT_POS = [
                                [],
                                [2, 2],
                                [2, 1, 2],
                                [2, 1, 2, 2]
                            ]
        PlayerManager.instance.registerClass(shisanshui.GamePlayerView)
        SoundManager.instance.language = 0
        BaseGameData.tablelayout = ShiSanShuiLayOut
        DialogManager.instance.addDialog("HISTORY",HistoryDialog)
        Utils.injectProp(GameConfig.cfgAudio, Laya.loader.getRes("res/config/shisanshui.json"))
        super.init.apply(this, params);

        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        AppControl.getInstance().stage.width = 640;
        Laya.stage.setScreenSize(Laya.Browser.clientWidth * Laya.Browser.pixelRatio, Laya.Browser.clientHeight * Laya.Browser.pixelRatio);
       
        this._tablePop.centerY = AppControl.getInstance().stage.height > 1280 ? 1 : 0
        
        this._table.centerY = AppControl.getInstance().stage.height > 1280 ? 1 : 0
        this.initEvent()
        this._table._bg.skin = "res/bg/bg_dbl.jpg"
        this._table._bg.width = 850
        this._tablePop._inviteUI.centerY = 150
        if(BaseGameData.isRecord){
            this.PlaySheet()
        }
      
       
    }



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
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_DETAIL_NTF, this, this.onDetailNtfHandler);
        EventManager.instance.registerOnObject(this, server, "game.updateTable", this, this.updateTable);
        // EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);

        
    }

    protected onDetailNtfHandler(msg){
        if(msg.detailType == GameDef.DETAIL_TYPE.WIN_DEATIL){
            
            ShiSanShuiData._scoreInfo = msg.playerInfo
            if(msg.noAni) return
            AnimationManager.instance.addAnimation(function(){
                if(this._timeCircleView){
                    this._timeCircleView.clear()
                    this._timeCircleView.removeSelf()
                    this._timeCircleView = null
                }
                SoundManager.instance.playEffect("start_compare",1)
                this.playStartCompare(msg)
                // this.playWinDetail(msg.playerInfo)
            }.bind(this),null)
            
        }else if(msg.detailType == GameDef.DETAIL_TYPE.WIN_SPECIAL){
            ShiSanShuiData._specialInfo = msg.playerInfo
            if(msg.noAni) return
            SoundManager.instance.playEffect("special",1)
            this.playWinSpecial(msg.playerInfo)
        }else if(msg.detailType == GameDef.DETAIL_TYPE.GUN_DETAIL){
            ShiSanShuiData._gunInfo = msg.playerInfo
            if(msg.noAni) return
            
            this.playGunEffect(msg.playerInfo)
        }else if(msg.detailType == GameDef.DETAIL_TYPE.SHOW_RULE){
            this.showRule(msg.playerInfo)
        }else if(msg.detailType == GameDef.DETAIL_TYPE.HISTORY_DETAIL){
            // HistoryCtrl.instance.updateData(msg.playerInfo, msg.globalInfo)
            if(DialogManager.instance.hasDialog("HISTORY")){
                DialogManager.instance._dialogList["HISTORY"].updateData(msg.playerInfo, msg.globalInfo)
            }
        }
    }

    protected playStartCompare(msg){
        AniEffectManager.instance.playEffectOnce(this._table, ResourceConfig.ANI_START_COMPARE,1100,{x:Laya.stage.width/2, y:Laya.stage.height/2},function(){
            this.playWinDetail(msg.playerInfo)
            // AnimationManager.instance.animationOver()
        }.bind(this))
    }

    protected showRule(info){
        if(!this._ruleView){
            this._ruleView = new ui.shisanshui.RuleViewUI()
            this._table.addChild(this._ruleView)
            this._ruleView.centerX = 0
            this._ruleView.centerY = -30
            this._ruleView._handCount.text = "第"+BaseGameData.currHandCount+"/"+BaseGameData.totalHandCount+"局"
            this._ruleView._code.text = "房间号："+BaseGameData.tableid
            this._ruleView._divide.text = BaseGameData.divide ? "AA支付":"房主支付"
            for(var k in info[0].info){
                let value = info[0].info[k]
                if(value.name == 4){
                    this._ruleView._rule.text = value.value > 0 ? "大小王百变":"普通模式"
                }
            }
        }
    }

    protected playGunEffect(info){
        let callback = function(){
            AnimationManager.instance.animationOver()
        }
       
            
            for (var k in info){
                let v = info[k]
                if(!this._handCardView[v.seatid-1]){
                    callback()
                    break
                }
                // this._handCardView[v.seatid-1].playGun(k)
                
                let gunScore = 0
                AnimationManager.instance.addAnimation(function(){
                    SoundManager.instance.playEffect("daqiang1",1)
                    for(var m in v.info){
                        let toInfo = v.info[m]
                        this._handCardView[v.seatid-1].playGun(m,toInfo.name, parseInt(m) == (v.info.length-1))
                        if(parseInt(k) == info.length-1 && parseInt(m) == v.info.length - 1){
                            this._handCardView[toInfo.name-1].playBullet(toInfo.value,m,callback)
                        }else{
                            this._handCardView[toInfo.name-1].playBullet(toInfo.value,m)
                        }
                        gunScore += toInfo.value || 0
                    }
                    this._handCardView[v.seatid-1].showGunScore(gunScore)
                }.bind(this),null)
            }
        
    }

    protected playWinSpecial(info){
        for(var k in info){
            let v = info[k]
            this._handCardView[v.seatid-1].showSpecial()
        }
        AnimationManager.instance.addAnimation(function(){
            WinSpecialView.instance.show(info)
        }.bind(this),null)
        
    }

    protected playWinDetail(info){
        let callback = function(){
            AnimationManager.instance.animationOver()
        }
        for(var k in info){
            let v = info[k]
            if(parseInt(k) == info.length-1){
                this._handCardView[v.seatid-1].showWinDetail(v.info,callback)
            }else{
                this._handCardView[v.seatid-1].showWinDetail(v.info)
            }
        }
    }

    protected onGameStartNtfHandler(msg){
        super.onGameStartNtfHandler(msg)
        // this.setTableInfo();//zhc新增
        AnimationManager.instance.endAnimations()
        ShiSanShuiData.clearData()
        this.initGameUI()
        if(this._ruleView){
            this._ruleView._handCount.text = BaseGameData.currHandCount + "/" + BaseGameData.totalHandCount
        }
        
    }

    protected initGameUI(){
        this.initCardLayout()
        this.initGameView()
    }

    protected initCardLayout(){
        ShiSanShuiLayOut.DEAL_VIEW_LAYOUT = [[
            {x:Laya.stage.width/2-100, y:Laya.stage.height - 150},
           
        ],[
            {x:Laya.stage.width/2-100 , y:Laya.stage.height - 150},
           
            {x:Laya.stage.width/2 - 120, y: 200},
         
        ],[
            {x:Laya.stage.width/2-100, y:Laya.stage.height - 150},
            {x:Laya.stage.width - 180, y:Laya.stage.height/2-50},
           
            {x:40, y:Laya.stage.height/2-50}
        ],[
            {x:Laya.stage.width/2-100, y:Laya.stage.height - 150},
            {x:Laya.stage.width - 180, y:Laya.stage.height/2-50},
            {x:Laya.stage.width/2 - 50, y: 200},
            {x:80, y:Laya.stage.height/2-50}
        ]]
    }

    protected initGameView(){
        this.clearGameUI()
        this.clearGame()
        this.initCardsView()
        if(!this._historyBtn){
            this._historyBtn = new component.BaseButton("shisanshui/history.png")
            this._table.addChild(this._historyBtn)
            this._historyBtn.stateNum = 2
            // this._historyBtn.right = 10
            // this._historyBtn.y = 20
            Utils.injectProp(this._historyBtn, ShiSanShuiLayOut.HISTORY_LAYOUT)
            this._historyBtn.on(Laya.Event.CLICK, this, this.showHistory)
        }
    }

    protected showHistory(){
        // HistoryCtrl.instance.show()
        var dialog = DialogManager.instance.callDialog("HISTORY")
        dialog.show()
    }

    protected clearGameUI(){
        for(var k in this._winScore){
            let v = this._winScore[k]
            v.removeSelf()
        }
        if(this._dealCardView){
            this._dealCardView.clear()
            this._dealCardView.removeSelf()
            this._dealCardView = null
        }
        for(var k in this._handCardView){
            let view = this._handCardView[k]
            view.clearAll()
            view.removeSelf()
        }
        if(this._timeCircleView){
            this._timeCircleView.clear()
            this._timeCircleView.removeSelf()
            this._timeCircleView = null
        }
        this._handCardView = []
        OptCardView.instance.hide()
    }

    protected clearGame(){
        BaseGameData.optSeatid = 0
        BaseGameData.winDetailArr = []
        BaseGameData.winDetailObj = {}
        BaseGameData.winCard = 0
        BaseGameData.winSeatid = 0
    }

    // message Score {
	// 	required uint32 seatid = 1;
	// 	optional int32 	win_score = 2;
	// 	optional int32 	score = 3;
	// }
	
	// optional uint32 win_type = 1;
	// repeated Score scores = 2;
	// optional uint32 table_end = 3;


    protected onTableInfoNtfHandler(msg){
        super.onTableInfoNtfHandler(msg)
        this.initGameUI()
         
        // Laya.timer.once(3000,this,function(){
        //     this.onGameStartNtfHandler({"currHandCount":1,"leftCard":50,"btnSeatid":0,"players":[{"uid":10001,"seatid":1,"score":1},{"uid":10002,"seatid":2,"score":1},{"uid":10003,"seatid":3,"score":1},{"uid":10004,"seatid":4,"score":1}]})
        //     this.onShowInfoNtfHandler({"type":GameDef.ShowInfoType.START_TIME,"info":[]})
        //     this.onShowInfoNtfHandler({"type":GameDef.ShowInfoType.START_GAME,"info":[]})
        //     this.onShowInfoNtfHandler({"type":GameDef.ShowInfoType.DEAL_CARDS,"info":[13,13,13,13]})
        //     this.onCardMoveNtfHandler({"toSeatid":1,"cards":[40,41,42,43,50,51,52,60,61,82,93,70,101],"opttype":GameDef.OptType.MJ_DEAL})
        //     this.onPlayerOptNtfHandler({"seatid":1,"cards":[40,41,42,43,50,51,52,60,61,82,93,70,101]})
        //     this.onShowCardsNtfHandler({"showncards":[{"seatid":1,"handcards":[40,41,42,43,50,51,52,60,61,82,93,70,101]},{"seatid":2,"handcards":[112,62,91,82,102,110,101,41,42,111,131,143,51]},{"seatid":3,"handcards":[53,142,30,71,40,141,23,33,121,140,22,73,123]},{"seatid":4,"handcards":[72,103,122,130,113,61,60,80,63,31,81,133,32]}]})
        //     this.onDetailNtfHandler({"detailType":1,"playerInfo":[{"seatid":1,"info":[{"name":2,"value":3},{"name":4,"value":5},{"name":1,"value":-3},{"name":8},{"name":1,"value":-3},{"name":1}]},{"seatid":2,"info":[{"name":1,"value":-3},{"name":1},{"name":3,"value":1},{"name":3},{"name":1,"value":3},{"name":1}]},{"seatid":3,"info":[{"name":1,"value":1},{"name":1},{"name":2,"value":-1},{"name":2},{"name":1,"value":-1},{"name":1}]},{"seatid":4,"info":[{"name":1,"value":-1},{"name":1},{"name":4,"value":3},{"name":8},{"name":1,"value":1},{"name":1}]}]})
        //     this.onDetailNtfHandler({"detailType":3,"playerInfo":[{"seatid":1,"info":[{"name":1000,"value":3}]}]})
        //     this.onDetailNtfHandler({"detailType":4,"playerInfo":[{"seatid":1,"info":[{"name":2,"value":3},{"name":3,"value":3},{"name":4,"value":3}]},
        //                                                          {"seatid":2,"info":[{"name":1,"value":3},{"name":3,"value":3},{"name":4,"value":3}]},
        //                                                          {"seatid":3,"info":[{"name":1,"value":3},{"name":2,"value":3},{"name":4,"value":3}]},
        //                                                          {"seatid":4,"info":[{"name":1,"value":3},{"name":2,"value":3},{"name":3,"value":3}]}]})
        //     this.onShowInfoNtfHandler({"type":GameDef.ShowInfoType.QUAN_LEI_DA,"info":[]})                                                    
        //     this.onGameEndNtfHandler({"win_type":1,"scores":[{"seatid":1,"winScore":20,"score":20},{"seatid":2,"winScore":-40,"score":20},{"seatid":3,"winScore":30,"score":20},{"seatid":4,"winScore":-20,"score":20}]})
        // })
    }

    protected onGameEndNtfHandler(msg){
        AnimationManager.instance.addAnimation(function(){
            BaseGameData.onGameEndNtfHandler(msg)
            for(var k in msg.scores){
                let v = msg.scores[k]
                // this._handCardView[v.seatid-1].showGameEnd(v.winScore)
                let text = v.winScore || 0
                let font = "font_num_15"
                if (v.winScore >= 0){
                    text = "+" + text
                    font = "font_num_14"
                }
                let score = new Laya.Label(text)
                this._table.addChild(score)
                score.font = font
                let dir = Utils.getDir(v.seatid)
                let pos = ShiSanShuiLayOut.WIN_SCORE_LAYOUT[BaseGameData.maxPlayer-1][dir-1]
                Utils.injectProp(score, pos)
                
                this._winScore.push(score)
            }
            this.setTableInfo()
            AnimationManager.instance.animationOver()
        }.bind(this),null)
        
    }

    protected onShowCardsNtfHandler(msg){
        BaseGameData.onShowCardsNtfHandler(msg)
        OptCardView.instance.hide()
        if(this._timeCircleView){
            this._timeCircleView.clear()
            this._timeCircleView.removeSelf()
            this._timeCircleView = null
        }
        for(var k in msg.showncards){
            let v = msg.showncards[k]
            let player = BaseGameData.getPlayerDataBySeatid(v.seatid)
            player.handCards = v.handcards
            this._handCardView[v.seatid-1].showCards(v.handcards)
        }
    }

    protected onPlayerOptNtfHandler(msg){
        if(msg.noAni) return
        AnimationManager.instance.addAnimation(function(){
            if(!this._timeCircleView){
                this._timeCircleView = new TimeCircleView()
                this._timeCircleView.centerX = 0
                this._timeCircleView.centerY = 35
                this._table.addChild(this._timeCircleView)
            }
            this._timeCircleView.start(msg.timeout)
            let player = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid)
            if(player && player.handCards){
                this._timeCircleView.visible = false
                OptCardView.instance.show(player.handCards,msg.timeout)
            }
            
            AnimationManager.instance.animationOver()
        }.bind(this),null)
        
    }

    protected onPlayerOptRepHandler(msg){

    }

    protected onCardMoveNtfHandler(msg){
        if(msg.opttype == GameDef.OptType.MJ_DEAL){
            let player = BaseGameData.getPlayerDataBySeatid(msg.toSeatid)
            player.handCards = msg.cards
        }
    }

    protected onReconnectNtfHandler(msg){
        super.onReconnectInfoHandler(msg);
         this.initGameUI()
         this.setHandCards()
         
         
        // for (var i: number = 1; i < this._playerUis.length; i++) {
        //     this._playerUis[i].checkIsGameing(true);
        // }
        this.setTableInfo();
    }

    protected setHandCards(){
        for (var k in BaseGameData.players){ 
            let player = BaseGameData.players[k]
            if (player.handCards){
                this._handCardView[player.seatid-1].init()
                
            }
        }
    }

    protected initCardsView(){
        for (var k in BaseGameData.players){
                let player = BaseGameData.players[k]
                let view = new shisanshui.HandCardView(player.seatid,player.dir)
                this._handCardView[player.seatid-1] = view
                this._table.addChild(view)
                let pos = ShiSanShuiLayOut.HAND_VIEW_LAYOUT[player.dir-1]
                Utils.injectProp(view,pos)
            }
    }

    protected onShowInfoNtfHandler(msg: any): void {
        if(msg.type == GameDef.ShowInfoType.DEAL_CARDS){
            if (msg.noAni) return
            AnimationManager.instance.addAnimation(function(){
                this._dealCardView = new shisanshui.DealCardView(this.dealCallBack.bind(this))
                this._table.addChild(this._dealCardView)
                this._dealCardView.dealCards(msg.info)
            }.bind(this),null)
        }else if(msg.type == GameDef.ShowInfoType.SHOW_OPT_END){
            
             AnimationManager.instance.addAnimation(function(){
                
                 
                 for(var k in msg.seatid){
                    if(msg.seatid[k] == BaseGameData.selfSeatid){
                        if(this._timeCircleView){
                            this._timeCircleView.visible = true
                        }
                        OptCardView.instance.hide()
                        
                    }
                    let view = this._handCardView[msg.seatid[k]-1]
                    view.updatePos()
                 }
                 Laya.timer.frameOnce(3,this,function(){
                    AlertInGameCtrl.instance.hide()
                 })
                 
                AnimationManager.instance.animationOver()
                
            }.bind(this),null)
        }else if(msg.type == GameDef.ShowInfoType.QUAN_LEI_DA){
            if(msg.noAni) return 
            AnimationManager.instance.addAnimation(function(){
                SoundManager.instance.playEffect("quanleida",1)
                let ani = new Laya.Animation()
                ani.loadAnimation(ResourceConfig.ANI_WIN_ALL)
                this._table.addChild(ani)
                ani.pos(this._table.width/2, this._table.height/2)
                ani.play(1,false)
                Laya.timer.once(2000,this,function(){
                    ani.stop()
                    ani.removeSelf()
                    AnimationManager.instance.animationOver()
                })

            }.bind(this),null)
        }else if(msg.type == GameDef.ShowInfoType.START_GAME){
            if(msg.noAni) return
            AnimationManager.instance.addAnimation(function(){
                SoundManager.instance.playEffect("start",1)
                let ani = new Laya.Animation()
                ani.loadAnimation(ResourceConfig.ANI_START_GAME)
                this._table.addChild(ani)
                ani.pos(this._table.width/2,this._table.height*0.45)
                ani.play(1,false)
                Laya.timer.once(2000,this,function(){
                    ani.stop()
                    ani.removeSelf()
                    AnimationManager.instance.animationOver()
                })
            }.bind(this),null)
        }else if(msg.type == GameDef.ShowInfoType.START_TIME){
            BaseGameData.isTableStart=true;
            BaseGameData.isGameing = true;
            this.setTableInfo();
            if(msg.noAni) return
            AnimationManager.instance.addAnimation(function(){
                SoundManager.instance.playEffect("start_time",1)
                let ani = new Laya.Animation()
                ani.loadAnimation(ResourceConfig.ANI_START_TIME)
                this._table.addChild(ani)
                ani.pos(this._table.width/2,this._table.height/2)
                ani.play(1,false)
                Laya.timer.once(4000,this,function(){
                    ani.stop()
                    ani.removeSelf()
                    AnimationManager.instance.animationOver()
                })
            }.bind(this),null)
        }
    }
    public dealCallBack(){
        if(this._dealCardView){
            this._dealCardView.clear()
            this._dealCardView.removeSelf()
            this._dealCardView = null
        }
        for(var i=0;i<BaseGameData.maxPlayer;i++){
            if(this._handCardView[i])
            this._handCardView[i].init()
        }
        AnimationManager.instance.animationOver()
    }

    protected updateTable(){
        Laya.Tween.clearAll(this)
        Laya.timer.clearAll(this)
        AnimationManager.instance.endAnimations()
        OptCardView.instance.hide()
        if(this._dealCardView){
            this._dealCardView.clear()
            this._dealCardView.removeSelf()
            this._dealCardView = null
        }
        this.initGameUI()
        // this.removeSeatViews()
        // this.initSeatViews()
        // for (var i: number = 1; i < this._playerUis.length; i++) {
        //     this._playerUis[i].checkIsGameing(true);
        // }
        for(var i=0;i<BaseGameData.maxPlayer;i++){
            if(this._handCardView[i])
            this._handCardView[i].init()
        }
        if(ShiSanShuiData._scoreInfo){
            for(var k in ShiSanShuiData._scoreInfo){
                let v = ShiSanShuiData._scoreInfo[k]
                
                this._handCardView[v.seatid-1].showWinDetail(v.info)
            }
        }
       
    }

    protected clearData(needCheckIsGameing: boolean = true): void {
        for(var k in this._handCardView){
            let v = this._handCardView[k]
            if(v){
                v.clearAll()
            }
        }
        if(this._dealCardView){
            this._dealCardView.clear()
            this._dealCardView.removeSelf()
            this._dealCardView = null
        }
        Laya.timer.clearAll(this)
        Laya.Tween.clearAll(this)
        AnimationManager.instance.endAnimations()
        super.clearData(needCheckIsGameing)
    }

    public destroy(): void {
        super.destroy();
        Laya.Tween.clearAll(this)
        Laya.timer.clearAll(this)
        if(this._ruleView){
            this._ruleView.removeSelf()
            this._ruleView = null
        }
        this.clearGame()
        this.clearGameUI()
    }
}