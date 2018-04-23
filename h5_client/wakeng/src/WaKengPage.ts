/*
* @author seacole
* 挖坑;
*/
class WaKengPage extends BasePokerPage {
    constructor() {
        super();
        this.name = "WaKengPage";
        this._loadDatas = this._loadDatas.concat([{ url: "res/config/wakeng.json", type: Laya.Loader.JSON }, { url: ResourceConfig.SHEET_WAKENG, type: Laya.Loader.ATLAS }, { url: ResourceConfig.BITMAP_FONT_WAKENG2_JSON, type: Laya.Loader.JSON },
        { url: ResourceConfig.BITMAP_FONT_WAKENG2_PNG, type: Laya.Loader.IMAGE }, { url: ResourceConfig.BITMAP_FONT_WAKENG3_JSON, type: Laya.Loader.JSON },
        { url: ResourceConfig.BITMAP_FONT_WAKENG3_PNG, type: Laya.Loader.IMAGE }, { url: ResourceConfig.SHEET_EFFECT_BOOM, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_EFFECT_SHUANGSHUN, type: Laya.Loader.ATLAS }, { url: ResourceConfig.BITMAP_FONT_GUANPAI1_JSON, type: Laya.Loader.JSON },
        { url: ResourceConfig.BITMAP_FONT_GUANPAI1_PNG, type: Laya.Loader.IMAGE }, { url: ResourceConfig.SHEET_WAKENG_CHAT, type: Laya.Loader.ATLAS }]);
        AppPage.register(WaKengPage, this._loadDatas);
    }
    private btnTypeHide: number = -1;
    private btnTypeBlackDug: number = 1;
    private btnTypeNormalDug: number = 2;
    private btnTypeDiscard: number = 3;


    private _clock: poker.Clock;
    private _ui: ui.wakeng.WaKengUI;
    private _clockSeat: number;
    private _logo: Laya.Image;
    protected init(...params): void {
        Utils.injectProp(GameConfig.cfgAudio, Laya.loader.getRes("res/config/wakeng.json"))
        BaseGameData.tablelayout = WaKengLayOut;
        super.init.apply(this, params);

        if (!this._ui) {
            this._ui = new ui.wakeng.WaKengUI();
            this._pokerCon.addChild(this._ui);



            // this._logo = new Laya.Image();
            // this._logo.source = Laya.Loader.getRes(ResourceConfig.WAKENG_LOGO);
            // this._logo.centerX = 0;
            // this._logo.y = 240;
            // this._table.addChildAt(this._logo, 1);




            this._ui._imgNoCard.y = this._myHandCardPosiY - 20;
            this._ui._imgNoCard.visible = false;
            //闹钟
            this._clock = new poker.Clock();
            this._ui.addChild(this._clock);
        }
        PlayerManager.instance.registerClass(WaKengPlayer);
        this.btnType = this.btnTypeHide;
        this.setClock(null);
        this.initEvent();
        if (BaseGameData.isRecord) {
            this.removeSeatViews()
            this.initSeatViews()
            this.PlaySheet()
        }
    }

    protected initEvent(): void {
        super.initEvent();

        EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.MOUSE_UP, this, this.onStageDoubleTouch);
        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.TIME_CHANGE, this, this.onTimeChange);
        EventManager.instance.registerOnObject(this, this._ui._btnDiscard, Laya.Event.CLICK, this, this.onOperationTouch);
        EventManager.instance.registerOnObject(this, this._ui._btnPass, Laya.Event.CLICK, this, this.onOperationTouch);
        EventManager.instance.registerOnObject(this, this._ui._btnTips, Laya.Event.CLICK, this, this.onOperationTouch);
        EventManager.instance.registerOnObject(this, this._ui._btnBlackDug, Laya.Event.CLICK, this, this.onOperationTouch);
        EventManager.instance.registerOnObject(this, this._ui._btnBlackNotDug, Laya.Event.CLICK, this, this.onOperationTouch);
        EventManager.instance.registerOnObject(this, this._ui._btnNotDug, Laya.Event.CLICK, this, this.onOperationTouch);
        EventManager.instance.registerOnObject(this, this._ui._btnDug1, Laya.Event.CLICK, this, this.onOperationTouch);
        EventManager.instance.registerOnObject(this, this._ui._btnDug2, Laya.Event.CLICK, this, this.onOperationTouch);
        EventManager.instance.registerOnObject(this, this._ui._btnDug3, Laya.Event.CLICK, this, this.onOperationTouch);
        EventManager.instance.registerOnObject(this, server, "game.updateTable", this, this.updateTable);
    }

    protected clearData(needCheckIsGameing: boolean = true): void {
        super.clearData(needCheckIsGameing);
        if (this._ui)
            this._ui._imgNoCard.visible = false;
        WaKengGameData.waKengHasBlackDug = false;
        WaKengGameData.waKengHasBoom = false;
        WaKengGameData.waKengBoomMultiply = false;

        this._clockSeat = 0;
        if (this._ui && this._ui._labMultiple)
            this._ui._labMultiple.text = "";
        this.setClock(null);
    }

    private set btnType(value: number) {
        if (!this._ui)
            return;
        if (value == this.btnTypeHide) {
            this._ui._btnDiscard.visible = false;
            this._ui._btnPass.visible = false;
            this._ui._btnTips.visible = false;
            this._ui._btnBlackDug.visible = false;
            this._ui._btnBlackNotDug.visible = false;
            this._ui._btnNotDug.visible = false;
            this._ui._btnDug1.visible = false;
            this._ui._btnDug2.visible = false;
            this._ui._btnDug3.visible = false;

        }
        else if (value == this.btnTypeDiscard) {
            this._ui._btnDiscard.visible = true;
            this._ui._btnPass.visible = true;
            this._ui._btnTips.visible = true;
            this._ui._btnBlackDug.visible = false;
            this._ui._btnBlackNotDug.visible = false;
            this._ui._btnNotDug.visible = false;
            this._ui._btnDug1.visible = false;
            this._ui._btnDug2.visible = false;
            this._ui._btnDug3.visible = false;
        }
        else if (value == this.btnTypeBlackDug) {
            this._ui._btnDiscard.visible = false;
            this._ui._btnPass.visible = false;
            this._ui._btnTips.visible = false;
            this._ui._btnBlackDug.visible = true;
            this._ui._btnBlackNotDug.visible = true;
            this._ui._btnNotDug.visible = false;
            this._ui._btnDug1.visible = false;
            this._ui._btnDug2.visible = false;
            this._ui._btnDug3.visible = false;
        }
        else if (value == this.btnTypeNormalDug) {
            this._ui._btnDiscard.visible = false;
            this._ui._btnPass.visible = false;
            this._ui._btnTips.visible = false;
            this._ui._btnBlackDug.visible = false;
            this._ui._btnBlackNotDug.visible = false;
            this._ui._btnNotDug.visible = true;
            this._ui._btnDug1.visible = true;
            this._ui._btnDug2.visible = true;
            this._ui._btnDug3.visible = true;
        }
        this.setClock(null);
    }

    /**
    * 显示房号等信息
    */
    protected setTableInfo(): void {
        // this._tablePop._labInfo.text = "";
        super.setTableInfo();
        this._ui._labRoom.text = StringUtils.format(GameConfig.language.room_id, BaseGameData.tableid);
        this._ui._labCount.text = StringUtils.format(GameConfig.language.hand_count, BaseGameData.currHandCount ? BaseGameData.currHandCount : 1, BaseGameData.totalHandCount);
        this.onTimeChange();
    }

    private onTimeChange(): void {
        this._ui._labTime.text = TimeUtils.getSystemTimeHM(true);
    }

    protected onPlayerOptNtfHandler(msg: any): void {
        if (msg.opts && msg.opts.length) {
            this._clockSeat = 0;
            this._currentOptSeatid = msg.seatid;
            //黑挖
            if (msg.opts[0].opttype == GameDef.OptType.CALL_SCORE) {
                if (BaseGameData.selfSeatid && msg.seatid == BaseGameData.selfSeatid) {
                    this.btnType = this.btnTypeBlackDug;
                    this.setClock(msg.timeout ? msg.timeout : 1, { centerX: 0, bottom: this._ui._btnBlackDug.bottom });
                }
                else {
                    this.btnType = this.btnTypeHide;
                    this.setOthersClock(msg.seatid, msg.timeout);
                }
            }
            //普通挖
            else if (msg.opts[0].opttype == GameDef.OptType.CALL_SCORE2) {
                if (BaseGameData.selfSeatid && msg.seatid == BaseGameData.selfSeatid) {
                    this.btnType = this.btnTypeNormalDug;
                    this._ui._btnDug1.disabled = false;
                    this._ui._btnDug2.disabled = false;
                    this._ui._btnDug3.disabled = false;
                    if (msg.opts[0].cards.length <= 2) {
                        this._ui._btnDug1.disabled = true;
                        this._ui._btnDug2.disabled = true;
                    }
                    else if (msg.opts[0].cards.length == 3)
                        this._ui._btnDug1.disabled = true;
                    this.setClock(msg.timeout ? msg.timeout : 1, { centerX: 0, bottom: this._ui._btnNotDug.bottom + 95 });
                }
                else {
                    this.btnType = this.btnTypeHide;
                    this.setOthersClock(msg.seatid, msg.timeout);
                }
            }
            //出牌
            else if (msg.opts[0].opttype == GameDef.OptType.MJ_DISCARD) {
                this._ui._imgNoCard.visible = false;
                for (i = 0; i < this._selfHandCards.length; i++) {
                    var card: poker.CardUI = this._selfHandCards[i];
                    card.isMask = false;
                }
                //新的一轮出牌时，清场
                if (this._lastSeatid == msg.seatid) {
                    this._lastSeatid = 0;
                    this._lastPlayCards = [];
                    this.removeSelfFoldCards();
                    this.removeLeftFoldCards();
                    this.removeRightFoldCards();
                    for (var i: number = 1; i < PlayerManager.instance._players.length; i++) {
                        PlayerManager.instance._players.pass = false;
                    }
                }
                //自己出牌
                if (BaseGameData.selfSeatid && msg.seatid == BaseGameData.selfSeatid) {
                    this._isMouseUpHelped = false;
                    this._selfPlayCards = [];
                    this.btnType = this.btnTypeDiscard;
                    this.removeSelfFoldCards();
                    PlayerManager.instance._players[BaseGameData.selfSeatid].pass = false;
                    this.getHelper();
                    this.onCheckCanUse();
                    this.setClock(msg.timeout ? msg.timeout : 1, { centerX: -98, bottom: this._ui._btnNotDug.bottom });
                    //自己第一个出牌
                    if (this._lastPlayCards.length == 0 || this._lastSeatid == BaseGameData.selfSeatid) {
                        this._ui._btnPass.disabled = true;
                        this._ui._btnTips.disabled = true;
                        this._ui._btnTips.visible = true;
                        this._ui._btnDiscard.visible = true;
                        this._ui._btnPass.centerX = -256;
                    }
                    else {
                        this._ui._btnPass.disabled = false;
                        this._ui._btnTips.disabled = false;
                        //有大过上家的牌
                        if (this._helpCards && this._helpCards.length) {
                            this._ui._btnTips.visible = true;
                            this._ui._btnDiscard.visible = true;
                            this._ui._btnPass.centerX = -256;
                        }
                        else {
                            this._ui._btnTips.visible = false;
                            this._ui._btnDiscard.visible = false;
                            this._ui._btnPass.centerX = 58;
                            this._ui._imgNoCard.visible = true;
                            for (i = 0; i < this._selfHandCards.length; i++) {
                                var card: poker.CardUI = this._selfHandCards[i];
                                card.isMask = true;
                            }
                        }
                    }
                }
                else {
                    this.btnType = this.btnTypeHide;
                    this.setOthersClock(msg.seatid, msg.timeout);
                    var index: number = Utils.getDir(msg.seatid);
                    if (index) {
                        PlayerManager.instance._players[msg.seatid].pass = false;
                        if (BaseGameData.maxPlayer == 3) {
                            if (index == 1)
                                this.removeSelfFoldCards();
                            else if (index == 2)
                                this.removeRightFoldCards();
                            else if (index == 4)
                                this.removeLeftFoldCards();
                        }
                    }
                }
            }
        }
    }

    private onStageDoubleTouch(e: Laya.Event): void {
        if (e.target == this._pokerCon._boxCards) {
            this.clearSelectedCards();
            this.canUse = false;

            // this.playCardTypeSound([41],1);
            // this.onDetailNtfHandler({"detailType":1,"playerInfo":[{"seatid":1,"info":[{"name":1},{"name":2},{"name":3,"value":6}]},{"seatid":2,"info":[{"name":1,"value":16},{"name":2},{"name":3,"value":-3}]},{"seatid":3,"info":[{"name":1,"value":16},{"name":2},{"name":3,"value":-3}]}]});

            // BaseGameData.clearPlayData();
            // this.removeAll();
            // BaseGameData.selfSeatid=1;
            // BaseGameData.maxPlayer=3;
            // var cards: Array<number> = [];
            // for (var i: number = 0; i < 20; i++) {
            //     var ran: number = Math.floor(Math.random() * WaKengCardsType.cards.length);
            //     cards.push(WaKengCardsType.cards[ran]);
            //     WaKengCardsType.cards.splice(ran, 1);
            // }
            // cards = [40, 41, 42, 43, 51, 61, 60, 71, 73, 70, 80, 81, 82, 90, 91, 92, 93, 100, 101, 110];

            //     this.onCardMoveNtfHandler({
            //         cards: cards, fromSeatid: 0,
            //         toSeatid: BaseGameData.selfSeatid, areaid: GameDef.AREA_TYPE.HAND_CARD, opttype: GameDef.OptType.MJ_DEAL, count: 20
            //     });


            // // this.showCardsEffect([61,62,63,60]);
            // this.onCardMoveNtfHandler({
            //     cards: [60,61,70,71,81,82], fromSeatid: 2,//61, 71, 82, 62, 72, 82
            //     toSeatid: 2, areaid: GameDef.AREA_TYPE.FOLD_CARD, opttype: GameDef.OptType.MJ_DISCARD, count: 3
            // });
        }
    }

    private onOperationTouch(e: Laya.Event): void {
        var callScore: number = -1;
        switch (e.currentTarget) {
            case this._ui._btnDiscard:
                this.onBtnDiscard();
                break;

            case this._ui._btnPass:
                server.playerOptReq({ opttype: GameDef.OptType.MJ_DISCARD, cards: [] })
                // this.useLeftCards([40, 41, 42, 43, 51, 52, 53, 61, 62, 63, 71, 72, 73]);
                // this.useRightCards([40, 41, 42, 43, 51, 52, 53, 61, 62, 63, 71, 72, 73]);
                break;

            case this._ui._btnTips:
                this.onHelp();
                break;

            case this._ui._btnBlackNotDug:
            case this._ui._btnNotDug:
                callScore = 0;
                break;

            case this._ui._btnBlackDug:
                callScore = 4;
                break;

            case this._ui._btnDug1:
                callScore = 1;
                break;

            case this._ui._btnDug2:
                callScore = 2;
                break;

            case this._ui._btnDug3:
                callScore = 3;
                break;
        }
        if (callScore != -1)
            this.callScore(callScore);
    }

    private callScore(value: number): void {
        server.playerOptReq({ opttype: GameDef.OptType.CALL_SCORE, cards: [value] })
        this.btnType = this.btnTypeHide;
    }

    /**
    * 使用卡牌按钮点击
    */
    private onBtnDiscard(): void {
        this.btnType = this.btnTypeHide;
        var selectCards: Array<number> = this.getSelectedCards();
        this.useSelfCards(selectCards);
    }

    /**
     * 提示
     */
    private onHelp(): void {
        if (this._helpCards && this._helpCards.length) {
            var helpCards: Array<number> = this._helpCards[this._helpIdx];
            this.autoSelectCards(helpCards);
            this.canUse = true;
            this._helpIdx++;
            if (this._helpIdx >= this._helpCards.length)
                this._helpIdx = 0;
        }
    }

    /**
     * 根据提示或单张牌的选取自动选择卡牌
     */
    private autoSelectCards(helpCards: Array<number>): void {
        this.clearSelectedCards();
        for (var i: number = 0; i < helpCards.length; i++) {
            var card: poker.CardUI = this.getSelfCardById(helpCards[i], false);
            if (card)
                card.selected = true;
        }
    }

    /**
     * 检查当前能否能出牌
     */
    protected onCheckCanUse(card: number = 0): void {
        if (BaseGameData.selfSeatid && this._currentOptSeatid == BaseGameData.selfSeatid && this._ui._btnDiscard.visible) {
            var selectCards: Array<number> = this.getSelectedCards();
            // if (selectCards)
            //     SoundManager.instance.playEffect("touch_card_p", 0);
            var flag: boolean;
            //单张牌和两张牌立起时检测自动选取
            if (card && (selectCards.length == 1 || selectCards.length == 2)) {
                var playerData: PlayerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
                var autoSelectedCards: Array<number>;
                //单张牌立起时检测自动选取
                if (selectCards.length == 1)
                    autoSelectedCards = WaKengCardsType.getAutoSelectedCardsByOneCard(this._helpCards, playerData.handCards, card);
                //两张牌立起时检测自动选取
                else if (selectCards.length == 2) {
                    //自己出牌
                    if (this._lastPlayCards.length == 0 || this._lastSeatid == BaseGameData.selfSeatid)
                        autoSelectedCards = WaKengCardsType.getAutoSelectedCardsByTwoCards(selectCards, playerData.handCards);
                }
                if (autoSelectedCards) {
                    this.autoSelectCards(autoSelectedCards);
                    selectCards = this.getSelectedCards();
                    flag = true;
                    this.canUse = true;
                }
            }
            if (!flag) {
                var myCardType: number = WaKengCardsType.getType(selectCards);
                //自己出牌
                if (this._lastPlayCards.length == 0 || this._lastSeatid == BaseGameData.selfSeatid)
                    this.canUse = myCardType > 0;
                //别人出牌，需要接大过他的牌
                else
                    this.canUse = WaKengCardsType.checkCanUse(this._lastPlayCards, selectCards);
            }
        }
    }

    /**
     * 获取所有提示中可选的牌
     */
    protected getHelper(): void {
        var playerData: PlayerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
        this._helpIdx = 0;
        this._helpCards = WaKengCardsType.getHelper(this._lastPlayCards, playerData.handCards);
    }

    /**
     * 出牌按钮是否亮
     */
    private set canUse(value: boolean) {
        if (this._ui._btnDiscard)
            this._ui._btnDiscard.disabled = !value;
    }

    /**
     * 拖拽选择智能选取
     */
    protected onMouseOverHelp(overCards: Array<number>): void {
        var i: number;
        var tmpArr: Array<number>;
        for (i = 0; i < overCards.length; i++) {
            var card: poker.CardUI = this.getSelfCardById(overCards[i], false);
            card.isOver = false;
        }
        //自己出牌
        if (this._currentOptSeatid == BaseGameData.selfSeatid) {
            //第一手出牌
            if (this._lastPlayCards.length == 0 || this._lastSeatid == BaseGameData.selfSeatid) {
                tmpArr = WaKengCardsType.getDragHelp(overCards);
                if (!this._isMouseUpHelped && tmpArr && tmpArr.length) {
                    this._isMouseUpHelped = true;
                    for (i = 0; i < this._selfHandCards.length; i++) {
                        this._selfHandCards[i].selected = false;
                    }
                    for (i = 0; i < tmpArr.length; i++) {
                        var card: poker.CardUI = this.getSelfCardById(tmpArr[i], false);
                        card.selected = true;
                    }
                }
                //选中拖取选中的牌
                else
                    this.reverseCardSelected(overCards);
            }
            //选中拖取选中的牌
            else
                this.reverseCardSelected(overCards);
        }
        //选中拖取选中的牌
        else
            this.reverseCardSelected(overCards);
        this.onCheckCanUse();
        SoundManager.instance.playEffect("touch_card_p", 0);
    }

    //反选卡牌
    private reverseCardSelected(overCards: Array<number>): void {
        var i: number;
        for (i = 0; i < overCards.length; i++) {
            var card: poker.CardUI = this.getSelfCardById(overCards[i], false);
            card.selected = !card.selected;
        }
    }

    protected onShowInfoNtfHandler(msg: any): void {
        var i: number;
        var playerData: PlayerData;
        var player: guanpai.GuanPaiPlayer;
        var index: number;
        //通知当前是几倍
        if (msg.type == GameDef.ShowInfoType.CALL_SCORE) {
            var seatid = msg.info[1];
            var score = msg.info[2];
            //确定叫分
            if (msg.info[0] == 1) {
                this.currentScore = score;
                BaseGameData.setMaster(seatid);
            }
            else {
                player = PlayerManager.instance._players[seatid];
                player.showDug(score);
                this.playDugSound(score, seatid, msg.hasOwnProperty("noAni"));
            }
        }
        //通知每个人发多少牌
        else if (msg.type == GameDef.ShowInfoType.DEAL_CARDS) {
            if (!msg.hasOwnProperty("noAni"))
                SoundManager.instance.playEffect("dealcard", 0);
            BaseGameData.setHandCardCount(msg);
            if (!BaseGameData.selfSeatid) {
                if (msg.hasOwnProperty("noAni"))
                    this.setVisitCards();
                else
                    this.sendCards();
            }
        }
    }

    private set currentScore(value: number) {
        if (this._ui && this._ui._labMultiple) {
            WaKengGameData.waKengCallScore = value;
            if (value) {
                this._ui._labMultiple.visible = true;
                this._ui._labMultiple.text = "×" + value;

            }
            else {
                this._ui._labMultiple.text = "";
                this._ui._labMultiple.visible = false;
            }

        }

    }

    private setOthersClock(seatid: number, timeout: number): void {
        this._clockSeat = seatid;
        this.setClock(timeout ? timeout : 1);
        this.layoutClock();
    }

    private layoutClock(): void {
        if (this._clockSeat && this._clock.visible) {
            var index: number = Utils.getDir(this._clockSeat);
            if (index) {
                var player: guanpai.GuanPaiPlayer = PlayerManager.instance._players[this._clockSeat];
                var p1: Laya.Point = player.localToGlobal(new Laya.Point(0, 0));
                var p2: Laya.Point = this._ui.globalToLocal(p1);
                this._clock.bottom = NaN;
                if (BaseGameData.maxPlayer == 3) {
                    this._clock.centerX = NaN;
                    if (index == 1 || index == 4) {
                        this._clock.x = p2.x + 138;
                        this._clock.y = p2.y + 16;
                    }
                    else {
                        this._clock.x = p2.x - 130;
                        this._clock.y = p2.y + 16;
                    }
                }
            }
        }
    }

    private setClock(value: number, pos: any = null): void {
        if (this._clock) {
            if (value) {
                this._clock.visible = true;
                this._clock.centerX = NaN;
                if (pos)
                    Utils.injectProp(this._clock, pos);
                this._clock.time = value;
            }
            else {
                this._clock.stop();
                this._clock.visible = false;
            }
        }
    }

    protected onCardMoveNtfHandler(msg: any): void {
        super.onCardMoveNtfHandler(msg);
        if (msg.cards)
            msg.cards.sort(WaKengCardsType.onSort);

        var playerData: PlayerData;
        if (msg.areaid == GameDef.AREA_TYPE.FOLD_CARD && msg.opttype != GameDef.OptType.RECONNECT) {
            if (WaKengCardsType.getType(msg.cards) == WaKengCardsType.ZHADAN && WaKengGameData.waKengHasBoom) {
                let seatInfo = BaseGameData.getPlayerDataBySeatid(msg.toSeatid);
                seatInfo.boomCount++;
                Dispatcher.dispatch(EventNames.PLAYER_DATA_CHANGED, seatInfo.uid);
            }
        }


        //公牌
        if (msg.opttype == GameDef.OptType.SHOW_CARDS) {
            if (msg.areaid == GameDef.AREA_TYPE.HAND_CARD) {
                if (msg.hasOwnProperty("noAni"))
                    this.setPublicCards(false, msg.cards.concat());
                else
                    this.setPublicCards(true, msg.cards.concat());
                if (BaseGameData.selfSeatid) {
                    if (msg.toSeatid == BaseGameData.selfSeatid) {
                        playerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
                        playerData.sortHandCards();
                        this.setMyCards();
                    }
                }
                else {
                    if (msg.toSeatid == 1)
                        this.setVisitCards();
                }
            }
            //断线重连
            else
                this.setPublicCards(false, msg.cards.concat());
        }
        //手牌
        else if (msg.opttype == GameDef.OptType.MJ_DEAL) {
            //我在桌子上
            if (BaseGameData.selfSeatid && BaseGameData.selfSeatid == msg.toSeatid) {
                playerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
                playerData.sortHandCards();
                if (msg.hasOwnProperty("noAni"))
                    this.setMyCards();
                else
                    this.sendCards();
            }
        }
        //出牌
        else if (msg.opttype == GameDef.OptType.MJ_DISCARD || msg.opttype == GameDef.OptType.RECONNECT) {
            if (!msg.hasOwnProperty("noAni"))
                msg.noAni = false;
            this.setClock(null);
            if (msg.fromSeatid == BaseGameData.selfSeatid) {
                this.useSelfCards(msg.cards, false, msg.opttype == GameDef.OptType.RECONNECT, msg.noAni);
            }
            else
                this.useCards(msg.fromSeatid, msg.cards, msg.opttype == GameDef.OptType.RECONNECT, msg.noAni);
        }

        // //我在桌子上
        // if (BaseGameData.selfSeatid) {
        //     var playerData: PlayerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
        //     if (msg.opttype == GameDef.OptType.MJ_DEAL || msg.opttype == GameDef.OptType.SHOW_CARDS) {
        //         playerData.sortHandCards();
        //         this.setMyCards();
        //     }
        //     else if (msg.opttype == GameDef.OptType.MJ_DISCARD) {
        //         if (msg.from_seatid == BaseGameData.selfSeatid) {

        //         }
        //         else
        //             this.useCards(msg.fromSeatid, msg.cards);
        //     }
        // }
    }

    protected showCardsEffect(cards: Array<number>, x: number, y: number, scale: number, noAni: boolean = false): void {
        if (!noAni) {
            var type: number = WaKengCardsType.getType(cards);
            var middle: number;
            var offsetY = -303;
            switch (type) {
                case WaKengCardsType.ZHADAN:
                    if (WaKengGameData.waKengHasBoom) {
                        poker.EffectBoom.instance.show(this._pokerCon);
                    }
                    break;
                case WaKengCardsType.DANSHUN:
                    var effectDauShun: poker.EffectDanShun = poker.EffectDanShun.borrow();
                    effectDauShun.pos(x - 480 * scale, y + offsetY * scale);
                    this._pokerCon.addChild(effectDauShun);
                    effectDauShun.play(scale);
                    break;
                case WaKengCardsType.SHUANGSHUN:
                    var effectShuangShun: poker.EffectShuangShun = poker.EffectShuangShun.borrow();
                    effectShuangShun.pos(x - 480 * scale, y + offsetY * scale);
                    this._pokerCon.addChild(effectShuangShun);
                    effectShuangShun.play(scale);
                    break;
            }
        }
    }

    protected onShowCardsNtfHandler(msg: any): void {
        super.onShowCardsNtfHandler(msg);
        this.btnType = this.btnTypeHide;
        this.setClock(null);
        for (var i: number = 0; i < msg.showncards.length; i++) {
            var seatid: number = msg.showncards[i].seatid;
            var cards: Array<number> = msg.showncards[i].handcards;
            cards.sort(WaKengCardsType.onSort);
            if (seatid == BaseGameData.selfSeatid) {

            }
            else
                this.useCards(seatid, cards, false, false, true);
        }
    }

    protected sendPublicCards(delay: number = 500): void {
        if (!this._publicCards.length) {
            this.removePublicCards();
            var card: poker.CardSmallUI;
            var dis: number = 63;
            var centerX: number = this._pokerCon.width * 0.5;
            var half: number = 1.5;
            var pX: number;
            for (var i: number = 0; i < 4; i++) {
                card = poker.CardSmallUI.borrowCard() as poker.CardSmallUI;
                card.init(false, { scaleX: 0.7, scaleY: 0.7, visible: false });
                card.pos(this._pokerCon.width * 0.5, this._pokerCon.height * 0.5);
                card.card = 0;
                this._publicCards.push(card);
                this._ui.addChild(card);

                pX = centerX + dis * (i - half);
                card.move({ x: pX, y: 70 + this._publicCards[i].height * this._publicCards[i].scaleX * 0.5 }, true, true, true, 100, null, null, null, delay);
            }
        }
    }

    protected setPublicCards(needTween: boolean, cards: Array<number>): void {
        // this.removePublicCards();
        //黑挖
        if (needTween && !this._publicCards.length) {
            this.sendPublicCards(0);
            Laya.timer.once(200, this, this.layoutPublicCards, [needTween, cards]);
        }
        else {
            var card: poker.CardSmallUI;
            for (var i: number = 0; i < cards.length; i++) {
                if (this._publicCards.length > i)
                    card = this._publicCards[i];
                else {
                    card = poker.CardSmallUI.borrowCard() as poker.CardSmallUI;
                    card.init(false, { scaleX: 0.7, scaleY: 0.7 });
                    card.card = cards[i];
                    this._publicCards.push(card);
                    this._ui.addChild(card);
                }
            }
            this.layoutPublicCards(needTween, cards);
        }
    }

    private layoutPublicCards(needTween: boolean, cards: Array<number> = null): void {
        Laya.timer.clear(this, this.layoutPublicCards);
        var dis: number = 28;
        var centerX: number = this._pokerCon.width * 0.5 - 16;
        var half: number = Math.ceil(this._publicCards.length * 0.5) - 1;
        var pX: number;
        var pY: number;
        for (var i: number = 0; i < this._publicCards.length; i++) {
            pX = centerX + dis * (i - half);
            pY = 10 + this._publicCards[i].height * this._publicCards[i].scaleX * 0.5;
            if (cards)
                this._publicCards[i].move({ x: pX, y: pY }, true, false, needTween, 150, (card: poker.CardSmallUI, cardNum: number) => {
                    card.card = cardNum;
                }, this, [this._publicCards[i], cards[i]]);
            else
                this._publicCards[i].move({ x: pX, y: pY }, true, false, needTween);
        }
    }

    protected onReconnectInfoHandler(msg: any): void {
        super.onReconnectInfoHandler(msg);
        this.setTableInfo();
        this.currentScore = msg.leftCard;
        var playerData: PlayerData;
        //我在桌子上
        if (BaseGameData.selfSeatid) {
            playerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
            playerData.sortHandCards();
            this.setMyCards();
        }
        else
            this.setVisitCards();
        // for (var i: number = 1; i < this._playerUis.length; i++) {
        //     this._playerUis[i].checkIsGameing(true);
        // }

        if (!BaseGameData.isGameing)
            this.removeAllCards();
    }

    protected removeAll(): void {
        super.removeAll();
        for (var i: number = 1; i <= BaseGameData.players.length; i++) {
            var player: PlayerData = BaseGameData.getPlayerDataBySeatid(i);
            if (player)
                player.boomCount = 0;
        }
        this.btnType = this.btnTypeHide;
        this.setClock(null);
        this.currentScore = 0;
    }

    protected onGameEndNtfHandler(msg: any): void {
        super.onGameEndNtfHandler(msg);
    }

    protected onDetailNtfHandler(msg: any): void {
        // DetailNtf {"detailType":101,"playerInfo":[{"info":[{"name":1,"value":1},{"name":2},{"name":3,"value":3}]}]}//黑挖 炸弹 炸弹倍数
        super.onDetailNtfHandler(msg);
        var i: number;
        var players: Array<any> = msg.playerInfo;
        //挖坑结算信息
        if (msg.detailType == 100) {
            var isWin: boolean;
            for (i = 0; i < players.length; i++) {
                var player: PlayerData = BaseGameData.getPlayerDataBySeatid(players[i].seatid);
                if (player) {
                    players[i].uid = player.uid;
                    players[i].nickname = player.nickname;
                }
                else
                    players[i].nickname = "";
                if (BaseGameData.selfSeatid) {
                    if (players[i].seatid == BaseGameData.selfSeatid)
                        isWin = players[i].info[2].value >= 0;
                }
                else {
                    if (players[i].seatid == 1)
                        isWin = players[i].info[2].value >= 0;
                }
            }
            players.sort((a: any, b: any): number => {
                if (a.seatid < b.seatid)
                    return -1;
                else
                    return 1
            })
            if (isWin)
                poker.GameEndWinCtrl.instance.show(msg);
            else
                poker.GameEndLoseCtrl.instance.show(msg);
        }
        else if (msg.detailType == 101) {
            this.currentScore = 0;
            for (i = 0; i < players[0].info.length; i++) {
                //code
                if (players[0].info[i].name == 1) {
                    if (players[0].info[i].hasOwnProperty("value"))
                        BaseGameData.tableid = players[0].info[i].value;
                }
                //max_hand_count
                else if (players[0].info[i].name == 2) {
                    if (players[0].info[i].hasOwnProperty("value"))
                        BaseGameData.totalHandCount = players[0].info[i].value;
                }
                //黑挖
                else if (players[0].info[i].name == 3) {
                    if (players[0].info[i].hasOwnProperty("value") && players[0].info[i].value == 1)
                        WaKengGameData.waKengHasBlackDug = true;
                }
                //炸弹
                else if (players[0].info[i].name == 4) {
                    if (players[0].info[i].hasOwnProperty("value") && players[0].info[i].value == 1)
                        WaKengGameData.waKengHasBoom = true;
                }
                //炸弹倍数
                else if (players[0].info[i].name == 5) {
                    if (players[0].info[i].hasOwnProperty("value"))
                        WaKengGameData.waKengBoomMultiply = players[0].info[i].value;
                }
            }
            this._ui._labRule.text = WaKengGameData.getGameRule();
            this.setTableInfo();
        }
    }

    protected setKengZhu(card: poker.CardUI, seatid: number): void {
        card.isMaster = seatid == BaseGameData.btnSeatid;
    }

    protected playCardTypeSound(cards: Array<number>, sex: number, isFirstSend: boolean, noAni: boolean): void {
        if (noAni)
            return;
        var ran: number = 100;
        if (cards.length) {
            if (!isFirstSend)
                ran = Math.floor(Math.random() * 100);
            var type: number = WaKengCardsType.getType(cards);
            if (type == WaKengCardsType.ZHADAN && WaKengGameData.waKengHasBoom)
                ran = 100;

            if (ran > 50) {
                switch (type) {
                    case WaKengCardsType.DAN:
                        SoundManager.instance.playEffect("one" + Math.floor(cards[0] / 10), sex);
                        break;
                    case WaKengCardsType.DUIZI:
                        SoundManager.instance.playEffect("dui" + Math.floor(cards[0] / 10), sex);
                        break;
                    case WaKengCardsType.SANZHANG:
                        SoundManager.instance.playEffect("sanzhang", sex);
                        break;
                    case WaKengCardsType.ZHADAN:
                        if (WaKengGameData.waKengHasBoom)
                            SoundManager.instance.playEffect("bomb", 0);
                        else
                            SoundManager.instance.playEffect("sizhang", sex);
                        break;
                    case WaKengCardsType.DANSHUN:
                        SoundManager.instance.playEffect("shunzi", sex);
                        break;
                    case WaKengCardsType.SHUANGSHUN:
                        SoundManager.instance.playEffect("lianshun", sex);
                        break;
                }
            }
            else if (ran > 20 && ran <= 50) {
                SoundManager.instance.playEffect("ya1", sex);
                SoundManager.instance.playEffect("outcard", 0);
            }
            else {
                SoundManager.instance.playEffect("ya2", sex);
                SoundManager.instance.playEffect("outcard", 0);
            }
        }
        else {
            ran = Math.floor(Math.random() * 100);
            if (ran > 75)
                SoundManager.instance.playEffect("pass_guo", sex);
            else
                SoundManager.instance.playEffect("pass0", sex);

        }
    }

    private playDugSound(score: number, seatid: number, noAni: boolean): void {
        if (noAni)
            return;
        var player: PlayerData = BaseGameData.getPlayerDataBySeatid(seatid);
        var sex: number = player ? player.sex : 0;
        if (score == 0)
            SoundManager.instance.playEffect("buwa", sex);
        else if (score == 1)
            SoundManager.instance.playEffect("1wa", sex);
        else if (score == 2)
            SoundManager.instance.playEffect("2wa", sex);
        else if (score == 3)
            SoundManager.instance.playEffect("3wa", sex);
        else if (score == 1)
            SoundManager.instance.playEffect("heiwa", sex);
    }

    protected onResize(e: Laya.Event): void {
        super.onResize(e);
        this.layoutPublicCards(false);
        Laya.timer.callLater(this, this.layoutClock);
    }

    protected updateTable() {
        // this.removePublicCards();        
    }
}