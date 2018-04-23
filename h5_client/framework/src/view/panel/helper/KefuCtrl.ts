/*
*  @author seacole
* 检测更新;
*/
class KeFuCtrl extends BaseCtrl {
    constructor() {
        super();
    }

    protected _ui: ui.panel.KeFuPanelUI;

    private static _instance: KeFuCtrl;
    public static get instance(): KeFuCtrl {
        if (!this._instance)
            this._instance = new KeFuCtrl();
        return this._instance;
    }

    private _newVer: string;
    private _url: string;
    private _tips: string;
    protected form
    protected input
    public show(tips: string): void {
        this._tips = tips;
        this.showself();
    }

    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.KeFuPanelUI();
            this._ui._title.skin = "menu/title_kefu.png"
            this._ui._labMsg.style.align = "center";
            this._ui._labMsg.style.color = "#9b5036";
            this._ui._labMsg.style.fontSize = 26;
            //  this._ui._labMsg.style.valign = "middle"; 
             this._ui._btnConfirm.skin = "menu/copy.png"
             this._ui._close.visible = true
             this._ui._close.on(Laya.Event.CLICK, this, this.hide)
             if(Native.instance.isNative){
                this._ui._btnConfirm.visible = true
                this._ui._btnConfirm.skin = "menu/copy_2.png"
                EventManager.instance.registerOnObject(this, this._ui._btnConfirm, Laya.Event.CLICK, this, this.onTouch);
             }else{
                this._ui._btnConfirm.visible = false
                this.form = new Laya.Sprite();
                this.form.size(156,58);
                let point = this._ui._box.localToGlobal(new laya.maths.Point(0,0))
                this.form.pos(Laya.stage.width/2-78, point.y+680);
                Laya.stage.addChild(this.form);
             }
            
        }
        super.beforeShow();
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow(1);
        LoadingUI.instance.hide();

        this._ui._labMsg.innerHTML = this._tips;
        this._ui._labMsg.y=100+(210-this._ui._labMsg.contextHeight)*0.5;
        this.tweenSelf();
        
        if(!Native.instance.isNative){
            let view = this.createInputElement()
            Laya.Utils.fitDOMElementInArea(view, this.form, 0, -40, 156, 58);
        }
    }

    public createInputElement(){
        this.input = Laya.Browser.createElement("img");
        this.input.type = "image";
        this.input.src = "res/menu/copy.png"
        this.input.style.zIndex = Laya.Render.canvas.zIndex + 1;
        this.input.onclick = function(){
            if(Native.instance.isNative){
                NativeHelper.instance.clipboardCopy("ddyx18")
                HintCtrl.instance.show("复制成功")
            }else{
                try {
                    Laya.Browser.document.getElementById("test").click();
                } catch (error) {
                    
                }
            }
        }
        Laya.Browser.document.body.appendChild(this.input);
        return this.input;
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }
    public hide(){
        super.hide()

        if(!Native.instance.isNative){
            this.form.removeSelf()
            Laya.Browser.document.body.removeChild(this.input)
        }
    }
    protected onTouch(e: Laya.Event): void {
        if(Native.instance.isNative){
            NativeHelper.instance.clipboardCopy("ddyx18")
            HintCtrl.instance.show("复制成功")
        }
       
        // Laya.Browser.window.clipboardData.setData("Text",this._tips);
    }

}