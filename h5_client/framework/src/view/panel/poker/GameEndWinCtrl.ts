/*
* @author seacole
* 挖坑单局结算胜利;
*/
module poker {
	export class GameEndWinCtrl extends poker.GameEndCtrl {
		constructor() {
			super();
			this["name"] = "GameEndWinCtrl";

		}
		protected _ui: ui.poker.shengliUI;

		private static _instance: GameEndWinCtrl;
		public static get instance(): GameEndWinCtrl {
			if (!this._instance)
				this._instance = new GameEndWinCtrl();
			return this._instance;
		}

		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.poker.shengliUI();
				this._ani = this._ui.ani1;				
			}
			super.beforeShow();
			this.onShow();
		}

		public show(data: any): void {
			super.show(data);
			if (BaseGameData.gameType == GameDef.GAME_TYPE.GUANPAI)
				SoundManager.instance.playEffect("sound_win", 0);
			else if (BaseGameData.gameType == GameDef.GAME_TYPE.WAKENG)
				SoundManager.instance.playEffect("result_win", 0);
		}

	}
}