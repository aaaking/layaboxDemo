class DialogManager extends Laya.View{
   public _dialogList:any  
   public DIALOG_NAME = {

   }

    constructor() {
        super()
        this["name"] = "DialogManager"
        this._dialogList = {}
        this.width = Laya.stage.width
        this.height = Laya.stage.height
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);
    }

    private static _instance: DialogManager;
    public static get instance(): DialogManager {
        if (!this._instance) {
            this._instance = new DialogManager();
        }
        return this._instance;
    }

    protected onResize(): void {
        this.width = AppControl.getInstance().stage.width;
        this.height = AppControl.getInstance().stage.height;
        for(var k in this._dialogList){
            let v = this._dialogList[k]
            v.width = this.width
            v.height = this.height
            if(v._mask){
                v._mask.width = this.width
                v._mask.height = this.height
            }
        }
    }

    public addDialog(name, className, loadData?: any){
        this.DIALOG_NAME[name] = className
        if (loadData){
            Laya.loader.load(loadData);
        }
    }

    public callDialog(name,...agrs){
        if (this._dialogList[name]){
            return this._dialogList[name]
        }else{
            let dialog = new this.DIALOG_NAME[name](...agrs)
            this.addChild(dialog)
            dialog.width = AppControl.getInstance().stage.width;
            dialog.height = AppControl.getInstance().stage.height;
            if (dialog._mask) {
                dialog._mask.width = AppControl.getInstance().stage.width;
                dialog._mask.height = AppControl.getInstance().stage.height;
                if(!dialog._autoHide){
                    dialog._mask.on(Laya.Event.CLICK, dialog, dialog.hide)
                }
            }
           
            this._dialogList[name] = dialog
            this.tweenSelf(dialog._box)
            return dialog
            // this._dialogList[name].show(...agrs)
        }
    }

    protected tweenSelf(target): void {
        target.pos(AppControl.getInstance().stage.width * 0.5, AppControl.getInstance().stage.height * 0.5);
        target.scale(0, 0);
        Laya.Tween.clearTween(target);
        Laya.Tween.to(target, { scaleX: 1, scaleY: 1, x: (AppControl.getInstance().stage.width - target.width) / 2, y: (AppControl.getInstance().stage.height - target.height) / 2 }, 200, Laya.Ease.backOut);

    }

    public removeDialog(name){
        if(this._dialogList[name]){
            this._dialogList[name].removeSelf()
            delete this._dialogList[name]
        }
    }

    public hasDialog(name){
        if(this._dialogList[name]) return true

        return false
    }

    public clearAll(){
        for(var k in this._dialogList){
            this.removeDialog(k)
        }

        this._dialogList = {}
    }



}