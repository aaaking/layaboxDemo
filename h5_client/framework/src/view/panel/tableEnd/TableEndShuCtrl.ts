class TableEndShuCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "TableEndShuCtrl";

    }
    private _head: HeadUI;
    protected _ui: ui.components.TableEndShuViewUI;
    private _data: any;
    private _shareInfo
    private _shareText
    private static _instance: TableEndShuCtrl;
    public static get instance(): TableEndShuCtrl {
        if (!this._instance)
            this._instance = new TableEndShuCtrl();
        return this._instance;
    }

    public show(data) {
        this._data = data;
        this.showself()
    }

    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.components.TableEndShuViewUI();
            this._ui._back.on(Laya.Event.CLICK, this, this.back)
            this._ui._btnShare.visible = true;
            EventManager.instance.registerOnObject(this, this._ui._btnShare, Laya.Event.CLICK, this, this.onShare);
            if (Native.instance.isNative) {
                this._ui._download.visible = false;
                this._ui._ani.removeSelf();
            }
            else {
                this._ui._download.visible = true;
                this._ui._area.skin = "gameLogo/" + GameConfig.APPAREA + ".png"
                this._ui._ani.hitArea = new Laya.Rectangle(-111, -28, 222, 56);
                EventManager.instance.registerOnObject(this, this._ui._area, Laya.Event.CLICK, this, this.onDownload);
                EventManager.instance.registerOnObject(this, this._ui._ani, Laya.Event.CLICK, this, this.onDownload);
            }
        }
        this._autoHide = false;
        super.beforeShow();
        this.onShow();
    }

    private back() {
        server.code = "";
        AppControl.getInstance().showPage(MenuPage);
        server.close();
    }

    private addTableEndItem(info, index) {
        let height = BaseGameData.maxPlayer == 4 ? 98 : 124
        let offset = BaseGameData.maxPlayer == 4 ? 12 : 25
        let view = new ui.components.TableEndItemUI()
        view._bg.width = 560
        let head = new HeadUI()
        head.setImageBounds(73, 73)
        view.height = height
        view._bg.height = height
        view._avatar.addChild(head)
        head.getInfo(info.uid)
        head._labInfo.visible = false
        head._labName.visible = false
        let player = BaseGameData.getPlayerDataByUid(info.uid)
        view._name.text = Utils.getFitNickName(player.nickname, 20)

        if (info.score >= 0) {
            view._score.font = "font_num_10"
        } else {
            view._score.font = "font_num_9"
        }
        if (Number(info.score) >= 0)
            view._score.text = "+" + info.score;
        else
            view._score.text = info.score;
        this._ui._bg.addChild(view)
        view.pos(30, index * height + index * offset + 100)
        if (info.info) {
            let peace = view._info.width / info.info.length
            for (var k in info.info) {
                let text = info.info[k]
                let lableInfo = new Laya.Label(text)
                lableInfo.fontSize = 22
                lableInfo.align = "center"
                view._info.addChild(lableInfo)
                lableInfo.x = peace * parseInt(k) + peace / 2
                lableInfo.centerY = 0
            }
        }
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow();
        console.info(this._data)
        this._ui._ani.play(1, true);
        this._ui._bg.removeChildren()
        let shareInfo = []
        this._shareText = ""
        for (var k in this._data) {
            let v = this._data[k]
            this.addTableEndItem(v, k)
            let player = BaseGameData.getPlayerDataByUid(v.uid)
            let info = { a: "", n: "", s: 1 }
            info.a = player.avatar
            info.n = Utils.getFitNickName(player.nickname, 16)
            info.s = v.score
            shareInfo.push(info)
            if (v.score >= 0) {
                let n = this.excludeSpecial(info.n)
                this._shareText += Utils.getFitNickName(n, 16) + " +" + info.s + " | "
            } else {
                let n = this.excludeSpecial(info.n)
                this._shareText += Utils.getFitNickName(n, 16) + " " + info.s + " | "
            }
            
        }
        let info = { "g": BaseGameData.gameType, "t": TimeUtils.Format("yyyy-MM-dd hh:mm"), "c": BaseGameData.totalHandCount, "p": shareInfo }
        this._shareInfo = JSON.stringify(info)
        if (GameConfig.IS_BANSHU)
            this._ui._gamename.skin = "banshu/history_" + BaseGameData.gameType + ".png";
        else
            this._ui._gamename.skin = "createTable/" + GameDef.GAME_LOGO[BaseGameData.gameType] + ".png"
        this._ui._round.text = "局数:" + BaseGameData.currHandCount + "/" + BaseGameData.totalHandCount
        var time: number = Laya.Browser.now();
        var d: Date = new Date(time);
        this._ui._time.text = TimeUtils.Format("yyyy-MM-dd hh:mm")
        WxWeb.instance.onShareInfo(4, 0, "战绩" + BaseGameData.tableid, this._shareText, this._shareInfo)
    }

    public excludeSpecial(s){
         // 去掉转义字符  
        s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');  
        // 去掉特殊字符  
        s = s.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]]/);  
        return s;  
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
        if (this._ui._ani)
            this._ui._ani.stop();
    }

    private onShare(): void {
        if (Native.instance.isNative) {
            Native.instance.share(2, 0);
        } else {
            Native.instance.share(4, 0, "战绩" + BaseGameData.tableid, this._shareText, this._shareInfo);
        }
    }

    private onDownload(): void {
        Native.instance.gotoDownload();
    }
}