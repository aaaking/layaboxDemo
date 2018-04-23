/*
* hwp;
*/
class FontBitmapData{

    //字体样式库(样式的名称就是样式图片的名字)(使用该样式时使用)
    private   _fontStyle:Laya.Dictionary =  new Laya.Dictionary() ;
    //存储样式图片的名称（用于加载时）
    private  _arrFont:Array<string>;

    private static _instance: FontBitmapData;
    constructor(){

    }

    public static get instance(): FontBitmapData {
        if (!this._instance) {
            this._instance = new FontBitmapData();
        }
        return this._instance; 
    }

     //需要加载的所有位图字资源
    public  set arrFont(arr:Array<string>)
    {
        this._arrFont = arr;
       
    }

    public  get arrFont():Array<string>
    {
       return this._arrFont;
       
    }


    //获取字体样式库
    public  get fontStyle():Laya.Dictionary
    {
        return this._fontStyle;
    }

    public  addFontStyle(name:string):void
    {
         this._fontStyle[name] = name;
    }

}