/*
* @author seacole
* 动画数据类;
*/
class EffectData{
    constructor(){

    } 

    public id:number=0;
    public type:number=0;
    public start:number=0;
    public loop:boolean=false; 

    public url:string=""; 
    public length:number=0;
    public scaleX:number=1;
    public scaleY:number=1;
    public posX:number=-1;
    public posY:number=-1;   
    public toPosX:number=-1;
    public toPosY:number=-1;
    public duation:number=0;
    public needTween:boolean=false;
    public blendMode:string="";
    public index:number = 0;
    public delay:number = 0;
    public tween:Array<any>;
    public text:string;
    public fontStyle:any;
    public delayShow:boolean=false;//延迟播放特效，在特效播放之前，是否自身执行play
    public tweenType:number=0;
    public setInfo(id:number,text:string,fontStyle:any,posX:number=-1,posY:number=-1,toPosX:number=-1,toPosY:number=-1):void
    {
        // var cfg:any=GameConfig.cfgH5Effect[id];
        // this.tween = [];
        // for (var item in cfg)
        // {            
        //     if (this.hasOwnProperty(item))
        //         this[item]=cfg[item];
        // }
        this.posX=posX==-1?this.posX:posX;
        this.posY=posY==-1?this.posY:posY;
        this.toPosX=toPosX==-1?this.toPosX:toPosX;
        this.toPosY=toPosY==-1?this.toPosY:toPosY;
        this.text = text;
        this.fontStyle = fontStyle;
        if (this.toPosX==-1 && this.toPosY==-1)
            this.needTween=false;
    }
    
}