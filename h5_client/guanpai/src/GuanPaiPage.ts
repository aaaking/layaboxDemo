/**
* name 
*/
class GuanPaiPage extends BasePokerPage {
	constructor() {
		super();
		this.name = "GuanPaiPage";
		this._loadDatas = this._loadDatas.concat([{ url: "res/config/guanpai.json", type: Laya.Loader.JSON }, { url: ResourceConfig.SHEET_GUANPAI, type: Laya.Loader.ATLAS }, { url: ResourceConfig.BITMAP_FONT_GUANPAI1_JSON, type: Laya.Loader.JSON },
		{ url: ResourceConfig.BITMAP_FONT_GUANPAI1_PNG, type: Laya.Loader.IMAGE }, { url: ResourceConfig.SHEET_EFFECT_BOOM, type: Laya.Loader.ATLAS },
		{ url: ResourceConfig.SHEET_EFFECT_SHUANGSHUN, type: Laya.Loader.ATLAS },
		{ url: ResourceConfig.SHEET_GUANPAI_CHAT, type: Laya.Loader.ATLAS }, { url: ResourceConfig.BG_GUANPAI, type: Laya.Loader.IMAGE }]);
		AppPage.register(GuanPaiPage, this._loadDatas);
	}
	private btnTypeHide: number = -1;
	private btnTypeCall: number = 1;
	private btnTypeDiscard: number = 2;

	private _clock: GuanPaiClock;
	private _ui: ui.guanpai.GuanPaiUI;
	private _clockSeat: number;
	private _logo: Laya.Image;
	protected init(...params): void {
		Utils.injectProp(GameConfig.cfgAudio, Laya.loader.getRes("res/config/guanpai.json"))
		BaseGameData.tablelayout = GuanPaiLayOut;
		super.init.apply(this, params);

		if (!this._ui) {
			this._ui = new ui.guanpai.GuanPaiUI();
			this._pokerCon.addChild(this._ui);
			this._table._bg.skin = ResourceConfig.BG_GUANPAI;

			PlayerManager.instance.registerClass(guanpai.GuanPaiPlayer);

			// this._logo = new Laya.Image();
			// this._logo.source = Laya.Loader.getRes(ResourceConfig.WAKENG_LOGO);
			// this._logo.centerX = 0;
			// this._logo.y = 240;
			// this._table.addChildAt(this._logo, 1);

			this._ui._imgNoCard.y = this._myHandCardPosiY - 20;
			this._ui._imgNoCard.visible = false;
			//闹钟
			this._clock = new GuanPaiClock();
			this._ui.addChild(this._clock);
		}
		this.btnType = this.btnTypeHide;
		this._ui._labMultiple.text = "";

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

		EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.DOUBLE_CLICK, this, this.onStageDoubleTouch);
		EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.TIME_CHANGE, this, this.onTimeChange);
		EventManager.instance.registerOnObject(this, this._ui._btnDiscard, Laya.Event.CLICK, this, this.onOperationTouch);
		EventManager.instance.registerOnObject(this, this._ui._btnPass, Laya.Event.CLICK, this, this.onOperationTouch);
		EventManager.instance.registerOnObject(this, this._ui._btnTips, Laya.Event.CLICK, this, this.onOperationTouch);
		EventManager.instance.registerOnObject(this, this._ui._btnCall, Laya.Event.CLICK, this, this.onOperationTouch);
		EventManager.instance.registerOnObject(this, this._ui._btnNotCall, Laya.Event.CLICK, this, this.onOperationTouch);
		EventManager.instance.registerOnObject(this, server, "game.updateTable", this, this.updateTable);
	}

	protected clearData(needCheckIsGameing: boolean = true): void {
		super.clearData(needCheckIsGameing);
		if (this._ui)
			this._ui._imgNoCard.visible = false;
		this._clockSeat = 0;
		this.setClock(null);
	}



	private set btnType(value: number) {
		if (!this._ui)
			return;
		if (value == this.btnTypeHide) {
			this._ui._btnDiscard.visible = false;
			this._ui._btnPass.visible = false;
			this._ui._btnTips.visible = false;
			this._ui._btnCall.visible = false;
			this._ui._btnNotCall.visible = false;
			this._ui._imgCall.visible = false;
			this._ui._imgWaitCall.visible = false;
		}
		else if (value == this.btnTypeDiscard) {
			this._ui._btnDiscard.visible = true;
			this._ui._btnPass.visible = true;
			this._ui._btnTips.visible = true;
			this._ui._btnCall.visible = false;
			this._ui._btnNotCall.visible = false;
			this._ui._imgCall.visible = false;
			this._ui._imgWaitCall.visible = false;
		}
		else if (value == this.btnTypeCall) {
			this._ui._btnDiscard.visible = false;
			this._ui._btnPass.visible = false;
			this._ui._btnTips.visible = false;
			this._ui._btnCall.visible = true;
			this._ui._btnNotCall.visible = true;
			this._ui._imgCall.visible = true;
			this._ui._imgWaitCall.visible = false;
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
					this.btnType = this.btnTypeCall;
					this.setClock(msg.timeout ? msg.timeout : 1, { centerX: 0, bottom: this._ui._btnCall.bottom });
				}
				else {
					this.btnType = this.btnTypeHide;
					this._ui._imgWaitCall.visible = true;
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
						PlayerManager.instance._players[i].pass = false;
					}
				}
				//自己出牌
				if (BaseGameData.selfSeatid && msg.seatid == BaseGameData.selfSeatid) {
					if (msg.opts[0].hasOwnProperty("cards"))
						guanpai.GuanPaiGameData.firstCard = msg.opts[0].cards[0];
					else
						guanpai.GuanPaiGameData.firstCard = 0;
					this._isMouseUpHelped = false;
					this._selfPlayCards = [];
					this.btnType = this.btnTypeDiscard;
					this.removeSelfFoldCards();
					PlayerManager.instance._players[BaseGameData.selfSeatid].pass = false;
					this.getHelper();
					this.onCheckCanUse();
					this.setClock(msg.timeout ? msg.timeout : 1, { centerX: -98, bottom: this._ui._btnDiscard.bottom });
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
							if (guanpai.GuanPaiGameData.isMustPress)
								this._ui._btnPass.disabled = true;
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
						else if (BaseGameData.maxPlayer == 2) {
							if (index == 1)
								this.removeSelfFoldCards();
							else if (index == 3)
								this.removeRightFoldCards();
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
			//     var ran: number = Math.floor(Math.random() * guanpai.GuanPaiCardsType.cards.length);
			//     cards.push(guanpai.GuanPaiCardsType.cards[ran]);
			//     guanpai.GuanPaiCardsType.cards.splice(ran, 1);
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
				// this.showCardsEffect([83,31,41,53,80,82,90,91,93,100],0,0,1);
				server.playerOptReq({ opttype: GameDef.OptType.MJ_DISCARD, cards: [] })
				// this.useLeftCards([40, 41, 42, 43, 51, 52, 53, 61, 62, 63, 71, 72, 73]);
				// this.useRightCards([40, 41, 42, 43, 51, 52, 53, 61, 62, 63, 71, 72, 73]);
				break;

			case this._ui._btnTips:
				this.onHelp();
				break;

			case this._ui._btnNotCall:
				callScore = 0;
				break;

			case this._ui._btnCall:
				callScore = 1;
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
			if (selectCards)
				SoundManager.instance.playEffect("touch_card_p", 0);
			var flag: boolean;
			var playerData: PlayerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
			//单张牌和两张牌立起时检测自动选取
			if (card && (selectCards.length == 1 || selectCards.length == 2)) {
				var autoSelectedCards: Array<number>;
				//单张牌立起时检测自动选取
				if (selectCards.length == 1)
					autoSelectedCards = guanpai.GuanPaiCardsType.getAutoSelectedCardsByOneCard(this._helpCards, playerData.handCards, card);
				//两张牌立起时检测自动选取
				else if (selectCards.length == 2) {
					//自己出牌
					if (this._lastPlayCards.length == 0 || this._lastSeatid == BaseGameData.selfSeatid)
						autoSelectedCards = guanpai.GuanPaiCardsType.getAutoSelectedCardsByTwoCards(selectCards, playerData.handCards);
				}
				if (autoSelectedCards) {
					this.autoSelectCards(autoSelectedCards);
					selectCards = this.getSelectedCards();
					flag = true;
					this.canUse = true;
				}
			}
			if (!flag) {
				var myCardTmp: Array<number> = guanpai.GuanPaiCardsType.getType(selectCards, guanpai.GuanPaiGameData.isBoomAAA, playerData.handCards.length);
				var myCardType: number = myCardTmp[0];
				//自己出牌
				if (this._lastPlayCards.length == 0 || this._lastSeatid == BaseGameData.selfSeatid) {
					if (myCardType > 0) {
						if (guanpai.GuanPaiGameData.firstCard)
							this.canUse = selectCards.indexOf(guanpai.GuanPaiGameData.firstCard) != -1;
						else
							this.canUse = true;
					}
					else
						this.canUse = false;
				}
				//别人出牌，需要接大过他的牌
				else
					this.canUse = guanpai.GuanPaiCardsType.checkCanUse(this._lastPlayCards, selectCards, guanpai.GuanPaiGameData.isBoomAAA, playerData.handCards.length, this._helpCards);
			}
		}
	}

	/**
	 * 获取所有提示中可选的牌
	 */
	protected getHelper(): void {
		var playerData: PlayerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
		this._helpIdx = 0;
		this._helpCards = guanpai.GuanPaiCardsType.getHelper(this._lastPlayCards, playerData.handCards, guanpai.GuanPaiGameData.isBoomAAA);
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
				var playerData: PlayerData = BaseGameData.getPlayerDataBySeatid(BaseGameData.selfSeatid);
				tmpArr = guanpai.GuanPaiCardsType.getDragHelp(overCards, playerData.handCards.length);
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
				BaseGameData.setMaster(seatid);
				this.currentScore = 1;
				this.layoutMyHandCards(false);
			}
			else {
				player = PlayerManager.instance._players[seatid];
				player.showDug(score);
				this.playDugSound(score, seatid);
			}
		}
		//通知每个人发多少牌
		else if (msg.type == GameDef.ShowInfoType.DEAL_CARDS) {
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

	private checkMultiple(): void {

	}

	private set currentScore(value: number) {
		if (!this._ui)
			return;
		if (value) {
			if (BaseGameData.btnSeatid)
				this._ui._labMultiple.text = "×2";
			else
				this._ui._labMultiple.text = "×1";
		}
		else
			this._ui._labMultiple.text = "×1";
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
				else if (BaseGameData.maxPlayer == 2) {
					this._clock.centerX = NaN;
					if (index == 1) {
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
			msg.cards.sort(guanpai.GuanPaiCardsType.onSort);

		var playerData: PlayerData;
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
			if (BaseGameData.selfSeatid) {
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
			var tmp: Array<number> = guanpai.GuanPaiCardsType.getType(cards, guanpai.GuanPaiGameData.isBoomAAA, cards.length);
			var type: number = tmp[0];
			var middle: number;
			var offsetY=-303;
			switch (type) {
				case guanpai.GuanPaiCardsType.ZHADAN:
					poker.EffectBoom.instance.show(this._pokerCon);
					break;
				case guanpai.GuanPaiCardsType.FEIJI:
					poker.EffectFeiji.instance.show(this._pokerCon);
					break;
				case guanpai.GuanPaiCardsType.DANSHUN:
					var effectDauShun: poker.EffectDanShun = poker.EffectDanShun.borrow();
					effectDauShun.pos(x - 480 * scale, y + offsetY * scale);
					this._pokerCon.addChild(effectDauShun);
					effectDauShun.play(scale);
					break;
				case guanpai.GuanPaiCardsType.SHUANGSHUN:
					var effectShuangShun: poker.EffectShuangShun = poker.EffectShuangShun.borrow();
					effectShuangShun.pos(x - 480 * scale, y + offsetY * scale);
					this._pokerCon.addChild(effectShuangShun);
					effectShuangShun.play(scale);
					break;
				case guanpai.GuanPaiCardsType.SIDAISAN:
					var effectSiDaiSan: poker.EffectSiDaiSan = poker.EffectSiDaiSan.borrow();
					effectSiDaiSan.pos(x - 480 * scale, y + offsetY * scale);
					this._pokerCon.addChild(effectSiDaiSan);
					effectSiDaiSan.play(scale);
					break;
				case guanpai.GuanPaiCardsType.SANDAIER:
					var effectSanDaiEr: poker.EffectSanDaiEr = poker.EffectSanDaiEr.borrow();
					effectSanDaiEr.pos(x - 480 * scale, y + offsetY * scale);
					this._pokerCon.addChild(effectSanDaiEr);
					effectSanDaiEr.play(scale);
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
			cards.sort(guanpai.GuanPaiCardsType.onSort);
			if (seatid == BaseGameData.selfSeatid) {

			}
			else
				this.useCards(seatid, cards, false, false, true);
		}
	}

	protected onReconnectInfoHandler(msg: any): void {
		super.onReconnectInfoHandler(msg);
		this.setTableInfo();
		this.currentScore = 1;
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
		// 	this._playerUis[i].checkIsGameing(true);
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
				players[i].info[0].value = players[i].info[0].value ? players[i].info[0].value : 0;
				if (BaseGameData.selfSeatid) {
					if (players[i].seatid == BaseGameData.selfSeatid)
						isWin = players[i].info[4].value == players[i].seatid;
				}
				else {
					if (players[i].seatid == 1)
						isWin = players[i].info[4].value == players[i].seatid;
				}
				players[i].othersCards = [];
				for (var j: number = 0; j < players.length; j++) {
					if (j != i)
						players[i].othersCards.push(players[j].info[0].value);
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
				else if (players[0].info[i].name == 3) {
					if (players[0].info[i].hasOwnProperty("value") && players[0].info[i].value == 1)
						guanpai.GuanPaiGameData.isBoomReward = true;
					else
						guanpai.GuanPaiGameData.isBoomReward = false;
				}
				else if (players[0].info[i].name == 4) {
					if (players[0].info[i].hasOwnProperty("value") && players[0].info[i].value == 1)
						guanpai.GuanPaiGameData.isCallScore = true;
					else
						guanpai.GuanPaiGameData.isCallScore = false;
				}
				else if (players[0].info[i].name == 5) {
					if (players[0].info[i].hasOwnProperty("value"))
						guanpai.GuanPaiGameData.maxCards = players[0].info[i].value;
					else
						guanpai.GuanPaiGameData.maxCards = 0;
				}
				else if (players[0].info[i].name == 6) {
					if (players[0].info[i].hasOwnProperty("value") && players[0].info[i].value == 1)
						guanpai.GuanPaiGameData.isBoomAAA = true;
					else
						guanpai.GuanPaiGameData.isBoomAAA = false;
				}
				else if (players[0].info[i].name == 7) {
					if (players[0].info[i].hasOwnProperty("value") && players[0].info[i].value == 1)
						guanpai.GuanPaiGameData.isHideCardCnt = true;
					else
						guanpai.GuanPaiGameData.isHideCardCnt = false;
				}
				else if (players[0].info[i].name == 8) {
					if (players[0].info[i].hasOwnProperty("value") && players[0].info[i].value == 1)
						guanpai.GuanPaiGameData.isMustPress = true;
					else
						guanpai.GuanPaiGameData.isMustPress = false;
				}
				else if (players[0].info[i].name == 9) {
					if (players[0].info[i].hasOwnProperty("value") && players[0].info[i].value == 1)
						guanpai.GuanPaiGameData.isWinerFirst = true;
					else
						guanpai.GuanPaiGameData.isWinerFirst = false;
				}
				this._ui._labRule.text = guanpai.GuanPaiGameData.getGameRule();
			}
			this.setTableInfo();
		}
	}

	protected setKengZhu(card: poker.CardUI, seatid: number): void {
		card.isMaster = seatid == BaseGameData.btnSeatid;
	}

	protected playCardTypeSound(cards: Array<number>, sex: number, isFirstSend: boolean): void {
		var ran: number = 100;
		if (cards.length) {
			if (!isFirstSend)
				ran = Math.floor(Math.random() * 100);
			var tmp: Array<number> = guanpai.GuanPaiCardsType.getType(cards, guanpai.GuanPaiGameData.isBoomAAA, cards.length);
			var type: number = tmp[0];
			if (type == guanpai.GuanPaiCardsType.ZHADAN && BaseGameData.waKengHasBoom)
				ran = 100;

			if (ran > 50) {
				switch (type) {
					case guanpai.GuanPaiCardsType.DAN:
						SoundManager.instance.playEffect("one_" + Math.floor(cards[0] / 10), sex);
						break;
					case guanpai.GuanPaiCardsType.DUIZI:
						SoundManager.instance.playEffect("double_" + Math.floor(cards[0] / 10), sex);
						break;
					case guanpai.GuanPaiCardsType.SIDAISAN:
						SoundManager.instance.playEffect("fourAndThree", sex);
						break;
					case guanpai.GuanPaiCardsType.SANDAIER:
						SoundManager.instance.playEffect("threeAndTwo", sex);
						break;
					case guanpai.GuanPaiCardsType.ZHADAN:
						SoundManager.instance.playEffect("ebomb", sex);
						SoundManager.instance.playEffect("bomb", sex);
						break;
					case guanpai.GuanPaiCardsType.FEIJI:
						SoundManager.instance.playEffect("eplane", sex);
						SoundManager.instance.playEffect("plane", sex);
						break;
					case guanpai.GuanPaiCardsType.DANSHUN:
						SoundManager.instance.playEffect("shunzi", sex);
						break;
					case guanpai.GuanPaiCardsType.SHUANGSHUN:
						SoundManager.instance.playEffect("liandui", sex);
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
			if (ran > 25) {
				if (ran > 62)
					SoundManager.instance.playEffect("pass_1", sex);
				else
					SoundManager.instance.playEffect("pass_2", sex);
			}
			else {
				if (ran > 12)
					SoundManager.instance.playEffect("pass_3", sex);
				else
					SoundManager.instance.playEffect("pass_4", sex);
			}

		}
	}

	private playDugSound(score: number, seatid: number): void {
		var player: PlayerData = BaseGameData.getPlayerDataBySeatid(seatid);
		var sex: number = player ? player.sex : 0;
		if (score == 0)
			SoundManager.instance.playEffect("grab_no", sex);
		else
			SoundManager.instance.playEffect("grab_yes", sex);
		// else if (score == 2)
		// 	SoundManager.instance.playEffect("2wa", sex);
		// else if (score == 3)
		// 	SoundManager.instance.playEffect("3wa", sex);
		// else if (score == 1)
		// 	SoundManager.instance.playEffect("heiwa", sex);
	}

	protected onResize(e: Laya.Event): void {
		super.onResize(e);
		Laya.timer.callLater(this, this.layoutClock);
	}

	protected updateTable() {

		// this.removePublicCards();        
	}
}



