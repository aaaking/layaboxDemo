class MatchRecordDialog extends ui.match.MatchRecordUI{
    constructor(){
        super()
        this._rankList.scrollBar.visible = false;
        this._rewardList.scrollBar.visible = false;
        this._rankList.itemRender = MatchRankRender;
        this._rankList.renderHandler = new Laya.Handler(this, this.updateRank);
        this._rankList.array=[];
        this._rewardList.itemRender = MatchRewardRender;
        this._rewardList.renderHandler = new Laya.Handler(this, this.updateReward);
        this._rewardList.array=[];
        if(!BaseGameData.isFreeMatch){
            this._rank.height = 320
            this._rank.y = 141
            this._rankList.height = 220
            this._tab.visible = true
            this._tab.on(Laya.Event.CLICK,this, this.onClick)
        }else{
            this._rankList.height = 300
            this._rank.height = 400
            this._rank.y = 65
            this._tab.visible = false
        }
        
        this._close.on(Laya.Event.CLICK,this, this.hide)
    }
    private _data
    show(data){
        this._data = data
        this._selectType = 0
        this.checkTab()
        this._rankList.array = data.playerInfo
    }

    private _selectType
    
    private onClick(){
        this._selectType = this._selectType == 0 ? 1 : 0
        this.checkTab()
    }
    checkTab(){
        if(this._selectType == 0){
            this._tab.skin = "match/paiming.png"
            this._rank.visible = true
            this._reward.visible = false
            this._selfRank.text = "我的排名"+this._data.selfInfo.ranking
            if (BaseGameData.matchInfo.matchHandCnt && BaseGameData.selfSeatid){
                if (BaseGameData.matchInfo.matchStage < 3 ){

                    this._round.text = "局数:"+BaseGameData.matchInfo.matchHandCnt
                    
                }else{
                    this._round.text = "局数:"+BaseGameData.currHandCount
                }
            }
            // this._round.text = "局数:" + (BaseGameData.matchInfo.matchHandCnt || 0)
            this._score.text = "分数："+ this._data.selfInfo.score
        }else{
            matchSign.MatchSignData.getReward(parseInt(server.code),function(reward){
                this._rewardList.array = reward
            }.bind(this))
            this._tab.skin = "match/jiangli.png"
            this._rank.visible = false
            this._reward.visible = true
            this._totalReward.text = "总奖池："+ BaseGameData.matchInfo.totalPlayer * 10
            this._player.text = "参赛人数 " + BaseGameData.matchInfo.totalPlayer
        }
    }

    protected updateRank(cell: MatchRankRender, index: number){
        cell.updata(index)
    }

    protected updateReward(cell: MatchRewardRender,index: number){
        cell.updata(index)
    }

    hide(){
        DialogManager.instance.removeDialog("MATCH_RECORD")
    }
}

class MatchRankRender extends ui.match.MatchRankRenderUI{
    constructor(){
        super()
    }

    updata(index){
        console.info(this.dataSource)
        if(this.dataSource.ranking < 4){
            this._rank.visible = false
            this._img.visible = true
            this._img.skin = "match/rank_"+this.dataSource.ranking+".png"
        }else{
            this._rank.visible = true
            this._rank.text = String(this.dataSource.ranking)
            this._img.visible = false
        }
        this._name.text = Utils.getFitNickName(this.dataSource.nickname,10)
        this._score.text = this.dataSource.score
    }
}

class MatchRewardRender extends ui.match.MatchRewardRenderUI{
    constructor(){
        super()
    }

    updata(index){
        if(index < 3){
            this._rank.visible = false
            this._img.skin = "match/rank_"+(index+1)+".png"
        }else{
            this._rank.text = String(index+1)
            this._img.visible = false
        }
        this._score.text = this.dataSource
    }
}