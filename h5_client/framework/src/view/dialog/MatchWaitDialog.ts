class MatchWaitDialog extends ui.match.MatchWaitUI{
    constructor(){
        super()
        // this.updateMatchInfo()
        
    }

    
    show(){
        this.updateMatchInfo()
    }

    updateMatchInfo(){
        let index = BaseGameData.matchInfo.matchRounds || 1
        if (BaseGameData.matchInfo.waiting == 1 && 
            !BaseGameData.matchInfo.matchHandCnt && 
            BaseGameData.matchInfo.matchStage == 1){

            this._rank.visible = false
            this._rankNum.visible = false
            this._ming .visible = false
            this._wait.visible = true
            
            
        }else{
            this._wait.visible = false
            this.updateWaittingTableText()

            this.updateRankingText()

        }
        let cnt = BaseGameData.matchInfo.matchLeftTable || 0
        if (cnt <= 0)
            cnt = 1
        this._left.text = cnt+"桌正在游戏中"
        // this._jinji.text = "前"+BaseGameData.matchInfo.matchSwissPlayer[index]+"名晋级"
        if (BaseGameData.matchInfo.totalPlayer > BaseGameData.matchInfo.matchSwissPlayer[0]){
            this._view1.visible = true
            this._view2.visible = false
            this._stage_1_3._stage.skin = BaseGameData.matchInfo.matchStage < 3 ? "match/stage_1_1.png":"match/stage_1_2.png"
            this._stage_1_3._bg.skin = BaseGameData.matchInfo.matchStage < 3 ?  "match/stage_1.png" : "match/stage_2.png"
            this._stage_1_3._jinjiBegin.text = String(BaseGameData.matchInfo.totalPlayer)
            this._stage_1_3._jinjiBegin.font = BaseGameData.matchInfo.matchStage < 3 ? "font_num_17" : "font_num_18"
            this._stage_1_3._jinjiBegin.visible =  true
            this._stage_1_3._jinjiEnd.text = String(BaseGameData.matchInfo.matchSwissPlayer[0])
            this._stage_1_3._jinjiEnd.visible =  true
             this._stage_1_3._jinjiEnd.font = BaseGameData.matchInfo.matchStage < 3 ? "font_num_17" : "font_num_18"
             this._stage_1_3._ing.skin = BaseGameData.matchInfo.matchStage < 3 ? "match/jin_1.png" : "match/jin_2.png"
            // this._stage_1_3._jinji.text =  "前"+BaseGameData.matchInfo.matchSwissPlayer[0]+"名晋级"
            this._stage_1_3._jinji.visible = BaseGameData.matchInfo.matchStage < 3 ? true : false
            this._stage_1_3._round.text = "第"+BaseGameData.matchInfo.matchHandCnt+"局"
            this._stage_1_3._round.visible = BaseGameData.matchInfo.matchStage < 3 && BaseGameData.matchInfo.matchHandCnt ? true : false
            this._stage_3_3._bg.skin = BaseGameData.matchInfo.matchStage == 3 ? "match/stage_1.png":"match/stage_2.png"
            this._stage_3_3._stage.skin = BaseGameData.matchInfo.matchStage == 3 ?"match/stage_3_1.png":"match/stage_3_2.png"
            this._stage_3_3._jinjiBegin.text = String(BaseGameData.matchInfo.matchSwissPlayer[index-1])
            this._stage_3_3._jinjiBegin.font = BaseGameData.matchInfo.matchStage == 3 ? "font_num_17" : "font_num_18"
            this._stage_3_3._jinjiBegin.visible = BaseGameData.matchInfo.matchStage < 3 ? false : true
            this._stage_3_3._jinjiEnd.text = String(BaseGameData.matchInfo.matchSwissPlayer[index])
            this._stage_3_3._jinjiEnd.font = BaseGameData.matchInfo.matchStage == 3 ? "font_num_17" : "font_num_18"
            this._stage_3_3._jinjiEnd.visible = BaseGameData.matchInfo.matchStage < 3 ? false : true
            this._stage_3_3._jin.skin = BaseGameData.matchInfo.matchStage == 3 ? "match/jin_1.png" : "match/jin_2.png" 
            this._stage_3_3._jin.visible = BaseGameData.matchInfo.matchStage < 3 ? false : true
            this._stage_3_3._begin.visible = BaseGameData.matchInfo.matchStage < 3 ? true : false
            // this._stage_3_3._jinji.text = "前"+BaseGameData.matchInfo.matchSwissPlayer[index]+"名晋级"
            // this._stage_3_3._jinji.visible = BaseGameData.matchInfo.matchStage == 3 ? true : false
            this._stage_3_3._round.text = "第"+(BaseGameData.matchInfo.matchRounds || 1) + "轮"
            this._stage_3_3._round.visible = BaseGameData.matchInfo.matchStage == 3 ? true : false
            this._stage_4_3._bg.skin = BaseGameData.matchInfo.matchStage == 4 ? "match/stage_1.png" : "match/stage_2.png"
            this._stage_4_3._stage.skin = BaseGameData.matchInfo.matchStage == 4 ? "match/stage_4_1.png" : "match/stage_4_2.png"
            this._stage_4_3._begin.visible = BaseGameData.matchInfo.matchStage < 4 ? true : false
            this._stage_4_3._ing.visible = BaseGameData.matchInfo.matchStage < 4 ? false : true
            if(BaseGameData.matchInfo.matchStage < 3){
                this._stage_1_3.ani1.play()
                this._stage_3_3.ani1.gotoAndStop(0)
                this._stage_4_3.ani1.gotoAndStop(0)
            }else if(BaseGameData.matchInfo.matchStage < 4){
                this._stage_1_3.ani1.gotoAndStop(0)
                this._stage_3_3.ani1.play()
                this._stage_4_3.ani1.gotoAndStop(0)
            }else{
                this._stage_1_3.ani1.gotoAndStop(0)
                this._stage_3_3.ani1.gotoAndStop(0)
                this._stage_4_3.ani1.play()
            }
        }else{
            this._view1.visible = false
            this._view2.visible = true
            this._stage_3_2._bg.skin = BaseGameData.matchInfo.matchStage == 3 ? "match/stage_1.png":"match/stage_2.png"
            this._stage_3_2._stage.skin = BaseGameData.matchInfo.matchStage == 3 ?"match/stage_3_1.png":"match/stage_3_2.png"
            this._stage_3_2._jinjiBegin.text = String(BaseGameData.matchInfo.matchSwissPlayer[index-1])
            this._stage_3_2._jinjiBegin.visible = true
            this._stage_3_2._jinjiBegin.font = BaseGameData.matchInfo.matchStage == 3 ? "font_num_17" : "font_num_18"
            this._stage_3_2._jinjiEnd.text = String(BaseGameData.matchInfo.matchSwissPlayer[index])
            this._stage_3_2._jinjiEnd.font = BaseGameData.matchInfo.matchStage == 3 ? "font_num_17" : "font_num_18"
            this._stage_3_2._jinjiEnd.visible = true
            if(BaseGameData.matchInfo.matchStage == 4){
                 this._stage_3_2._jinjiBegin.text = String(BaseGameData.matchInfo.matchSwissPlayer[index-2])
                 this._stage_3_2._jinjiEnd.text = String(BaseGameData.matchInfo.matchSwissPlayer[index-1])
            }
            this._stage_3_2._jinji.visible = BaseGameData.matchInfo.matchStage == 3 ? true : false
            this._stage_3_2._round.text = "第"+(BaseGameData.matchInfo.matchRounds || 1)+"轮"
            this._stage_3_2._round.visible = BaseGameData.matchInfo.matchStage == 3 ? true : false
            this._stage_3_2._ing.skin = BaseGameData.matchInfo.matchStage == 3 ? "match/jin_1.png" : "match/jin_2.png"
            this._stage_4_2._bg.skin = BaseGameData.matchInfo.matchStage == 4 ? "match/stage_1.png" : "match/stage_2.png"
            this._stage_4_2._stage.skin = BaseGameData.matchInfo.matchStage == 4 ? "match/stage_4_1.png" : "match/stage_4_2.png"
            this._stage_4_2._begin.visible = BaseGameData.matchInfo.matchStage < 4 ? true : false
            this._stage_4_2._ing.visible = BaseGameData.matchInfo.matchStage < 4 ? false : true

            if(BaseGameData.matchInfo.matchStage < 4){
                this._stage_3_2.ani1.play()
                this._stage_4_2.ani1.gotoAndStop(0)
            }else{
                this._stage_3_2.ani1.gotoAndStop(0)
                this._stage_4_2.ani1.play()
            }
        }
    }

    updateWaittingTableText(){
        if (BaseGameData.matchInfo.matchStage == 1){
            this._waittext.text = "正在为您匹配本局对手，请稍等"
            
        }else{
            this._waittext.text = "正在等待其他桌结束"
            let cnt = BaseGameData.matchInfo.matchLeftTable || 0
            if (cnt <= 0)
                cnt = 1
            this._left.text = "当前仍有"+cnt+"桌进行中"
        }
    }
    private _fontData
    updateRankingText(){
        this._rank.visible = true
        //倍数美术字
       
        this._rankNum.text = String(BaseGameData.matchInfo.matchRank);
        
    }
}

// this._fontData = new FontData();
// 			this._fontData.init(FontConfig.FONT_WAKENG_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_WAKENG1_JSON),
// 				Laya.loader.getRes(ResourceConfig.BITMAP_FONT_WAKENG1_PNG), 50, BPFont.LEFT);
// 			this._bpFont = FontManager.instance.addFont(this._fontData);
// 			this.addChild(this._bpFont);
// 			this._bpFont.pos(41, 12);
// 			this._bpFont.text = "*1";