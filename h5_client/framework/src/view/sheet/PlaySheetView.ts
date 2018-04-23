let BUTTON_POS_X = 75
let BUTTON_POS_Y = 70
let TIMER_LINE_ZORDER = 1
let BUTTON_ZORDER = 2

class PlaySheetView extends ui.panel.PlaySheetUI{
    private _lastX ;
    private time;
    private totalTime;
    private _playing;
    private playtime;
    private showing;
	private _sheetData;
    constructor() {
        super();
        this.name = "PlaySheetView";
		
		Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
		Laya.timer.once(100,this,this.onResize)
		// this.init()
    }
	
	private onResize(){
		this.width = Laya.stage.width
		this.height = Laya.stage.height
		this._exit.left = Laya.stage.width > 1280 ? (Laya.stage.width - 1280)/2 + 30 : 30
	}

    private onMouseDown(e:Laya.Event){
		this.pause()
        // this._thumb.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMoved);
        // this._thumb.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
		Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMoved);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this._lastX = Laya.stage.mouseX;
		// console.info(this._progress._childs)
        console.log("onMouseDown " + Laya.stage.mouseX + "," + Laya.stage.mouseY)
    }

    private onTouchMoved(e:Laya.Event){
        if (Math.abs(e.currentTarget.mouseX - this._lastX) < 5) {
            return;
        }
        console.log("onMouseMove1 " + e.stageX + "," + e.stageY)
        console.log("onMouseMove2 " + e.currentTarget.mouseX + "," + e.currentTarget.mouseY)
        this._thumb.x = this._thumb.x +  e.currentTarget.mouseX - this._lastX;
		if(this._thumb.x <= 0 ){
			this._thumb.x = 0
			this._fg.width = this._thumb.x
			return
		}
		if(this._thumb.x > this._progress.width){
			this._thumb.x = this._progress.width
			this._fg.width = this._thumb.x
			return
		}
        this._lastX = e.currentTarget.mouseX;
        
		// let percentage = Math.abs(this._thumb.x / 701)*100
		this._fg.width = this._thumb.x
    }

     private onMouseUp(e: Laya.Event): void {
        let percentage = this._thumb.x / this._progress.width

		let time = this.totalTime * percentage
		PlaySheet.instance.stopAndGoToTime(time)
		this.resume()
        this._thumb.off(Laya.Event.MOUSE_MOVE, this, this.onTouchMoved);
		

		Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onTouchMoved);
		Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onMouseUp);
		Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.onMouseUp);
    }


public isValid(){
	if (PlaySheet.instance.netmsgs){
		return true
    }else{
		return false
    }
}

public init(sheetData){
	this._sheetData = sheetData
	this.hideAllBtns()
	PlaySheet.instance.init(this._sheetData)
	this.totalTime = PlaySheet.instance.getTotalTime()
	PlaySheet.instance.onUpdateCallBack(this.update.bind(this))

	this.showPlayBtn()
	this._playing = false
	this.updateView()
	// this.showTimerLine()
    Laya.timer.loop(1000,this, this.updateShow)
	this.on(Laya.Event.CLICK, this, this.show)
    this._thumb.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown)
	this._play.on(Laya.Event.CLICK, this, this.play)
	this._exit.on(Laya.Event.CLICK, this, this.onExitClicked)
	this._last.on(Laya.Event.CLICK, this, this.gotoLast)
	this._next.on(Laya.Event.CLICK, this, this.gotoNext)
}

public gotoLast(){
	PlaySheet.instance.gotoLast()
	this.resume()
}

public gotoNext(){
	PlaySheet.instance.gotoNext()
	this.resume()
}

public showPlayBtn(){
	this._play.skin = "sheet/sheet_play_button_1.png"
}


public updateShow(){
	if (!this._playing){
		return
    }
	if (this.playtime && this.playtime > 0){
		this.playtime = this.playtime - 1 
		if (this.playtime == 0){
			this.hide()
        }
    }
}

public show(){
	this._view.visible = true
	this.showing = true
}

public hide(){
	this._view.visible = false
	this.showing = false
}

public updateView(){
	// this.stopAllActions()
	if (this._playing){
		this.playtime = 3
    }else{
		this.show()
    }
}

public update(time){
	this.time = time
	this.updateTimerLine()

	if (this.time >= this.totalTime){
		this.ended()
    }
}

public updateTimerLine(){
	this.time = this.time || 0
	let percentage = this.time / this.totalTime
	if (percentage > 1){
		percentage = 1
    }
	if(percentage < 0){
		percentage = 0
	}
	if (this._fg){
		this._fg.width = Math.abs(percentage*this._progress.width)
		this._thumb.x = Math.abs(percentage*this._progress.width)
	}
}

public showTimerLine(){
	this.updateTimerLine()
}

public onSheetBgTouch(event){
	// let name = event.name
	// if name == "began" then
	// 	return true
	// elseif name == "ended" then
	// 	this.playtime = 3
	// end

}




public hideTimerLine(){
	
}

public hidePlayBtn(){
	// if not this.playBtn then
	// 	return
	// end

	// this.playBtn:setVisible(false)
}

public showPauseBtn(){
	this._play.skin = "sheet/sheet_pause_button_1.png"
}

public hidePauseBtn(){
	// if not this.pauseBtn then
	// 	return
	// end

	// this.pauseBtn:setVisible(false)
}

public showResumeBtn(){
	// if this.resumeBtn then
	// 	this.resumeBtn:setVisible(true)
	// 	return
	// end

	// let images = {normal = "sheet/sheet_play_button_1.png", pressed = "sheet/sheet_play_button_2.png"}
	// this.resumeBtn = ht.ui.HTPushButton.new(images)
	// 	:pos(BUTTON_POS_X, BUTTON_POS_Y)
	// 	:addTo(this.view, BUTTON_ZORDER)
	// 	:onButtonClicked(handler(self, this.resume))
}

public hideResumeBtn(){
	// if not this.resumeBtn then
	// 	return
	// end

	// this.resumeBtn:setVisible(false)
}

public showReplayBtn(){
	// this._replay.visible = true
	// this._replay.on(Laya.Event.CLICK,this,this.replay)
	this.showPlayBtn()
}

public hideReplayBtn(){
	this._replay.visible = false
	this._replay.off(Laya.Event.CLICK, this, this.replay)
}

public play(){
	if(!this._playing){
		if (this.time >= this.totalTime){
			this.replay()
    	}else{
			this._playing = true
			// this.hideAllBtns()
			this.showPauseBtn()
			this.showTimerLine()

			PlaySheet.instance.play()
			this.updateView()
		}
	}else{
		this._playing = false
		// this.hideAllBtns()
		this.showPlayBtn()
		this.showTimerLine()

		PlaySheet.instance.pause()
		// this.updateView()
	}
}

public pause(){
	this._playing = false

	this.hideAllBtns()
	this.showResumeBtn()

	PlaySheet.instance.pause()


	this.updateView()
}

public resume(){
	this._playing = true
	this.hideAllBtns()
	this.showPauseBtn()
	this.showTimerLine()

	PlaySheet.instance.resume()
	this.updateView()
}

public ended(){
	this._playing = false
	this.hideAllBtns()
	this.showReplayBtn()
	this.hideTimerLine()

	PlaySheet.instance.stop()
	this.updateView()
}

public replay(){
	this.time = 0
	this.init(this._sheetData)
	this.play()
}

public hideAllBtns(){
	this.hidePlayBtn()
	this.hidePauseBtn()
	this.hideResumeBtn()
	this.hideReplayBtn()
}

public onExitClicked(callback){
	AppControl.getInstance().showPage(MenuPage);
}

// public changePlaySpeed(){
// 	if (!this.speed || this.speed == 1){
// 		this.speed = 2
//     }else{
// 		this.speed = 1
//     }
// 	PlaySheet.instance.setSpeed(this.speed)
// }

}