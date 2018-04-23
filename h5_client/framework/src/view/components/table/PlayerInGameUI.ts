/*
* @author seacole
* 游戏中玩家UI
*/
class PlayerInGameUI extends ui.components.table.PlayerInGameUI {
    constructor() {
        super();
        this._btnSit.on(Laya.Event.CLICK, this, this.onSitTouch);

        this._head = new HeadUI();
        this._head.setLabName({ visible: false });
        // this._head.setLabInfo(HeadUI.TYPE_SCORE);
        // this._head.scale(0.8, 0.8);
        //     this._head._imgFemale.width = 73
        //     this._head._imgFemale.height = 73
        //    this._head._imgMale.width = 73
        //    this._head._imgMale.height = 73
        //    this._head._imgHead.width = 73
        //    this._head._imgHead.height = 73
        this._head.setImageBounds(73, 73)
        this._head.x = 12;
        this._head.y = 12;
        this._head._labName.fontSize = 18
        this._box.addChildAt(this._head, 0);

        if (BaseGameData.gameType == GameConfig.GAME_TYPE_POKER) {
            this._cardCountUI = new poker.PokerCountUI();
            this._cardCountUI.y = 34;
            this._box.addChildAt(this._cardCountUI, this._box.numChildren - 2);

            this._boomCountUI = new poker.BoomCountUI();
            this._boomCountUI.y = -15;
            this._box.addChild(this._boomCountUI);

            this._imgDug = new Laya.Image();
            this._imgDug.source = Laya.loader.getRes(ResourceConfig.DUG_URL + "10.png")
            this._imgDug.y = -35;
            this._box.addChild(this._imgDug);
            this._imgDug.visible = false;

            this._imgPass = new Laya.Image();
            // this._imgPass.source = Laya.loader.getRes(ResourceConfig.PASS_URL);
            this._imgPass.y = 24;
            this._box.addChild(this._imgPass);
            this._imgPass.visible = false;
        }

        this._chatContent = new ChatContent()
        this._chatContent.visible = false
        this._box.addChild(this._chatContent)
        this._chatContent.pos(-70, -7)
        this._box.on(Laya.Event.CLICK, this, this.onPlayerInfo);

        if (Native.instance.isNative) {
            this._chatRecord = new ui.components.chat.ChatRecordUI();
            this._chatRecord.y = 73;
            this._chatRecord.visible = false;
            this._box.addChild(this._chatRecord)

            this._chatRecordCh = new Laya.Image("table/table_chat_record.png");
            this._chatRecordCh.y = 73;
            this._box.addChild(this._chatRecordCh)
        }
    }

    private _head: HeadUI;
    private _cardCountUI: poker.PokerCountUI;
    private _boomCountUI: poker.BoomCountUI;
    private _imgDug: Laya.Image;
    private _imgPass: Laya.Image;
    private _imgDugType: number;
    private _chatContent: ChatContent
    private _chatRecord: ui.components.chat.ChatRecordUI
    private _chatRecordCh: Laya.Image;

    public static STATUS_EMPTY: number = 1;//空位
    public static STATUS_CAN_SIT: number = 2;//可以坐下
    public static STATUS_ALREADY_SIT: number = 3;//已经坐下

    private addListener(): void {
        EventManager.instance.enableOnObject(this);
    }

    private removeListener(): void {
        EventManager.instance.disableOnObject(this);
    }

    private _index: number;
    private _status: number;
    private _data: PlayerData;
    private _isCurrentLayoutInGame: boolean;
    public set index(value: number) {
        this._index = value;
        this.name = "PlayerInGameUI" + this._index;
        this.scale(0.8, 0.8)
        if (BaseGameData.gameType == GameDef.GAME_TYPE.SHISANSHUI) {
            this.scale(1, 1)
        }
        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.PLAYER_DATA_CHANGED, this, this.onDataChange);

        if (BaseGameData.gameType == GameConfig.GAME_TYPE_MJ) {
            switch (this._index) {
                case 1:
                    this.setChildPos(2, 2);
                    break;
                case 2:
                    this.setChildPos(1, 1);
                    this._imgPao.x = -16
                    break;

                case 3:
                    this.setChildPos(1, 2);
                    this._imgPao.x = -16
                    break;

                case 4:
                    this.setChildPos(2, 2);
                    break;
            }
        }
        else {
            switch (this._index) {
                case 1:
                    this.setChildPos(1, 2, 2, 2, 2, 2);
                    break;
                case 2:
                    this.setChildPos(2, 1, 1, 1, 1, 1);
                    break;

                case 3:
                    this.setChildPos(1, 2, 2, 2, 2, 2);
                    break;

                case 4:
                    this.setChildPos(1, 2, 2, 2, 2, 2);
                    break;
            }
        }
        if (this._chatContent) {
            this._chatContent.popleft = GameDef.CHAT_POS[BaseGameData.maxPlayer - 1][this._index - 1]
            if (this._chatRecord)
                this._chatRecord.visible = this._chatRecordCh.visible = false;
            // let posi = Utils.injectProp(this._chatContent, GameDef.CHAT_POS[BaseGameData.maxPlayer - 1][this._index - 1]);
            // switch (this._index){
            //     case 1: 
            //          this._chatContent.y = -100
            //          break;
            //     case 2:
            //         break;
            //     case 3:
            //         this._chatContent.y = 100
            //         break;
            //     case 4:
            //         this._chatContent.x = 100
            //         break;
            // }
        }
    }

    /**
     * 1左2右
     */
    private setChildPos(master: number, ready: number, cardCount: number = 0, boom: number = 0, dug: number = 0, pass: number = 0): void {
        if (master == 1)
            this._imgMaster.x = -16;
        else if (master == 2)
            this._imgMaster.x = 70;
        if (ready == 1) {
            this._imgReady.x = -176;
            if (this._chatRecord)
                this._chatRecord.x = this._chatRecordCh.x = -7;
        }

        else if (ready == 2) {
            this._imgReady.x = 122;
            if (this._chatRecord)
                this._chatRecord.x = this._chatRecordCh.x = 72;
        }

        if (this._cardCountUI) {
            if (cardCount == 1)
                this._cardCountUI.x = -60;
            else if (cardCount == 2)
                this._cardCountUI.x = 110;
        }
        if (this._boomCountUI) {
            if (boom == 1)
                this._boomCountUI.x = -77;
            else if (boom == 2)
                this._boomCountUI.x = 100;
        }
        if (this._imgDug) {
            this._imgDugType = dug;
            if (dug == 1)
                this._imgDug.x = -114;
            else if (boom == 2)
                this._imgDug.x = 100;
        }
        if (this._imgPass) {
            if (dug == 1)
                this._imgPass.x = -148;
            else if (boom == 2)
                this._imgPass.x = 153;

        }
    }

    public set status(value: number) {
        if (this._status != value) {
            this._status = value;
            this._imgEmpty.visible = this._status == PlayerInGameUI.STATUS_EMPTY;
            this._btnSit.visible = this._status == PlayerInGameUI.STATUS_CAN_SIT;
            this._box.visible = this._status == PlayerInGameUI.STATUS_ALREADY_SIT;
            if (this._status == PlayerInGameUI.STATUS_ALREADY_SIT)
                this.addListener();
            else {
                this.removeListener();
                this._data = null;
                this._head.data = null;
            }
        }
    }

    public get status(): number {
        return this._status;
    }

    public checkIsGameing(isFirstLayout: boolean = false): void {

        this.checkAll();

        if (!isFirstLayout && this._isCurrentLayoutInGame == BaseGameData.isGameing)
            return;
        this._isCurrentLayoutInGame = BaseGameData.isGameing;


        var posi: any = PlayerInGamePosiConfig.getPosi(BaseGameData.gameType, this._index);
        this.setPosi(isFirstLayout, posi);
    }

    private getMjGameType(): any {

    }

    private setPosi(isFirstLayout: boolean, posi: any): void {
        // if (isFirstLayout) {
        Utils.injectProp(this, posi);
        // }
        // else {
        //     this.centerX = NaN
        //     if (this._index == 1)
        //         AnimationManager.instance.addAnimation(() => {
        //             Laya.Tween.to(this, posi, 200, null, Laya.Handler.create(this, () => { AnimationManager.instance.animationOver() }));
        //         }, null);
        //     else
        //         Laya.Tween.to(this, posi, 200);
        // }

    }

    public clear(needCheckIsGameing: boolean = true): void {
        this.status = PlayerInGameUI.STATUS_CAN_SIT;
        this._isCurrentLayoutInGame = false;
        this._data = null;
        this._head.data = null;
        this._labScore.text = "";
        this._labFlower.text = "";
        this.pass = false;
        if (needCheckIsGameing)
            this.checkIsGameing(true);
        if (this._cardCountUI)
            this._cardCountUI.visible = false;
    }

    private onSitTouch(): void {
        if (BaseGameData.divide) {
            let text = StringUtils.format(GameConfig.language.sit_down_tip, BaseGameData.divide);
            AlertInGameCtrl.instance.show(text, (type: number) => {
                if (type == AlertCtrl.CONFIRM) {
                    server.sitdownReq(this._index)
                }
            }, 0, true, ResourceConfig.ALERT_TISHI);
        } else {
            server.sitdownReq(this._index)
        }
        // server.sitdownReq(this._index);
    }

    public set data(value: PlayerData) {
        this._data = value;
        this.onDataChange(this._data.uid);
    }
    private checkMaster() {
        if (BaseGameData.gameType == GameDef.GAME_TYPE.SHISANSHUI) {
            this._imgMaster.visible = false;
            this._imgKengzhu.visible = false;
        }
        else if (BaseGameData.gameType == GameDef.GAME_TYPE.WAKENG) {
            this._imgMaster.visible = false;
            if (this._data)
                this._imgKengzhu.visible = this._data.seatid == BaseGameData.btnSeatid;
            else
                this._imgKengzhu.visible = false;
        }
        else {
            this._imgKengzhu.visible = false;
            if (this._data)
                this._imgMaster.visible = this._data.seatid == BaseGameData.btnSeatid;
            else
                this._imgMaster.visible = false;
        }
    }

    private checkAll(): void {
        if (BaseGameData.gameType != GameDef.GAME_TYPE.SHANGQIU_MJ) {
            this._labFlower.visible = false;
            this._imgFlower.visible = false;
        }else{
            this._labFlower.visible = true;
            this._imgFlower.visible = true; 
        }
        // if (BaseGameData.gameType == GameDef.GAME_TYPE.SHANGQIU_MJ) {
        //     this._imgFlower.visible = BaseGameData.isGameing;
        //     this._labFlower.visible = BaseGameData.isGameing;
        // } else 
        if (BaseGameData.gameType == GameDef.GAME_TYPE.SHANXI_MJ) {
            this._imgPao.visible = BaseGameData.isGameing;
        }
        this.setBoom();
        this.setReady();
        this.setCardCountUI();
        if (!BaseGameData.isGameing)
            this.pass = false;
    }

    private onDataChange(uid: number): void {
        this.checkAll();

        if (this._data) {
            if (this._data.uid == uid) {
                this._imgDisconnect.visible = this._data.isOffline;
                this._imgLeave.visible = this._data.isLeave;
                if (this._data.isOffline)
                    this.voiceChanged(0);
                this._labScore.text = this._data.score + "";
                if (this._data.score >= 0) {
                    this._labScore.color = "#ffdd65"
                } else
                    this._labScore.color = "#65ffa3"
                this._labFlower.text = this._data.flowerCout + "";
                this._labName.text = this._data.showname + "";
                this._head.data = this._data;
                this._imgPao.skin = "card/tag_" + this._data.pao + ".png"
                if (this._cardCountUI) {
                    if (this._data.uid == server.uid)
                        this._cardCountUI.count = this._data.handCards.length;
                    else
                        this._cardCountUI.count = this._data.handCardCount;
                }
                if (this._boomCountUI) {
                    this._boomCountUI.count = this._data.boomCount;
                    this.setBoom();
                }
                this.checkMaster();
            }
        }
        else {
            this._imgDisconnect.visible = false;
            this._imgMaster.visible = false;
            this._imgKengzhu.visible = false;
            this._head.data = null;
        }
    }

    private setBoom(): void {
        if (this._boomCountUI) {
            if (BaseGameData.isGameing && this._data && this._data.boomCount > 0)
                this._boomCountUI.visible = true;
            else
                this._boomCountUI.visible = false;
        }
    }

    private setCardCountUI(): void {
        if (this._cardCountUI)
            this._cardCountUI.visible = BaseGameData.isTableStart && !this._imgReady.visible;
    }

    private setReady(): void {
        if (this._data && !GameConfig.IS_MATCH)
            this._imgReady.visible = this._data.isReady;
        else
            this._imgReady.visible = false;
    }

    private onPlayerInfo() {
        if (!GameConfig.IS_BANSHU)
            PlayerInfoCtrl.instance.show(this._data);
    }

    public showDug(score: number): void {
        this._imgDug.source = Laya.loader.getRes(ResourceConfig.DUG_URL + this._imgDugType + score + ".png");
        Laya.Tween.clearTween(this._imgDug);
        this._imgDug.visible = true;
        TweenUtils.get(this._imgDug).to({ alpha: 1 }, 200).delay(1000).to({ alpha: 0 }, 200, null, Laya.Handler.create(this, () => {
            this._imgDug.visible = false;
        }));
    }

    public set pass(value: boolean) {
        if (this._imgPass)
            this._imgPass.visible = value;
    }

    public playChat(info) {
        if (this._chatContent) {
            // let player = BaseGameData.getPlayerDataBySeatid(this._index)
            this._chatContent.init(info, this._index, this._data.seatid)
            this._chatContent.visible = true
        }
    }

    //status 0:停止说话 1:开始说话 2:继续说话 98取消禁言 99禁言
    public voiceChanged(status: number) {
        let player = BaseGameData.getPlayerDataByUid(this._data.uid);
        if (this._chatRecord) {
            if (status == 0) {
                this._chatRecord.visible = false;
                this._chatRecord.ani1.stop();
            }
            else if (status == 1 || status == 2) {
                if (player && !player.isVoiceForbidden && player.uid != server.uid && !player.isOffline) {
                    this._chatRecordCh.visible = false;
                    if (!this._chatRecord.visible) {
                        this._chatRecord.ani1.play(1, true);
                        this._chatRecord.visible = true;
                    }
                }
            }
            else if (status == 99) {
                this._chatRecordCh.visible = true;
                this._chatRecord.visible = false;
                this._chatRecord.ani1.stop();
            }
            else if (status == 98) {
                this._chatRecordCh.visible = false;
            }
        }
    }
}