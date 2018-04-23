class JinYunMjPage extends BaseMJPage{
    constructor(){
        super()
        this.name = "JingYunMjPage";
         this._loadDatas = this._loadDatas.concat([
            { url: "res/config/jinyun_mj.json", type: Laya.Loader.JSON },
         {url: ResourceConfig.SHEET_JINYUN_MJ_CHAT, type: Laya.Loader.ATLAS}
       ]);
        AppPage.register(JinYunMjPage, this._loadDatas);
        
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
        BaseHandCardManager.instance.registerClass(jinyun_mj.HandCardView)
        BaseFoldCardManager.instance.registerClass(jinyun_mj.FoldCardView)
        BaseWinCardManager.instance.registerClass(jinyun_mj.WinCardView)
        BaseTingCardManager.instance.registerClass(jinyun_mj.TingCardView)
        BaseHoldCardManager.instance.registerClass(jinyun_mj.HoldCardView)
        PlayerManager.instance.registerClass(component.BasePlayer)
        DialogManager.instance.addDialog("GAME_END", jinyun_mj.GameEndDialog,[{ url: ResourceConfig.SHEET_GAME_END, type: Laya.Loader.ATLAS }])
        SoundManager.instance.language = 1
        BaseFoldCardManager.instance._foldType = 1
    }
    
    public replace_card(cardid){
        if(cardid%100 == BaseGameData.SHIFTER_NUM){
            cardid = 78
        }else if(cardid%100 == 78){
            cardid = BaseGameData.SHIFTER_NUM
        }
        return cardid
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
                BaseGameData.moveCard._bg.skin = "card/1/"+(this.replace_card(cardid)%100)+".png"
                BaseGameData.moveCard.zOrder = GameZorder.Ani
            }else{
                switch(dir){
                    case 1: BaseGameData.moveCard = new ui.mj.FoldCard.Card_1UI()
                            BaseGameData.moveCard._bg.skin = "card/1/"+(this.replace_card(cardid)%100)+".png"
                            // targetPos.x = targetPos.x + 20
                            // targetPos.y = targetPos.y + 20
                            break;
                    case 2: BaseGameData.moveCard = new ui.mj.FoldCard.Card_2UI()
                            BaseGameData.moveCard._bg.skin = "card/2/"+(this.replace_card(cardid)%100)+".png"
                            // targetPos.x = targetPos.x + 20
                            // targetPos.y = targetPos.y - 20
                            break;
                    case 3: BaseGameData.moveCard = new ui.mj.FoldCard.Card_3UI()
                            BaseGameData.moveCard._bg.skin = "card/3/"+(this.replace_card(cardid)%100)+".png"
                            // targetPos.x = targetPos.x - 20
                            // targetPos.y = targetPos.y - 20
                            break;
                    case 4: BaseGameData.moveCard = new ui.mj.FoldCard.Card_4UI()
                            BaseGameData.moveCard._bg.skin = "card/4/"+(this.replace_card(cardid)%100)+".png"
                            // targetPos.x = targetPos.x - 20
                            // targetPos.y = targetPos.y + 20
                            break;
                }
            }
            // BaseGameData.moveCard = new BaseCardView(cardid,dir,null)
            this._table.addChild(BaseGameData.moveCard)
             if(dir == 2 || dir == 3){

            }else{
                BaseGameData.moveCard.zOrder = GameZorder.Ani
            }
            BaseGameData.moveCard.pos(beginPos.x, beginPos.y)
            BaseHandCardManager.instance.removeCard(seatid,cardid)
            let callback = function(){
                let arror = new Laya.Animation();
                arror.loadAnimation(ResourceConfig.ANI_ARROW);
                if(BaseGameData.moveCard){
                    BaseGameData.moveCard.addChild(arror)
                
                    arror.pos(BaseGameData.moveCard.width/2,BaseGameData.moveCard.height/2)
                    arror.play()
                    arror.zOrder = 100
                }
                AnimationManager.instance.animationOver()
            }.bind(this)
            SoundManager.instance.playEffect("card_out", 0, 1, false, 1, true);
            Laya.Tween.to(BaseGameData.moveCard,{x:targetPos.x,y:targetPos.y},100,null,Laya.Handler.create(this,callback))
        }else{
            let targetPos = BaseFoldCardManager.instance.getFoldPosition(seatid)
            let callback = function(){
                let player = BaseGameData.getPlayerDataBySeatid(seatid)
                let sex = player ? player.sex : 1
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
                }else{
                    AnimationManager.instance.animationOver()
                }
                // AnimationManager.instance.animationOver()
            }.bind(this)
            Laya.Tween.to(BaseGameData.moveCard,{x:targetPos.x,y:targetPos.y},0,null,Laya.Handler.create(this,callback))
        }
    }

    protected foldCardAni(seatid, cardid){
        
        AnimationManager.instance.addAnimation(() => {
            if(seatid == BaseGameData.selfSeatid && this._lastCard && this._lastSeatid == BaseGameData.selfSeatid){
                if(cardid != this._lastCard){
                    server.close()
                }
            }
            if (BaseHandCardManager.instance.getHandCardViews(seatid)%3 == 2){
                let player = BaseGameData.getPlayerDataBySeatid(seatid)
                let sex = player ? player.sex : 1
                SoundManager.instance.playEffect(String(this.replace_card(cardid)%100),sex);
                if (seatid != BaseGameData.selfSeatid){
                    this.showFoldBigCard(Utils.getDir(seatid),cardid)
                }
                this.moveFoldCard(seatid, cardid)
            }else{
                AnimationManager.instance.animationOver()
            }
        },null)
    }

    protected clearData(needCheckIsGameing: boolean = true): void {
        Laya.timer.clearAll(this)
        Laya.Tween.clearAll(this)
        AnimationManager.instance.endAnimations()
        super.clearData(needCheckIsGameing)
    }

    protected showFoldBigCard(dir, card){
        if(!GameConfig.bigcard) return
        if(dir == 1) return 
        if(!this._foldBigCard){
            this._foldBigCard = new BaseCardView(this.replace_card(card)%100, 1)
            this._foldBigCard.showFoldBg()
            this._foldBigCard.zOrder = GameZorder.Ani + 1
            this._table.addChild(this._foldBigCard)
            this._foldBigCard.alpha = 0
            Laya.Tween.to(this._foldBigCard,{alpha:1},200)
        }else{
            this._foldBigCard.visible = true
            this._foldBigCard.alpha = 0
            Laya.Tween.to(this._foldBigCard,{alpha:1},200)
            this._foldBigCard.updateFront(this.replace_card(card)%100)
        }
        this._foldBigCard.view._god.visible = false
        this._foldBigCard.centerX = TableLayout.FOLD_BIG_CARD[dir-2].x
        this._foldBigCard.y = TableLayout.FOLD_BIG_CARD[dir-2].y
    }

}