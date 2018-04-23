/*
* @author seacole
* 扑克游戏基础类;
*/
class BasePokerPage extends TablePage {
    constructor() {
        super();
        this.name = "BasePokerPage";
        this._loadDatas = this._loadDatas.concat([{ url: ResourceConfig.SHEET_POKER_CARD_BIG, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_POKER_CARD_SMALL, type: Laya.Loader.ATLAS },
        { url: ResourceConfig.SHEET_POKER, type: Laya.Loader.ATLAS }, { url: ResourceConfig.SHEET_GAME_END, type: Laya.Loader.ATLAS }]);
    }

    private _moveCardTime: number = 100;
    protected _myHandCardPosiY: number = 546;
    private _myFoldCardPosiY: number = 386;
    private _myFoldCardUpPosiY: number = 347;
    protected _isMouseUpHelped: boolean;

    protected _pokerCon: ui.poker.PokerConUI;
    protected _lastSeatid: number;
    protected _lastPlayCards: Array<number>;
    protected _currentOptSeatid: number;
    protected _helpCards: Array<Array<number>>;
    protected _helpIdx: number;
    protected _selfHandCards: Array<poker.CardBigUI>;
    protected _selfPlayCards: Array<number>;//用来验证出牌是否和自己出牌相同
    protected _selfFoldCards: Array<poker.CardBigUI>;
    protected _rightFoldCards: Array<poker.CardSmallUI>;
    protected _leftFoldCards: Array<poker.CardSmallUI>;
    protected _publicCards: Array<poker.CardSmallUI>;
    protected _sendCards: Array<poker.CardSmallUI>;

    protected init(...params): void {
        super.init.apply(this, params);
        if (!this._pokerCon) {
            this._pokerCon = new ui.poker.PokerConUI();
            this._table.addChild(this._pokerCon);
        }
    }

    protected initEvent(): void {
        super.initEvent();
        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.POKER_SELECTED_CHANGE, this, this.onCheckCanUse);
        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.POKER_OVER_CHANGE, this, this.onCheckMouseOverCards);
        EventManager.instance.registerOnObject(this, this._pokerCon._boxCards, Laya.Event.MOUSE_UP, this, this.onMouseUp);


        EventManager.instance.registerOnObject(this, server, EventNames.GAME_PLAYER_OPT_NTF, this, this.onPlayerOptNtfHandler);
        // EventManager.instance.registerOnObject(this, server, EventNames.GAME_PLAYER_OPT_REP, this, this.onPlayerOptRepHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_CARD_MOVE_NTF, this, this.onCardMoveNtfHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_GAME_END_NTF, this, this.onGameEndNtfHandler);  //
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_SHOW_CARDS_NTF, this, this.onShowCardsNtfHandler);  //
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_RECONNECT_INFO, this, this.onReconnectInfoHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_SHOW_INFO_NTF, this, this.onShowInfoNtfHandler);
        EventManager.instance.registerOnObject(this, server, EventNames.GAME_DETAIL_NTF, this, this.onDetailNtfHandler);
    }

    protected clearData(needCheckIsGameing: boolean = true): void {
        super.clearData(needCheckIsGameing);
        this.removeAll();
    }

    protected removeAll(): void {
        this._lastSeatid = 0;
        this._lastPlayCards = [];
        this._helpCards = [];
        this._helpIdx = 0;
        this._selfPlayCards = [];
        this.removeAllCards();
        poker.GameEndWinCtrl.instance.hide();
        poker.GameEndLoseCtrl.instance.hide();
    }

    protected removeAllCards(): void {
        this.removeSelfHandCards();
        this.removeSelfFoldCards();
        this.removeRightFoldCards();
        this.removeLeftFoldCards();
        this.removePublicCards();
        this.removeSendCards();
    }

    private removeSelfHandCards(): void {
        if (!this._selfHandCards)
            this._selfHandCards = [];
        else {
            while (this._selfHandCards.length) {
                var card: poker.CardUI = this._selfHandCards.pop();
                card.removeSelf();
                poker.CardBigUI.returnCard(card);
            }
        }
    }

    protected removeSelfFoldCards(): void {
        if (!this._selfFoldCards)
            this._selfFoldCards = [];
        else {
            while (this._selfFoldCards.length) {
                var card: poker.CardUI = this._selfFoldCards.pop();
                card.removeSelf();
                poker.CardBigUI.returnCard(card);
            }
        }
    }

    protected removeRightFoldCards(): void {
        if (!this._rightFoldCards)
            this._rightFoldCards = [];
        else {
            while (this._rightFoldCards.length) {
                var card: poker.CardUI = this._rightFoldCards.pop();
                card.removeSelf();
                poker.CardSmallUI.returnCard(card);
            }
        }
    }

    protected removeLeftFoldCards(): void {
        if (!this._leftFoldCards)
            this._leftFoldCards = [];
        else {
            while (this._leftFoldCards.length) {
                var card: poker.CardUI = this._leftFoldCards.pop();
                card.removeSelf();
                poker.CardSmallUI.returnCard(card);
            }
        }
    }

    protected removePublicCards(): void {
        if (!this._publicCards)
            this._publicCards = [];
        else {
            while (this._publicCards.length) {
                var card: poker.CardUI = this._publicCards.pop();
                card.removeSelf();
                poker.CardSmallUI.returnCard(card);
            }
        }
    }

    protected removeSendCards(): void {
        if (!this._sendCards)
            this._sendCards = [];
        else {
            while (this._sendCards.length) {
                var card: poker.CardUI = this._sendCards.pop();
                card.removeSelf();
                poker.CardSmallUI.returnCard(card);
            }
        }
    }

    protected onGameStartNtfHandler(msg: any): void {
        super.onGameStartNtfHandler(msg);
        this.removeAll();
    }

    private _testIdx: number = 10;
    private test(): void {
        //询问黑挖
        Laya.timer.once(300, this, () => {
            this.onPlayerOptNtfHandler({
                seatid: BaseGameData.selfSeatid, timeout: 15, opts: [{ opttype: GameDef.OptType.CALL_SCORE, cards: [0, 4] }]
            });
        });

        //每个人发16张牌
        Laya.timer.once(800, this, () => {
            this.onShowInfoNtfHandler({
                type: GameDef.ShowInfoType.DEAL_CARDS, info: [16, 16, 16]
            });
        });


        //我的手牌
        var cards: Array<number> = [];
        for (var i: number = 0; i < 20; i++) {
            var ran: number = Math.floor(Math.random() * WaKengCardsType.cards.length);
            cards.push(WaKengCardsType.cards[ran]);
            WaKengCardsType.cards.splice(ran, 1);
        }
        cards = [40, 41, 42, 43, 51, 52, 53, 72, 73, 70, 80, 81, 82, 90, 91, 92, 93, 100, 101, 110];
        Laya.timer.once(1300, this, () => {
            this.onCardMoveNtfHandler({
                cards: cards, fromSeatid: 0,
                toSeatid: BaseGameData.selfSeatid, areaid: GameDef.AREA_TYPE.HAND_CARD, opttype: GameDef.OptType.MJ_DEAL, count: 20
            });
        });

        //上家挖1分
        Laya.timer.once(1800, this, () => {
            this.onShowInfoNtfHandler({
                type: GameDef.ShowInfoType.CALL_SCORE, info: [0, 3, 1]
            });
        });

        //询问挖坑
        Laya.timer.once(2300, this, () => {
            this.onPlayerOptNtfHandler({
                seatid: BaseGameData.selfSeatid, timeout: 15, opts: [{ opttype: GameDef.OptType.CALL_SCORE2, cards: [0, 2, 3] }]
            });
        });

        //下家挖3分
        Laya.timer.once(2800, this, () => {
            this.onShowInfoNtfHandler({
                type: GameDef.ShowInfoType.CALL_SCORE, info: [1, 2, 3]
            });
        });

        //公共牌
        Laya.timer.once(3300, this, () => {
            this.onCardMoveNtfHandler({
                cards: [61, 62, 71, 41], fromSeatid: 0,
                toSeatid: BaseGameData.selfSeatid, areaid: GameDef.AREA_TYPE.HAND_CARD, opttype: GameDef.OptType.SHOW_CARDS, count: 4
            });
        });
        // Laya.timer.once(500, this, () => {
        //     this.onCardMoveNtfHandler({
        //         cards: [61, 62, 63, 71], fromSeatid: 0,
        //         toSeatid: BaseGameData.selfSeatid, areaid: GameDef.AREA_TYPE.HAND_CARD, opttype: GameDef.OptType.SHOW_CARDS, count: 4
        //     });
        // });

        //下家出了炸弹
        Laya.timer.once(3800, this, () => {
            this.onCardMoveNtfHandler({
                cards: [60, 61], fromSeatid: 2,//61, 71, 82, 62, 72, 82
                toSeatid: 2, areaid: GameDef.AREA_TYPE.FOLD_CARD, opttype: GameDef.OptType.MJ_DISCARD, count: 3
            });
        });
        Laya.timer.once(4300, this, () => {
            this.onPlayerOptNtfHandler({
                seatid: BaseGameData.selfSeatid, timeout: 15, opts: [{ opttype: GameDef.OptType.MJ_DISCARD, cards: [] }]
            });
        });



        // var playerData: PlayerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
        // playerData.handCards = [40, 41, 42, 43, 51, 52, 53, 61, 62, 63, 71, 72, 73];
        // this.addCards(playerData.handCards);
    }

    protected onCheckCanUse(card: number = 0): void {

    }

    protected onCardMoveNtfHandler(msg: any): void {
        BaseGameData.cardMove(msg);
    }

    protected onShowCardsNtfHandler(msg: any): void {

    }

    /**
     * 发牌动画
     */
    protected sendCards(): void {
        server.startCache();
        if (BaseGameData.selfSeatid)
            this.setMyCards(true);
        else
            this.setVisitCards(true);
        this.sendOthersCards();
        this.sendPublicCards();
        Laya.timer.clear(this, this.stopCache);
        this.timer.once(800, this, this.stopCache);
    }

    private stopCache(): void {
        server.stopCache();
    }

    protected setPublicCards(needTween: boolean, cards: Array<number>): void {
    }

    protected sendPublicCards(): void {
    }

    /**
     * 发边上玩家的牌
     */
    protected sendOthersCards(): void {
        var player: PlayerData;
        var count: number;
        var card: poker.CardSmallUI;
        var scale: number = 1;
        var delay: number;
        var p1: Laya.Point;
        var p2: Laya.Point
        if (BaseGameData.selfSeatid) {
            player = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
            count = player.handCards.length;
        }
        else {
            player = BaseGameData.getPlayerDataBySeatid(1);
            count = player.handCardCount;
        }
        for (var i: number = 0; i < count * 2; i++) {
            card = poker.CardSmallUI.borrowCard() as poker.CardSmallUI;
            card.init(false, { scaleX: 1, scaleY: 1, visible: false });
            card.pos(this._pokerCon.width * 0.5, this._pokerCon.height * 0.5);
            card.card = 0;
            delay = Math.floor(i * 0.5) * 30 + 10 * (i % 2 + 1);
            if (i % 2 == 0)
                p1 = PlayerManager.instance._players[BaseGameData.nextSeatId].localToGlobal(new Laya.Point(card.width * scale * 0.5, card.height * scale * 0.5));
            else
                p1 = PlayerManager.instance._players[BaseGameData.preSeatId].localToGlobal(new Laya.Point(card.width * scale * 0.5, card.height * scale * 0.5));
            p2 = this._pokerCon._boxCards.globalToLocal(p1);
            this._sendCards.push(card);
            this._pokerCon.addChild(card);
            card.move({ x: p2.x, y: p2.y }, true, true, true, this._moveCardTime, (endCard: poker.CardSmallUI) => {
                endCard.removeSelf();
                poker.CardSmallUI.returnCard(endCard);
            }, this, [card], delay);
        }
    }

    private onSendEnd(card: poker.CardSmallUI): void {
        card.removeSelf();
        poker.CardSmallUI.returnCard(card);
    }

    protected setVisitCards(isSendCards: boolean = false): void {
        var player = BaseGameData.getPlayerDataBySeatid(1);
        var card: poker.CardBigUI;
        for (var i: number = 0; i < player.handCardCount; i++) {
            if (this._selfHandCards.length > i) {
                card = this._selfHandCards[i];
                card.card = 0;
            }
            else {
                card = poker.CardBigUI.borrowCard();
                card.init(false, { scaleX: 1, scaleY: 1, visible: false });
                card.card = 0;
                card.pos(this._pokerCon.width * 0.5, this._pokerCon.height * 0.5);
                this._selfHandCards.push(card);
                this._pokerCon._boxCards.addChild(card);
            }
        }
        this.layoutMyHandCards(isSendCards ? true : false, isSendCards);
    }

    /**
     * 设置我的手牌
     * @param isSendCards 是否是一开始的发牌
     */
    protected setMyCards(isSendCards: boolean = false): void {
        var player = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
        var cards: Array<number> = player.handCards;
        var card: poker.CardBigUI;
        for (var i: number = 0; i < cards.length; i++) {
            if (this._selfHandCards.length > i) {
                card = this._selfHandCards[i];
                card.card = cards[i];
            }
            else {
                card = poker.CardBigUI.borrowCard();
                card.init(true, { scaleX: 1, scaleY: 1, visible: false });
                card.card = cards[i];
                card.pos(this._pokerCon.width * 0.5, this._pokerCon.height * 0.5);
                this._selfHandCards.push(card);
                this._pokerCon._boxCards.addChild(card);
            }
        }

        this.layoutMyHandCards(isSendCards ? true : false, isSendCards);
    }

    protected layoutMyHandCards(needTween: boolean, isSendCards: boolean = false): void {
        // return;
        var dis: number = (AppControl.getInstance().stage.width - 280) / this._selfHandCards.length;
        if (dis > 50)
            dis = 50;
        var centerX: number = this._pokerCon.width * 0.5;
        var half: number = Math.ceil(this._selfHandCards.length * 0.5) - 1;
        var pX: number;
        var pY: number;
        var time: number = this._moveCardTime;
        var delay: number = 0;
        for (var i: number = 0; i < this._selfHandCards.length; i++) {
            pX = centerX + dis * (i - half);
            this._selfHandCards[i].selected = false;
            if (isSendCards)
                delay = i * 30;
            this._selfHandCards[i].move({ x: pX, y: AppControl.getInstance().stage.height - 640 + this._myHandCardPosiY, visible: true }, true, false, needTween, time, null, null, null, delay);
            if (i == (this._selfHandCards.length - 1))
                this.setKengZhu(this._selfHandCards[i], BaseGameData.selfSeatid ? BaseGameData.selfSeatid : 1);
            else
                this.setKengZhu(this._selfHandCards[i], -1);
        }
        this.onCheckCanUse();
    }

    protected clearSelectedCards(): void {
        for (var i: number = 0; i < this._selfHandCards.length; i++) {
            this._selfHandCards[i].selected = false;
        }
    }

    private autoDisconnect(cards: Array<number>): void {
        console.warn("not match usecards." + cards + " ; " + this._selfPlayCards);
        server.close();
    }

    protected useVisiterCards(cards: Array<number>, seatid: number, isReconnect: boolean, noAni: boolean = false): void {
        var i: number;

        this.removeSelfFoldCards();
        if (cards.length) {
            this._lastSeatid = BaseGameData.selfSeatid;
            this._lastPlayCards = cards.concat();
            this._lastPlayCards = this._lastPlayCards.reverse();
        }
        else
            PlayerManager.instance._players[1].pass = true;
        var card: poker.CardBigUI;
        for (i = 0; i < cards.length; i++) {
            if (isReconnect) {
                card = poker.CardBigUI.borrowCard();
                card.init(false, { scaleX: 1, scaleY: 1 });
                card.card = cards[i];
            }
            else {
                if (this._selfHandCards.length) {
                    card = this._selfHandCards.shift();
                    card.card = cards[i];
                    this._selfFoldCards.push(card);
                }
            }
            if (i == (cards.length - 1))
                this.setKengZhu(card, seatid);
            else
                this.setKengZhu(card, -1);
        }
        this.layoutMyFoldCards(true, cards, noAni);
        this.layoutMyHandCards(true);
    }

    protected showCardsEffect(cards: Array<number>, x: number, y: number, scale: number, noAni: boolean = false): void {
    }

    protected useSelfCards(cards: Array<number>, needSend: boolean = true, isReconnect: boolean = false, noAni: boolean = false): void {
        var i: number;
        if (this._selfPlayCards.length) {
            if (this._selfPlayCards.length != cards.length) {
                this.autoDisconnect(cards);
                return;
            }
            for (i = 0; i < cards.length; i++) {
                if (cards[i] != this._selfPlayCards[i]) {
                    this.autoDisconnect(cards);
                    return;
                }
            }
        }
        else {
            this.removeSelfFoldCards();
            var player: PlayerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
            if (!isReconnect)
                this.playCardTypeSound(cards, player ? player.sex : 0, this._lastSeatid == 0 || this._lastSeatid == BaseGameData.selfSeatid,noAni);

            if (cards.length) {
                this._lastSeatid = BaseGameData.selfSeatid;
                this._lastPlayCards = cards.concat();
                this._lastPlayCards = this._lastPlayCards.reverse();
            }
            else
                PlayerManager.instance._players[BaseGameData.selfSeatid].pass = true;
            var card: poker.CardBigUI;
            for (i = 0; i < cards.length; i++) {
                card = this.getSelfCardById(cards[i], true);
                //20171221 09:59 修改断线重连情况下，自己上次出的牌不存在的bug
                if (!card && isReconnect) {
                    card = poker.CardBigUI.borrowCard();
                    card.init(false, { scaleX: 1, scaleY: 1 });
                    card.card = cards[i];
                    this._pokerCon._boxCards.addChild(card);
                }
                //--------------------------------------
                if (card) {
                    this._selfFoldCards.push(card);
                }
            }
            this.layoutMyFoldCards(isReconnect ? false : true, cards, noAni);
            this.layoutMyHandCards(true);
            if (needSend) {
                this._selfPlayCards = cards.concat();
                server.playerOptReq({ opttype: GameDef.OptType.MJ_DISCARD, cards: cards });
            }

        }
    }

    private layoutMyFoldCards(needTween: boolean, cards: Array<number> = null, noAni: boolean = false): void {
        if (this._selfFoldCards.length) {
            var dis: number = 33;
            var centerX: number = this._pokerCon.width * 0.5;
            var half: number = Math.ceil(this._selfFoldCards.length * 0.5) - 1;
            if (half > 4)
                half = 4;
            var pX: number;
            var pY: number;
            for (var i: number = 0; i < this._selfFoldCards.length; i++) {
                if (this._selfFoldCards.length > 10) {
                    if (i < 10) {
                        pX = centerX + dis * (i - half);
                        pY = AppControl.getInstance().stage.height - 640 + this._myFoldCardUpPosiY;
                    }
                    else {
                        pX = centerX + dis * (i - 10 - half);
                        pY = AppControl.getInstance().stage.height - 640 + this._myFoldCardPosiY;
                    }
                }
                else {
                    pX = centerX + dis * (i - half);
                    pY = AppControl.getInstance().stage.height - 640 + this._myFoldCardPosiY;
                }
                if (i == (this._selfFoldCards.length - 1))
                    this.setKengZhu(this._selfFoldCards[i], BaseGameData.selfSeatid ? BaseGameData.selfSeatid : 1);
                else
                    this.setKengZhu(this._selfFoldCards[i], -1);
                this._selfFoldCards[i].move({ x: pX, y: pY, scaleX: 0.75, scaleY: 0.75 }, true, true, needTween, this._moveCardTime);
            }
            if (needTween && cards)
                this.showCardsEffect(cards, centerX, pY, 1, noAni);
        }
    }

    protected useCards(seatid: number, cards: Array<number>, isReconnect: boolean, noAni: boolean = false, isShowCard: boolean = false): void {
        var idx: number = Utils.getDir(seatid);
        var player: PlayerData = BaseGameData.getPlayerDataBySeatid(seatid);
        if (!isReconnect && !isShowCard)
            this.playCardTypeSound(cards, player ? player.sex : 0, this._lastSeatid == 0 || this._lastSeatid == seatid,noAni);

        if (cards.length) {
            this._lastSeatid = seatid;
            this._lastPlayCards = cards.concat();
            this._lastPlayCards = this._lastPlayCards.reverse();
        }
        else {
            if (!isShowCard)
                PlayerManager.instance._players[seatid].pass = true;
        }
        if (isShowCard)
            noAni=true;

        if (BaseGameData.maxPlayer == 3) {
            if (idx == 1)
                this.useVisiterCards(cards, seatid, isReconnect, noAni);
            else if (idx == 2)
                this.useRightCards(cards, seatid, isReconnect, noAni);
            else if (idx == 4)
                this.useLeftCards(cards, seatid, isReconnect, noAni);
        }
        else if (BaseGameData.maxPlayer == 2) {
            if (idx == 1)
                this.useVisiterCards(cards, seatid, isReconnect, noAni);
            else if (idx == 3)
                this.useRightCards(cards, seatid, isReconnect, noAni);
        }
    }

    protected useRightCards(cards: Array<number>, seatid: number, isReconnect: boolean, noAni: boolean = false): void {
        this.removeRightFoldCards();
        var card: poker.CardSmallUI;
        for (var i: number = 0; i < cards.length; i++) {
            card = poker.CardSmallUI.borrowCard() as poker.CardSmallUI;
            card.init(false, { scaleX: 1, scaleY: 1, visible: true });
            if (i == (cards.length - 1))
                this.setKengZhu(card, seatid);
            else
                this.setKengZhu(card, -1);
            card.card = cards[i];
            this._rightFoldCards.push(card);
            this._pokerCon._boxCards.addChild(card);
        }
        this.layoutRightCards(true, cards, isReconnect, noAni);
    }

    private layoutRightCards(needTween: boolean, cards: Array<number> = null, isReconnect: boolean = false, noAni: boolean = false): void {
        if (this._rightFoldCards.length) {
            var card: poker.CardSmallUI = this._rightFoldCards[0];
            var dis: number;
            var pX: number;
            var pY: number;
            var scale: number;
            if (this._rightFoldCards.length > 10) {
                dis = 24;
                scale = 0.75;
            }
            else {
                dis = 33;
                scale = 1;
            }
            var right: number = Math.min(1280, this._pokerCon.width * 0.5 + AppControl.getInstance().stage.width * 0.5) - 183 - card.width * scale * 0.5;
            var upY: number = PlayerManager.instance._players[BaseGameData.nextSeatId].y + card.height * scale * 0.5 + 0;//+20
            var downY: number = PlayerManager.instance._players[BaseGameData.nextSeatId].y + card.height * scale * 0.5 + 56;//+76
            var middleY: number = PlayerManager.instance._players[BaseGameData.nextSeatId].y + card.height * scale * 0.5 + 25;
            var p1: Laya.Point = PlayerManager.instance._players[BaseGameData.nextSeatId].localToGlobal(new Laya.Point(card.width * scale * 0.5, card.height * scale * 0.5));
            var p2: Laya.Point = this._pokerCon._boxCards.globalToLocal(p1);
            for (var i: number = 0; i < this._rightFoldCards.length; i++) {
                card = this._rightFoldCards[i];
                card.pos(p2.x, p2.y);
                if (this._rightFoldCards.length > 10) {
                    if (i < 10) {
                        pX = right - (10 - 1 - i) * dis;
                        pY = upY;
                    }
                    else {
                        pX = right - (20 - 1 - i) * dis;
                        pY = downY;
                    }
                }
                else {
                    pX = right - (this._rightFoldCards.length - 1 - i) * dis;
                    pY = middleY;
                }
                card.move({ x: pX, y: pY, scaleX: scale, scaleY: scale }, true, true, needTween, this._moveCardTime);

            }
            if (!isReconnect && needTween && cards) {
                var len: number;
                if (this._rightFoldCards.length > 10)
                    len = 10;
                else
                    len = this._rightFoldCards.length;
                this.showCardsEffect(cards, right - Math.floor(len / 2) * dis, pY, 0.8, noAni);
            }
        }
    }

    protected useLeftCards(cards: Array<number>, seatid: number, isReconnect: boolean, noAni: boolean = false): void {
        this.removeLeftFoldCards();
        var card: poker.CardSmallUI;
        for (var i: number = 0; i < cards.length; i++) {
            card = poker.CardSmallUI.borrowCard() as poker.CardSmallUI;
            card.init(false, { scaleX: 1, scaleY: 1, visible: true });
            if (i == (cards.length - 1))
                this.setKengZhu(card, seatid);
            else
                this.setKengZhu(card, -1);
            card.card = cards[i];
            this._leftFoldCards.push(card);
            this._pokerCon._boxCards.addChild(card);
        }
        this.layoutLeftCards(true, cards, isReconnect, noAni);
    }

    private layoutLeftCards(needTween: boolean, cards: Array<number> = null, isReconnect: boolean = false, noAni: boolean = false): void {
        if (this._leftFoldCards.length) {
            var card: poker.CardSmallUI = this._leftFoldCards[0];
            var dis: number;
            var pX: number;
            var pY: number;
            var scale: number;
            if (this._leftFoldCards.length > 10) {
                dis = 24;
                scale = 0.75;
            }
            else {
                dis = 33;
                scale = 1;
            }
            var left: number = Math.max(0, this._pokerCon.width * 0.5 - AppControl.getInstance().stage.width * 0.5) + 183 + card.width * scale * 0.5;
            var upY: number = PlayerManager.instance._players[BaseGameData.preSeatId].y + card.height * scale * 0.5 + 20;
            var downY: number = PlayerManager.instance._players[BaseGameData.preSeatId].y + card.height * scale * 0.5 + 76;
            var middleY: number = PlayerManager.instance._players[BaseGameData.preSeatId].y + card.height * scale * 0.5 + 25;
            var p1: Laya.Point = PlayerManager.instance._players[BaseGameData.preSeatId].localToGlobal(new Laya.Point(card.width * scale * 0.5, card.height * scale * 0.5));
            var p2: Laya.Point = this._pokerCon._boxCards.globalToLocal(p1);
            for (var i: number = 0; i < this._leftFoldCards.length; i++) {
                card = this._leftFoldCards[i];
                card.pos(p2.x, p2.y);
                if (this._leftFoldCards.length > 10) {
                    if (i < 10) {
                        pX = left + i * dis;
                        pY = upY;
                    }
                    else {
                        pX = left + (i - 10) * dis;
                        pY = downY;
                    }
                }
                else {
                    pX = left + i * dis;
                    pY = middleY;
                }
                card.move({ x: pX, y: pY, scaleX: scale, scaleY: scale }, true, true, needTween, this._moveCardTime);

            }
            if (!isReconnect && needTween && cards) {
                var len: number;
                if (this._leftFoldCards.length > 10)
                    len = 10;
                else
                    len = this._leftFoldCards.length;
                this.showCardsEffect(cards, left + Math.floor(len / 2) * dis, pY, 0.8, noAni);
            }
        }
    }

    protected getSelfCardById(id: number, needDelete: boolean): poker.CardBigUI {
        for (var i: number = 0; i < this._selfHandCards.length; i++) {
            if (this._selfHandCards[i].card == id) {
                if (needDelete)
                    return this._selfHandCards.splice(i, 1)[0];
                else
                    return this._selfHandCards[i];
            }
        }
        return null;
    }

    protected getSelectedCards(): Array<number> {
        var tmp: Array<number> = [];
        for (var i: number = 0; i < this._selfHandCards.length; i++) {
            if (this._selfHandCards[i].selected)
                tmp.push(this._selfHandCards[i].card);
        }
        tmp.sort(WaKengCardsType.onSort);
        return tmp;
    }



    protected onTableInfoNtfHandler(msg: any): void {
        // BaseGameData.isGameing = true;
        // msg.maxPlayer = 3;//测试代码
        // msg.playerinfo = [{ "uid": 10066, "seatid": 1, "status": 1 }, { "uid": 10002, "seatid": 2, "status": 1 }, { "uid": 10003, "seatid": 3, "status": 1 }];
        super.onTableInfoNtfHandler(msg);
        // this.test();
    }

    protected onPlayerOptNtfHandler(msg: any): void {

    }

    private onMouseUp(e: Laya.Event): void {

        if (poker.CardUI.mouseDownEndCard && poker.CardUI.mouseDownStartCard && poker.CardUI.mouseDownStartCard != poker.CardUI.mouseDownEndCard) {
            this.onCheckMouseOverCards(false);
            e.stopPropagation();
        }
        else {
            for (var i: number = 0; i < this._selfHandCards.length; i++) {
                this._selfHandCards[i].isOver = false;
            }
        }
        poker.CardUI.clearMouseOver();

    }

    /**
     * 当鼠标滑过手牌时检测
     */
    private onCheckMouseOverCards(isOver: boolean): void {
        var card1: number;
        var card2: number;
        if (poker.CardUI.mouseDownEndCard > poker.CardUI.mouseDownStartCard) {
            card1 = poker.CardUI.mouseDownEndCard;
            card2 = poker.CardUI.mouseDownStartCard;
        }
        else {
            card1 = poker.CardUI.mouseDownStartCard;
            card2 = poker.CardUI.mouseDownEndCard;
        }
        var overCards: Array<number> = [];
        for (var i: number = 0; i < this._selfHandCards.length; i++) {
            if (this._selfHandCards[i].card >= card2 && this._selfHandCards[i].card <= card1) {
                if (isOver)
                    this._selfHandCards[i].isOver = true;
                else
                    this._selfHandCards[i].isOver = false;
                overCards.push(this._selfHandCards[i].card);
            }
            else
                this._selfHandCards[i].isOver = false;
        }
        if (!isOver)
            this.onMouseOverHelp(overCards);
    }

    protected onMouseOverHelp(overCards: Array<number>): void {

    }

    protected setKengZhu(card: poker.CardUI, seatid: number): void {
    }

    protected onReconnectInfoHandler(msg: any): void {
        super.onReconnectInfoHandler(msg);
    }

    protected playCardTypeSound(cards: Array<number>, sex: number, isFirstSend: boolean,noAni:boolean): void {

    }
    
    protected onPlayerReadyNtfHandler(msg: any): void {
        super.onPlayerReadyNtfHandler(msg);
        if (msg.seatid == BaseGameData.selfSeatid) {
            this.removeAllCards();
        }
    }

    // protected layoutChild(): void {
    //     EventManager.instance.enableOnObject(this);
    //     this.onResize(null);
    // }

    private _scale: number;
    protected onResize(e: Laya.Event): void {
        super.onResize(e);
        log("onResize:" + Laya.stage.width / Laya.stage.height);
        if (!this._scale || Laya.stage.width / Laya.stage.height != this._scale) {
            if (!this._scale)
                this._scale = Laya.stage.width / Laya.stage.height
            if (Laya.stage.width / Laya.stage.height < 8 / 5) {
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
                AppControl.getInstance().stage.width = 1024;

            } else {
                Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
                AppControl.getInstance().stage.height = 640;
            }
            this._scale = Laya.stage.width / Laya.stage.height;
            Laya.stage.setScreenSize(Laya.Browser.clientWidth * Laya.Browser.pixelRatio, Laya.Browser.clientHeight * Laya.Browser.pixelRatio);

        }

        this.layoutMyHandCards(false);
        this.layoutMyFoldCards(false);
        this.layoutRightCards(false);
        this.layoutLeftCards(false);
        this.removeSendCards();
    }

}