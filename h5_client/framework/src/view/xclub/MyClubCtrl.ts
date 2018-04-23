/*
* @author seacole
* 我的俱乐部
*/
module club {
	export class MyClubCtrl extends BaseCtrl {
		constructor() {
			super();
		}

		private static _instance: MyClubCtrl;
		public static get instance(): MyClubCtrl {
			if (!this._instance)
				this._instance = new MyClubCtrl();
			return this._instance;
		}

		protected _ui: ui.club.MyClubUI;
		private _cid: number;
		private _myClub: any;
		private _dicDetail: any = {};
		private _detailTotal: any;
		private _currentTag: number;
		private _currentCreateTag: number;
		private _lastGid: number;
		private _lastGtype: number;
		private _isLastScrollMax: boolean;
		private _refreshResultsMore: boolean;
		private _refreshResultsFirstPage: boolean;
		private _refreshGamesMore: boolean;
		private _refreshGamesFirstPage: boolean;
		private _games: Array<number>;
		private _matchs: Array<number>;
		private _btns: Array<component.BaseButton>;
		public show(cid: number): void {
			this._cid = cid;
			this._myClub = ClubManager.getClubByCid(this._cid);
			if (this._myClub)
				this.showself();
		}

        /**
         * 这里完成new ui，添加注册监听等初始化工作
         */
		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.club.MyClubUI();
				this._ui._btnTab1.hitArea = new Laya.Rectangle(275, 0, 236, 80);
				this._ui._btnTab2.hitArea = new Laya.Rectangle(0, 0, 236, 80);
				this._ui._btnCreateTab1.hitArea = new Laya.Rectangle(320, 0, 320, 75);
				this._ui._btnCreateTab2.hitArea = new Laya.Rectangle(0, 0, 320, 75);
				this._ui._listGames.itemRender = GameListRenderer;
				this._ui._listGames.scrollBar.elasticDistance = 100;
				this._ui._listGames.scrollBar.visible = false;
				this._ui._listGames.renderHandler = new Laya.Handler(this, this.updateGameList);
				this._ui._listGames.mouseHandler = new Laya.Handler(this, this.selectGameList);
				this._ui._listGames.scrollBar.on(Laya.Event.CHANGE, this, this.onScrollGameChanged);

				this._ui._listResults.itemRender = MenuHistoryScoreRenderer;
				this._ui._listResults.scrollBar.visible = false;
				this._ui._listResults.scrollBar.elasticDistance = 100;
				this._ui._listResults.selectEnable = true;
				this._ui._listResults.renderHandler = new Laya.Handler(this, this.updateResultList);
				this._ui._listResults.mouseHandler = new Laya.Handler(this, this.selectResultList);
				this._ui._listResults.scrollBar.on(Laya.Event.CHANGE, this, this.onScrollResultChanged);

				this._ui._listDetail.itemRender = MenuHistoryDetailRenderer;
				this._ui._listDetail.scrollBar.visible = false;
				this._ui._listDetail.selectEnable = true;
				this._ui._listDetail.renderHandler = new Laya.Handler(this, this.updateDetailList);
				this._ui._listDetail.mouseHandler = new Laya.Handler(this, this.selectDetailList);

				this._games = GameDef.currentGames.concat();
				this._matchs = GameDef.currentMatchs.concat();
				this._btns = [];
				// var daboluoIdx: number = this._games.indexOf(Number(GameDef.GAME_TYPE.SHISANSHUI));
				// if (daboluoIdx != -1)
				// 	this._games.splice(daboluoIdx, 1);
				for (var i = 0; i < this._games.length; i++) {
					var btn: component.BaseButton = new component.BaseButton();
					btn.loadImage("res/gameIcon/gameIcon_club_" + this._games[i] + ".png", 0, 0, null, null, Laya.Handler.create(this, (b, index) => {
						b.stateNum = 2;
						b.skin = "res/gameIcon/gameIcon_club_" + index + ".png";
						b.height = b.height * 0.5;
					}, [btn, this._games[i]]));

					this._ui._boxCreate.addChild(btn);
					btn.centerX = 160 * (i % 2 == 0 ? -1 : 1);
					btn.bottom = 50;
					btn.on(Laya.Event.CLICK, this, this.onCreateTouch);
					this._btns.push(btn);
				}


				EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
				EventManager.instance.registerOnObject(this, this._ui._btnCreateTab1, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnCreateTab2, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnTab1, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnTab2, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnCreateTable, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnSetup, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnRecharge, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._boxMask, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnBack, Laya.Event.CLICK, this, this.onBack);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.UPDATE_MY_CLUB_RESULTS_LIST, this, this.onUpdateResultList);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.UPDATE_MY_CLUB_GAMES_LIST, this, this.onUpdateGameList);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.UPDATE_MY_CLUB_DIAMOND, this, this.onUpdateDiamond);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_RENAME_SUCC, this, this.onRenameSucc);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.UNAUTHORIZED, this, this.onUnauthorized);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_QUIT_SUCC, this, this.onQuitSucc);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_DELETE_SUCC, this, this.onDeleteSucc);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_KICK_OUT_SUCC, this, this.onKickOutSucc);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_RECHARGE_SUCC, this, this.onRechargeSucc);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CREATE_MATCH_SUCC, this, this.onCreateSucc);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CREATE_ROOM_SUCC, this, this.onCreateSucc);
			}
			super.beforeShow();
			this.onShow();
		}

		/**
		 * cid
		 * title
		 * role 100创始人
		 * cnt 总人数
		 * currcnt 当前人数
		 * gcnt 比赛数
		 */
        /**
        * 开启监听，配置宽高，添加到舞台
        */
		public onShow(): void {
			super.onShow();
			ClubManager.getInfo(this._myClub.cid);
			this.boxCreateVis = false;
			this._ui._btnCreateTab1.visible = true;
			this._ui._btnCreateTab2.visible = false;
			this._ui._listGames.array = [];
			this._ui._listResults.array = [];
			this._ui._labDiamond.text = "";
			this._ui._labTitle.text = this._ui._labClubTitle.text = this._myClub.title;
			this._ui._labMember.text = StringUtils.format(GameConfig.language.club_search_2, this._myClub.currmem ? this._myClub.currmem : 0, this._myClub.maxmem ? this._myClub.maxmem : 0);
			this._ui._btnRecharge.visible = this._ui._labDiamond.visible = ClubManager.isCreator(this._myClub.role);
			if (this.lastGInfo) {
				this._ui._btnTab1.visible = false;
				this._ui._btnTab2.visible = true;
			}
			else {
				this._ui._btnTab1.visible = true;
				this._ui._btnTab2.visible = false;
			}
			this.checkTab();
			this.checkCreateTab();
		}
        /**
         * 离开时调度
         */
		public afterShow(): void {
			super.afterShow();
			Laya.timer.clear(this, this.onRefreshGameList);
			ClubManager.removeGames(this._myClub.cid);
			ClubManager.removeResults(this._myClub.cid);
		}

		private onTouch(e: Laya.Event): void {
			switch (e.currentTarget) {
				case this._ui._btnTab1:
					this._ui._btnTab1.visible = false;
					this._ui._btnTab2.visible = true;
					this.checkTab();
					e.stopPropagation();
					break;

				case this._ui._btnTab2:
					this._ui._btnTab1.visible = true;
					this._ui._btnTab2.visible = false;
					this.checkTab();
					e.stopPropagation();
					break;

				case this._ui._btnCreateTable:
					this.boxCreateVis = true;
					e.stopPropagation();
					break;

				case this._ui._btnSetup:
					ClubInfoCtrl.instance.show(this._myClub.cid);
					e.stopPropagation();
					break;

				case this._ui._btnRecharge:
					ClubRecharge.instance.show(this._myClub.cid);
					e.stopPropagation();
					break;

				case this._ui._btnCreateTab1:
					this._ui._btnCreateTab1.visible = false;
					this._ui._btnCreateTab2.visible = true;
					this.checkCreateTab();
					e.stopPropagation();
					break;

				case this._ui._btnCreateTab2:
					this._ui._btnCreateTab1.visible = true;
					this._ui._btnCreateTab2.visible = false;
					this.checkCreateTab();
					e.stopPropagation();
					break;

				case this._ui._boxMask:
					this.boxCreateVis = false;
					break;
			}
		}

		private onCreateTouch(e: Laya.Event): void {
			var index: number = this._btns.indexOf(e.currentTarget as component.BaseButton);
			if (index != -1) {
				if (this._ui._btnCreateTab1.visible) {
					CreateTableCtrl.instance.show(String(this._games[index]), GameDef.showGames[String(this._games[index])], this._myClub.cid, this._myClub.paytype);
				}
				else {
					matchSign.MatchSignCreateCtrl.instance.show(this._games[index], GameDef.showGames[String(this._games[index])], this._myClub.cid, this._myClub.paytype);
				}
				this.boxCreateVis = false;
			}
			e.stopPropagation();
		}

		private set boxCreateVis(value: boolean) {
			this._ui._boxCreate.visible = this._ui._boxMask.visible = value;
			if (value)
				this.showCreate();
			else
				Laya.Tween.clearTween(this._ui._boxCreate);
		}

		private showCreate() {
			this._ui._boxCreate.bottom = -this._ui._boxCreate.height;
			Laya.Tween.to(this._ui._boxCreate, { bottom: 0, }, 150);
		}

		private checkTab(): void {
			if (this._ui._btnTab1.visible) {
				this._currentTag = 0;
				this._ui._listGames.visible = true;
				this._ui._listResults.visible = this._ui._boxDetail.visible = this._ui._btnBack.visible = this._ui._labNoResults.visible = false;
				ClubManager.getGameList(this._myClub.cid, 1);
				Laya.timer.loop(10 * 1000, this, this.onRefreshGameList);
			}
			else {
				this._ui._listGames.visible = this._ui._labNoGames.visible = false;
				this.currentTag = 1;
				ClubManager.getResultList(this._myClub.cid, 1);
				Laya.timer.clear(this, this.onRefreshGameList);
			}
		}

		private checkCreateTab(): void {
			var i: number;
			if (this._ui._btnCreateTab1.visible) {
				this._currentCreateTag = 0;
				for (i = 0; i < this._btns.length; i++) {
					this._btns[i].visible = true;
					this._btns[i].centerX = 160 * (i % 2 == 0 ? -1 : 1);
				}
			}
			else {
				this._currentCreateTag = 1;
				for (i = 0; i < this._btns.length; i++) {
					this._btns[i].visible = this._matchs.indexOf(this._games[i]) != -1;
					//临时代码
					if (this._btns[i].visible)
						this._btns[i].centerX = 0;
				}


			}
		}

		private onUpdateGameList(cid: number): void {
			if (this._myClub.cid == cid) {
				if (this._myClub.games) {
					this._ui._listGames.array = this._myClub.games;
					if (this._myClub.games.length)
						this._ui._labNoGames.visible = false;
					else
						this._ui._labNoGames.visible = this._ui._btnTab1.visible;
				}
				else {
					this._ui._labNoGames.visible = this._ui._btnTab1.visible;
				}
			}
		}

		private onUpdateResultList(cid: number): void {
			if (this._myClub.cid == cid) {
				if (this._myClub.results) {
					this._ui._listResults.array = this._myClub.results;
					if (this._myClub.results.length)
						this._ui._labNoResults.visible = false;
					else
						this._ui._labNoResults.visible = this._ui._btnTab2.visible;
				}
				else {
					this._ui._labNoResults.visible = this._ui._btnTab2.visible;
				}
				if (this.lastGInfo) {
					if (this._dicDetail && this._dicDetail[this._lastGid])
						this.showDetail(this._lastGid, this._lastGtype);
					else {
						LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY, null, null, null, 5000);
						webService.getHistoryNoraml(this._lastGid, this._lastGtype, this.onGetHistoryDetail.bind(this));
					}
					this.clearLastInfo();
				}
			}
		}

		/***渲染单元格时的回调方法***/
		private updateGameList(cell: GameListRenderer, index: number): void {
			cell.updata();
		}

		private selectGameList(e: Laya.Event, index: number): void {
			if (e.type == Laya.Event.CLICK) {
				var code: number = this._ui._listGames.getItem(index).code;
				webService.joinTable(String(code), (response: any) => {
					if (response.code == 0) {
						GameConfig.setServerUrl(response.ip);
						GameConfig.joinTable(response);
					}
					else {
						AlertInGameCtrl.instance.show(GameConfig.language.room_not_exist, null, 0, false);
						ClubManager.removeGame(this._myClub.cid, code);
					}
				});
			}
		}

		private onScrollGameChanged(e): void {
			if (this._ui._listGames.scrollBar.value < 0)
				this._refreshGamesFirstPage = true;
			else if (this._ui._listGames.scrollBar.value > 0)
				this._refreshGamesFirstPage = false

			if (this._refreshGamesFirstPage && this._ui._listGames.scrollBar.value == 0)
				ClubManager.getGameList(this._myClub.cid, 1, true);


			if (this._ui._listGames.scrollBar.value > this._ui._listGames.scrollBar.max)
				this._refreshGamesMore = true;
			else if (this._ui._listGames.scrollBar.value < this._ui._listGames.scrollBar.max)
				this._refreshGamesMore = false

			if (this._refreshGamesMore && this._ui._listGames.scrollBar.value == this._ui._listGames.scrollBar.max)
				ClubManager.getGameList(this._myClub.cid);
		}


		/***渲染单元格时的回调方法***/
		private updateResultList(cell: MenuHistoryScoreRenderer, index: number): void {
			cell.updata(index);
		}

		/***选择单元格回调***/
		private selectResultList(e: Laya.Event): void {
			if (e.type == Laya.Event.CLICK) {
				let className = Laya.ClassUtils.getClass(e.target)
				if (e.target.name == "share") {

				} else if (e.target.name == "video") {
					var gid: number = (e.target.parent as MenuHistoryScoreRenderer).dataSource.gid;
					var gtype: number = (e.target.parent as MenuHistoryScoreRenderer).dataSource.gtype
					if (this._dicDetail[gid]) {
						this.showDetail(gid, gtype);
					}
					else {
						LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY);
						webService.getHistoryNoraml(gid, gtype, this.onGetHistoryDetail.bind(this));
					}
				} else {
					if (!GameConfig.IS_BANSHU) {
						var gid: number = (e.target as MenuHistoryScoreRenderer).dataSource.gid;
						var gtype: number = (e.target as MenuHistoryScoreRenderer).dataSource.gtype;
						if (this._dicDetail[gid]) {
							if (MatchConfig.isMatch((e.target as MenuHistoryScoreRenderer).dataSource.gmode))
								this.showMatchHistory(gid);
							else
								this.showDetail(gid, gtype);
						}
						else {
							LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY);
							if (MatchConfig.isMatch((e.target as MenuHistoryScoreRenderer).dataSource.gmode))
								webService.getHistoryMatch(gid, 1, gtype, (e.target as MenuHistoryScoreRenderer).dataSource.title, (e.target as MenuHistoryScoreRenderer).dataSource.tplayer,
									(e.target as MenuHistoryScoreRenderer).dataSource.ttime, (e.target as MenuHistoryScoreRenderer).dataSource.rank, this.onGetHistoryMatchDetail.bind(this));
							else
								webService.getHistoryNoraml(gid, gtype, this.onGetHistoryDetail.bind(this));
						}
					}
				}
			}
		}


		private onScrollResultChanged(e): void {
			if (this._ui._listResults.scrollBar.value < 0)
				this._refreshResultsFirstPage = true;
			else if (this._ui._listResults.scrollBar.value > 0)
				this._refreshResultsFirstPage = false

			if (this._refreshResultsFirstPage && this._ui._listResults.scrollBar.value == 0)
				ClubManager.getResultList(this._myClub.cid, 1);

			if (this._ui._listResults.scrollBar.value > this._ui._listResults.scrollBar.max)
				this._refreshResultsMore = true;
			else if (this._ui._listResults.scrollBar.value < this._ui._listResults.scrollBar.max)
				this._refreshResultsMore = false

			if (this._refreshResultsMore && this._ui._listResults.scrollBar.value == this._ui._listResults.scrollBar.max)
				ClubManager.getResultList(this._myClub.cid);
		}

		/***渲染单元格时的回调方法***/
		private updateDetailList(cell: MenuHistoryDetailRenderer, index: number): void {
			cell.updata();
		}

		/***选择单元格回调***/
		private selectDetailList(e: Laya.Event, index): void {
			if (e.type == Laya.Event.CLICK) {
				// goto播录像
				var vid: string
				var gtype: number
				if (e.target.name == "video") {
					vid = (e.target.parent as MenuHistoryDetailRenderer).dataSource.vid;
					gtype = (e.target.parent as MenuHistoryDetailRenderer).dataSource.gtype
				} else {
					vid = (e.target as MenuHistoryDetailRenderer).dataSource.vid;
					gtype = (e.target as MenuHistoryDetailRenderer).dataSource.gtype
				}
				LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY);


				var testPath = GameConfig.WEB_SERVICE_URL + "/history/video?vid=" + vid;
				Laya.loader.load(testPath, Laya.Handler.create(this, this.onGetVidoInfo, [gtype]), null, Laya.Loader.BUFFER)
				// webService.getVideoDetail(vid, gtype, this.onGetHistoryDetail.bind(this));
			}
		}

		private onGetVidoInfo(gtype: number, data: number): void {
			LoadingUI.instance.hide();
			if (data) {
				if (String(gtype) == GameDef.GAME_TYPE.SHANXI_MJ || String(gtype) == GameDef.GAME_TYPE.WAKENG || String(gtype) == GameDef.GAME_TYPE.JINYUN_MJ || String(gtype) == GameDef.GAME_TYPE.SHISANSHUI) {
					GameConfig.IS_MATCH = false;
					AppControl.getInstance().showPage(GameConfig.getGamePage(GameDef.GAME_NAME[gtype - 1]), 1, String(gtype), data);
				}
			}
		}

		private onGetHistoryDetail(response: any, gid: number, gtype: number): void {
			LoadingUI.instance.hide();
			if (response.code == 0) {
				if (!this._detailTotal)
					this._detailTotal = {}
				if (this._detailTotal[gid])
					return;
				if (!this._detailTotal[gid])
					this._detailTotal[gid] = [];
				if (response.data) {
					for (var i: number = 0; i < response.data.length; i++) {
						let data = JSON.parse(response.data[i])
						data.gtype = gtype
						response.data[i] = data;
						for (var k in data.ss) {
							let v = data.ss[k]
							if (!this._detailTotal[gid][k]) {
								this._detailTotal[gid][k] = {
									"n": v.n,
									"s": v.s
								}
							} else {
								this._detailTotal[gid][k].s += v.s
							}
						}
					}
				}
				this._dicDetail[gid] = response.data;
				this.showDetail(gid, gtype);
			}
		}

		private onGetHistoryMatchDetail(response: any, gid: number, gtype: number, title: string, tplayer: number, ttime: number, rank: number): void {
			LoadingUI.instance.hide();
			if (response.code == 0) {
				var data: any = { gid, gtype, title, tplayer, ttime };
				if (response.data)
					data.list = response.data;
				this._dicDetail[gid] = { list: response.data, gid, gtype, title, tplayer, ttime, rank, page: response.page, pageCnt: response.page_cnt };
				this.showMatchHistory(gid);
			}
		}

		private showDetail(gid: number, gtype): void {
			this._lastGid = gid;
			this._lastGtype = gtype;
			this._ui._listDetail.array = this._dicDetail[gid];
			this._ui._luxiangname.skin = "createTable/" + gtype + ".png"
			this.currentTag = 2;
			this._ui._profit.removeChildren()
			let peace = this._ui._profit.width / this._detailTotal[gid].length
			for (var k in this._detailTotal[gid]) {
				let v = this._detailTotal[gid][k]
				let name = new Laya.Label(Utils.getFitNickName(v.n, 10))
				name.fontSize = 26
				name.color = "#ffffff"
				name.align = "center"
				name.strokeColor = "#5c281f"
				name.stroke = 2
				name.x = peace * parseInt(k) + peace / 2
				name.y = 10
				name.anchorX = 0.5
				this._ui._profit.addChild(name)
				let text = new Laya.Label(String(v.s))
				text.align = "center"
				if (v.s >= 0) {
					text.text = "+" + v.s
					text.font = "font_num_10"
				} else {
					text.font = "font_num_9"
				}
				text.x = peace * parseInt(k) + peace / 2
				text.y = 45
				text.anchorX = 0.5
				this._ui._profit.addChild(text)
			}
		}

		public set currentTag(value: number) {
			if (this._currentTag != value) {
				this._currentTag = value;
				if (this._currentTag == 1) {
					this._ui._listResults.visible = true;
					this._ui._boxDetail.visible = this._ui._btnBack.visible = false;
				}
				else {
					this._ui._listResults.visible = false;
					this._ui._boxDetail.visible = this._ui._btnBack.visible = true;
				}
			}
		}

		private showMatchHistory(gid: number): void {
			MatchHistoryCtrl.instance.show(this._dicDetail[gid]);
		}

		private onBack(e: Laya.Event): void {
			this.clearLastInfo();
			this.currentTag = 1;
		}

		private onUnauthorized(e: Laya.Event): void {
			this.clearLastInfo();
		}

		private clearLastInfo(): void {
			this._lastGid = 0;
			this._lastGtype = 0;
		}

		private get lastGInfo(): boolean {
			if (this._lastGid && this._lastGtype)
				return true;
			else
				return false;
		}

		private onUpdateDiamond(cid: number): void {
			if (this._myClub.cid == cid)
				this._ui._labDiamond.text = this._myClub.diamond + "";
		}

		private onRenameSucc(cid: number): void {
			if (this._myClub.cid == cid)
				this._ui._labTitle.text = this._ui._labClubTitle.text = this._myClub.title;
		}

		private onQuitSucc(cid: number): void {
			if (this._myClub.cid == cid)
				this.hide();
		}

		private onDeleteSucc(cid: number): void {
			if (this._myClub.cid == cid)
				this.hide();
		}

		private onKickOutSucc(cid: number, uid: number): void {
			if (this._cid == cid)
				this._ui._labMember.text = StringUtils.format(GameConfig.language.club_search_2, this._myClub.currmem ? this._myClub.currmem : 0, this._myClub.maxmem ? this._myClub.maxmem : 0);
		}

		private onRechargeSucc(cid: number): void {
			if (this._cid == cid)
				this._ui._labDiamond.text = this._myClub.diamond;
		}

		private onCreateSucc(): void {
			this.onRefreshGameList();
		}

		private onRefreshGameList(): void {
			if (this._ui._btnTab1.visible)
				ClubManager.getGameList(this._myClub.cid, 1);
		}
	}
}