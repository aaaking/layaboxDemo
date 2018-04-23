/*
* @author seacole
 * 创建桌子
*/
class ChatCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "ChatCtrl";
    }

    private static _instance: ChatCtrl;
    public static get instance(): ChatCtrl {
        if (!this._instance)
            this._instance = new ChatCtrl();
        return this._instance;
    }

    protected _ui: ui.panel.ChatUI;
    private _listEmojData: any[];
    private _listMesData: any[];
    private _selectTab: number = 0;
    private _type: number;
    private _data: any;

    public static TYPE_REAL_TIME: number = 1;
    public static TYPE_GAME_END: number = 2;

    public show(): void {
        this._selectTab = 0;
        this.showself();
    }

    /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.ChatUI();
            this._ui._emoList.itemRender = emojiRender;
            this._ui._emoList.scrollBar.visible = false;
            this._ui._emoList.renderHandler = new Laya.Handler(this, this.updateListResult);
            this._ui._mesList.itemRender = mesRender;
            this._ui._mesList.scrollBar.visible = false;
            this._ui._mesList.renderHandler = new Laya.Handler(this, this.updateListVisiter);
            EventManager.instance.registerOnObject(this, this._ui._emoji, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._message, Laya.Event.CLICK, this, this.onTouch)
            this._ui._emoList.selectEnable = true;
            this._ui._emoList.mouseHandler = new Laya.Handler(this, this.onEmoji);
            this._ui._mesList.selectEnable = true;
            this._ui._mesList.mouseHandler = new Laya.Handler(this, this.onMessage);
            this._ui._close.on(Laya.Event.CLICK, this, this.hide)
             
             
            // EventManager.instance.registerOnObject(this, this._ui._btnClose, Laya.Event.CLICK, this, this.onTouch);
        }
        super.beforeShow();
        this.onShow();
    }

    private onEmoji(e:Laya.Event,index:number){
        if(e.type == "click"){
            console.log("index============="+index)
            server.playerChatReq(GameDef.CHAT_TYPE.EMOJI,String(index))
            this.hide()
        }
    }

    private onMessage(e:Laya.Event,index:number){
        if(e.type == "click"){
            console.log("index============="+index)
            server.playerChatReq(GameDef.CHAT_TYPE.QUICK_MESSAGE,String(index))
            this.hide()
        }
    }
    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        this._ui._tabBtn.selectedIndex = 0
        Utils.injectProp(this._ui._chatbox, BaseGameData.tablelayout.CHAT_CONTENT_LAYOUT)
        this.checkTab();
        this._ui._emoList.array = GameDef.CHAT_EMOJI
        this._ui._mesList.array = GameDef.CHAT_MESSAGE[BaseGameData.gameType]
        super.onShow();
        // this.tweenSelf();
        
    }

    // protected tweenSelf():void
    // {
    //     this._ui.right=414;
    //     this._ui.bottom=155;
    //     this._ui.scale(0,0);
    //     Laya.Tween.clearTween(this._ui);
    //     Laya.Tween.to(this._ui,{scaleX:1,scaleY:1,right:120,bottom:0},200,Laya.Ease.backOut);
    // }

    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            // case this._ui._btnClose:
            //     this.hide();
            //     break;

            case this._ui._emoji:
                this.selectTab = 1;
                break;

            case this._ui._message:
                this.selectTab = 0;
                break;
        }
    }

    private set selectTab(value: number) {
        if (this._selectTab != value) {
            this._selectTab = value;
            this.checkTab();
        }
    }

    

    private checkTab(): void {
        // if (this._selectTab == 0) {
        //     this._ui._emoji.alpha = 1;
        //     this._ui._message.alpha = 0.01;
        // }else {
        //     this._ui._emoji.alpha = 0.01;
        //     this._ui._message.alpha = 1;
        // }
        this._ui._emojiBox.visible = this._selectTab == 1;
        this._ui._mesBox.visible = this._selectTab == 0;
    }

    /***渲染单元格时的回调方法***/
    private updateListResult(cell: emojiRender, index: number): void {
        cell.update(index);
    }

    /***渲染单元格时的回调方法***/
    private updateListVisiter(cell: mesRender, index: number): void {
        cell.update(index);
    }

    
}

class emojiRender extends Laya.View {
    private _img
    public _index
    constructor() {
        super();
        //实例化图片
      this._img = new Laya.Image();
      this.width = 86
      this.height = 75

        //加载到单元格中
        this.addChild(this._img);
        this._img.x = 10
    }

    public update(index){
        this._index = index
        this._img.skin = "chat/"+GameDef.CHAT_EMOJI[index]+".png"
    }
}

class mesRender extends Laya.View {
    private _img:Laya.Label;
    public _index
    private _line
    constructor() {
        super();
        //实例化图片
      this._img = new Laya.Label();
      this._img.fontSize = 24
      this._img.color = "#ead8b8"
      this.width = 450
      this.height = 40
      this._img.x = 10
      this._img.y = 6
        //加载到单元格中
      this.addChild(this._img);
      this._line = new Laya.Image("chat/icon_line.png")
      this.addChild(this._line)
      this._line.centerX = 0
      this._line.bottom = 1

    }

    public update(index){
        this._index = index
        this._img.text = GameDef.CHAT_MESSAGE[BaseGameData.gameType][index]
        if(index == GameDef.CHAT_MESSAGE[BaseGameData.gameType].length -1){
            this._line.visible = false
        }else{
            this._line.visible = true
        }

    }
}