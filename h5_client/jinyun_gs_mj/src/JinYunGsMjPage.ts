class JinYunGsMjPage extends BaseMJPage{
    constructor(){
        super()
        this.name = "JinYunGsMjPage";
         this._loadDatas = this._loadDatas.concat([
            { url: "res/config/jinyun_mj.json", type: Laya.Loader.JSON },
         {url: ResourceConfig.SHEET_JINYUN_MJ_CHAT, type: Laya.Loader.ATLAS}
       ]);
        AppPage.register(JinYunGsMjPage, this._loadDatas);
        
    }

    protected init(...params): void {
        GameDef.CHAT_POS = [
                                [],
                                [2, 1],
                                [2, 1, 2],
                                [2, 1, 1, 2]
                            ]
        Utils.injectProp(GameConfig.cfgAudio, Laya.loader.getRes("res/config/jinyun_mj.json"))
        super.init.apply(this, params);
        BaseHandCardManager.instance.registerClass(jinyun_gs_mj.HandCardView)
        BaseFoldCardManager.instance.registerClass(BaseFoldCardView)
        BaseWinCardManager.instance.registerClass(jinyun_gs_mj.WinCardView)
        BaseTingCardManager.instance.registerClass(BaseTingCardView)
        BaseHoldCardManager.instance.registerClass(BaseHoldCardView)
        PlayerManager.instance.registerClass(component.BasePlayer)
        DialogManager.instance.addDialog("GAME_END", BaseGameEndDialog,[{ url: ResourceConfig.SHEET_GAME_END, type: Laya.Loader.ATLAS }])
        SoundManager.instance.language = 1
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
                    BaseGameData.leftCard = BaseGameData.leftCard - 52
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