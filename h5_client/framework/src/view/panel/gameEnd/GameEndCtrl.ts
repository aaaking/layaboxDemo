
class GameEndCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "GameEndCtrl";
    }

    private static _instance: GameEndCtrl;
    public static get instance(): GameEndCtrl {
        if (!this._instance)
            this._instance = new GameEndCtrl();
        return this._instance;
    }

    public _ui: ui.mj.GameEndUI;
    private _listScoreData: any[];
    private _data: Array<any>;
    private _endType: number;
    private _winType: number

    public show(data: Array<any> = null, endType: number, winType): void {
        this._data = data;
        this._data.sort(this.onSort)
        this._endType = endType;
        this._winType = winType
        this.showself();
        
    }

    private getHoldModel(target_dir){
        if (target_dir == 2){
            return ui.mj.HoldCard.Card_2_1UI
        }else if(target_dir == 3){
            return ui.mj.HoldCard.Card_3_1UI
        }else if(target_dir == 4){
            return ui.mj.HoldCard.Card_4_1UI
        }else if(target_dir == 1){
            return ui.mj.HoldCard.Card_3_1UI
        }
    }

    private getDir(seatid){
			let dirList = [
			[[1]],
			[[1,3],[3,1]],
			[[1,2,4],[4,1,2],[2,4,1]],
			[[1,2,3,4],[4,1,2,3],[3,4,1,2],[2,3,4,1]]
				]
			let dir = seatid   

			if(!BaseGameData.winSeatid){
                return dirList[BaseGameData.maxPlayer-1][0][seatid-1]
            }
				
				return dirList[BaseGameData.maxPlayer-1][BaseGameData.winSeatid-1][seatid-1]
		}

    public addHoldCard(info){
        let target_dir = this.getDir(info.fromSeatid)
        let view = this.getHoldModel(target_dir)
        let hold_card = new view()
        
        for(var i=0;i<4;i++){
            let v = info.cards[i]
            if (v){
                hold_card["card_"+(i+1)]._bg.skin = "card/"+hold_card["card_"+(i+1)].name+"/"+ (v%100) + ".png"
            }else{
                hold_card["card_"+(i+1)].visible = false
            }
        }
        return hold_card
    }
    
    private nextRound(){
        if(this._endType){
            this.hide()
            TableEndCtrl.instance.show(BaseGameData.tableEndInfo)
        }else{
            server.playerReadyReq()
            this.hide()
        }
    }

    /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.mj.GameEndUI();
        }
        super.beforeShow();
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow();

        // if (BaseGameData.winDetailArr[BaseGameData.winSeatid] && BaseGameData.winDetailArr[BaseGameData.winSeatid].length) {
        //     this._ui._detail.array = BaseGameData.winDetailArr[BaseGameData.winSeatid];
        // }else{
        //     this._ui._detail.array = BaseGameData.winDetailArr[BaseGameData.selfSeatid];
        // }

        let index = 1
        let posX = 30
        let posY = 550
        // this._ui._selfView.removeChildren()
        // for(var k in BaseGameData.players){
        //     let player = BaseGameData.players[k]
        //     if(player.seatid == BaseGameData.winSeatid || (!BaseGameData.winSeatid && player.seatid ==BaseGameData.selfSeatid)){
        //         this._ui._winner._labName.text = player.nickname
        //         this._ui._winner._imgHead.loadImage(player.avatar, 0, 0, 86, 86);
        //         this._ui._win_score.text = this._data[player.seatid-1].winScore || 0
                
        //         this._ui._gang.text = BaseGameData.winDetailObj[player.seatid][9].value
        //         this._ui._total.text = String(parseInt(this._ui._win_score.text) - parseInt(this._ui._gang.text))
        //         if(BaseGameData.winSeatid){
        //             this._ui._hu.skin = "gameEnd/hu.png"
        //         }else{
        //             this._ui._hu.skin = "gameEnd/liuju.png"
        //         }
        //         for(var j in player.holdCards){
        //             let holdInfo = player.holdCards[j]
        //             let holdCard = this.addHoldCard(holdInfo)
        //             this._ui._selfView.addChild(holdCard)
        //             holdCard.scale(0.5,0.5)

        //             holdCard.pos(posX, posY+10)
        //             posX = posX + holdCard.width*0.5 + 5
        //             console.log("posX======================"+posX)
        //         }
        //         for(var m in player.handCards){
        //             let cardid = player.handCards[m]
        //             let handCard = new BaseCardView(cardid,1,null)
        //             handCard.scale(0.5,0.5)
        //             this._ui._selfView.addChild(handCard)
        //             handCard.pos(posX, posY)
        //             posX = posX + 35
        //         }
        //         if (BaseGameData.winSeatid){
        //             let handCard = new BaseCardView(BaseGameData.winCard,1,null)
        //             handCard.scale(0.5,0.5)
        //             this._ui._selfView.addChild(handCard)
        //             handCard.pos(posX+15, posY)
        //         }
        //     }else{
        //         this._ui["_loser_"+index]._loser._labName.text = player.nickname
        //         this._ui["_loser_"+index]._loser._imgHead.loadImage(player.avatar, 0, 0, 86, 86);
        //         this._ui["_loser_"+index]._score.text = this._data[player.seatid-1].winScore || 0
        //         this._ui["_loser_"+index]._gang.text = BaseGameData.winDetailObj[player.seatid][9].value
        //         index ++
        //     }
        // }
        this._ui._bg.removeChildren()
        if(this._winType == 0){
            this._ui._liuju.visible = true
        }else{
            this._ui._liuju.visible = false
        }
        for(var k in this._data){
            let v = this._data[k]
            if(v.winScore <= 0){
                let view = this.addLoseItem(BaseGameData.getPlayerDataBySeatid(v.seatid),v.winScore)
                this._ui._bg.addChild(view)
                view.pos(posX,posY-view.height-20)
                posY = view.y
            }else{
                let view = this.addWinItem(BaseGameData.getPlayerDataBySeatid(v.seatid),v.winScore)
                this._ui._bg.addChild(view)
                view.pos(posX, posY - view.height - 5)
                posY = view.y
                if(k == "3"){
                    view._line.visible = false
                }
            }
        }
        this._ui._next.on(Laya.Event.CLICK, this, this.nextRound)
        if(this._endType){
            this._ui._next.skin = "gameEnd/tableEnd.png"
        }else{
            this._ui._next.skin = "table/next_round.png"
        }
    }
    public onSort(a , b): number {
        if (a.winScore > b.winScore) return 1;
        else return -1;
    }
    private addLoseItem(player, score){
        let view = new ui.mj.GameEndLoseItemUI()
        let head = new HeadUI();
        view._avatar.addChild(head)
        head.getInfo(player.uid || 0)
        head._labInfo.visible = false
        head._labName.visible = false
        view._score.text = score 
        view._name.text =  Utils.getFitNickName(player.nickname,20)

         let arr = BaseGameData.winDetailObj[player.seatid]
         
         let toX = 10
         for(var k in arr){
             let v = arr[k]
             let detail = this.addDetail(v.name,v.value,v.sign)
             view._detail.addChild(detail)
             detail.x = toX
             toX = detail.width + detail.x + 10 
         }
            view._pao.skin= "card/tag_" + player.pao + ".png"
        return view
    }

    public sortCards(cards){
        let length = cards.length
        for (var i=0;i<length-1;i++){
            for (var j=i+1;j<length;j++){
                if (BaseGameData.SHIFTER_NUM == (cards[i]%100) || BaseGameData.SHIFTER_NUM == (cards[j]%100)){
                    if (BaseGameData.SHIFTER_NUM == (cards[i]%100) && BaseGameData.SHIFTER_NUM != (cards[j]%100)){
                        let a = cards[j]
                        cards[j] = cards[i]
                        cards[i] = a
                    }
                }else if ((cards[i]%100) < (cards[j]%100)){
                    let a = cards[i]
                    cards[i] = cards[j]
                    cards[j] = a
                }
            }
        }
    }

    private addWinItem(player, score){
        let view = new ui.mj.GameEndWinItenUI()
        let head = new HeadUI();
        view._avatar.addChild(head)
        head._labInfo.visible = false
        head._labName.visible = false
        head.getInfo(player.uid)
        view._name.text =  Utils.getFitNickName(player.nickname,20)
        let index = 1
        let posX = 10
        let posY = 0
         for(var j in player.holdCards){
            let holdInfo = player.holdCards[j]
            let holdCard = this.addHoldCard(holdInfo)
            view._card.addChild(holdCard)
            holdCard.scale(0.5,0.5)
            holdCard.pos(posX, posY+12)
            posX = posX + holdCard.width*0.5 + 5
            console.log("posX======================"+posX)
         }
         let cards = player.handCards
        this.sortCards(cards)
         for(var m = cards.length-1; m >= 0 ; m--){
            let cardid = player.handCards[m]
            let handCard = new BaseCardView(cardid,1,null)
            handCard.scale(0.5,0.5)
            view._card.addChild(handCard)
            handCard.pos(posX, posY)
            posX = posX + 35
         }
         if (BaseGameData.winSeatid){
            let handCard = new BaseCardView(BaseGameData.winCard,1,null)
            handCard.scale(0.5,0.5)
            view._card.addChild(handCard)
            handCard.pos(posX+15, posY)
         }

         let arr = BaseGameData.winDetailObj[player.seatid]
         
         let toX = 10
         for(var k in arr){
             let v = arr[k]
             let detail = this.addDetail(v.name,v.value, v.sign)
             view._detail.addChild(detail)
             detail.x = toX
             toX = detail.width + detail.x + 10 
         }
         
         view._pao.skin= "card/tag_" + player.pao + ".png"
         
         view._score.text = "+"+score 
         return view
    }
    private signList = ["+","-","*","/"]
    private addDetail(type, value, sign){
        let view = new Laya.View()
        let typeImg = new Laya.Image("gameEnd/"+type+".png")
        view.addChild(typeImg)
        let text = this.signList[sign-1] + value
        let num = new Laya.Label(text)
        num.font = "font_num_5"
        view.addChild(num)
        num.x = typeImg.width + 10
        num.y =3
        return view
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

   

   

    /***渲染单元格时的回调方法***/
    private updateListResult(cell: ReportDescRenderer, index: number): void {
        cell.updata();
    }

    public hide(){
        super.hide()
        if(this._endType){
            TableEndCtrl.instance.show(BaseGameData.tableEndInfo)
        }else{
            Laya.timer.once(100,this,function(){
                Dispatcher.dispatch(EventNames.CHECK_READY)
            })
            
        }
    }
}