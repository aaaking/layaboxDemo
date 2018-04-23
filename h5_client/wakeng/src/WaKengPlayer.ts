/*
* @author seacole
* 关牌游戏中玩家UI
*/
class WaKengPlayer extends component.BasePlayer {
    protected view: ui.wakeng.WaKengPlayerViewUI;
    constructor(p) {
        super(p);
    }

    protected init(p): void {
        this._seatid = p.seatid
        this._dir = p.dir || 1
        this.name = "PlayerInGameUI" + this._seatid;
        this.view = new ui.wakeng.WaKengPlayerViewUI()
        this.addChild(this.view)
        this.view._btnSit.on(Laya.Event.CLICK, this, this.onSitTouch);

        this._head = new HeadUI();
        this._head.setLabName({ visible: false });
        this._head.setImageBounds(73, 73)
        this._head.x = 12;
        this._head.y = 12;
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
        EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.setSelfActionPos);
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
        var isChildLeft: boolean;
        if (BaseGameData.maxPlayer == 3) {
            if (dir == 2)
                isChildLeft = true;
        }

        if (dir == 1) {
            this.view._boxBumb.y = -64;
        }
        else {
            this.view._boxBumb.y = 133;
        }

        if (isChildLeft) {
            this.view._imgKengzhu.x = -19;
            this.view._boxCard.x = -46;
            this.view._imgReady.x = -184;
            this.view._imgDug.x = this.view._imgPass.x = -134;
            this.view._imgDug.y = this.view._imgPass.y = 32;
            if (this._chatRecord)
                this._chatRecord.x = this._chatRecordCh.x = -7;
        }
        else {
            this.view._imgKengzhu.x = 63;
            this.view._boxCard.x = 97;
            this.view._imgReady.x = 99;
            if (dir == 1)
                this.setSelfActionPos();
            else {
                this.view._imgDug.x = this.view._imgPass.x = 143;
                this.view._imgDug.y = this.view._imgPass.y = 32;
            }
            if (this._chatRecord)
                this._chatRecord.x = this._chatRecordCh.x = 72;
        }
    }

    private setSelfActionPos(): void {
        if (this.view && this.view.parent && this._dir == 1) {
            var p1: Laya.Point = this.view.globalToLocal(new Laya.Point(Laya.stage.width * 0.5, Laya.stage.height - 214));
            this.view._imgPass.x = p1.x - this.view._imgPass.width * 0.5;
            this.view._imgPass.y = p1.y - this.view._imgPass.height * 0.5;
            this.view._imgDug.x = p1.x - this.view._imgDug.width * 0.5;
            this.view._imgDug.y = p1.y - this.view._imgDug.height * 0.5;
        }
    }

    private hideAll(): void {
        this.view._imgPass.visible = this.view._imgKengzhu.visible = this.view._imgDug.visible = this.view._boxBumb.visible = this.view._boxCard.visible = false;
    }


    protected checkAll(): void {
        this.setBoom();
        this.setReady();
    }

    protected setReady(): void {
        super.setReady();
        if (this.view._imgReady.visible)
            this.hideAll();
    }

    protected checkMaster() {
        if (this._data)
            this.view._imgKengzhu.visible = this._data.seatid == BaseGameData.btnSeatid;
        else
            this.view._imgKengzhu.visible = false;
    }

    protected onDataChange(uid: number): void {
        super.onDataChange(uid);
        if (this._data) {
            this.view._boxCard.visible = this._data.uid != server.uid;
            if (this._data.uid == uid) {
                if (this.view._labCard) {
                    if (this._data.uid == server.uid)
                        this.view._labCard.text = this._data.handCards.length + "";
                    else
                        this.view._labCard.text = this._data.handCardCount + "";
                }
                if (this.view._boxBumb) {
                    this.view._labBumb.text ="×"+ this._data.boomCount+"";
                    this.setBoom();
                }
                this.checkMaster();
            }
        }
        else
            this.view._imgKengzhu.visible = false;
    }

    public showDug(score: number): void {
        this.view._imgDug.skin = ResourceConfig.DUG_URL + score + ".png";
        // waKeng/waKeng_score_10.png
        // wakeng/waKeng_score_10
        Laya.Tween.clearTween(this.view._imgDug);
        this.view._imgDug.visible = true;
        TweenUtils.get(this.view._imgDug).to({ alpha: 1 }, 200).delay(1000).to({ alpha: 0 }, 200, null, Laya.Handler.create(this, () => {
            this.view._imgDug.visible = false;
        }));
    }

    public set pass(value: boolean) {
        this.view._imgPass.visible = value;
        if (value)
            this.setSelfActionPos();
    }

    private setBoom(): void {
        if (this.view._boxBumb) {
            if (BaseGameData.isGameing && this._data && this._data.boomCount > 0)
                this.view._boxBumb.visible = true;
            else
                this.view._boxBumb.visible = false;
        }
    }
}