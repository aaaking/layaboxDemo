module component {

    export class BasePlayer extends laya.ui.View {
        protected view;
        protected _seatid
        protected _dir

        protected _head: HeadUI;
        protected _chatContent: ChatContent
        protected _chatRecord: ui.components.chat.ChatRecordUI
        protected _chatRecordCh: Laya.Image;

        public static STATUS_EMPTY: number = 1;//空位
        public static STATUS_CAN_SIT: number = 2;//可以坐下
        public static STATUS_ALREADY_SIT: number = 3;//已经坐下



        private _status: number;
        protected _data: PlayerData;
        private _isCurrentLayoutInGame: boolean;
        constructor(p) {
            super();
            this.init(p);

        }

        protected init(p): void {
            this._seatid = p.seatid
            this._dir = p.dir || 1
            this.name = "PlayerInGameUI" + this._seatid;
            this.view = new ui.components.table.PlayerViewUI()
            this.addChild(this.view)
            this.view._btnSit.on(Laya.Event.CLICK, this, this.onSitTouch);

            this._head = new HeadUI();
            this._head.setLabName({ visible: false });
            this._head.setImageBounds(74, 74)
            this._head.x = 12;
            this._head.y = 12;
            this._head._labName.fontSize = 18
            this.view._box.addChildAt(this._head,1);
            this._chatContent = new ChatContent()
            this._chatContent.visible = false
            this.view._box.addChild(this._chatContent)
            this._chatContent.pos(-70, -7)
            this.view._box.on(Laya.Event.CLICK, this, this.onPlayerInfo);

            if (Native.instance.isNative) {
                this._chatRecord = new ui.components.chat.ChatRecordUI();
                this._chatRecord.y = 73;
                this._chatRecord.visible = false;
                this.view._box.addChild(this._chatRecord)

                this._chatRecordCh = new Laya.Image("table/table_chat_record.png");
                this._chatRecordCh.y = 73;
                this.view._box.addChild(this._chatRecordCh)
            }
            // Dispatcher.on(EventNames.PLAYER_DATA_CHANGED, this.view, this.test)
            EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.PLAYER_DATA_CHANGED, this, this.onDataChange);
            this.initView(p)
        }


        protected initView(p) {


        }

        public set dir(value: number) {
            this._dir = value;
            switch (this._dir) {
                case 1:
                    this.setChildPos(1, 2);
                    break;
                case 2:
                    this.setChildPos(2, 1);
                    break;

                case 3:
                    this.setChildPos(1, 2);
                    break;

                case 4:
                    this.setChildPos(1, 2);
                    break;
            }

            if (this._chatContent) {
                this._chatContent.popleft = GameDef.CHAT_POS[BaseGameData.maxPlayer - 1][this._dir - 1]
                if (this._chatRecord)
                    this._chatRecord.visible = this._chatRecordCh.visible = false;

            }
        }

        /**
         * 1左2右
         */
        protected setChildPos(master: number, ready: number): void {
            if (master == 1)
                this.view._imgMaster.x = -13;
            else if (master == 2)
                this.view._imgMaster.x = 77;
            if (ready == 1) {
                this.view._imgReady.x = -176;
                if (this._chatRecord)
                    this._chatRecord.x = this._chatRecordCh.x = -7;
            }

            else if (ready == 2) {
                this.view._imgReady.x = 122;
                if (this._chatRecord)
                    this._chatRecord.x = this._chatRecordCh.x = 72;
            }


        }

        private addListener(): void {
            EventManager.instance.enableOnObject(this);
        }

        private removeListener(): void {
            EventManager.instance.disableOnObject(this);
        }

        public set status(value: number) {
            if (this._status != value) {
                this._status = value;
                this.view._imgEmpty.visible = this._status == PlayerInGameUI.STATUS_EMPTY;
                this.view._btnSit.visible = this._status == PlayerInGameUI.STATUS_CAN_SIT;
                this.view._box.visible = this._status == PlayerInGameUI.STATUS_ALREADY_SIT;
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

        // public checkIsGameing(isFirstLayout: boolean = false): void {

        //     this.checkAll();

        //     if (!isFirstLayout && this._isCurrentLayoutInGame == BaseGameData.isGameing)
        //         return;
        //     this._isCurrentLayoutInGame = BaseGameData.isGameing;


        //     var posi: any = PlayerInGamePosiConfig.getPosi(BaseGameData.gameType, this._seatid);
        //     this.setPosi(isFirstLayout, posi);
        // }

        private getMjGameType(): any {

        }

        private setPosi(isFirstLayout: boolean, posi: any): void {
            Utils.injectProp(this, posi);
        }

        public clear(needCheckIsGameing: boolean = true): void {
            this.status = PlayerInGameUI.STATUS_CAN_SIT;
            this._isCurrentLayoutInGame = false;
            this._data = null;
            this._head.data = null;
            this.view._labScore.text = "";
            // if (needCheckIsGameing)
            //     this.checkIsGameing(true);

        }

        protected onSitTouch(): void {
            if (BaseGameData.divide) {
                let text = StringUtils.format(GameConfig.language.sit_down_tip, BaseGameData.divide);
                AlertInGameCtrl.instance.show(text, (type: number) => {
                    if (type == AlertCtrl.CONFIRM) {
                        server.sitdownReq(this._seatid)
                    }
                }, 0, true, ResourceConfig.ALERT_TISHI);
            } else {
                server.sitdownReq(this._seatid)
            }
            // server.sitdownReq(this._index);
        }

        public changeToPlayer(){
            if(this._data)
            this._head.getInfo(this._data.uid)
        }

        public set data(value: PlayerData) {
            this._data = value;
            this.onDataChange(this._data.uid);
        }
        protected checkMaster() {

            if (this._data)
                this.view._imgMaster.visible = this._data.seatid == BaseGameData.btnSeatid;
            else
                this.view._imgMaster.visible = false;
        }

        protected checkAll(): void {
            this.setReady();

        }

        protected onDataChange(uid: number): void {
            this.checkAll();

            if (this._data) {
                if (this._data.uid == uid) {
                    this.view._imgDisconnect.visible = this._data.isOffline;
                    this.view._imgLeave.visible = this._data.isLeave;
                    if (this._data.isOffline)
                        this.voiceChanged(0);
                    this.view._labScore.text = this._data.score + "";
                    if (this._data.score >= 0) {
                        this.view._labScore.color = "#ffdd65"
                    } else
                        this.view._labScore.color = "#65ffa3"
                    this.view._labName.text = this._data.showname + "";
                    this._head.data = this._data;


                    this.checkMaster();
                }
            }
            else {
                this.view._imgDisconnect.visible = false;
                if (this.view._imgMaster)
                    this.view._imgMaster.visible = false;
                this._head.data = null;
            }
        }



        protected setReady(): void {
            if (this._data && !GameConfig.IS_MATCH)
                this.view._imgReady.visible = this._data.isReady;
            else
                this.view._imgReady.visible = false;
        }

        protected onPlayerInfo() {
            if (!GameConfig.IS_BANSHU) {
                // PlayerInfoCtrl.instance.show(this._data);
                var dialog = DialogManager.instance.callDialog("PLAYER_INFO")
                dialog.show(this._data)
            }
        }



        public playChat(info) {
            if (this._chatContent) {
                // let player = BaseGameData.getPlayerDataBySeatid(this._index)
                this._chatContent.init(info, this._dir, this._data.seatid)
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
}