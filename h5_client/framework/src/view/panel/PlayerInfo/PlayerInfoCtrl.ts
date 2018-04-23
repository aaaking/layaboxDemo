class PlayerInfoCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "PlayerInfoCtrl";

    }
    private _head: HeadUI;
    protected _ui: ui.components.PlayerInfoUI;
    private _data: any;
    private static _instance: PlayerInfoCtrl;
    public static get instance(): PlayerInfoCtrl {
        if (!this._instance)
            this._instance = new PlayerInfoCtrl();
        return this._instance;
    }

    public show(data) {
        this._data = data;
        this.showself();
    }

    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.components.PlayerInfoUI();
            this._head = new HeadUI();
            this._head.setImageBounds(73,73)
            this._head.setLabInfo(HeadUI.TYPE_SCORE);
            this._head._labName.visible = false
            this._head._labInfo.visible = false
            this._ui._box.addChild(this._head);
            this._ui._close.on(Laya.Event.CLICK, this, this.hide)
            EventManager.instance.registerOnObject(this, server, EventNames.GAME_USER_INFO_REP, this, this.onUserInfoRep);
            EventManager.instance.registerOnObject(this, this._ui._btnVoice, Laya.Event.CLICK, this, this.onTouch);
        }
        super.beforeShow();
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow();
        let player = BaseGameData.getPlayerDataByUid(this._data.uid)
        if (player.ip == "") {
            server.userInfoReq([this._data.uid]);
        }
        this._head.getInfo(this._data.uid)
        this._ui._name.text = Utils.getFitNickName(this._data.nickname ,20)
        this._ui._ip.text = this._data.ip
        this._ui._gps.text = this._data.gps || "该玩家定位未开启"
        this._ui._ID.text = this._data.uid
        this._ui._btnVoice.visible = (Native.instance.isNative && this._data.uid != server.uid && !GameConfig.IS_MATCH);
        this.checkFobbiden();
        this.tweenSelf();

    }

    private checkFobbiden(): void {
        let player = BaseGameData.getPlayerDataByUid(this._data.uid)
        if (player.isVoiceForbidden)
            this._ui._btnVoice.selected=true;
        else
            this._ui._btnVoice.selected=false;
    }

    private onUserInfoRep(info) {
        for (var k in info.info) {
            let v = info.info[k]
            let player = BaseGameData.getPlayerDataByUid(v.uid)
            player.ip = v.ip
            player.gps = v.addr
            this._ui._ip.text = v.ip
            this._ui._gps.text = v.addr || "该玩家定位未开启"
        }
    }

    private onTouch(): void {
        let player = BaseGameData.getPlayerDataByUid(this._data.uid);
        if (player) {
            if (player.isVoiceForbidden)
                Native.instance.voiceForbidMemberVoice(BaseGameData.voiceRoomName, player.voiceMemberID, 0, () => {
                    this.checkFobbiden();
                });
            else
                Native.instance.voiceForbidMemberVoice(BaseGameData.voiceRoomName, player.voiceMemberID, 1, () => {
                    this.checkFobbiden();
                });
        }
    }

    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }
}