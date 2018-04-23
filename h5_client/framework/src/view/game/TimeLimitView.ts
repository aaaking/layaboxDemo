class TimeLimitView extends ui.mj.TimeLimitUI{
    private _posList = []
    private POS_ROTATION = [
                                [],
                                [-90,90],
                                [-90,180,0],
                                [0,-90,180,90]
                            ]
    private POS_LIST = [];
    private time = 0;
    constructor() {
        super();
		this.init()
    }

    protected init(){
        // this._posBg.stop()
        for(var i=1;i<5;i++){
            let view = this["_pos_"+i]
            this.POS_LIST.push({x:view.x,y:view.y})
            this["_time_"+i].stop()
            this["_time_"+i].visible = false
            if(BaseGameData.maxPlayer < 4){
                view.visible = false
            }
        }
    }

    public updatePos(){
        if (BaseGameData.maxPlayer > 3){
            for(var i=1;i<5;i++){
                let view = this["_pos_"+i];
                let posi = Utils.getDir(i)
                view.pos(this.POS_LIST[posi-1].x,this.POS_LIST[posi-1].y);
                this["_time_"+i].rotation = -180 + 90*(BaseGameData.selfSeatid || 1)
                // this["ani"+i].rotation = -180 + 90*BaseGameData.selfSeatid
                console.log("this.time============_time_"+i+"rotation ======="+this["_time_"+i].rotation)
            }
        }else{
            for(var i=1;i<5;i++){
                let view = this["_pos_"+i];
                let posi = Utils.getDir(i)
                view.pos(this.POS_LIST[posi-1].x,this.POS_LIST[posi-1].y);
                this["_time_"+i].rotation = -90
                // this["ani"+i].rotation = -180 + 90*BaseGameData.selfSeatid
                console.log("this.time============_time_"+i+"rotation ======="+this["_time_"+i].rotation)
            }
        }
        let pos = Utils.getDir(1)
        // this._posBg.rotation = this.POS_ROTATION[BaseGameData.maxPlayer-1][pos-1]
    }
    private change = [1,2,4,3]
    public updatePosBg(){
        if (BaseGameData.optSeatid){
            let pos = Utils.getDir(BaseGameData.optSeatid)

            // this._posBg.rotation = this.POS_ROTATION[BaseGameData.maxPlayer-1][pos-1]
            if (BaseGameData.maxPlayer > 3){
                for (var i=1;i<5;i++){
                    if (i != BaseGameData.optSeatid){
                        this["_pos_"+i].skin = "timelimit/time_pos_"+i+".png"
                        this["_time_"+i].stop()
                        this["_time_"+i].visible = false
                    }else{
                        this["_pos_"+i].skin = "timelimit/time_pos_"+(i+4)+".png"
                        this["_time_"+i].play()
                        this["_time_"+i].visible = true
                    }
                }
            }else{
                for (var i=1;i<5;i++){
                    if (i != Utils.getDir(BaseGameData.optSeatid)){
                        this["_pos_"+i].skin = "timelimit/time_pos_"+i+".png"
                        this["_time_"+i].stop()
                        this["_time_"+i].visible = false
                    }else{
                        this["_pos_"+i].skin = "timelimit/time_pos_"+(i+4)+".png"
                        this["_time_"+i].play()
                        this["_time_"+i].visible = true
                    }
                }
            }
        }
    }

    private updateLabel(){
        this.time = this.time - 1 > 0 ? this.time - 1 : 0
        if (this.time <= 0){
            if(BaseGameData.isGameing)
            server.dispatchMessage(EventNames.GAME_PLAYER_OPT_REP,{"result":2})
            this._num.text = String(this.time)
            Laya.timer.clearAll(this)
        }else{
            this._num.text = String(this.time)
        }
    }
    public startCount(time){
        this.time = time
        this.updatePosBg()
        // this._posBg.play()
        Laya.timer.loop(1000,this,this.updateLabel)
    }

    public updateLeftCount(){
        // if(this._leftCard.visible == false){
        //     this._leftCard.visible = true
        // }
        // this._leftLabel.text = String(BaseGameData.leftCard)
    }

    public clean(){
        for (var i=1;i<5;i++){
            this["_time_"+i].stop()
        }
        Laya.timer.clearAll(this)
    }
}