/*
* @author seacole
 * 俱乐部游戏列表
*/
module club {
	export class GameListRenderer extends ui.club.GameListRendererUI {
		constructor() {
			super();
		}

		public updata(): void {
			this._imgIcon.skin = "res/gameIcon/gameIcon_matchInfo_" + this.dataSource.gtype + ".png";
			this._imgIng.visible = this.dataSource.status > 0;
			if (this.dataSource.hasOwnProperty("mrule")) {
				this._boxMatch.visible = true;
				this._boxNormal.visible = false;
				var mrule: any = JSON.parse(this.dataSource.mrule);
				this._labMatchTitle.text = mrule.title;
				this._labMatchMember.text = this.dataSource.cnt ? this.dataSource.cnt : 0;
				if (MatchConfig.isModeTime(mrule.matchmode)) {
					var d: Date = new Date(Number(mrule.starttime)*1000);
					var h: number = d.getHours();
					var m: number = d.getMinutes();
					this._labMatchRule.text = StringUtils.format(GameConfig.language.format_m_d_h_m, "", d.getMonth() + 1, d.getDate(), h < 10 ? "0" + h : h, m < 10 ? "0" + m : m);
				}
				else {
					this._labMatchRule.text = StringUtils.format(GameConfig.language.matchsign_min_member2, mrule.playercnt);
				}
				this._imgReadying.visible = false;
				this._imgSignin.visible = !this._imgIng.visible;
			}
			else {
				this._boxMatch.visible = false;
				this._boxNormal.visible = true;
				var grule: any = JSON.parse(this.dataSource.grule);
				this._labMember.text = (this.dataSource.cnt ? this.dataSource.cnt : "0") + "/" + (grule.max_player ? grule.max_player : "0");
				this._labGameRule.text = GameConfig.getGameRule(GameDef.GAME_NAME[this.dataSource.gtype - 1], this.dataSource.grule, false,this.dataSource.diamond,this.dataSource.paytype);
				this._imgSignin.visible = false;
				this._imgReadying.visible = !this._imgIng.visible;
			}

		}
	}
}