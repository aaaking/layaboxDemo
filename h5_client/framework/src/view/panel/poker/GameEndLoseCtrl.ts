/*
* @author seacole
* 挖坑单局结算失败;
*/
module poker {
	export class GameEndLoseCtrl extends poker.GameEndCtrl {
		constructor() {
			super();
			this["name"] = "GameEndLoseCtrl";

		}

		protected _ui: ui.poker.shibaiUI;

		private static _instance: GameEndLoseCtrl;
		public static get instance(): GameEndLoseCtrl {
			if (!this._instance)
				this._instance = new GameEndLoseCtrl();
			return this._instance;
		}

		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.poker.shibaiUI();
				this._ani = this._ui.ani1;				
			}
			super.beforeShow();
			this.onShow();
		}

		public show(data: any): void {
			super.show(data);
			if (BaseGameData.gameType == GameDef.GAME_TYPE.GUANPAI)
				SoundManager.instance.playEffect("sound_lose", 0);
			else if (BaseGameData.gameType == GameDef.GAME_TYPE.WAKENG)
				SoundManager.instance.playEffect("result_lose", 0);
		}
	}
}