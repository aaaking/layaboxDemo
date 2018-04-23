class PlayerManager {
    constructor() {
        this._players = {}
    }
    public _players
    public _playerClass
    private static _instance: PlayerManager;
    public static get instance(): PlayerManager {
        if (this._instance == undefined) {
            this._instance = new PlayerManager();
        }
        return this._instance;
    }

    public registerClass(playerClass){
		this._playerClass = playerClass
	}


    public addPlayerView(seatid, playerInfo){
        if(!this._players){
            this._players = {}
        }
        if (this._players[seatid]){
            return  this._players[seatid]
        }
        
        this._players[seatid] = new this._playerClass(playerInfo)
        return this._players[seatid]
    }


    public changeSeatToPlayer(uid, seatid, callback?){
        if(!Utils.checkSeatid(seatid))
            return
        var playerInfo = BaseGameData.getPlayerDataByUid(uid)
        playerInfo.dir = Utils.getDir(seatid)
        this._players[seatid].status = PlayerInGameUI.STATUS_ALREADY_SIT
        this._players[seatid].data = playerInfo
        // this._players[seatid].changeToPlayer()
    }

    public changeToSeat(seatid){
        if(this._players && this._players[seatid]){
            this._players[seatid].status = PlayerInGameUI.STATUS_CAN_SIT
        }
    }

    public changeToEmpty(seatid){
        if(this._players && this._players[seatid]){
            this._players[seatid].status = PlayerInGameUI.STATUS_EMPTY
        }
    }
    
    public changeToReady(seatid){
        if(this._players && this._players[seatid]){
            this._players[seatid].changeToReady()
        }
    }

    public movePlayer( ani ){
        for(let i=1;i<=BaseGameData.maxPlayer;i++){
            let pos = Utils.currentPos(i)
            Utils.injectProp(this._players[i],{left:NaN,right:NaN,top:NaN,bottom:NaN,x:NaN,y:NaN,centerX:NaN,centerY:NaN})
            if (ani){
                console.info(BaseGameData.tablelayout.SEAT_LAYOUT[BaseGameData.maxPlayer-1][pos-1])
                Laya.Tween.to(this._players[i],BaseGameData.tablelayout.SEAT_LAYOUT[BaseGameData.maxPlayer-1][pos-1],500)
            }else{
                console.info(BaseGameData.tablelayout.SEAT_LAYOUT[BaseGameData.maxPlayer-1][pos-1])
                Utils.injectProp(this._players[i],BaseGameData.tablelayout.SEAT_LAYOUT[BaseGameData.maxPlayer-1][pos-1])
            }
                // this._players[i].pos(BaseGameData.tablelayout.SEAT_LAYOUT[BaseGameData.maxPlayer-1][pos-1].x,BaseGameData.tablelayout.SEAT_LAYOUT[BaseGameData.maxPlayer-1][pos-1].y)
            
            
            if (Utils.checkSeatid(BaseGameData.selfSeatid) &&  !BaseGameData.getPlayerDataBySeatid(i)){
                this._players[i].status = PlayerInGameUI.STATUS_EMPTY
            }
        }

        // self:setBankPos()
    }

 public moveToGameStart( ani ){
    
    for (var k in this._players){
        let v = this._players[k]
         Utils.injectProp(v,{left:NaN,right:NaN,top:NaN,bottom:NaN,x:NaN,y:NaN,centerX:NaN,centerY:NaN})
        Utils.injectProp(v,BaseGameData.tablelayout.GAME_START_SEAT_LAYOUT[BaseGameData.maxPlayer-1][v._dir-1])
    }
 }

    public removeAllPlayer(){
        for(var k in this._players){
            let v = this._players[k]
            v.removeListener()
            v.removeSelf()
            v = null
        }
        this._players = {}
    }

    public playChat(seatid,msg){
        this._players[seatid].playChat(msg)
    }
    
}