class ShangQiuMjPage extends BaseMJPage{
    constructor(){
        super()
        this.name = "ShangQiuMjPage";
        this._loadDatas = this._loadDatas.concat([ { url: "res/config/shanxi_mj.json", type: Laya.Loader.JSON },{url: ResourceConfig.SHEET_SHANXI_MJ_CHAT, type: Laya.Loader.ATLAS}])
        AppPage.register(ShangQiuMjPage, this._loadDatas);
        
    }

    protected init(...params): void {
        super.init.apply(this, params);
        Utils.injectProp(GameConfig.cfgAudio, Laya.loader.getRes("res/config/shanxi_mj.json"))
        BaseHandCardManager.instance.registerClass(shangqiu_mj.HandCardView)
        BaseFoldCardManager.instance.registerClass(BaseFoldCardView)
        BaseWinCardManager.instance.registerClass(shangqiu_mj.WinCardView)
        BaseHoldCardManager.instance.registerClass(BaseHoldCardView)
        BaseTingCardManager.instance.registerClass(BaseTingCardView)
        PlayerManager.instance.registerClass(shangqiu_mj.GamePlayerView)
        DialogManager.instance.addDialog("GAME_END", BaseGameEndDialog,[{ url: ResourceConfig.SHEET_GAME_END, type: Laya.Loader.ATLAS }])
        SoundManager.instance.language = 1
    }

    protected onGameStartNtfHandler(msg : any){
        super.onGameStartNtfHandler(msg)
        for(var k in PlayerManager.instance._players){
            let v = PlayerManager.instance._players[k]
            v.hideTing()
        }
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
            if(!this._leftView){
                this._leftView = new LeftCardView()
                this._table.addChild(this._leftView)
                this._leftView.centerX = -250
                this._leftView.centerY = -150
            }
            if(this._leftView){
                this._leftView.visible = true
                this._leftView.updateLeftCount()
                if(BaseGameData.SHIFTER_NUM && BaseGameData.SHIFTER_NUM > 0){
                    this._leftView.updateShifter()
                }else{
                    this._leftView._card._back.visible = true
                }
            }
            AnimationManager.instance.animationOver()
        }.bind(this)
        if(info.noAni){
            callback()
        }else{
            this._dealCardsView.dealCards(BaseGameData.btnSeatid, callback)
        }
    }

   
    
}