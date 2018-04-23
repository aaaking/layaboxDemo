class MatchOverDialog extends ui.match.MatchOverUI{
    constructor(){
        super()
        this._rankList.scrollBar.visible = false;
        this._rankList.itemRender = MatchOverRender;
        this._rankList.renderHandler = new Laya.Handler(this, this.updateRank);
        this._rankList.array=[];
        this._close.on(Laya.Event.CLICK,this, this.hide)
        this._btnConfirm.on(Laya.Event.CLICK, this, this.back)
        this._btnShare.on(Laya.Event.CLICK, this, this.showShare)
        this._share1.on(Laya.Event.CLICK, this, this.share1)
        this._share2.on(Laya.Event.CLICK, this, this.share2)
        this._back.on(Laya.Event.CLICK, this, this.hideShare)
    }

    protected showShare(){
        this._share1.visible = true
        this._share2.visible = true
        this._back.visible = true
    }

    protected hideShare(){
        this._share1.visible = false
        this._share2.visible = false
        this._back.visible = false
    }

    public _autoHide = true
    private _data
    private _head
    show(data){
        this._data = data
        this._selectType = 0
        this._rankList.array = data.playerInfo
        if(BaseGameData.matchInfo.matchRank < 4){
            this._ranklBig.visible = true
            this._rank1.text = String(BaseGameData.matchInfo.matchRank)
        }else{
            this._rankSmall.visible = true
            this._rank2.text = String(BaseGameData.matchInfo.matchRank)
        }
        this._reward.text = String(BaseGameData.matchReward)
        if(BaseGameData.isFreeMatch || !BaseGameData.matchReward){
            this._showReward.visible = false
            this._labelReward.visible = false
            this._labelName.x = 400
        }
        if (Native.instance.isNative) {
            
            
        }else{
            // this._btnConfirm.centerX = 0
            // this._btnShare.visible = false
        }
        this._title.text = BaseGameData.matchTitle
        this._time.text = TimeUtils.Format("yyyy-MM-dd hh:mm")
        this._head = new HeadUI();
        this._head.setImageBounds(60, 60)
        this._head.nameLimit = 8
        this._head.setLabName({ x: 70, y: 10, align: "left", color: "#ffffff", fontSize: 18 });
        this._head.setLabInfo(HeadUI.TYPE_UID, { x: 70, y: 44, align: "left", color: "#ffffff", fontSize: 16 });
        // this._head.centerX = 0
        // this._head.y = 330
        this._avatar.addChild(this._head);
        this._head.getInfo(server.uid)

        // var htmlCanvas:Laya.HTMLCanvas = this._content.drawToCanvas(620, 560, 0, 0);//把精灵绘制到canvas上面
        // var canvas = htmlCanvas.getCanvas();//获取原生的canvas对象
        var data = matchSign.MatchSignData.getInfoByCode(matchSign.MatchSignData.currentMatchCode)
		let text = ""
		if(data){
			if(data.gamemode >= 160){
				text = "精彩赛事不间断，可赢得钻石奖励！快来参与吧！"
			}else{
				text = "精彩赛事不间断，奖励丰厚，快来参与吧！"
			}
		}
        WxWeb.instance.onShareInfo(3, 0, "我在比赛中获得了第"+BaseGameData.matchInfo.matchRank+"名", text, this._data.info)
    }

    private _selectType
    
    private onClick(){
        this._selectType = this._selectType == 0 ? 1 : 0
    }
    
    private back() {
        this.hide()
       
        // if(GameConfig.IS_MATCH)
        //     matchSign.MatchSignData.backCode = BaseGameData.tableid
        // server.code = "";
        // AppControl.getInstance().showPage(MenuPage);
        // server.close();
    }

    protected updateRank(cell: MatchOverRender, index: number){
        cell.updata(index)
    }

    hide(){
        DialogManager.instance.removeDialog("MATCH_OVER")
        Utils.backToMenu()
    }

    private share1(): void {
            Native.instance.share(2, 0);
       
    }

    private share2(): void {
        Native.instance.share(2, 1);
    }
}


class MatchOverRender extends ui.match.MatchOverRenderUI{
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
        this._reward.text = this.dataSource.reward
        this._name.text = Utils.getFitNickName(this.dataSource.nickname,10)
        if(BaseGameData.isFreeMatch){
            this._diamond.visible = false
            this._reward.visible = false
            this._name.x = 365
        }
    }
}