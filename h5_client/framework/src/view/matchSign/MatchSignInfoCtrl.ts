/*
* @author seacole
* 比赛信息页面;
*/
module matchSign {
	export class MatchSignInfoCtrl extends BaseCtrl {
		constructor() {
			super();
			this["name"] = "MatchSignInfoCtrl";
		}

		private static _instance: MatchSignInfoCtrl;
		public static get instance(): MatchSignInfoCtrl {
			if (!this._instance)
				this._instance = new MatchSignInfoCtrl();
			return this._instance;
		}

		protected _ui: ui.matchSign.MatchSignInfoUI;
		private _match: any;
		private _canRefreshUserList: boolean = true;
		private _rewardList: Array<number>;

		private _fontMember: BPFont;
		private _fontTime: BPFont;
		private _fontCode: BPFont;
		private _fontRank: BPFont;
		private _fontCost: BPFont;
		private _fontNotStart: BPFont;
		private _isBoxWarnShow: boolean;

		public show(code: number): void {
			this._match = MatchSignData.getInfoByCode(code);
			matchSign.MatchSignData.backCode = 0;
			this.showself();
		}

        /**
         * 这里完成new ui，添加注册监听等初始化工作
         */
		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.matchSign.MatchSignInfoUI();

				var fontData1: FontData = new FontData();
				fontData1.init(FontConfig.FONT_MATCHSIGN_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_MATCHSIGN1_JSON),
					Laya.loader.getRes(ResourceConfig.BITMAP_FONT_MATCHSIGN1_PNG), 200, BPFont.LEFT);

				var fontData2: FontData = new FontData();
				fontData2.init(FontConfig.FONT_MATCHSIGN_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_MATCHSIGN1_JSON),
					Laya.loader.getRes(ResourceConfig.BITMAP_FONT_MATCHSIGN1_PNG), 264, BPFont.CENTER);

				var fontData3: FontData = new FontData();
				fontData3.init(FontConfig.FONT_MATCHSIGN_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_MATCHSIGN1_JSON),
					Laya.loader.getRes(ResourceConfig.BITMAP_FONT_MATCHSIGN1_PNG), 200, BPFont.RIGHT);

				this._fontMember = FontManager.instance.addFont(fontData1);
				this._fontMember.text = "1/1";
				this._ui._box.addChild(this._fontMember);
				this._fontMember.pos(300, 142);

				this._fontCode = FontManager.instance.addFont(fontData1);
				this._fontCode.text = "1/1";
				this._ui._box.addChild(this._fontCode);
				this._fontCode.pos(318, 190);

				this._fontRank = FontManager.instance.addFont(fontData1);
				this._fontRank.text = "1名";
				this._ui._box.addChild(this._fontRank);
				this._fontRank.x = 287;
				this._fontRank.bottom = 50;

				this._fontCost = FontManager.instance.addFont(fontData3);
				this._fontCost.text = "";
				this._ui._box.addChild(this._fontCost);
				this._fontCost.x = this._ui._imgDiamond.x - 210;
				this._fontCost.y = 170;

				this._fontTime = FontManager.instance.addFont(fontData2);
				this._fontTime.text = "1/1";
				this._ui._box.addChild(this._fontTime);
				this._fontTime.centerX = 5;
				this._fontTime.y = 142;

				this._fontNotStart = FontManager.instance.addFont(fontData2);
				this._fontNotStart.text = "11";
				this._ui._box.addChild(this._fontNotStart);
				this._fontNotStart.centerX = -25;
				this._fontNotStart.y = 142;



				EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, server, EventNames.CONNECT_SERVER, this, this.onConnectToServer);
				EventManager.instance.registerOnObject(this, server, EventNames.SERVER_ERROR, this, this.onServerError);
				EventManager.instance.registerOnObject(this, server, EventNames.SHOW_DISCONNECT, this, this.onDisconnectServer);
				EventManager.instance.registerOnObject(this, server, EventNames.GAME_MATCH_HALL_STATUS_REP, this, this.onMatchHallStatusRepHandler);
				EventManager.instance.registerOnObject(this, server, EventNames.GAME_MATCH_HALL_USER_LIST_REP, this, this.onMatchHallUserListRepHandler);
				EventManager.instance.registerOnObject(this, server, EventNames.GAME_MATCH_HALL_SIGNIN_NTF, this, this.onMatchHallSigninNtfHandler);
				EventManager.instance.registerOnObject(this, server, EventNames.GAME_MATCH_HALL_STATUS_NTF, this, this.onMatchHallStatusNtfHandler);
				EventManager.instance.registerOnObject(this, server, EventNames.GAME_MATCH_SIGNUP_REP, this, this.onMatchSignupRepHandler);
				EventManager.instance.registerOnObject(this, server, EventNames.GAME_MATCH_SIGNOUT_REP, this, this.onMatchSignoutRepHandler);
				EventManager.instance.registerOnObject(this, server, EventNames.GAME_MATCH_HALL_WILL_START_NTF, this, this.onMatchHallWillStartNtfHandler);
				EventManager.instance.registerOnObject(this, server, EventNames.GAME_MATCH_HALL_START_NTF, this, this.onMatchHallStartNtfHandler);
				EventManager.instance.registerOnObject(this, server, EventNames.MATCH_OVER, this, this.onMatchOverNtfHandler);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.MATCH_NEW_LIST, this, this.onListChange);


				EventManager.instance.registerOnObject(this, this._ui._btnSign, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnCancelSign, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnReturnMatch, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnManager, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnTab, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnTab2, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnShare, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._labHelp, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._tab1, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._tab2, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._tab3, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._box, Laya.Event.CLICK, this, this.onTouch);


				this._ui._listUser.itemRender = MatchSignUserListRenderer;
				this._ui._listUser.scrollBar.elasticDistance = 100;
				this._ui._listUser.scrollBar.visible = false;
				this._ui._listUser.renderHandler = new Laya.Handler(this, this.updateList);
				this._ui._listUser.array = [];
				this._ui._listUser2.itemRender = MatchSignUserList2Renderer;
				this._ui._listUser2.scrollBar.elasticDistance = 100;
				this._ui._listUser2.scrollBar.visible = false;
				this._ui._listUser2.renderHandler = new Laya.Handler(this, this.updateList);
				this._ui._listUser2.array = [];
				this._ui._listReward.itemRender = MatchRewardRenderer;
				// this._ui._listReward.scrollBar.elasticDistance = 100;
				this._ui._listReward.scrollBar.visible = false;
				this._ui._listReward.renderHandler = new Laya.Handler(this, this.updateRewardList);
				this._ui._listReward.array = [];

				this._ui._btnTab.visible = true;
				this._ui._btnTab2.visible = false;
				this._ui._btnTab.hitArea = new Laya.Rectangle(204, 0, 162, 57);
				this._ui._btnTab2.hitArea = new Laya.Rectangle(0, 0, 162, 57);
				this._ui._panel.vScrollBar.visible = false;
			}
			super.beforeShow();
			this.onShow();
		}

        /**
        * 开启监听，配置宽高，添加到舞台
        */
		public onShow(): void {
			super.onShow();
			this._ui._boxWarn.visible = false;
			this._isBoxWarnShow = false;
			this._match.sequence = 0;
			this.update();
			if (this.isFreeMatch) {
				this._ui._btnTab.visible = true;
				this._ui._btnTab2.visible = false;
				this._ui._boxTab.visible = false;
			}
			else {
				this._ui._btnTab.visible = false;
				this._ui._btnTab2.visible = false;
				this._ui._boxTab.visible = true;
				this._ui._imgTab1.visible = true;
				this._ui._imgTab2.visible = this._ui._imgTab3.visible = false;
			}

			this._ui._boxUserTitle.visible = false;
			if (this._match.mrule.cost && Number(this._match.mrule.cost)) {
				this._ui._imgDiamond.visible = this._fontCost.visible = true;
				this._ui._imgFree.visible = false;
				this._fontCost.text = this._match.mrule.cost;
			}
			else {
				this._ui._imgDiamond.visible = this._fontCost.visible = false;
				this._ui._imgFree.visible = true;
			}

			this.checkTab();
			server.code = this._match.code;
			MatchSignData.currentMatchCode = this._match.code;
			BaseGameData.gameType = this._match.gtype;
			WxWeb.instance.onShare();
			LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_ATONCE);
			server.connect();
		}
        /**
         * 离开时调度
         */
		public afterShow(): void {
			super.afterShow();
			this.stopTimer();
			this.stopRefreshUserList();
			this.clearMatchList();
			MatchSignData.getStatus();
		}


		/**
		* 连接上服务器
		*/
		protected onConnectToServer(): void {
			LoadingUI.instance.hide();
			server.matchHallStatusReq();
			// MatchSignData.getReward(this._match.code, null);
		}

		/**
		 * 连接失败
		 */
		protected onServerError(): void {

		}

		/**
		* 断开连接
		*/
		protected onDisconnectServer(code: number): void {
			if (code) {
				LoadingUI.instance.hide();
				AlertInGameCtrl.instance.show(GameConfig.language.socket_disconnect[code], this.back, 0, false)
			}
			else
				LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_ATONCE);
			this.clearMatchList();
		}

		private clearMatchList(): void {
			this._canRefreshUserList = true;
			this._match.sequence = 0;
			if (this._match.userlist) {
				while (this._match.userlist.length) {
					this._match.userlist.pop();
				}
			}
		}

		private back(): void {
			MatchSignInfoCtrl.instance.hide();
		}

		/***渲染单元格时的回调方法***/
		protected updateList(cell: MatchSignUserListRenderer, index: number): void {
			cell.updata();
		}

		/***渲染单元格时的回调方法***/
		protected updateRewardList(cell: MatchRewardRenderer, index: number): void {
			cell.updata(index + 1, this._rewardList.length);
		}

		private update(): void {
			if (this.parent) {
				this.updateTop();
				this.updateMiddle();
				this.updateBottom();
			}
		}

		private updateTop(): void {
			this._ui._imgName.skin = "res/gameIcon/gameIcon_matchInfo_" + this._match.gtype + ".png";
			this._fontCode.text = this._match.code + "";
			this._ui._labTitle.text = this._match.mrule.title;
			var matchrule = this._match.mrule;
			this._ui._imgTime.visible = false;
			this._ui._imgWillStart.visible = false;
			this._ui._imgMatching.visible = false;
			this._ui._imgMember.visible = false;
			this._fontMember.visible = false;
			this._fontTime.visible = false;
			this._fontNotStart.visible = false;
			this._ui._imgTimeNotStart.visible = false;			
			//定时赛
			if (MatchConfig.isModeTime(matchrule.matchmode)) {
				//已开赛
				if (MatchConfig.isMatchStart(this._match.status)) {
					this._ui._imgMatching.visible = true;
					this._fontTime.visible = true;
					this.startTimer();
				}
				//未开赛
				else {
					var now: number = server.serverTime ? server.serverTime * 1000 : new Date().getTime();
					var starttime = Number(matchrule.starttime) * 1000;
					var leftTime: number = starttime - now;
					if (leftTime < 0) {
						this._ui._imgWillStart.visible = true;
						this._fontNotStart.visible = this._ui._imgTimeNotStart.visible = true;
						if (!this._isBoxWarnShow) {
							this._ui._boxWarn.visible = true;
							this._isBoxWarnShow = true;
						}
						this._fontNotStart.text = this._match.mrule.min_player ? this._match.mrule.min_player + "" : "0";
						this._ui._labWarn.text = StringUtils.format("比赛人数未满{0}人,暂时无法开赛", this._match.mrule.min_player ? this._match.mrule.min_player : 0)
					}
					// 距离开赛时间30分钟以内
					else if (leftTime < (30 * 60 * 1000)) {
						this._ui._imgWillStart.visible = true;
						this.startTimer();
						this._fontTime.visible = true;
					}
					else {
						this._ui._imgTime.visible = true;
						this._ui._imgTime.skin = "matchSign/matchSign_img_17.png";
						var d: Date = new Date(starttime);
						var h: number = d.getHours();
						var m: number = d.getMinutes();
						this._fontTime.text = StringUtils.format(GameConfig.language.format_m_d_h_m, "", d.getMonth() + 1, d.getDate(), h < 10 ? "0" + h : h, m < 10 ? "0" + m : m);
						this._fontTime.visible = true;
					}
				}
			}
			else if (MatchConfig.isModeMember(matchrule.matchmode)) {
				//已开赛
				if (MatchConfig.isMatchStart(this._match.status)) {
					this._ui._imgMatching.visible = true;
					if (this._match.mrule.starttime > 0) {
						this.startTimer();
						this._fontTime.visible = true;
					}
				}
				//未开赛
				else {
					this._ui._imgTime.visible = true;
					this._ui._imgTime.skin = "matchSign/matchSign_img_27.png";
					this._ui._imgMember.visible = true;
					this._fontMember.visible = true;
					this._fontMember.text = (this._match.cnt ? this._match.cnt : 0) + "/" + matchrule.playercnt;
				}
			}
		}

		private updateMiddle(): void {
			var isSignin: boolean = Number(this._match.signin) != 0;
			if (MatchConfig.isMatchStart(this._match.status)) {
				this._ui._labMemberCount1.text = this._ui._labMemberCount2.text = "";
				//定时赛
				if (MatchConfig.isModeTime(this._match.mrule.matchmode))
					this._ui._labCurrentMember1.text = this._ui._labCurrentMember2.text = StringUtils.format(GameConfig.language.current_member, this._match.leftcnt ? this._match.leftcnt : this._match.cnt, this._match.cnt);
				else if (MatchConfig.isModeMember(this._match.mrule.matchmode))
					this._ui._labCurrentMember1.text = this._ui._labCurrentMember2.text = StringUtils.format(GameConfig.language.current_member, this._match.leftcnt ? this._match.leftcnt : this._match.mrule.playercnt, this._match.mrule.playercnt);
				if (isSignin)
					this._ui._labMyRank1.text = this._ui._labMyRank2.text = StringUtils.format(GameConfig.language.my_rank, this._match.rank ? this._match.rank : 1);
				else
					this._ui._labMyRank1.text = this._ui._labMyRank2.text = "";
			}
			else {
				this._ui._labMemberCount1.text = this._ui._labMemberCount2.text = StringUtils.format(GameConfig.language.matchsign_min_member3, this._match.cnt ? this._match.cnt : 0);
				this._ui._labCurrentMember1.text = this._ui._labCurrentMember2.text = "";
				this._ui._labMyRank1.text = this._ui._labMyRank2.text = "";
			}

			if (this._match.hasOwnProperty("userlist")) {
				if (this._match.userlist.length && this._match.userlist[0].hasOwnProperty("rank")) {
					this._ui._listUser.visible = this._ui._boxUserTitle.visible = true;
					this._ui._listUser2.visible = false;
					this._ui._listUser.array = this._match.userlist;

				}
				else {
					this._ui._listUser.visible = this._ui._boxUserTitle.visible = false;
					this._ui._listUser2.visible = true;
					this._ui._listUser2.array = this._match.userlist;
				}
			}
			this._ui._labRule.text = GameConfig.DESC[this._match.code] == "" ? GameConfig.language.match_classical : GameConfig.DESC[this._match.code];
		}

		private updateBottom(): void {
			this._ui._labBottom.text = "";
			this._fontRank.visible = false;
			if (this._match.hasOwnProperty("status")) {
				var isSignin: boolean = Number(this._match.signin) != 0;
				var isOut: boolean = Number(this._match.signin) == 2;
				this._ui._btnSign.disabled = false;
				this._ui._labFinalRank.visible = false;
				this._ui._labSignOver.visible = false;
				//管理者
				if (this._match.owner == server.uid) {
					this._ui._btnSign.centerX = this._ui._btnCancelSign.centerX = this._ui._btnReturnMatch.centerX = -120;
					this._ui._btnManager.centerX = 120;
					this._ui._btnManager.visible = true;
					this._ui._labBottom.centerX = NaN;
					this._ui._labBottom.x = 44;
					this._ui._labBottom.bottom = 70;
					this._ui._labFinalRank.centerX = -120;
					this._ui._labSignOver.centerX = -154;
				}
				else {
					this._ui._btnSign.centerX = this._ui._btnCancelSign.centerX = this._ui._btnReturnMatch.centerX = 0;
					this._ui._btnManager.centerX = 120;
					this._ui._btnManager.visible = false;
					this._ui._labBottom.centerX = 0;
					this._ui._labBottom.bottom = 94;
					this._ui._labFinalRank.centerX = -30;
					this._ui._labSignOver.centerX = 0;
				}

				//比赛已开始
				if (MatchConfig.isMatchStart(this._match.status)) {//MatchConfig.isMatchStart(this._match.status)
					this._ui._btnCancelSign.visible = false;
					//已报名
					if (isSignin) {//isSignin
						//已淘汰
						if (isOut) {//isOut
							if (this._match.owner == server.uid) {
								this._ui._labBottom.text = GameConfig.language.knock_out2;
								this._fontRank.x = this._ui._labBottom.x + this._ui._labBottom.width + 5;
								this._fontRank.bottom = 64;
							}
							else {
								this._ui._labBottom.text = GameConfig.language.knock_out;
								this._fontRank.x = this._ui._labFinalRank.x + this._ui._labFinalRank.width + 5;
								this._fontRank.bottom = 48;
								this._ui._labFinalRank.visible = true;
							}
							this._fontRank.text = this._match.rank ? this._match.rank + "" : "1";
							this._fontRank.visible = true;
							this._ui._btnReturnMatch.visible = false;
							this._ui._btnSign.visible = false;

						}
						else {
							// this._ui._labBottom.text = GameConfig.language.in_match;
							this._ui._btnReturnMatch.visible = true;
							this._ui._btnSign.visible = false;
						}
					}
					//未报名
					else {
						this._ui._btnReturnMatch.visible = false;
						this._ui._btnSign.visible = true;
						//定时赛
						if (MatchConfig.isModeTime(this._match.mrule.matchmode)) {
							//不能报名
							if (this._match.status == MatchConfig.MATCH_STATUS_BEGIN_CAN_NOT_SIGNIN) {
								this._ui._btnSign.disabled = true;
								this._ui._labSignOver.visible = true;
								// this._ui._labBottom.text = GameConfig.language.can_not_signin;
							}
						}
						else if (MatchConfig.isModeMember(this._match.mrule.matchmode)) {
							//已经不能报名
							if (this._match.status >= MatchConfig.MATCH_STATUS_BEGIN_CAN_SIGNIN) {
								this._ui._btnSign.disabled = true;
								this._ui._labSignOver.visible = true;
								// this._ui._labBottom.text = GameConfig.language.can_not_signin;
							}
						}
					}
				}
				//比赛未开始
				else {
					this._ui._btnReturnMatch.visible = false;
					//已报名
					if (isSignin) {
						this._ui._btnSign.visible = false;
						this._ui._btnCancelSign.visible = true;
						// this._ui._labBottom.text = GameConfig.language.wait_match
					}
					else {
						this._ui._btnSign.visible = true;
						this._ui._btnCancelSign.visible = false;
					}
				}
			}
			else {
				this._ui._btnSign.visible = false;
				this._ui._btnCancelSign.visible = false;
				this._ui._btnReturnMatch.visible = false;
				this._ui._btnManager.visible = false;
			}
		}

		private onTouch(e: Laya.Event): void {
			switch (e.currentTarget) {
				case this._ui._btnSign:
					var str: string;
					if (this._match.mrule.cost && Number(this._match.mrule.cost) > 0)
						str = StringUtils.format(GameConfig.language.match_signin_2, this._match.mrule.cost);
					else
						str = GameConfig.language.match_signin;
					AlertInGameCtrl.instance.show(str, (value: number) => {
						if (value == AlertCtrl.CONFIRM)
							server.matchSignupReq();
					});
					break;

				case this._ui._btnCancelSign:
					AlertInGameCtrl.instance.show(GameConfig.language.match_signout, (value: number) => {
						if (value == AlertCtrl.CONFIRM)
							server.matchSignoutReq();
					});
					break;

				case this._ui._btnReturnMatch:
					this.gotoTable();
					break;

				case this._ui._close:
					EventManager.instance.disableOnObject(this);
					server.code = "";
					server.close();
					this.hide();
					this.afterShow();
					MatchSignData.getMatchList();
					break;

				case this._ui._btnTab:
					this._ui._btnTab.visible = false;
					this._ui._btnTab2.visible = true;
					this.checkTab();
					break;

				case this._ui._btnTab2:
					this._ui._btnTab.visible = true;
					this._ui._btnTab2.visible = false;
					this.checkTab();
					break;

				case this._ui._tab1:
					this._ui._imgTab1.visible = true;
					this._ui._imgTab2.visible = this._ui._imgTab3.visible = false;
					this.checkTab();
					break;

				case this._ui._tab2:
					this._ui._imgTab2.visible = true;
					this._ui._imgTab1.visible = this._ui._imgTab3.visible = false;
					this.checkTab();
					break;

				case this._ui._tab3:
					this._ui._imgTab3.visible = true;
					this._ui._imgTab1.visible = this._ui._imgTab2.visible = false;
					this.checkTab();
					break;

				case this._ui._btnShare:
					Native.instance.share();
					break;

				case this._ui._labHelp:
					HelpCtrl.instance.show(true, [1]);
					break;

				case this._ui._btnManager:
					AlertInGameCtrl.instance.show("该功能暂未开启", null, 0, false);
					break;

				case this._ui._box:
					this._ui._boxWarn.visible = false;
					break;
			}
		}

		private checkTab(): void {
			if (this.isFreeMatch) {
				this._ui._boxInfo.visible = this._ui._btnTab.visible;
				this._ui._boxPlayerList.visible = this._ui._btnTab2.visible;
				this._ui._boxReward.visible = false;
			}
			else {
				this._ui._boxInfo.visible = this._ui._imgTab1.visible;
				this._ui._boxPlayerList.visible = this._ui._imgTab2.visible;
				this._ui._boxReward.visible = this._ui._imgTab3.visible;
			}

			if (this._ui._boxPlayerList.visible) {
				if (MatchConfig.isMatchStart(this._match.status)) {
					if (this._canRefreshUserList) {
						this.refreshUserList();
					}
				}
				else {
					if (this._match.sequence <= 0)
						server.matchHallUserListReq(this._match.sequence);
				}
			}

			if (this._ui._boxReward.visible) {
				MatchSignData.getReward(this._match.code, (list: Array<number>) => {
					this._rewardList = list;
					this._ui._listReward.array = this._rewardList;
				});
			}
		}

		private onRefreshUserListCd(): void {
			this._canRefreshUserList = true;
			if (this._ui._boxPlayerList.visible) {
				this.refreshUserList();
			}
		}

		private refreshUserList(): void {
			this._canRefreshUserList = false;
			Laya.timer.once(10 * 1000, this, this.onRefreshUserListCd);
			server.matchHallUserListReq(this._match.sequence);
		}

		private stopRefreshUserList(): void {
			Laya.timer.clear(this, this.onRefreshUserListCd);
		}

		private startTimer(): void {
			Laya.timer.loop(1000, this, this.onTimer);
			this.onTimer();
		}

		public stopTimer(): void {
			this._fontTime.text = " ";
			Laya.timer.clear(this, this.onTimer);
		}

		private onTimer(): void {
			var now: number = server.serverTime ? server.serverTime * 1000 : new Date().getTime();
			if (this._match.mrule.starttime * 1000 > now) {
				this._fontTime.text = TimeUtils.timeFormat(this._match.mrule.starttime - Math.floor(now * 0.001));
				if ((this._match.mrule.starttime * 1000 - now) < 5 * 60 * 1000 && (this._match.mrule.starttime * 1000 - now) > (5 * 60 * 1000 - 1000)) {
					if (MatchConfig.isModeTime(this._match.mrule.matchmode) && this._match._cnt < 8)
						AlertInGameCtrl.instance.show(GameConfig.language.match_will_start_2, null, 0, false);
					else
						AlertInGameCtrl.instance.show(StringUtils.format(GameConfig.language.match_will_start, 5), null, 0, false);
				}
			}
			else {
				if (MatchConfig.isMatchStart(this._match.status))
					this._fontTime.text = TimeUtils.timeFormat(-this._match.mrule.starttime + Math.floor(now * 0.001));
				else {
					this.stopTimer();
					Laya.timer.once(1000, this, this.update);
					// this.update();
				}
			}
		}

		private onMatchHallStatusRepHandler(msg: any): void {
			// 		   optional int32 signin = 1;          // 0 未报名 1 已报名、 2淘汰
			// optional int32 status = 2;            //比赛状态 0为开赛 1已开赛 2已开赛，不能报名
			// optional int32 total = 3;               //报名总人数
			// optional int32 begintime = 4;         //真实开始时间 大于0有效
			// optional int32 rank = 5;                //自己排名
			this._match.signin = msg.signin;
			if (msg.hasOwnProperty("status"))
				this._match.status = msg.status;
			else
				this._match.status = 0;
			this._match.owner = msg.owner;
			this._match.cnt = msg.total;
			if (msg.hasOwnProperty("leftcnt"))
				this._match.leftcnt = msg.leftcnt;
			if (msg.hasOwnProperty("begintime"))
				this._match.mrule.starttime = msg.begintime;
			if (msg.hasOwnProperty("rank"))
				this._match.rank = msg.rank;
			this.update();
			if (this._ui._btnReturnMatch.visible) {
				var e: Laya.Event = new Laya.Event;
				e.currentTarget = this._ui._btnReturnMatch;
				this.onTouch(e);
			}
		}

		private onMatchHallUserListRepHandler(msg: any): void {
			if (this._match.sequence != msg.sequence) {
				this._match.sequence = msg.sequence;
				this._match.cnt = msg.total;
				this._match.userlist = msg.userlist;
				if (msg.hasOwnProperty("leftcnt")) {
					this._match.leftcnt = msg.leftcnt;
					if (this._match.userlist) {
						for (var i: number = 0; i < this._match.userlist.length; i++) {
							this._match.userlist[i].leftcnt = msg.leftcnt;
						}
					}
				}

				this.update();
			}
		}

		private onMatchHallSigninNtfHandler(msg: any): void {
			if (!this._match.userlist)
				this._match.userlist = [];
			if (msg.signin == 1) {
				this._match.userlist.unshift({ uid: msg.uid, nickname: msg.nickname })
				if (this._match.hasOwnProperty("cnt"))
					this._match.cnt++;
			}
			else {
				for (var i: number = 0; i < this._match.userlist.length; i++) {
					if (this._match.userlist[i].uid == msg.uid) {
						this._match.userlist.splice(i, 1);
						break;
					}
				}
				if (this._match.hasOwnProperty("cnt"))
					this._match.cnt--;
			}
			this.update();
		}

		private onMatchHallStatusNtfHandler(msg: any): void {
			this._match.status = msg.status;
			this.update();
		}

		private onMatchSignupRepHandler(msg: any): void {
			if (msg.result == 0) {
				GameLogic.selfData.getInfo(true);
				this._match.signin = 1;
				this.update();
				Dispatcher.dispatch(EventNames.MATCH_LIST_CHANGE);
				var desc: string;
				if (MatchConfig.isModeTime(this._match.mrule.matchmode)) {
					var now: number = server.serverTime ? server.serverTime * 1000 : new Date().getTime();
					var starttime = Number(this._match.mrule.starttime) * 1000;
					if (now > starttime && this._match.mrule.min_player)
						desc = StringUtils.format(GameConfig.language.matchsign_member_count, this._match.mrule.min_player);
					else {
						var d: Date = new Date(starttime);
						var hour: number = d.getHours();
						var min: number = d.getMinutes();
						if (TimeUtils.isToday(starttime, now))
							desc = StringUtils.format(GameConfig.language.matchsign_start_time_2, hour < 10 ? "0" + hour : hour, min < 10 ? "0" + min : min);
						else if (TimeUtils.isTomorrow(starttime, now))
							desc = StringUtils.format(GameConfig.language.matchsign_start_time_3, hour < 10 ? "0" + hour : hour, min < 10 ? "0" + min : min);
						else
							desc = StringUtils.format(GameConfig.language.matchsign_start_time, "", d.getMonth() + 1, d.getDate(), hour < 10 ? "0" + hour : hour, min < 10 ? "0" + min : min);
					}
				}
				else
					desc = StringUtils.format(GameConfig.language.matchsign_member_count, this._match.mrule.playercnt);
				AlertInGameCtrl.instance.show(StringUtils.format(GameConfig.language.match_signin_3, this._match.mrule.title, desc), null, 0, false, "tongyong/tongyong_tishi_2.png", null, ["tongyong/tongyong_btn_zhidao.png"]);

				if (MatchConfig.isMatchStart(this._match.status))
					this.gotoTable();
			}
			else {
				server.matchHallStatusReq();
				var str: string = GameConfig.language.match_signin_fail[msg.result];
				if (!str)
					str = GameConfig.language.match_signin_fail[-1];
				AlertInGameCtrl.instance.show(str, null, 0, false);
			}
		}

		private onMatchSignoutRepHandler(msg: any): void {
			if (msg.result == 0) {
				GameLogic.selfData.getInfo(true);
				this._match.signin = 0;
				this.update();
				Dispatcher.dispatch(EventNames.MATCH_LIST_CHANGE);
			}
			else {
				server.matchHallStatusReq();
				AlertInGameCtrl.instance.show(GameConfig.language.match_signout_fail, null, 0, false);
			}
		}

		private onMatchHallWillStartNtfHandler(msg: any): void {

		}

		private onMatchHallStartNtfHandler(msg: any): void {
			if (this._match.signin == 1)
				this.gotoTable();
			else {
				server.matchHallStatusReq();
			}
		}

		private onMatchOverNtfHandler(msg: any): void {
			if (!msg.overType)
				msg.overType = 0;
			AlertInGameCtrl.instance.show(GameConfig.language.match_disband[msg.overType], () => {
				EventManager.instance.disableOnObject(this);
				server.code = "";
				server.close();
				this.hide();
				this.afterShow();
			}, 0, false);
		}

		private gotoTable(): void {
			GameConfig.IS_MATCH = true;
			BaseGameData.isFreeMatch = this.isFreeMatch;
			AppControl.getInstance().showPage(GameConfig.getGamePage(this._match.gname));
		}

		private get isFreeMatch(): boolean {
			if (this._match.mrule.cost && Number(this._match.mrule.cost) > 0)
				return false;
			else
				return true;
		}


		private onListChange(): void {
			this._match = MatchSignData.getInfoByCode(Number(this._match.code));
		}

	}
}