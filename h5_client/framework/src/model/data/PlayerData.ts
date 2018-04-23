/*
* @author seacole
* 游戏中玩家信息;
*/
class PlayerData {
    constructor() {

    }

    public uid: number = 0;
    public seatid: number = 0;
    public status: number = 0;		//0 不在游戏  1已准备 2游戏中
    public timeout: number = 0;	//倒计时
    public score: number = 0;
    public offline: number = 0;
    public winScore:number=0;
    public info:Array<number>=[];
    public handCards = [];
    public foldCards = [];
    public holdCards = [];
    public flowerCards = [];
    public dir:number = 0;
    public pao:number = 0;
    public handCardCount:number=0;//扑克数据，手牌数
    public boomCount:number=0;//扑克数据，炸弹数量
    public voiceMemberID:number;
    public isVoiceForbidden:boolean;

    //web返回 uid nickname sex avatar  gold diamond
    public nickname:string;
    public showname:string;
    public avatar:string;
    public sex:number;//1 male 2female
    public ip:string;
    public gps:string;
    public tableStatus:number;

    public get isReady():boolean
    {
        return this.status==1;
    }

    public get isOffline():boolean
    {
        return this.has_status("offline")
    }

    public get isLeave():boolean{
        return this.has_status("leave")
    }

    public get flowerCout():number
    {
        return this.flowerCards.length;
    }

    public clear():void
    {
        this.uid=0;
        this.seatid=0;
        this.status=0;
        this.timeout=0;
        this.score=0;
        this.offline=0;
        this.winScore=0;
        this.info=[];
        this.nickname="";
        this.showname = "";
        this.avatar="";
        this.sex=1;
        this.ip = ""
        this.gps = ""
        this.pao = 0;
        this.handCards = [];
        this.foldCards = [];
        this.holdCards = [];
        this.flowerCards = [];
        this.handCardCount=0;
        this.boomCount=0;
        this.tableStatus = 0;
        this.voiceMemberID=0;
        this.isVoiceForbidden=false;
    }

    public clearCards():void{
        this.handCards = [];
        this.foldCards = [];
        this.holdCards = [];
        this.flowerCards = [];
        this.handCardCount=0;
    }

    public sortHandCards():void
    {
        if (this.handCards)
            this.handCards.sort(WaKengCardsType.onSort);
    }

    public reset():void
    {
        this.status=0;
        this.boomCount=0;
    }


    public  _status = {
        "offline" : 1 << 0,
        "leave" : 1 << 1,
    }

    

    public set_status(name){
        if (!this._status[name])  return 

        this.tableStatus = this.tableStatus | this._status[name]
    }

    public remove_status(name){
        if (!this._status[name]) return 
        this.tableStatus = this.tableStatus^this._status[name]
    }

    public has_status(name){
	    if (!this._status[name]) return false 
	    return (this.tableStatus & this._status[name]) > 0
    }
    
}