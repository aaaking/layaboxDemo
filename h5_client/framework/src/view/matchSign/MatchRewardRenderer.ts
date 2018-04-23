/*
* @author seacole
* 比赛奖励Renderer;
*/
module matchSign {
	export class MatchRewardRenderer extends ui.matchSign.MatchRewardRendererUI {
		constructor() {
			super();
		}


		public updata(index: number, max: number): void {
			if (this.dataSource) {
				if (index <= 3) {
					this._labRank.text = "";
					this._imgRank.visible = true;
					this._imgRank.source = Laya.loader.getRes("matchSign/matchSign_rank_" + index + ".png");
				}
				else {
					this._labRank.text = index + "";
					this._imgRank.visible = false;
				}
				this._labReward.text = this.dataSource;
				this._imgLine.visible = index != max;
			}
		}
	}
}