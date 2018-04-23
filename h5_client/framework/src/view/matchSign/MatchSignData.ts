/*
* @author seacole
* 比赛报名数据;
*/
module matchSign {
	export class MatchSignData {
		constructor() {

		}

		//  {
		//     "mrule": "{\"matchmode\":\"151\",\"title\":\"13\",\"cost\":\"1\",\"starttime\":\"1515175320\",\"playercnt\":\"12\"}",
		// 	   "grule":"{\"max_player\":4,\"qghu_bao\":1,\"zh4_bao\":1,\"ying_seven\":1,\"xia_zhuang\":1,\"qizi\":1,\"gen_pai\":1,\"gps\":0,\"charge_type\":0,\"max_hand_cnt\":8}",
		//     "code": "150685",
		//     "gid": "487",
		//     "signin": "0",0 未报名 1 已报名、 2淘汰
		//     "sys": "1", 1 官方赛 0个人赛
		//     "gtype": "3",
		//     "gname": "jinyun_mj"
		// 	   "cnt":1,		报名多少人
		// 	   "status":0,  //比赛状态 0为开赛 1已开赛 2已开赛，不能报名
		//     "userlist":[], 
		//     "leftcnt":10,  剩余多少人，
		//     "rank": 1 排名,
		//     "owner":uid,建局人
		// }

		public static _matchList: Array<any> = [];
		// "","您报名的比赛\"{0}\"<br>即将开赛","您正在参加比赛\"{0}\"<br>请及时回到比赛","您报名的比赛\"{0}\"<br>已经开赛,请尽快参赛"
		public static _matchWarn: Array<any> = [{},{},{},{}];

		/**
		 * @param callback 
		 */
		public static getMatchList(callback: any = null): void {
			matchSignService.getMatchList((response) => {
				if (response.code == 0) {
					for (var i: number = 0; i < response.list.length; i++) {
						if (response.list[i].hasOwnProperty("mrule")) {
							var mrule: any = JSON.parse(response.list[i].mrule);
							response.list[i].mrule = mrule;
						}
						else {
							response.list.splice(i, 1);
							i--;
						}
					}
					MatchSignData._matchList = response.list;
					MatchSignData.getStatus();
					MatchSignData.sortMatch();
					Dispatcher.dispatch(EventNames.MATCH_LIST_CHANGE);
					Dispatcher.dispatch(EventNames.MATCH_NEW_LIST);
					MatchSignData.checkWillStart();
					Laya.timer.loop(60 * 1000, this, MatchSignData.checkWillStart);
				}
			});
		}

		public static getStatus(): void {
			if (MatchSignData._matchList.length) {
				var list: Array<number> = [];
				for (var i: number = 0; i < MatchSignData._matchList.length; i++) {
					list.push(MatchSignData._matchList[i].code);
				}
				matchSignService.getMatchStatus(list, (response) => {
					if (response.code == 0) {
						for (var i: number = 0; i < response.list.length; i++) {
							for (var j: number = 0; j < MatchSignData._matchList.length; j++) {
								if (response.list[i].code == MatchSignData._matchList[j].code) {
									MatchSignData._matchList[j].cnt = response.list[i].cnt;

									if (MatchConfig.isMatchStart(response.list[i].status)) {
										//之前未开始
										if (MatchSignData._matchList[j].hasOwnProperty("status") && !MatchConfig.isMatchStart(MatchSignData._matchList[j].status) && MatchSignData._matchList[j].mrule.matchmode == 161) {
											Laya.timer.once(5000, this, () => {
												if (!MatchSignInfoCtrl.instance.parent)
													MatchSignData.getMatchList();
											})
										}
									}



									//如果比赛已经开始
									if (MatchConfig.isMatchStart(response.list[i].status) && MatchSignData._matchList[j].signin == 1) {
										//之前未开始
										if (MatchSignData._matchList[j].hasOwnProperty("status") && !MatchConfig.isMatchStart(MatchSignData._matchList[j].status)) {
											Dispatcher.dispatch(EventNames.MATCH_START_WARN, [MatchSignData._matchList[j], 3]);//"已经开赛,请尽快参赛"
										}
										//之前未拿到状态
										if (!MatchSignData._matchList[j].hasOwnProperty("status")) {
											Dispatcher.dispatch(EventNames.MATCH_START_WARN, [MatchSignData._matchList[j], 2]);//"请及时回到比赛"
										}
									}

									MatchSignData._matchList[j].status = response.list[i].status;
									break;
								}
							}
						}
						MatchSignData.sortMatch();
						Dispatcher.dispatch(EventNames.MATCH_LIST_CHANGE);
					}
				})
			}
		}

		/**
		 * 
		 * @param code 加入桌子拿到比赛信息
		 * @param grule 
		 * @param mrule 
		 */
		public static setInfo(code: number, gamename: string, gamerule: string, matchrule: string, gamemode:number): void {
			var item: any;
			if (!MatchSignData._matchList)
				MatchSignData._matchList = [];
			for (var i: number = 0; i < MatchSignData._matchList.length; i++) {
				if (MatchSignData._matchList[i].code == code) {
					item = MatchSignData._matchList[i];
					break;
				}
			}
			if (!item) {
				item = {};
				item.code = code;
				MatchSignData._matchList.push(item);
				this.getStatus();
			}

			item.code = code;
			item.gname = gamename;
			item.gtype = GameDef.getGameTypeByGameName(gamename);
			item.gamemode = gamemode
			var mrule: any = JSON.parse(matchrule);
			item.mrule = mrule;
			MatchSignData.sortMatch();
			Dispatcher.dispatch(EventNames.MATCH_LIST_CHANGE);
		}

		public static setSignin(code: number, value: number): void {
			var item: any;
			if (MatchSignData._matchList) {
				for (var i: number = 0; i < MatchSignData._matchList.length; i++) {
					if (MatchSignData._matchList[i].code == code) {
						item = MatchSignData._matchList[i];
						break;
					}
				}
				if (item) {
					item.signin = value;
					if (value)
						item.cnt++;
					else
						item.cnt--;
					MatchSignData.sortMatch();
					Dispatcher.dispatch(EventNames.MATCH_LIST_CHANGE);
				}
			}
		}

		public static getInfoByCode(code: number): any {
			for (var i: number = 0; i < MatchSignData._matchList.length; i++) {
				if (MatchSignData._matchList[i].code == code) {
					return MatchSignData._matchList[i];
				}
			}
			return null;
		}

		private static sortMatch(): void {
			MatchSignData._matchList.sort(MatchSignData.onSort);
		}


		// 比赛列表排序规则：
		// 1.个人创建的比赛排在前面，官方赛在后
		// 2.自己创建的比赛（人满开赛在前，定时开赛在后）
		// 3.官方赛（人满开赛在前，定时开赛在后）
		// 4.人满开赛按照创建比赛时间从最早创建的开始排序，定时开始按照开赛时间从最近的开始排序
		private static onSort(a: any, b: any): number {
			var asys: number = Number(a.sys) || 0;
			var bsys: number = Number(b.sys) || 0;
			var amode: number = Number(a.mrule.matchmode) || 0;
			var bmode: number = Number(b.mrule.matchmode) || 0;
			var agid: number = Number(a.gid) || 0;
			var bgid: number = Number(b.gid) || 0;
			var astarttime: number = Number(a.mrule.starttime) || 0;
			var bstarttime: number = Number(b.mrule.starttime) || 0;

			//个人赛在前，官方赛在后
			if (asys > bsys)
				return 1;
			else if (asys < bsys)
				return -1;
			else {
				//人满开赛在前，定时开赛在后
				if (MatchConfig.isModeTime(amode) && MatchConfig.isModeMember(bmode))
					return 1;
				else if (MatchConfig.isModeMember(amode) && MatchConfig.isModeTime(bmode))
					return -1;
				else {
					//人满开赛按照创建比赛时间从最早创建的开始排序
					if (MatchConfig.isModeMember(amode)) {
						if (agid > bgid)
							return 1;
						else if (agid < bgid)
							return -1;
						else
							return 0;
					}
					//定时开赛
					else if (MatchConfig.isModeTime(amode)) {
						if (astarttime > bstarttime)
							return 1;
						else if (astarttime < bstarttime)
							return -1;
						else
							return 0;
					}
				}
			}
		}

		private static _backCode: number;
		public static set backCode(code: number) {
			this._backCode = code;
		}

		public static get backCode(): number {
			return this._backCode;
		}

		public static getMatchShareDesc(code: number): string {
			var match = MatchSignData.getInfoByCode(code);
			var str: string = "";
			if (match) {
				if (MatchConfig.isModeMember(match.mrule.matchmode)) {
					str += "满" + match.mrule.playercnt + "人开赛";
				}
				else {
					var d: Date = new Date(Number(match.mrule.starttime) * 1000);
					var h: number = d.getHours();
					var m: number = d.getMinutes();
					str += StringUtils.format(GameConfig.language.format_m_d_h_m, "", d.getMonth() + 1, d.getDate(), h < 10 ? "0" + h : h, m < 10 ? "0" + m : m) + "开赛";
				}
				str += "  免费报名。赛事多多，惊喜多多！"
			}
			return str;
		}

		public static getReward(code: number, callback: any): void {
			var flag: boolean = true;
			if (MatchSignData._matchList) {
				for (var i: number = 0; i < MatchSignData._matchList.length; i++) {
					if (MatchSignData._matchList[i].code == code) {
						if (MatchSignData._matchList[i].reward) {
							flag = false;
							if (callback)
								callback(MatchSignData._matchList[i].reward);
							break;
						}
					}
				}
			}
			if (flag) {
				server.MatchRewardListReq();
				server.on(EventNames.GAME_MATCH_REWARD_LIST_REP, this, MatchSignData.setReward, [code, callback]);
			}
		}

		private static setReward(code: number, callback: any, msg: any): void {
			var item: any;
			if (MatchSignData._matchList) {
				for (var i: number = 0; i < MatchSignData._matchList.length; i++) {
					if (MatchSignData._matchList[i].code == code) {
						item = MatchSignData._matchList[i];
						break;
					}
				}
				if (item) {
					item.reward = msg.reward;
					if (callback)
						callback(MatchSignData._matchList[i].reward);
					// Dispatcher.dispatch(EventNames.MATCH_LIST_CHANGE);
				}
			}
		}

		private static checkWillStart(): void {
			for (var i: number = 0; i < MatchSignData._matchList.length; i++) {
				if (MatchSignData._matchList[i].mrule && MatchSignData._matchList[i].mrule.starttime && MatchSignData._matchList[i].signin == 1 && !MatchConfig.isMatchStart(MatchSignData._matchList[i].status)) {
					var now: number = server.serverTime ? server.serverTime * 1000 : new Date().getTime();
					var starttime = Number(MatchSignData._matchList[i].mrule.starttime) * 1000;
					var leftTime: number = starttime - now;
					// 距离开赛时间3分钟以内
					if (leftTime < (3 * 60 * 1000)) {
						Dispatcher.dispatch(EventNames.MATCH_START_WARN, [MatchSignData._matchList[i], 1]);
					}
				}
			}
		}

		private static _currentMatchCode: number;
		public static set currentMatchCode(value: number) {
			MatchSignData._currentMatchCode=value;
		}

		public static get currentMatchCode(): number {
			return MatchSignData._currentMatchCode;
		}

		// public static isFreeMatch(code: number): boolean {
		// 	for (var i: number = 0; i < MatchSignData._matchList.length; i++) {
		// 		if (MatchSignData._matchList[i].code == code) {
		// 			if (MatchSignData._matchList[i].mrule.cost && Number(MatchSignData._matchList[i].mrule.cost)>0)
		// 				return false;
		// 			else
		// 				return true;
		// 		}
		// 	}
		// 	return true;
		// }

		
	}
}

