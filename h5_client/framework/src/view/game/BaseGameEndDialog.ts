class BaseGameEndDialog extends ui.mj.GameEndUI{
        constructor() {
            super();
            this["name"] = "BaseGameEndDialog";
        }

        protected _listScoreData: any[];
        protected _data: Array<any>;
        protected _endType: number;
        protected _winType: number;

        public onSort(a , b): number {
            if(BaseGameData.winDetailObj[a.seatid] && !BaseGameData.winDetailObj[b.seatid]) return 1
            if(!BaseGameData.winDetailObj[a.seatid] && BaseGameData.winDetailObj[b.seatid]) return -1
            if (a.winScore > b.winScore) return 1;
            else return -1;
        }
        public show(data, data1, data2): void {
            this._data = data;
            this._data.sort(this.onSort)
            this._endType = data1;
            this._winType = data2
            let index = 1
            let posX = 40
            let posY = BaseGameData.maxPlayer*130+10
            this._bg.removeChildren()
            if(this._winType == 0){
                this._liuju.visible = true
            }else{
                this._liuju.visible = false
            }
            for(var k in this._data){
                let v = this._data[k]
                
                // if(v.winScore <= 0){
                if(!BaseGameData.winDetailObj[v.seatid]){
                    let view = this.addLoseItem(BaseGameData.getPlayerDataBySeatid(v.seatid),v.winScore)
                    this._bg.addChild(view)
                    view.pos(posX,posY-view.height-10)
                    posY = view.y
                }else{
                    let view = this.addWinItem(BaseGameData.getPlayerDataBySeatid(v.seatid),v.winScore)
                    this._bg.addChild(view)
                    view.pos(posX, posY - view.height - 5)
                    posY = view.y
                    if(parseInt(k) == this._data.length-1){
                        view._line.visible = false
                    }
                }
            }
            this._next.on(Laya.Event.CLICK, this, this.nextRound)
            if(this._endType){
                this._next.skin = "gameEnd/tableEnd.png"
            }else{
                this._next.skin = "table/next_round.png"
            }
        }

        protected getHoldModel(target_dir){
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

        protected getDir(seatid){
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
            if(GameConfig.IS_MATCH){
                this.hide()
                if(DialogManager.instance.hasDialog("MATCH_WAIT")){
                    DialogManager.instance._dialogList["MATCH_WAIT"].visible = true
                }
            }else if(this._endType){
                this.hide()
                TableEndCtrl.instance.show(BaseGameData.tableEndInfo)
            }else{
                server.playerReadyReq()
                if(this._endType){
                    DialogManager.instance.removeDialog("GAME_END")
                    TableEndCtrl.instance.show(BaseGameData.tableEndInfo)
                }else{
                    Laya.timer.once(100,this,function(){
                        DialogManager.instance.removeDialog("GAME_END")
                    })
                }
            }
        }

         protected addLoseItem(player, score){
                let view = new ui.mj.GameEndLoseItemUI()
                let head = new HeadUI();
                view._avatar.addChild(head)
                head.setImageBounds(73,73)
                head.getInfo(player.uid || 0)
                
                head._labInfo.visible = false
                head._labName.visible = false
                if (player.seatid == BaseGameData.btnSeatid){
                    view._zhuang.visible = true
                }
                if (score >= 0){
                    view._score.font = "font_num_4"
                    view._score.text = "+"+score 
                }else{
                    view._score.font = "font_num_3"
                    view._score.text = score
                }
                view._name.text =  Utils.getFitNickName(player.nickname,10)

                let arr = BaseGameData.loseDetailObj[player.seatid]
                
                let toX = 10
                for(var k in arr){
                    let v = arr[k]
                    if (v.name != GameDef.WIN_TYPE.XIAZHUANG){
                        let detail = this.addDetail(v.name,v.value,v.sign)
                        view._detail.addChild(detail)
                        detail.x = toX
                        toX = detail.width + detail.x + 10 
                    }else{
                        let img = new Laya.Image("gameEnd/28.png")
                        view.addChild(img)
                        img.centerY = 0
                        img.right = 150
                    }
                }
                if(BaseGameData.gameType == GameDef.GAME_TYPE.SHANXI_MJ){
                    view._pao.skin= "card/tag_" + player.pao + ".png"
                }else{
                    view._pao.visible = false
                }
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

        protected addWinItem(player, score){
            let view = new ui.mj.GameEndWinItenUI()
            let head = new HeadUI();
            view._avatar.addChild(head)
            head._labInfo.visible = false
            head._labName.visible = false
            head.setImageBounds(73,73)
            head.getInfo(player.uid)
            view._name.text =  Utils.getFitNickName(player.nickname,10)
            let index = 1
            let posX = 10
            let posY = 0
            if (player.seatid == BaseGameData.btnSeatid){
                    view._zhuang.visible = true
                }
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
                posX = posX + 15
            }

            let arr = BaseGameData.winDetailObj[player.seatid]
            
            let toX = 10
            let total = 1
            for(var k in arr){
                let v = arr[k]
                let detail = this.addDetail(v.name,v.value, v.sign)
                view._detail.addChild(detail)
                detail.x = toX
                toX = detail.width + detail.x + 10 
                if(v.sign == 3){
                    total = total * v.value
                }
            }
            let totalfan = new Laya.Label(String(total))
            totalfan.font = "font_num_8"
            view._card.addChild(totalfan)
            totalfan.pos(posX+38, posY+19)
            let img = new Laya.Image("gameEnd/total_fan.png")
            view._card.addChild(img)
            img.pos(posX+38+totalfan.width, posY+18)
            view._pao.visible = false
            
            if (score >= 0){
                view._score.font = "font_num_4"
                view._score.text = "+"+score 
            }else{
                view._score.text = score
                view._score.font = "font_num_3"
            }

            if (this._winType == GameDef.MJ_WIN_TYPE.WIN_ALL){
                view._hu.skin = "gameEnd/zimo.png"
            }else{
                view._hu.skin = "gameEnd/pinghu.png"
            }
            if(BaseGameData.gameType == GameDef.GAME_TYPE.SHANXI_MJ){
                view._pao.skin= "card/tag_" + player.pao + ".png"
            }else{
                view._pao.visible = false
            }
            return view
        }
        private signList = ["+","-","*","/"]
        protected addDetail(type, value, sign){
            let view = new Laya.View()
            let typeImg = new Laya.Image("gameEnd/"+type+".png")
            view.addChild(typeImg)
            let text = this.signList[sign-1] + value
            if(value < 0){
                text = value
            }
            let num = new Laya.Label(text)
            num.font = "font_num_5"
            view.addChild(num)
            num.x = typeImg.width + 10
            num.y =3
            return view
        }
        
        private updateListResult(cell: ReportDescRenderer, index: number): void {
            cell.updata();
        }

        public hide(){
            
            if(this._endType){
                DialogManager.instance.removeDialog("GAME_END")
                TableEndCtrl.instance.show(BaseGameData.tableEndInfo)
            }else{
                Laya.timer.once(100,this,function(){
                    if(!BaseGameData.isGameing){
                        Dispatcher.dispatch(EventNames.CHECK_READY)
                    }
                    DialogManager.instance.removeDialog("GAME_END")
                })
                
            }
        }

        public updateMatchRoundEnd(){
            this._next.skin = "gameEnd/showwait.png"
        }
    }
