/*
* @author seacole
* 比赛玩家列表Renderer;
*/
module matchSign {
	export class MatchSignUserListRenderer extends ui.matchSign.MatchSignUserRendererUI {
		constructor() {
			super();
		}


		public updata(): void {
			if (this.dataSource) {
				if (this.dataSource.hasOwnProperty("rank")) {
					if (this._dataSource.rank <= 3) {
						this._labRank.text = "";
						this._imgRank.visible = true;
						this._imgRank.source = Laya.loader.getRes("matchSign/matchSign_rank_" + this.dataSource.rank + ".png");
					}
					else {
						this._labRank.text = this.dataSource.rank;
						this._imgRank.visible = false;
					}

					if (this._dataSource.rank > this._dataSource.leftcnt)
						this._labScore.text = "已淘汰";
					else
						this._labScore.text = this.dataSource.score ? this.dataSource.score : 0;

				}
				else {
					this._labRank.text = "";
					this._imgRank.visible = false;
					this._labScore.text = "";
				}

				this._labNickname.text = Utils.getFitNickName(this.dataSource.nickname, 20);

			}
		}
	}
}