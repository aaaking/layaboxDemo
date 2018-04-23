/*
* @author seacole
 * 创建桌子
*/
class HistoryCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "HistoryCtrl";
    }

    private static _instance: HistoryCtrl;
    public static get instance(): HistoryCtrl {
        if (!this._instance)
            this._instance = new HistoryCtrl();
        return this._instance;
    }

    protected _ui: ui.shisanshui.HistoryViewUI;
    private _listScoreData: any[];
    private _listVisitData: any[];
    private _selectTab: number = 0;
    private _type: number;
    private _data: any;
    private _currentHand
    private _historyData = {}

    public static TYPE_REAL_TIME: number = 1;
    public static TYPE_GAME_END: number = 2;

    public show(): void {
        this.showself();
    }

    /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.shisanshui.HistoryViewUI();
            this._ui._list.itemRender = HistoryRender;
            this._ui._list.scrollBar.visible = false;
            this._ui._list.renderHandler = new Laya.Handler(this, this.updateListResult);
            
            EventManager.instance.registerOnObject(this, this._ui._last, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._btnClose, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._next, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, server, EventNames.GAME_REAL_TIME_RECORD_REP, this, this.onRealTimeRecordRepHandler);
        }
        super.beforeShow();
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow();
        // server.realTimeRecordReq();
        this._currentHand = (BaseGameData.currHandCount - 1) > 0 ? (BaseGameData.currHandCount - 1) : BaseGameData.currHandCount
        this._ui._hand.text = this._currentHand + "/" + BaseGameData.currHandCount
        this._ui._list.array = []
        if(this._historyData[this._currentHand]){
            this._ui._list.array = this._historyData[this._currentHand]
        }else{
            server.historyReq(this._currentHand)
        }
        // this._ui._list.array = [{"seaid":1,"info":[{"name":1,"value":1},{"name":2,"value":2},{"name":3,"value":3},{"name":4,"value":4},{"name":5,"value":5},
        // {"name":6,"value":6},{"name":7,"value":7},{"name":8,"value":8},{"name":10,"value":10}],
        // "cards":[{"cards":[40,41,42,43,50,51,52,53,60,61,62,63,70],"opttype":1}]},
        // {"seaid":1,"info":[{"name":1,"value":1},{"name":2,"value":2},{"name":3,"value":3},{"name":4,"value":4},{"name":5,"value":5},
        // {"name":6,"value":6},{"name":7,"value":7},{"name":8,"value":8},{"name":10,"value":10}],
        // "cards":[{"cards":[40,41,42,43,50,51,52,53,60,61,62,63,70],"opttype":1}]},
        // {"seaid":1,"info":[{"name":1,"value":1},{"name":2,"value":2},{"name":3,"value":3},{"name":4,"value":4},{"name":5,"value":5},
        // {"name":6,"value":6},{"name":7,"value":7},{"name":8,"value":8},{"name":10,"value":10}],
        // "cards":[{"cards":[40,41,42,43,50,51,52,53,60,61,62,63,70],"opttype":1}]}]
        this.tweenSelf();
    }

    public updateData(info,index){
        this._historyData[parseInt(index)] = info
        this._ui._list.array = info
    }

    public nextHand(){
        if((this._currentHand + 1) > BaseGameData.currHandCount) return
        if(BaseGameData.isGameing && (this._currentHand + 1) == BaseGameData.currHandCount) return
        this._currentHand = this._currentHand + 1
        this._ui._hand.text = this._currentHand + "/" + BaseGameData.currHandCount
        if(this._historyData[this._currentHand]){
            this._ui._list.array = this._historyData[this._currentHand]
        }else{
            server.historyReq(this._currentHand)
        }
    }

    public lastHand(){
        if((this._currentHand - 1) <= 0) return
        if(BaseGameData.currHandCount - this._currentHand > 9 && BaseGameData.currHandCount > 10) return
        this._currentHand = this._currentHand - 1
        this._ui._hand.text = this._currentHand + "/" + BaseGameData.currHandCount
        if(this._historyData[this._currentHand]){
            this._ui._list.array = this._historyData[this._currentHand]
        }else{
            server.historyReq(this._currentHand)
        }
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._ui._btnClose:
                this.hide();
                break;
            case this._ui._next:
                this.nextHand();
                break;
            case this._ui._last:
                this.lastHand();
                break;
        }
    }

    /***渲染单元格时的回调方法***/
    private updateListResult(cell: HistoryRender, index: number): void {
        if(index == this._ui._list.array.length-1){
            cell.updata(false);
        }else{
            cell.updata(true);
        }
    }

    

    private onRealTimeRecordRepHandler(msg: any): void {
        if (msg) {
            this._ui._list.array = this._listScoreData;
        }
    }
}

// class HistoryRender extends ui.shisanshui.HistoryItemUI{
//     constructor(){
//         super()
//     }
//     protected setCard(card:ui.poker.CardBigUI, value){
//             let baseUrl = "pokerCardBig/pokerCardBig_";
//             card._imgBack.visible = false;
//             card._imgFont.visible = true;
//             card._imgNum.visible = true;
//             card._imgFlowerBig.visible = true;
//             if (card._imgFlowerSmall)
//                 card._imgFlowerSmall.visible = true;
//             if (!card._imgFont.texture)
//                 card._imgFont.source = Laya.Loader.getRes(baseUrl + "front.png");
//             // if (card._imgOver && !card._imgOver.texture)
//             // {
//             // 	card._imgOver.source = Laya.Loader.getRes(baseUrl + "mask.png");
//             // 	card._imgOver.alpha=0.2;
//             // }					
//             // if (card._imgMask && !card._imgMask.texture)
//             // 	card._imgMask.source = Laya.Loader.getRes(baseUrl + "mask.png");

//             var flower: number = value % 10;
//             var num: number = Math.floor(value / 10);
//             card._imgFlowerBig.source = Laya.Loader.getRes(baseUrl + "flower_big_" + flower + ".png");
//             if (card._imgFlowerSmall)
//                 card._imgFlowerSmall.source = Laya.Loader.getRes(baseUrl + "flower_small_" + flower + ".png");
//             var numUrl: string = baseUrl;
//             if (this.isBlack(flower))
//                 numUrl += "black_";
//             else
//                 numUrl += "red_";
            
//             var imgNum: number = num;
//             if (num == 14)
//                 imgNum = 1;
//             card._imgNum.source = Laya.Loader.getRes(numUrl + imgNum + ".png");
//             if(value == 1){
//                 card._imgFlowerBig.source = Laya.Loader.getRes(baseUrl + "flower_big_4.png");
//                 card._imgFlowerSmall.source = null
//                 card._imgNum.source = Laya.Loader.getRes(baseUrl + "red_14.png");
//             }else if(value == 2){
//                 card._imgFlowerBig.source = Laya.Loader.getRes(baseUrl + "flower_small_4.png");
//                 card._imgFlowerSmall.source = null
//                 card._imgNum.source = Laya.Loader.getRes(baseUrl + "black_14.png");
//             }
//     }

//     private isBlack(flower: number): boolean {
//         return (flower == poker.CardUI.FLOWER_CLUB || flower == poker.CardUI.FLOWER_SPADE);
//     }

//     public updata(show){
//         this._name.text = Utils.getFitNickName(BaseGameData.getPlayerDataBySeatid(this.dataSource.seatid).nickname,20)
//         if(show){
//             this._line.visible = true
//         }else
//             this._line.visible = false
//         for (var k in this.dataSource.cards){
//             let v = this.dataSource.cards[k]
//             if(v.opttype == GameDef.AREA_TYPE.HAND_CARD){
//                 for(var m in v.cards){
//                     this.setCard(this["_card_"+m], v.cards[m])
//                 }
//             }
//         }
//         this._spe.visible = false
//         this._normal.visible = true

//         for(var k in this.dataSource.info){
//             let v = this.dataSource.info[k]
//             let score = v.value || 0
//             if(v.name == 9 ){
//                 this["score_9"].skin = "shisanshui/special/"+v.value+"_1.png"
//             }else if(v.name == 8 && v.value){
//                 this["score_"+v.name].visible = true
//                 if(score >= 0){
//                     this["score_"+v.name].text = "全垒打+"+score
//                     this["score_"+v.name].color = "#f77400"
//                 }else{
//                     this["score_"+v.name].text = "全垒打"+score
//                     this["score_"+v.name].color = "#00a604"
//                 }
//             }else if(v.name == 7){
//                 this["score_"+v.name].visible = true
//                 if(score >= 0){
//                     this["score_"+v.name].text = "打枪+"+score
//                     this["score_"+v.name].color = "#f77400"
//                 }else{
//                     this["score_"+v.name].text = "打枪"+score
//                     this["score_"+v.name].color = "#00a604"
//                 }
//             }else if(v.name == 10){
//                 if(score >= 0){
//                     this["score_"+v.name].text = "+"+score
//                     this["score_"+v.name].color = "#f77400"
//                 }else{
//                     this["score_"+v.name].text = String(score)
//                     this["score_"+v.name].color = "#00a604"
//                 }
//             }else{
//                 if(score >= 0){
//                     if(parseInt(v.name)%2 == 0){
//                         this["score_"+v.name].text = "(+"+score+")"
//                     }else{
//                         this["score_"+v.name].text = "+"+score
//                     }
//                     this["score_"+v.name].color = "#f77400"
//                 }else{
//                     if(parseInt(v.name)%2 == 0){
//                         this["score_"+v.name].text = "("+score+")"
//                     }else{
//                         this["score_"+v.name].text = score
//                     }
//                     this["score_"+v.name].color = "#00a604"
//                 }
//             }
            
//             if (v.name == 9){
//                this._spe.visible = true
//                this._normal.visible = false
//             }
//         }
//     }
// }