class MatchOutLoseDialog extends ui.matchSign.MatchLoseUI{
    constructor(){
        super()
    }
    public _autoHide = true
    private matchOut
    show(msg){
        //  if(msg.ranking > BaseGameData.maxPlayer){
        //     this.matchOut = new ui.matchSign.MatchLoseUI()
        // }else{
        //     this.matchOut = new ui.matchSign.MatchWInUI()
        //     this.matchOut._win.skin = "matchSign/ani/win_"+msg.ranking+".png"
        // }
        
        // this.addChild(this.matchOut)
        // this.matchOut.zOrder = GameZorder.Ani
        this._title.text = msg.title
        this.ani1.play(1,false)
        this._btnConfirm.on(Laya.Event.CLICK, this, this.back)
        this._btnShare.on(Laya.Event.CLICK, this, this.share, [msg])
        this._download.on(Laya.Event.CLICK, this, this.onDownload)
        this._ani1.play()
        this._area.skin = "gameLogo/"+GameConfig.APPAREA+".png" 
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
        if(BaseGameData.matchInfo.matchStage < 3){
            this._text.text = "请在比赛结束后查看您的名次"
        }else{
            this._text.text = "继续比赛，再接再厉吧"
        }
    }

    hide(){
        this.ani1.stop()
        DialogManager.instance.removeDialog("MATCH_OUT_LOSE")
    }

    private back(){
        this.hide()
        Utils.backToMenu()
      
    }

    private share(data){
        //  if(Native.instance.isNative){
        //     Native.instance.share(2, 0);
        //  }else{
            var dialog = DialogManager.instance.callDialog("MATCH_SHARE")
            dialog.show(data)
        //  }
        // Native.instance.share(2, 0);
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