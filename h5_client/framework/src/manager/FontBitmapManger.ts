/*
* hwp;
*/
class FontBitmapManger{
    
    private static _instance: FontBitmapManger;
    constructor(){

    }

    public static get instance(): FontBitmapManger {
        if (!this._instance) {
            this._instance = new FontBitmapManger();
        }
        return this._instance; 
    }

    //需要加载的所有位图字资源
    public  loadFontArr()
    {
        //FontBitmapData.instance.arrFont = arr;
        FontBitmapData.instance.arrFont = ResourceConfig.BITMAP_FONT_TOTAL;
        this.loadAction();
       
    }

    //逐个加载
    private loadAction():void
    { 
         var len = FontBitmapData.instance.arrFont.length;
          if(len==0)
          {
              log('FontBitmapManer------位图字注册完成');
              Dispatcher.dispatch(EventNames.FONT_BITMMAP);
               return;
          }
            
          var fontName = FontBitmapData.instance.arrFont.pop();
         if(fontName == '')
          {
            this.loadAction();
            return;
          }
    
        var  mBitmapFont = new Laya.BitmapFont();
        //外部保证fnt与png文件同名
         mBitmapFont.loadFont("res/bitmapFont/"+fontName+".fnt",new Laya.Handler(this,this.onLoaded,[fontName,mBitmapFont]));
    }

    //注册字体样式
    private onLoaded(fontName:string,mBitmapFont:Laya.BitmapFont):void
    {
       //注册样式
       // mBitmapFont.autoScaleSize = true;
         Laya.Text.registerBitmapFont(fontName,mBitmapFont);
         //保存样式名称
          FontBitmapData.instance.addFontStyle(fontName);
          //继续加载样式
         this.loadAction();
    }


}