/**
* name 
*/
module guanpai {
	export class GuanPaiGameEndInfoRenderer extends ui.guanpai.GuanPaiGameEndInfoRendererUI {
		constructor() {
			super();
		}

		private onDataChanged(uid: number): void {
			if (this.dataSource && !this.dataSource.nickname && this.dataSource.hasOwnProperty("uid") && this.dataSource.uid == uid) {
				var player: PlayerData = BaseGameData.getPlayerDataByUid(uid);
				this.dataSource.nickname = player.nickname;
				this.updata();
				Dispatcher.off(EventNames.PLAYER_DATA_CHANGED, this, this.onDataChanged);
			}
		}


		//nickname leftCards boom score
		public updata(): void {
			if (this.dataSource) {
				this._labNickname.text = Utils.getFitNickName(this.dataSource.nickname, 10);
				if (!this.dataSource.nickname)
					Dispatcher.on(EventNames.PLAYER_DATA_CHANGED, this, this.onDataChanged);
				else
					Dispatcher.off(EventNames.PLAYER_DATA_CHANGED, this, this.onDataChanged);

				var isGrab: boolean;
				var i: number;
				if (this.dataSource.info[0].value == 0 && BaseGameData.btnSeatid) {
					isGrab = true;
					for (i = 0; i < this.dataSource.othersCards.length; i++) {
						if (this.dataSource.othersCards[i] != guanpai.GuanPaiGameData.maxCards) {
							isGrab = false;
							break;
						}
					}
				}
				var isPoGuan: boolean;
				if (BaseGameData.btnSeatid && BaseGameData.btnSeatid != this.dataSource.info[4].value && this.dataSource.seatid == this.dataSource.info[4].value)
					isPoGuan = true;
				this._imgPo.visible = isPoGuan;
				this._imgGrab.visible = isGrab;
				if (this.dataSource.info[0].value == guanpai.GuanPaiGameData.maxCards && BaseGameData.btnSeatid && BaseGameData.btnSeatid == this.dataSource.info[4])
					this._imgQuan.visible = true;
				else if (this.dataSource.info[0].value == guanpai.GuanPaiGameData.maxCards && !BaseGameData.btnSeatid)
					this._imgQuan.visible = true;
				else
					this._imgQuan.visible = false;

				this._labLeftCount.text = this.dataSource.info[0].value;

				if (this.dataSource.info[1].hasOwnProperty("value")) {
					this._labBomb.text = "×" + this.dataSource.info[1].value;
					this._imgBomb.visible = true;
				}
				else {
					this._labBomb.text = "";
					this._imgBomb.visible = false;
				}

				if (this.dataSource.info[2].hasOwnProperty("value")) {

					if (this.dataSource.info[2].value >= 0) {
						this._labScore.font = "font_num_14";
						this._labScore.text = "+" + this.dataSource.info[2].value;
					}
					else {
						this._labScore.font = "font_num_15";
						this._labScore.text = this.dataSource.info[2].value;
					}

				}
				else {
					this._labScore.text = "+0";
					this._labScore.font = "font_num_14"
				}



				var color: string = "";
				if (this.dataSource.seatid == BaseGameData.selfSeatid)
					color = "#ffe00d";
				else
					color = "#fff4d0";
				this._labNickname.color = color;
				this._labLeftCount.color = color;
				this._labBomb.color = color;
			}
		}
	}
}