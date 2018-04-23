/*
* @author seacole
* 关牌游戏中玩家UI
*/
module guanpai {
    export class GuanPaiPlayer extends component.BasePlayer {
        protected view: ui.guanpai.GuanPaiPlayerViewUI;
        constructor(p) {
            super(p);
        }

        protected init(p): void {
            this._seatid = p.seatid
            this._dir = p.dir || 1
            this.name = "PlayerInGameUI" + this._seatid;
            this.view = new ui.guanpai.GuanPaiPlayerViewUI()
            this.addChild(this.view)
            this.view._btnSit.on(Laya.Event.CLICK, this, this.onSitTouch);

            this._head = new HeadUI();
            this._head.setLabName({ visible: false });
            this._head.setImageBounds(73, 73)
            this._head.x = 8;
            this._head.y = 7;

            this.view._box.addChildAt(this._head, 1);
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
            this.hideAll();
        }

        public set dir(value: number) {
            this._dir = value;
            this.setChildPos(value);
            if (this._chatContent) {
                this._chatContent.popleft = GameDef.CHAT_POS[BaseGameData.maxPlayer - 1][this._dir - 1]
                if (this._chatRecord)
                    this._chatRecord.visible = this._chatRecordCh.visible = false;
            }
        }

        /**
         * 1左2右
         */
        protected setChildPos(dir: number): void {
            var isChildLeft:boolean;
            if (BaseGameData.maxPlayer==2){
                if (dir==3)
                    isChildLeft=true;
            }
            else if (BaseGameData.maxPlayer==3){
                if (dir==2)
                    isChildLeft=true;
            }
            if (isChildLeft) {
                this.view._imgMaster.x = -11;
                this.view._imgWarn.x = -58;
                this.view._boxCard.x = -46;
                this.view._imgReady.x = -184;
                this.view._imgNotGrab.x = this.view._imgPass.x = -134;
            }
            else {
                this.view._imgMaster.x = 70;
                this.view._imgWarn.x = 89;
                this.view._boxCard.x = 97;
                this.view._imgReady.x = 99;
                this.view._imgNotGrab.x = this.view._imgPass.x = 143;
            }
        }

        private hideAll(): void {
            this.view._imgPass.visible = this.view._imgNotGrab.visible = this.view._boxMultiple.visible = this.view._imgMaster.visible = this.view._imgWarn.visible = this.view._boxCard.visible = false;
        }

        public showDug(score: number): void {
            Laya.Tween.clearTween(this.view._imgNotGrab);
            if (score == 0) {
                this.view._imgNotGrab.visible = true;
                TweenUtils.get(this.view._imgNotGrab).to({ alpha: 1 }, 200).delay(1000).to({ alpha: 0 }, 200, null, Laya.Handler.create(this, () => {
                    this.view._imgNotGrab.visible = false;
                }));
            }
        }

        public set pass(value: boolean) {
            if (this.view._imgPass)
                this.view._imgPass.visible = value;
        }

        protected checkAll(): void {
            this.setReady();
        }

         protected setReady(): void {
            super.setReady();
            if (this.view._imgReady.visible)
                this.hideAll();
        }

        protected checkMaster() {
            if (this._data)
                this.view._imgMaster.visible =  this._data.seatid == BaseGameData.btnSeatid;//this.view._boxMultiple.visible =
            else
                this.view._imgMaster.visible = false;
        }

        protected onDataChange(uid: number): void {
            super.onDataChange(uid);
            if (this._data) {
                this.view._boxCard.visible = true;
                if (this._data.uid == uid) {
                    if (GuanPaiGameData.isHideCardCnt) {
                        if (this._data.uid == server.uid)
                            this.view._labCard.text = this._data.handCards.length + "";
                        else
                            this.view._labCard.text = "";
                    }
                    else {
                        if (this._data.uid == server.uid)
                            this.view._labCard.text = this._data.handCards.length + "";
                        else
                            this.view._labCard.text = this._data.handCardCount + "";
                    }
                    this.view._imgWarn.visible = this._data.handCardCount == 1;
                }
            }
        }
    }
}