/*
* @author seacole
* 比赛报名奖励Renderer;
*/
module matchSign {
	export class MatchSignRewardRenderer extends ui.matchSign.MatchSignRewardRendererUI {
		constructor() {
			super();
		}

		public updata(): void {
			if (this.dataSource) {
				this._btn.label = "奖励表" + this.dataSource;
			}
		}

		public set selected(value: boolean) {
			this._btn.selected = value;
		}
	}
}