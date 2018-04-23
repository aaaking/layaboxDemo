/*
* @author seacole
* 比赛玩家列表Renderer;
*/
module matchSign {
	export class MatchSignUserList2Renderer extends ui.matchSign.MatchSignUser2RendererUI {
		constructor() {
			super();
		}


		public updata(): void {
			if (this.dataSource) {
				this._labNickname.text = Utils.getFitNickName(this.dataSource.nickname,20);
			}
		}
	}
}