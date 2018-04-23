/*
* @author seacole
* 美术字;
*/
class FontData{
    constructor(){

    }

    public static TYPE_NORMAL:number=1;
    public static TYPE_TIME:number=2;

    public id:number;
    public jsonData: any;
    public textureData: Laya.Texture;
    public width: number;
    public posType:string = "left";
    public type:number=1;
    public needRemove:boolean;

    public posX:number;
    public posY:number;
    private _text:string;

    public init(id:number,jsonData: any,textureData: Laya.Texture,width: number,posType:string = "left",type:number=1,needRemove:boolean=false):void
    {
       this.id=id;
       this.jsonData=jsonData;
       this.textureData=textureData;
       this.width=width;
       this.posType=posType;
       this.type=type;
       this.needRemove=needRemove;
    }

    public setInfo(posX:number,posY:number,text:string):void
    {
        this.posX=posX;
        this.posY=posY;
        this._text=text;
    }

    public setPos(posX:number,posY:number):void
    {
        this.posX=posX;
        this.posY=posY;
    }

    public set text(value:string)
    {
        this._text=value;
    }

    public get text():string
    {
        return this._text;
    }
}