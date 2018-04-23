class MJBaseControl extends Laya.Sprite {
    constructor() {
        super();
    }
    public init(){

    }

    public initEvent(){
        
    }

    private onGameStart(event){

    }

    private onGameInfoNtf(event){

    }

    private onCardInit(event){//初始化牌

    }

    private onCardMoveNtf(event){//牌移動

    }

    private onShowCardNtf(event){//結束亮牌

    }

    private onPlayerOptNtf(event){//玩家操作

    }

    public PlayerOptReq(opt){
        
    }

    private onGameEndNtf(event){

    }

    private initGameView(){

    }

    private initCardsView(){
        // for k,v in pairs(_gameDataMgr.seatsInfo) do
        //     local handView = _handCardManager:addHandCardView(v.seatid,v.dir,handler(self,self.foldCard))
        //     if handView then
        //         handView:addTo(self,HAND_CARD_ZORDER):pos(handCardLayouts[v.dir].x, handCardLayouts[v.dir].y)
        //     end
        //     local foldView  = _foldCardManager:addFoldCardView(v.seatid,v.dir)
        //     if foldView then
        //         foldView:addTo(self,FOLD_CARD_ZORDER):pos(foldCardLayouts[v.dir].x, foldCardLayouts[v.dir].y)
        //     end
        //     local holdView = _holdCardManager:addHoldCardView(v.seatid,v.dir)
        //     if holdView then
        //         local order = v.dir == 4 and FOLD_CARD_ZORDER or HAND_CARD_ZORDER
        //         holdView:addTo(self,order):pos(holdCardLayouts[v.dir].x, holdCardLayouts[v.dir].y)
        //     end
        // end
    }

    public clearGameUI(){

    }
}