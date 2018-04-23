/*
* @author seacole
* 扑克结算个人信息renderer
*/
module poker {
	export class GameEndInfoRenderer extends ui.poker.GameEndInfoRendererUI {
		constructor() {
			super();
		}

		private onDataChanged(uid:number):void
		{
			if (this.dataSource && !this.dataSource.nickname && this.dataSource.hasOwnProperty("uid") && this.dataSource.uid==uid)
			{
				var player:PlayerData=BaseGameData.getPlayerDataByUid(uid);
				this.dataSource.nickname = player.nickname;
				this.updata();
				Dispatcher.off(EventNames.PLAYER_DATA_CHANGED,this,this.onDataChanged);
			}
		}


		//nickname leftCards boom score
		public updata(): void {
			if (this.dataSource) {
				this._labNickname.text = this.dataSource.nickname;
				if (!this.dataSource.nickname)
					Dispatcher.on(EventNames.PLAYER_DATA_CHANGED,this,this.onDataChanged);
				else
					Dispatcher.off(EventNames.PLAYER_DATA_CHANGED,this,this.onDataChanged);
				if (this.dataSource.info[0].hasOwnProperty("value"))
					this._labLeftCards.text = this.dataSource.info[0].value;
				else
					this._labLeftCards.text = "0";
				if (this.dataSource.info[1].hasOwnProperty("value"))
					this._labBoom.text = this.dataSource.info[1].value;
				else
					this._labBoom.text = "0";
				if (this.dataSource.info[2].hasOwnProperty("value"))
					this._labScore.text = this.dataSource.info[2].value;
				else
					this._labScore.text = "0";
				this._imgMaster.visible = this.dataSource.seatid == BaseGameData.btnSeatid;
				var color: string = "";
				if (this.dataSource.seatid == BaseGameData.selfSeatid)
					color = "#D05A33";
				else
					color = "#EBCF71";
				this._labNickname.color = color;
				this._labLeftCards.color = color;
				this._labBoom.color = color;
				this._labScore.color = color;
				// console.warn(this._labNickname.displayWidth);
				this._imgMaster.x = this._labNickname.x + this._labNickname.width * 0.5 - (this._labNickname.getChildAt(0) as Laya.Text).textWidth * 0.5 - 10 - this._imgMaster.width * this._imgMaster.scaleX;
			}
		}
	}
}