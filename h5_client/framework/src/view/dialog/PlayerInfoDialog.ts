class PlayerInfoDialog extends ui.components.PlayerInfoUI {
    constructor() {
        super();
        this.name = "PlayerInfoDialog";

    }
    private _head: HeadUI;
    private _data: any;
    private static _instance: PlayerInfoCtrl;
   

    public show(data) {
        this._data = data;
        this.beforeShow()
        this.onShow()
    }

    public beforeShow(): void {
            this._head = new HeadUI();
            this._head.setImageBounds(73,  73)
            this._head.setLabInfo(HeadUI.TYPE_SCORE);
            this._head._labName.visible = false
            this._head._labInfo.visible = false
            this._avatar.addChild(this._head);
            this._close.on(Laya.Event.CLICK, this, this.hide)
            server.on(EventNames.GAME_USER_INFO_REP, this, this.onUserInfoRep)
            this._btnVoice.on(Laya.Event.CLICK, this, this.onTouch)
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        let player = BaseGameData.getPlayerDataByUid(this._data.uid)
        if (player.ip == "") {
            server.userInfoReq([this._data.uid]);
        }
        this._head.getInfo(this._data.uid)
        this._name.text = Utils.getFitNickName(this._data.nickname ,20)
        this._ip.text = this._data.ip
        this._gps.text = this._data.gps || "该玩家定位未开启"
        this._ID.text = this._data.uid
        this._btnVoice.visible = (Native.instance.isNative && this._data.uid != server.uid && !GameConfig.IS_MATCH);
        this.checkFobbiden();

    }

    private checkFobbiden(): void {
        let player = BaseGameData.getPlayerDataByUid(this._data.uid)
        if (player.isVoiceForbidden)
            this._btnVoice.selected=true;
        else
            this._btnVoice.selected=false;
    }

    private onUserInfoRep(info) {
        for (var k in info.info) {
            let v = info.info[k]
            let player = BaseGameData.getPlayerDataByUid(v.uid)
            player.ip = v.ip
            player.gps = v.addr
            this._ip.text = v.ip
            this._gps.text = v.addr || "该玩家定位未开启"
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

   private hide(){
       DialogManager.instance.removeDialog("PLAYER_INFO")
   }
}