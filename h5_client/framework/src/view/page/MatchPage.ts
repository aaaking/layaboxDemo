class MatchPage extends TablePage {
    constructor() {
        super()
        this.name = "MatchPage";
        this._loadDatas = this._loadDatas.concat([{ url: ResourceConfig.SHEET_SHISANSHUI_ANI, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_MATCH, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_MATCHSIGN_ANI, type: Laya.Loader.ATLAS }
                            ,{ url: ResourceConfig.BG_MATCH_SHARE, type: Laya.Loader.IMAGE }
        ]);
        AppPage.register(BaseMJPage, this._loadDatas);
        // GameConfig.IS_MATCH = true
    }
    protected matchTopBg
    protected matchStage
    protected matchOut
    protected startAni
    protected serverCode
    private isOver
    protected init(...params): void {
        BaseGameData.tablelayout = MaJiangLayOut
        super.init.apply(this, params);
        // this.initEvent()
        DialogManager.instance.addDialog("MATCH_WAIT", MatchWaitDialog)
        DialogManager.instance.addDialog("MATCH_RECORD", MatchRecordDialog)
        DialogManager.instance.addDialog("MATCH_OVER", MatchOverDialog)
        DialogManager.instance.addDialog("MATCH_OUT_WIN", MatchOutWinDialog)
        DialogManager.instance.addDialog("MATCH_OUT_LOSE", MatchOutLoseDialog)
        DialogManager.instance.addDialog("MATCH_SHARE", MatchShareDialog)
        this.isOver = false
    }

    protected initEvent(): void {
        super.initEvent()
        if (GameConfig.IS_MATCH) {
            EventManager.instance.registerOnObject(this, server, EventNames.MATCH_START, this, this.onMatchStartNtf);
            EventManager.instance.registerOnObject(this, server, EventNames.MATCH_INFO, this, this.onMatchInfoNtf);
            EventManager.instance.registerOnObject(this, server, EventNames.MATCH_KICK_OUT, this, this.onMatchKickOutNtf);
            EventManager.instance.registerOnObject(this, server, EventNames.MATCH_SCORE_NTF, this, this.onMatchBaseScoreNtf);

            EventManager.instance.registerOnObject(this, server, EventNames.MATCH_RANK, this, this.onMatchUpdateRankNtf);
            EventManager.instance.registerOnObject(this, server, EventNames.MATCH_OVER, this, this.onMatchOverNtf);
            EventManager.instance.registerOnObject(this, server, EventNames.MATCH_RECORD_REP, this, this.onMatchRecordRep);
            EventManager.instance.registerOnObject(this, server, EventNames.MATCH_MSG_INFO, this, this.onMsgMatchInfoNtf);
            this.serverCode = server.code
        }

        //     message PlayerInfo {
        // 	required uint32 uid = 1;
        // 	optional uint32 ranking = 2;
        // 	optional int32 score = 3;
        // }

        Laya.timer.once(3000, this, function () {
            // this.onMatchOverNtf({playerInfo:[{uid:10001,ranking:1,score:3,nickname:"1111"},{uid:10002,ranking:2,score:3,nickname:"2222"},{uid:10003,ranking:3,score:3,nickname:"3333"}]})
            //          optional uint32 waiting = 1; 		//等待状态 0 不等待 1等待
            // optional uint32 stage = 2; 			//阶段 1初赛 2初赛进复赛等待 3复赛 4 决赛 
            // optional uint32 ranking = 3;
            // optional uint32 hands_cnt = 4;  	//初赛一共打了几局
            // optional uint32 rounds = 5;    		//复赛轮数
            // optional uint32 left_table = 6;
            // optional uint32 player_cnt = 7;
            // repeated uint32 swiss_player = 8;
            // optional uint32 total_player = 9;
            // optional uint32 match_score = 10;
            // optional uint32 swiss_round = 11;
            // this.onMatchStartNtf({"stage":4,"playerCnt":25})
            // this.onMatchInfoNtf({"waiting":1,"stage":3,"handsCnt":4,"lefttable":10,"ranking":10,"playerCnt":48,"swissPlayer":[25,18,12,4],"totalPlayer":25,"matchScore":10})
            // this.onShowInfoNtfHandler({"type":GameDef.ShowInfoType.START_GAME,"info":[]})
            // this.onShowInfoNtfHandler({"type":GameDef.ShowInfoType.DEAL_CARDS,"info":[13,13,13,13]})
            // this.onCardMoveNtfHandler({"toSeatid":1,"cards":[40,41,42,43,50,51,52,60,61,82,93,70,101],"opttype":GameDef.OptType.MJ_DEAL})
            // this.onPlayerOptNtfHandler({"seatid":1,"cards":[40,41,42,43,50,51,52,60,61,82,93,70,101]})
            // this.onShowCardsNtfHandler({"showncards":[{"seatid":1,"handcards":[40,41,42,43,50,51,52,60,61,82,93,70,101]},{"seatid":2,"handcards":[112,62,91,82,102,110,101,41,42,111,131,143,51]},{"seatid":3,"handcards":[53,142,30,71,40,141,23,33,121,140,22,73,123]},{"seatid":4,"handcards":[72,103,122,130,113,61,60,80,63,31,81,133,32]}]})
            // this.onDetailNtfHandler({"detailType":1,"playerInfo":[{"seatid":1,"info":[{"name":2,"value":3},{"name":4,"value":5},{"name":1,"value":-3},{"name":8},{"name":1,"value":-3},{"name":1}]},{"seatid":2,"info":[{"name":1,"value":-3},{"name":1},{"name":3,"value":1},{"name":3},{"name":1,"value":3},{"name":1}]},{"seatid":3,"info":[{"name":1,"value":1},{"name":1},{"name":2,"value":-1},{"name":2},{"name":1,"value":-1},{"name":1}]},{"seatid":4,"info":[{"name":1,"value":-1},{"name":1},{"name":4,"value":3},{"name":8},{"name":1,"value":1},{"name":1}]}]})
            // this.onDetailNtfHandler({"detailType":3,"playerInfo":[{"seatid":1,"info":[{"name":1000,"value":3}]}]})
            // this.onDetailNtfHandler({"detailType":4,"playerInfo":[{"seatid":1,"info":[{"name":2,"value":3}]}]})
            // this.onGameEndNtfHandler({"win_type":1,"scores":[{"seatid":1,"winScore":20,"score":20},{"seatid":2,"winScore":-40,"score":20},{"seatid":3,"winScore":30,"score":20},{"seatid":4,"winScore":-20,"score":20}]})
            // this.onMatchKickOutNtf({uid:969726,ranking:1})
        })
    }

    protected layoutChild(): void {
        super.layoutChild();
        if(!GameConfig.IS_MATCH){
            if(this.matchTopBg){
                this.matchTopBg.removeSelf()
                this.matchTopBg = null
            }
            if(this.matchStage){
                this.matchStage.removeSelf()
                this.matchStage = null
            }
        }
       

    }

    protected onGameStartNtfHandler(msg: any): void {
        super.onGameStartNtfHandler(msg)
        if(GameConfig.IS_MATCH){
            this.updateMatchTopInfo()
        }
    }

    protected onMatchStartNtf(msg) {
        BaseGameData.matchInfo.matchStage = msg.stage
        if (msg.stage == 3) {
            BaseGameData.matchInfo.matchRounds = 1
        }
        if (msg.stage == 1 && !BaseGameData.matchInfo.matchHandCnt) {
            BaseGameData.matchInfo.matchHandCnt = 1
        }
        BaseGameData.matchInfo.matchPlayer = msg.playerCnt
        if (BaseGameData.matchInfo.matchRank && BaseGameData.matchInfo.matchRank > BaseGameData.matchInfo.matchPlayer) {
            BaseGameData.matchInfo.matchPlayer = BaseGameData.matchInfo.matchRank
        }
        if (this.matchTopBg && BaseGameData.matchInfo.matchRank && BaseGameData.selfSeatid) {
            this.matchTopBg._rank.text = "当前排名" + BaseGameData.matchInfo.matchRank + "/" + BaseGameData.matchInfo.matchPlayer
        }
        AnimationManager.instance.addAnimation(function () {
            DialogManager.instance.clearAll()
            this.showMatchStart()
        }.bind(this), function () {
            this.clearMatchStart()
        }.bind(this))
    }

    protected showMatchStart() {
        this.startAni = new Laya.Animation();
        let res = ResourceConfig.ANI_START_STAGE_1
        if (BaseGameData.matchInfo.matchStage == 3 && BaseGameData.matchInfo.totalPlayer > BaseGameData.matchInfo.matchSwissPlayer[0]) {
            res = ResourceConfig.ANI_START_STAGE_3
        } else if (BaseGameData.matchInfo.matchStage == 4) {
            res = ResourceConfig.ANI_START_STAGE_4
        }

        this.startAni.loadAnimation(res);

        this.startAni.zOrder = GameZorder.Ani
        this._table.addChild(this.startAni)
        this.startAni.pos(Laya.stage.width / 2, Laya.stage.height / 2)
        this.startAni.play(1, false)
        Laya.timer.once(2100, this, this.removeStartAni)
    }

    protected removeStartAni(){
        if(this.startAni){
            this.startAni.stop()
            this.startAni.removeSelf()
            this.startAni = null
        }
        AnimationManager.instance.animationOver()
    }

    protected clearMatchStart() {
        Laya.timer.clear(this, this.removeStartAni)
        if (this.startAni) {
            this.startAni.stop()
            this.startAni.removeSelf()
            this.startAni = null
        }
        // AnimationManager.instance.animationOver()
    }

    protected updateMatchTopInfo() {
        if (!BaseGameData.matchInfo.matchStage)
            return




        if (this.matchTopBg){
            this.matchTopBg.removeSelf()
            this.matchTopBg = null
        }
        if(!this.matchTopBg){
            this.matchTopBg = new ui.match.MatchTopUI()
            this._table.addChild(this.matchTopBg)
        }
        this.matchTopBg.centerX = 0

        let node = new Laya.Box()
        let offset = 0
        let xoffset = 20
        let size = this.matchTopBg.getBounds()
        let yoffset = size.height / 2
        let stageTxt = ["[预赛]", "[预赛]", "[复赛]", "[决赛]"]
        let stage = BaseGameData.matchInfo.matchStage

        if (BaseGameData.matchInfo.matchSwissPlayer) {
            if (BaseGameData.matchInfo.totalPlayer == BaseGameData.matchInfo.matchSwissPlayer[0] && stage == 3)
                stage = 1
            if (!this.matchStage) {
                this.matchStage = new Laya.Label(stageTxt[stage - 1])
                this.matchStage.width = 200
                this.matchStage.align = "center"
                this._table.addChild(this.matchStage)
                this.matchStage.centerX = 0
                this.matchStage.bottom = 200
                this.matchStage.fontSize = 32
                this.matchStage.alpha = 0.32
            } else {
                this.matchStage.text = stageTxt[stage - 1]
            }
        }

        if (BaseGameData.matchInfo.matchRounds &&
            BaseGameData.matchInfo.matchRounds > 0 &&
            BaseGameData.matchInfo.matchStage < 4) {
            this.matchStage.text = stageTxt[stage - 1] + " 第" + BaseGameData.matchInfo.matchRounds + "轮"
        }
        if (BaseGameData.matchInfo.matchScore) {
            console.log("BaseGameData.matchInfo.matchScore===============================" + BaseGameData.matchInfo.matchScore)
            this.matchTopBg._score.text = "当前底分：" + BaseGameData.matchInfo.matchScore
        }

        // if(BaseGameData.matchInfo.matchHandCnt && BaseGameData.selfSeatid){
        //     if(BaseGameData.matchInfo.matchStage < 3){

        //         this.matchHandCnt = new Laya.Label("第"+BaseGameData.matchInfo.matchHandCnt+"局")
        //             node.addChild(this.matchHandCnt)
        //             this.matchHandCnt.pos(offset,yoffset)

        //         size = this.matchHandCnt.getBounds()
        //         offset = offset + size.width + xoffset
        //     }else{
        //         this.matchHandCnt = new Laya.Label("第"+BaseGameData.currHandCount+"/"+BaseGameData.matchInfo.swissRound+"局")
        //             node.addChild(this.matchHandCnt)
        //             this.matchHandCnt.pos(offset,yoffset)

        //         size = this.matchHandCnt.getBounds()
        //         offset = offset + size.width + xoffset
        //     }
        // }
        if (BaseGameData.matchInfo.matchStage < 4) {
            if (BaseGameData.matchInfo.matchStage > 2) {
                // if(BaseGameData.matchInfo.matchRounds && BaseGameData.matchInfo.matchRounds > 0){
                this.matchTopBg._taotai.text = "前" + BaseGameData.matchInfo.matchSwissPlayer[BaseGameData.matchInfo.matchRounds || 1] + "名晋级"
                // }
            } else {
                if (BaseGameData.matchInfo.baseScore && BaseGameData.matchInfo.multiple) {
                    this.matchTopBg._taotai.text = "低于" + String(BaseGameData.matchInfo.baseScore * BaseGameData.matchInfo.multiple) + "分将被淘汰"
                }
            }
        } else {
            this.matchTopBg._taotai.text = "决赛中"
        }

        if (BaseGameData.matchInfo.matchPlayer > 0) {
            // if(BaseGameData.selfSeatid){
            if (BaseGameData.matchInfo.matchRank && BaseGameData.matchInfo.matchRank > BaseGameData.matchInfo.matchPlayer)
                BaseGameData.matchInfo.matchPlayer = BaseGameData.matchInfo.matchRank
            this.matchTopBg._rank.text = "当前排名" + (BaseGameData.matchInfo.matchRank || 1) + "/" + BaseGameData.matchInfo.matchPlayer

            // }else{
            //     this.matchTopBg._rank.text = "剩余"+BaseGameData.matchInfo.matchPlayer+"人对战中"
            // }

        }
    }

    protected onMatchInfoNtf(msg) {
        // this.joinTableOk = true
        BaseGameData.onMatchInfo(msg)
        if (msg.handsCnt) {
            BaseGameData.matchInfo.matchHandCnt = msg.handsCnt
        } else
            BaseGameData.matchInfo.matchHandCnt = BaseGameData.matchInfo.matchHandCnt

        if (msg.matchScore)
            BaseGameData.matchInfo.baseScore = msg.matchScore
        if (msg.swissRound)
            BaseGameData.matchInfo.swissRound = msg.swissRound
        if (!BaseGameData.matchInfo.waiting || BaseGameData.matchInfo.waiting <= 0)
            this.updateMatchTopInfo()
        this.showMatchWait()
    }

    protected showMatchWait() {
        if (!BaseGameData.matchInfo.waiting || BaseGameData.matchInfo.waiting == 0 || this.isOver
            || DialogManager.instance.hasDialog("MATCH_OUT_WIN") || DialogManager.instance.hasDialog("MATCH_OUT_LOSE"))
            return
        if (!BaseGameData.matchInfo.matchSwissPlayer) return
        if(BaseGameData.isGameing) return
        BaseGameData.tableid = 0
        // if self.menuButton then
        //     self.menuButton:setLocalZOrder(DIALOG_ZORDER + 1)
        // end
        if (DialogManager.instance.hasDialog("MATCH_WAIT"))
            DialogManager.instance._dialogList["MATCH_WAIT"].updateMatchInfo()
        else
            AnimationManager.instance.addAnimation(function () {
                let dialog = DialogManager.instance.callDialog("MATCH_WAIT")
                dialog.show()
                if (DialogManager.instance.hasDialog("GAME_END") && DialogManager.instance._dialogList["GAME_END"].updateMatchRoundEnd) {
                    DialogManager.instance._dialogList["GAME_END"].updateMatchRoundEnd()
                    dialog.visible = false
                }
                AnimationManager.instance.animationOver()
            }, null)
    }

    protected onMatchBaseScoreNtf(msg) {
        console.log("onMatchBaseScoreNtf=======================")
        BaseGameData.matchInfo.baseScore = msg.score || 0
        BaseGameData.matchInfo.multiple = msg.multiple || 1
        BaseGameData.matchInfo.nextUpdateTime = parseInt(msg.nextUpdateTime) || 0
        BaseGameData.matchInfo.nextBaseScore = parseInt(msg.nextBaseScore) || 0
        HintCtrl.instance.show("淘汰分涨至 " + BaseGameData.matchInfo.baseScore * BaseGameData.matchInfo.multiple + "  底分涨至" + BaseGameData.matchInfo.baseScore)
        if (this.matchTopBg) {
            this.matchTopBg._taotai.text = "低于" + String(BaseGameData.matchInfo.baseScore * BaseGameData.matchInfo.multiple) + "分将被淘汰"
        }

        // if (!this.matchTimerHandler then
        //     this.matchTimerHandler = scheduler.scheduleGlobal(handler(self, this.checkLeftTimer), 1)
        // end
        //  console.log(msg.nextUpdateTime-server.serverTime)
        //  if(msg.nextUpdateTime-server.serverTime > 0){
        //     Laya.timer.once(Math.abs(msg.nextUpdateTime-server.serverTime)*1000, this, function(){
        //         HintCtrl.instance.show("淘汰分涨至 "+BaseGameData.matchInfo.nextBaseScore*BaseGameData.matchInfo.multiple+"  底分涨至"+BaseGameData.matchInfo.nextBaseScore)
        //         if (this.matchTopBg){
        //             this.matchTopBg._taotai.text = "低于"+String(BaseGameData.matchInfo.baseScore*BaseGameData.matchInfo.multiple)+"分将被淘汰"
        //             // this.matchTopBg._score.text = "当前底分: "+msg.nextBaseScore
        //         }    
        //     })
        //  }
    }

    protected onMatchUpdateRankNtf(msg) {
        BaseGameData.matchInfo.matchRank = msg.ranking
        if (BaseGameData.matchInfo.matchRank && BaseGameData.matchInfo.matchRank > BaseGameData.matchInfo.matchPlayer)
            BaseGameData.matchInfo.matchPlayer = msg.ranking
        if (this.matchTopBg && BaseGameData.selfSeatid)
            this.matchTopBg._rank.text = "当前排名" + BaseGameData.matchInfo.matchRank + "/" + BaseGameData.matchInfo.matchPlayer
        this.showMatchWait()
    }

    protected onMatchKickOutNtf(msg) {
        if (msg.uid == server.uid) {
            if (DialogManager.instance.hasDialog("MATCH_WAIT")) {
                DialogManager.instance.removeDialog("MATCH_WAIT")
            }
            this.isOver = true
            BaseGameData.matchInfo.matchRank = msg.ranking
            AnimationManager.instance.addAnimation(function () {
                // let dialog = DialogManager.instance.callDialog("MATCH_OUT",msg.ranking)
                // dialog.show(msg.ranking)
                // dialog.onCloseView(this.exitGame)
                if (DialogManager.instance.hasDialog("MATCH_WAIT")) {
                    DialogManager.instance.removeDialog("MATCH_WAIT")
                }
                if (DialogManager.instance.hasDialog("GAME_END")) {
                    //  DialogManager.instance._dialogList["GAME_END"].updateMatchRoundEnd()
                    //  dialog.visible = false
                    if(BaseGameData.matchInfo.matchStage > 2){
                        Laya.timer.once(2000, this, function () {
                            this.playMathOut(msg)
                            DialogManager.instance.removeDialog("GAME_END")
                        })
                    }else{
                        this.playMathOut(msg)
                        DialogManager.instance.removeDialog("GAME_END")
                    }
                } else {
                    this.playMathOut(msg)
                }
                
            }.bind(this), null)

        }

        BaseGameData.matchInfo.matchPlayer = msg.playerCnt
        if (BaseGameData.matchInfo.matchRank && BaseGameData.matchInfo.matchRank > BaseGameData.matchInfo.matchPlayer) {
            BaseGameData.matchInfo.matchPlayer = BaseGameData.matchInfo.matchRank
        }
        
    }

    protected playMathOut(msg) {
        DialogManager.instance.removeDialog("MATCH_WAIT")
        let player = RoleManager.getRole(server.uid)
        BaseGameData.matchReward = msg.reward || 0
        BaseGameData.matchTitle = matchSign.MatchSignData.getInfoByCode(parseInt(this.serverCode)).mrule.title
        var info = {a:"",u:"",n:"",r:0,t:"",s:1,d:0}
        if(player){
            info.a = player.avatar
            info.n = player.nickname
            info.u = String(server.uid)
            info.r = BaseGameData.matchInfo.matchRank
            info.t = BaseGameData.matchTitle
            info.s = BaseGameData.matchInfo.matchStage
            info.d = BaseGameData.matchReward
        }
        let text = JSON.stringify(info)
        msg.info = text
        msg.code = this.serverCode
        msg.title = BaseGameData.matchTitle
        if (BaseGameData.matchInfo.matchStage < 3) {
            let dialog = DialogManager.instance.callDialog("MATCH_OUT_LOSE")
            dialog.show(msg)
            AnimationManager.instance.animationOver()
            server.code = "";
            server.close();
            LoadingUI.instance.hide();
        } else {
            let dialog = DialogManager.instance.callDialog("MATCH_OUT_WIN")
            dialog.show(msg)
            Laya.timer.once(4000,this,function(){
                AnimationManager.instance.animationOver()
            })
        }
        
    }

    protected back() {
        if (this.matchOut) {
            this.matchOut.removeSelf()
            this.matchOut = null
        }
        super.back()
    }

    private share(): void {
        Native.instance.share(2, 0);
    }

    protected onMatchOverNtf(msg) {
        AnimationManager.instance.addAnimation(function () {
            let dialog = DialogManager.instance.callDialog("MATCH_OVER")
            msg.code = this.serverCode
            let player = RoleManager.getRole(server.uid)
            var info = {a:"",u:"",n:"",r:0,t:"",s:1,d:0}
            if(player){
                info.a = player.avatar
                info.n = player.nickname
                info.u = String(server.uid)
                info.r = BaseGameData.matchInfo.matchRank
                info.t = BaseGameData.matchTitle
                info.s = BaseGameData.matchInfo.matchStage
                info.d = BaseGameData.matchReward
            }
            let text = JSON.stringify(info)
            msg.info = text
            dialog.show(msg)
            if(DialogManager.instance.hasDialog("MATCH_OUT_WIN")){
                dialog.visible = false
                DialogManager.instance._dialogList["MATCH_OUT_WIN"].matchOver()
            }
            
            server.code = "";
            server.close();
            LoadingUI.instance.hide();
            AnimationManager.instance.animationOver()
        }.bind(this), null)
        //--------------------------主动断开连接 zhc新增-------------
        
    }

    protected onMsgMatchInfoNtf(msg) {
        if (msg.type == 1) {

        }

        if (msg.type == 2) {
            HintCtrl.instance.show("请勿消极比赛，可能被直接淘汰")
        }
    }

    protected onMatchRecordRep(msg) {
        if (!msg.playerInfo) return

        let playersInfo = msg.playerInfo
        // self:checkPlayer(playersInfo)

        if (DialogManager.instance.hasDialog("MATCH_RECORD")) {
            DialogManager.instance._dialogList["MATCH_RECORD"].show(msg)
        }
    }

}