class BaseChooseScore extends ui.mj.ChooseScoreUI {
    private callback
    public constructor(callback,info) {
        super();
        this.callback = callback
        this.init(info);
    }

    private init(info){
        this.mouseEnabled = true
        for (var i = 0;i<5;i++){
            this["_score_"+i].on(Laya.Event.CLICK,this,this.onClick)
        }
        for(var k in info.cards){
            
        }
    }

    private onClick(event){
         this.callback(GameDef.OptType.CALL_SCORE, [parseInt(event.target.name)])
         this.removeSelf()
    }




}