class MatchOutWinDialog extends ui.matchSign.MatchWInUI{
    constructor(){
        super()
    }
    public _autoHide = true
    private matchOut
    show(msg){
        
        this._win.text = String(msg.ranking)
        if(BaseGameData.matchInfo.matchStage == 4){
            if(msg.ranking == 1){
                this._text.skin = "matchSign/ani/win_tips_1.png"
            }else{
                this._text.skin = "match/win_tips_2.png"
            }
        }else{
            this._text.skin = "match/lose_tips_1.png"
        }
        this._title.text = msg.title
        this.ani1.play(1,false)
        this._btnConfirm.on(Laya.Event.CLICK, this, this.back)
        this._btnShare.on(Laya.Event.CLICK, this, this.share, [msg])
        this._download.on(Laya.Event.CLICK, this, this.onDownload)
        this._ani1.play()
        this._area.skin = "gameLogo/"+GameConfig.APPAREA+".png" 
        if(BaseGameData.isFreeMatch || !BaseGameData.matchReward){
            this._showReward.visible = false
        }
        this._reward.text = String(BaseGameData.matchReward)
        this._diamond.x = this._reward.x + this._reward.width + 10
        Laya.timer.once(1000, this, function(){
            this.ani1.stop()
            AnimationManager.instance.animationOver()
        })
        if (Native.instance.isNative) {
            this._download.visible = false
        }else{
            // this._btnConfirm.centerX = 0
            // this._btnShare.visible = false
            
        }
    }

    hide(){
        this.ani1.stop()
        DialogManager.instance.removeDialog("MATCH_OUT_WIN")
    }

    private back(){
        
        if(DialogManager.instance.hasDialog("MATCH_OVER")){
            DialogManager.instance._dialogList["MATCH_OVER"].visible = true
        }else{
            this.hide()
            Utils.backToMenu()
        }
       
    }

    private share(data){
        // if(Native.instance.isNative){
        //     Native.instance.share(2, 0);
        // }else{
             var dialog = DialogManager.instance.callDialog("MATCH_SHARE")
                dialog.show(data)
        // }
    }

    public matchOver(){
        this._btnConfirm.skin = "gameEnd/tableEnd.png"
    }

    private onDownload(): void {
        Native.instance.gotoDownload();
    }
    
}

// this._fontData = new FontData();
// 			this._fontData.init(FontConfig.FONT_WAKENG_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_WAKENG1_JSON),
// 				Laya.loader.getRes(ResourceConfig.BITMAP_FONT_WAKENG1_PNG), 50, BPFont.LEFT);
// 			this._bpFont = FontManager.instance.addFont(this._fontData);
// 			this.addChild(this._bpFont);
// 			this._bpFont.pos(41, 12);
// 			this._bpFont.text = "*1";