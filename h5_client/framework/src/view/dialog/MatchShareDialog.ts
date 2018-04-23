class MatchShareDialog extends ui.match.MatchRankShareUI{
    constructor(){
        super()
    }
    public _autoHide = true
    private matchOut
    private _head
    private _data
    show(msg){
        this._data = msg
        this._winNum.text = String(msg.ranking)
        if(BaseGameData.matchInfo.matchStage > 2){
            this._lose.visible = false
            this._win.visible = true
            if(BaseGameData.matchInfo.matchStage == 4 ){
                if(msg.ranking == 1){
                    this._winText.skin = "matchSign/ani/win_tips_1.png"
                }else{
                    this._winText.skin = "match/win_tips_2.png"
                }
            }else{
                this._winText.skin = "match/lose_tips_1.png"
            }
        }else{
            this._lose.visible = true
            this._win.visible = false
            this._text.text = "请在比赛结束后查看您的排名"
        }
        this._reward.text = String(BaseGameData.matchReward)
        this._diamond.x = this._reward.x + this._reward.width + 10
        if(BaseGameData.isFreeMatch){
            this._showReward.visible = false
        }
        this._share1.on(Laya.Event.CLICK, this, this.share1)
        this._share2.on(Laya.Event.CLICK, this, this.share2)
        this._title.text = msg.title
        this._head = new HeadUI();
        this._head.setImageBounds(73, 73)
        this._head.nameLimit = 20
        this._head.setLabName({ x: 106, y: 10, align: "left", color: "#ffffff", fontSize: 20 });
        this._head.setLabInfo(HeadUI.TYPE_UID, { x: 106, y: 48, align: "left", color: "#ffffff", fontSize: 18 });
        this._head.centerX = 0
        this._head.y = 330
        this._avatar.addChild(this._head);
        this._head.getInfo(server.uid)
        this._back.on(Laya.Event.CLICK, this, this.back)
        var htmlCanvas:Laya.HTMLCanvas = this._content.drawToCanvas(739, 552, 0, 0);//把精灵绘制到canvas上面
        var canvas = htmlCanvas.getCanvas();//获取原生的canvas对象
        var data = matchSign.MatchSignData.getInfoByCode(matchSign.MatchSignData.currentMatchCode)
		let text = ""
		if(data){
			if(data.gamemode >= 160){
				text = "精彩赛事不间断，可赢得钻石奖励！快来参与吧！"
			}else{
				text = "精彩赛事不间断，奖励丰厚，快来参与吧！"
			}
		}
        WxWeb.instance.onShareInfo(3, 0, "我在比赛中获得了第"+this._data.ranking+"名", text,this._data.info)
    }

    hide(){
        DialogManager.instance.removeDialog("MATCH_SHARE")
    }

    private back(){
        DialogManager.instance.removeDialog("MATCH_SHARE")
    }

    private share1(){
        Native.instance.share(2, 0);
    }

    private share2(){
        Native.instance.share(2, 1);
    }

    
    
}

