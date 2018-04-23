/*
* @author seacole
* 创建比赛;
*/
module matchSign {
	export class MatchSignCreateCtrl extends BaseCtrl {
		constructor() {
			super();
			this["name"] = "MatchSignCreateCtrl";
		}

		private static _instance: MatchSignCreateCtrl;
		public static get instance(): MatchSignCreateCtrl {
			if (!this._instance)
				this._instance = new MatchSignCreateCtrl();
			return this._instance;
		}

		protected _ui: ui.matchSign.MatchSignCreateUI;
		private _keyboard: KeyBoardNumUI;
		private _date: DateUI;
		private _gameType: number;
		private _startTime: number;
		private _inputCount: string;
		private _inputTime: string;
		private _cid: number;
		private _data
		private _paytype: number;
		private _tabBtns;
		private _currentKeyboard: number;

		private _costArr: Array<number> = [1, 2, 3, 4, 5];
		public show(gameType: number, param: any, cid: number = 0, paytype: number = 0): void {
			this._gameType = gameType;
			this._cid = cid;
			this._data = param
			this._paytype = paytype;
			this.showself();
		}

        /**
         * 这里完成new ui，添加注册监听等初始化工作
         */
		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.matchSign.MatchSignCreateUI();
				// this._ui._pan.hScrollBar.visible=false;

				// this._signKind = new MatchSignKind();
				// this._ui.addChild(this._signKind);
				// this._signKind.x = this._ui._btnCreate.x + (this._ui._btnCreate.width - this._signKind.width) * 0.5;
				// this._signKind.bottom = this._ui._btnCreate.bottom + this._ui._btnCreate.height + 10;
				// this._signKind.visible = false;
				EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
				EventManager.instance.registerOnObject(this, this._ui._btnCreate, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._inputName, Laya.Event.INPUT, this, this.onInputChange);

				EventManager.instance.registerOnObject(this, this._ui._box, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnRule, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._imgCount, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._imgDiamond, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._radType, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.KEYBOARD_NUM, this, this.onInputCountChanged)
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.MATCH_RULE_CHANGE, this, this.setRule)
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.MATCH_CREATE_TIME_CHANGE, this, this.removeDate)

				this._ui._panel.vScrollBar.visible = false;
				this._ui._radType.selectHandler = new Laya.Handler(this, this.onSelectRadTypeChange);
				this._ui._inputName.text = StringUtils.format(GameConfig.language.match_name, Utils.getFitNickName(GameLogic.selfData.nickname, 10));

				if (GameLogic.selfData.permit) {
					this._ui._boxRule.y = 455;
					this._ui._inputDiamond.visible = this._ui._imgDiamond.visible = true;
				}
				else {
					this._ui._boxRule.y = 380;
					this._ui._inputDiamond.visible = this._ui._imgDiamond.visible = false;
				}
				// this._ui._tab.selectHandler = new Laya.Handler(this, this.checkTab);
				// this._ui._tab.selectedIndex = 0;
			}


			super.beforeShow();
			this.onShow();
		}

        /**
        * 开启监听，配置宽高，添加到舞台
        */
		public onShow(): void {
			super.onShow();
			this._ui._inputCount.text = "";
			this._ui._radType.selectedIndex = 0;
			MatchSignRuleCtrl.instance.show(this._gameType.toString());
			if (String(this._gameType) == GameDef.GAME_TYPE.JINYUN_MJ) {
				MatchSignRuleCtrl.instance.show(GameDef.GAME_TYPE.JINYUN_GS_MJ);
				MatchSignRuleCtrl.instance.show(GameDef.GAME_TYPE.JINYUN_HZ_MJ);
			}

			MatchSignRuleCtrl.instance.hide();
			this.checkTab();
			this.setRule();
			this._ui._imgInputBack.visible = false;
			this.tweenSelf();
		}
        /**
         * 离开时调度
         */
		public afterShow(): void {
			super.afterShow();
			this._inputCount = "";
			this._inputTime = "";
			this.removeKeyboard();
		}

		private checkTab(): void {
			if (this._data.length > 1) {
				this._ui._panel.top = 169
				this._ui._wanfa.removeChildren()
				this._tabBtns = []
				for (let k in this._data) {
					let btn = new component.BaseButton("createTable/gameTab.png", GameDef.GAME_NAME_CH[parseInt(this._data[k]) - 1])
					btn.stateNum = 3
					btn.labelSize = 28
					btn.labelColors = "#fff7b2,#fff7b2,#fff7b2,#fff7b2"

					btn.labelStrokeColor = "#cb5a20"
					btn.on(Laya.Event.CLICK, this, this.chooseWanFa, [this._data[k]])
					if (k == "0") {
						btn.selected = true
						btn.labelStroke = 3
					} else {
						btn.labelStroke = 0
					}
					this._ui._wanfa.addChild(btn)
					this._tabBtns.push(btn)
					btn.pos(172 * parseInt(k) + 30, 5)
				}
				// this.showCreateInfo(this._data[0])
			} else {
				this._ui._panel.top = 99
				this._ui._wanfa.removeChildren()
				// this.showCreateInfo(this._gameType)
			}
		}

		private chooseWanFa(type, e) {
			for (var k in this._tabBtns) {
				let v = this._tabBtns[k]
				if (v == e.currentTarget) {
					v.selected = true
					v.labelStroke = 3
				} else {
					v.selected = false
					v.labelStroke = 0
				}
			}
			this._gameType = type
			this.setRule();

			// this.showCreateInfo(type)
		}

		private onInputChange(e: Laya.Event): void {
			var flag: boolean;
			while (Utils.getCharCodeLength(this._ui._inputName.text) > 20) {
				flag = true;
				this._ui._inputName.text = this._ui._inputName.text.substring(0, this._ui._inputName.text.length - 1);
			}
			if (flag)
				HintCtrl.instance.show(GameConfig.language.match_name_too_long);
		}

		private onBoxTouch(e: Laya.Event): void {
			if (this._keyboard) {
				if (e.target != this._ui._imgCount && e.target != this._keyboard) {
					this._keyboard.removeSelf();
				}
			}
		}

		private onTouch(e: Laya.Event): void {
			switch (e.currentTarget) {
				case this._keyboard:
				case this._date:
					e.stopPropagation();
					break;
				case this._ui._imgCount:
					if (this._ui._radType.selectedIndex == 0) {
						this.showKeyboard(1);
					}
					else {
						this.removeKeyboard();
						this.showDate();
					}
					e.stopPropagation();
					break;

				case this._ui._imgDiamond:
					this.removeDate(0);
					this.showKeyboard(2);
					e.stopPropagation();
					break;

				case this._ui._btnRule:
					MatchSignRuleCtrl.instance.show(this._gameType.toString());
					break;

				case this._ui._btnCreate:
					this.create();
					break;

				case this._ui._radType:
					e.stopPropagation();
					break;

				default:
					this.removeKeyboard();
					// this.removeDate();
					break;
			}
		}

		private setRule(): void {
			let text = localStorage.getItem("matchRule_" + GameDef.GAME_NAME[this._gameType - 1]);
			if (text) {
				var tmp: any = JSON.parse(text);
				this._ui._labRule.text = tmp["desc"] == "" ? GameConfig.language.match_classical : tmp["desc"];
			}
		}

		private onSelectRadTypeChange(index: number): void {
			if (index == 0) {
				this._ui._inputCount.prompt = "设定比赛人数";
				this._ui._inputCount.text = this._inputCount ? this._inputCount : "";
				this.removeDate(0);
				this.showKeyboard(1);
			}
			else {
				this._ui._inputCount.prompt = "设定比赛时间";
				this._ui._inputCount.text = this._inputTime ? this._inputTime : "";
				this.removeKeyboard();
				this.showDate();
			}
		}

		private onInputCountChanged(key: string): void {
			var input: Laya.TextInput;
			if (this._currentKeyboard == 1)
				input = this._ui._inputCount;
			else
				input = this._ui._inputDiamond;
			var num: number;
			switch (key) {
				case "10":
					input.text = "";
					break;

				case "12":
					input.text = input.text.substr(0, input.text.length - 1);
					break;

				case "11":
					input.text += "0";
					break;
				default:
					input.text += key;
					break;
			}
			if (this._currentKeyboard == 1)
				this._inputCount = input.text;
		}

		private showKeyboard(value: number): void {
			this._currentKeyboard = value;
			this._ui._imgInputBack.visible = true;
			if (!this._keyboard) {
				this._keyboard = new KeyBoardNumUI();
				this._keyboard.centerX = 0;
				this._keyboard.bottom = 20;
			}
			this._ui._box.addChild(this._keyboard);
			this._keyboard.on(Laya.Event.CLICK, this, this.onTouch);
		}

		private removeKeyboard(): void {
			if (this._keyboard && this._keyboard.parent) {
				this._keyboard.removeSelf();
				this._keyboard.off(Laya.Event.CLICK, this, this.onTouch);
				if (!this._date || !this._date.parent)
					this._ui._imgInputBack.visible = false;
			}
		}

		private showDate(): void {
			this._ui._imgInputBack.visible = true;
			if (!this._date) {
				this._date = new DateUI();
				this._date.centerX = 0;
				this._date.bottom = 0;
			}
			this._date.getDate();
			if (!this._date.parent) {
				this._date.start();
				this._ui._box.addChild(this._date);
			}
		}

		private removeDate(value: number): void {
			if (this._date && this._date.parent) {
				if (value == 1) {
					this._startTime = this._date.getTime();
					var now: number = server.serverTime ? server.serverTime * 1000 : new Date().getTime();
					if (this._startTime < (now + 2000 * 60)) {
						AlertInGameCtrl.instance.show(GameConfig.language.create_match_error_1, null, 0, false);
						return;
					}
					this._date.removeSelf();
					this._date.off(Laya.Event.CLICK, this, this.onTouch);
					this._date.stop();

					var d: Date = new Date(this._startTime);
					var h: number = d.getHours();
					var m: number = d.getMinutes();
					if (this._ui._radType.selectedIndex == 1)
						this._ui._inputCount.text = StringUtils.format(GameConfig.language.format_m_d_h_m, "", d.getMonth() + 1, d.getDate(), h < 10 ? "0" + h : h, m < 10 ? "0" + m : m);
					this._inputTime = this._ui._inputCount.text;
				}
				else {
					this._date.removeSelf();
					this._date.off(Laya.Event.CLICK, this, this.onTouch);
					this._date.stop();
				}
				if (!this._keyboard || !this._keyboard.parent)
					this._ui._imgInputBack.visible = false;
			}
		}

		private create(): void {
			if (!this._ui._inputName.text) {
				HintCtrl.instance.show(GameConfig.language.matchsign_noname);
				return;
			}
			var matchmode: number;
			var starttime: string;
			var playercnt: string;
			if (this._ui._radType.selectedIndex == 0) {
				matchmode = MatchConfig.MATCH_MODE_MEMBER;
				if (!this._ui._inputCount.text) {
					HintCtrl.instance.show(GameConfig.language.matchsign_no_member);
					return;
				}
				if (Number(this._ui._inputCount.text) < 8 || Number(this._ui._inputCount.text) > 3000) {
					HintCtrl.instance.show(GameConfig.language.match_member_limit);
					return;
				}
				playercnt = this._ui._inputCount.text;
			}
			else {
				matchmode = MatchConfig.MATCH_MODE_TIME;
				if (!this._ui._inputCount.text) {
					HintCtrl.instance.show(GameConfig.language.matchsign_no_time);
					return;
				}
				var now: number = new Date().getTime();
				if (this._startTime < (now + 2000 * 60)) {
					AlertInGameCtrl.instance.show(GameConfig.language.create_match_error_1, null, 0, false);
					this.showDate();
					return;
				}
				starttime = Math.floor(this._startTime * 0.001) + "";
			}
			var title: string = Utils.getFitNickName(this._ui._inputName.text, 20);
			var cost: string = this._ui._inputDiamond.text ? this._ui._inputDiamond.text : "0";
			var matchRule: string = JSON.stringify({ matchmode, title, cost, playercnt, starttime });


			let text = localStorage.getItem("matchRule_" + GameDef.GAME_NAME[this._gameType - 1]);
			if (text) {
				var tmp: any = JSON.parse(text);
				var rule: any = {};
				for (var i in tmp) {
					if (i != "desc")
						rule[i] = tmp[i];
				}
				// if (String(this._gameType) == GameDef.GAME_TYPE.JINYUN_MJ || String(this._gameType) == GameDef.GAME_TYPE.JINYUN_HZ_MJ)
				// rule.xia_zhuang = 0;
				// rule.gps = 0;
				// rule.charge_type = 0;
				// rule.max_hand_cnt = matchSign.JinYunMJ.maxHandCnt;
				// tmp.desc=null;
			}
			var str: string = JSON.stringify(rule);
			if (matchmode == MatchConfig.MATCH_MODE_TIME) {
				AlertInGameCtrl.instance.show(GameConfig.language.create_match_tip_1, (value: number) => {
					if (value == AlertCtrl.CONFIRM)
						this.gotoCreate(tmp.max_player, str, matchRule);
				});
			}
			else
				this.gotoCreate(tmp.max_player, str, matchRule);
			// console.info(this._desc)
			// var score: string = "0"
			// var count: string = this._newCreateInfo["max_hand_cnt"]


			// webService.createTable(this._gameType, this._name, count, this._newCreateInfo["max_player"], str, (response: any) => {
			// }
			// );
		}

		private gotoCreate(maxPlayer: string, str: string, matchRule: string): void {
			matchSignService.createMatch(this._cid, this._gameType + "", GameDef.GAME_NAME[this._gameType - 1], "0", maxPlayer, str, matchRule, (response: any) => {
				if (response.code == 0) {
					MatchSignData.getMatchList();
					HintCtrl.instance.show(GameConfig.language.create_succ);
					this.hide();
					Dispatcher.dispatch(EventNames.CREATE_MATCH_SUCC);
				}
				else {
					HintCtrl.instance.show("创建失败");
				}
			});
		}
	}
}