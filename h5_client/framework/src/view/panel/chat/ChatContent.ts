class ChatContent extends ui.panel.ChatContentUI {
    constructor() {
        super();
        Dispatcher.on(EventNames.PLAY_RECORD_END, this, this.onPlayRecordEnd);

        // this.init(info)

    }
    private dir
    private _chatType
    private _popleft
    private _seatid
    // private rotationList = [[], [], [0, 0, 0], [0, 0, 0, 0]]
    // private contentRotation = [[], [], [0, 0, 0], [0, 0, 0, 0]]
    private emojiCenterXList = [[], [0, 0], [100, -10, 100], [100, -10, -100, 3]]
    private emojiCenterYList = [[], [0, 0], [20, -30, 20], [20, -30, -10, -5]]
    private mesCenterXList = [[], [0, 0], [0, 0, 0], [0, 0, -120, 0]]
    private mesCenterYList = [[], [0, 0], [0, 0, 0], [0, 0, -200, 0]]
    private centerXList = [[], [0, 0], [0, 0, 3], [0, 0, 0, 3]]
    private centerYList = [[], [-7, -3], [-7, -8, -8], [-7, -8, -8, -8]]

    private _chatRecord: ui.components.chat.ChatRecordUI;
    public set popleft(position) {
        this._popleft = position
        if (position == 1) {
            this._bg.visible = false
            this._bgEmoji.visible = false
        } else {
            this._bgEmojiLeft.visible = false
            this._bgLeft.visible = false
        }
    }
    public init(info, dir, seatid) {
        Laya.timer.clearAll(this)
        this.dir = dir
        this._seatid = seatid
        switch (info.chatType) {
            case GameDef.CHAT_TYPE.EMOJI:
                Laya.timer.clear(this, this.clear)
                this._bg.visible = false
                this._bgLeft.visible = false
                if (this._popleft == 1) {
                    this._bgEmojiLeft.visible = true
                    this._emojiLeft.skin = "chat/" + GameDef.CHAT_EMOJI[parseInt(info.chatContent)] + ".png"
                } else {
                    this._bgEmoji.visible = true
                    this._emoji.skin = "chat/" + GameDef.CHAT_EMOJI[parseInt(info.chatContent)] + ".png"
                }
                this.clear()
                break
            case GameDef.CHAT_TYPE.QUICK_MESSAGE:
                Laya.timer.clear(this, this.clear)
                // this._bg.skin = "chat/messagePop.png"

                // let text = new Laya.Label()
                // text.text = GameDef.CHAT_MESSAGE[BaseGameData.gameType][parseInt(info.chatContent)]
                // text.fontSize = 26
                // text.color = "#000000"

                // this._bg.addChild(text)
                // this._bg.width = text.width + 45
                // this._bg.height = 74;
                // text.anchorX = 0.5
                // text.anchorY = 0.5
                // this._bg.scaleX = 1
                // text.scaleX = 1
                // if (this.dir == 2 && BaseGameData.maxPlayer> 2) {
                //     this._bg.scaleX = -1
                //     text.scaleX = -1
                // }
                // if(BaseGameData.maxPlayer == 4 && this.dir == 3){
                //     this._bg.scaleX = -1
                //     text.scaleX = -1
                // }
                // // text.rotation = this.contentRotation[BaseGameData.maxPlayer - 1][this.dir - 1]
                // text.centerX = this.centerXList[BaseGameData.maxPlayer - 1][this.dir - 1]
                // text.centerY = this.centerYList[BaseGameData.maxPlayer - 1][this.dir - 1]
                // this._bg.x = this.mesCenterXList[BaseGameData.maxPlayer - 1][this.dir - 1]
                // this._bg.y = this.mesCenterYList[BaseGameData.maxPlayer - 1][this.dir - 1]
                this._bgEmoji.visible = false
                this._bgEmojiLeft.visible = false
                if (this._popleft == 1) {
                    this._bgLeft.visible = true
                    this._messageLeft.text = GameDef.CHAT_MESSAGE[BaseGameData.gameType][parseInt(info.chatContent)]
                    this._messageLeft.right = 21 + this._messageLeft.width
                    this._bgLeft.width = this._messageLeft.width + 45
                } else {
                    this._bg.visible = true
                    this._bgLeft.visible = false
                    this._message.text = GameDef.CHAT_MESSAGE[BaseGameData.gameType][parseInt(info.chatContent)]
                    this._bg.width = this._message.width + 45
                }
                let player = BaseGameData.getPlayerDataBySeatid(this._seatid)
                let sex = player ? player.sex : 1
                SoundManager.instance.playEffect("message_" + info.chatContent, sex)
                this.clear()

                break

            case GameDef.CHAT_TYPE.RECORD:
                Laya.timer.clear(this, this.clear)
                this._bgEmoji.visible = false
                this._bgEmojiLeft.visible = false
                if (!this._chatRecord)
                    this._chatRecord = new ui.components.chat.ChatRecordUI();
                this._chatRecord.ani1.play(1, true);
                if (this._popleft == 1) {
                    this._bgLeft.visible = true
                    this._messageLeft.text = ""
                    this._bgLeft.width = 70
                    this._bgLeft.addChild(this._chatRecord);
                } else {
                    this._bg.visible = true
                    this._message.text = ""
                    this._bg.width = 70;
                    this._bg.addChild(this._chatRecord);
                }
                this._chatRecord.centerX = 0;
                this._chatRecord.centerY = 0;
                break;
        }
    }

    private getContentBox() {
        // this._bg.rotation = this.rotationList[BaseGameData.maxPlayer - 1][this.dir - 1]
        if (this.dir == 2)
            this._bg.scaleX = -1
    }
    private onPlayRecordEnd(): void {
        if (this._chatRecord)
            this._chatRecord.ani1.stop();
        this._chatRecord.removeSelf();
        this.visible = false;
    }

    private clear() {
        Laya.timer.once(2000, this, function () {
            this.visible = false
        })
    }


}