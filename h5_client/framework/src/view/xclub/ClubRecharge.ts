/*
* @author seacole
 * 俱乐部划账
*/
module club {
	export class ClubRecharge extends BaseCtrl {
		constructor() {
			super();
			this["name"] = "ClubRecharge";

		}

		private static _instance: ClubRecharge;
		static get instance(): ClubRecharge {
			if (!this._instance)
				this._instance = new ClubRecharge();
			return this._instance;
		}

		protected _ui: ui.club.ClubRechargeUI;
		private _cid: number;

		public show(cid: number): void {
			this._cid = cid;
			this.showself();
		}

		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.club.ClubRechargeUI();
				this._ui._input.type = "TYPE_NUMBER";

				EventManager.instance.registerOnObject(this, this._ui._btnConfirm, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnCancel, Laya.Event.CLICK, this, this.hide);
				EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
				EventManager.instance.registerOnObject(this, this._ui._input, Laya.Event.INPUT, this, this.onInputChange);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_RECHARGE_SUCC, this, this.onRechargeSucc);


			}
			super.beforeShow();
			this.onShow();
		}

        /**
        * 开启监听，配置宽高，添加到舞台
        */
		public onShow(): void {
			super.onShow();
			ClubManager.getMyClub();
			this._ui._input.text = "";
			this._ui._labDiamond.text = StringUtils.format(GameConfig.language.my_diamond, GameLogic.selfData.diamond);
			this.tweenSelf();
		}
        /**
         * 离开时调度
         */
		public afterShow(): void {
			super.afterShow();
		}

		private onInputChange(e: Laya.Event): void {

		}

		private onTouch(e: Laya.Event): void {
			switch (e.currentTarget) {
				case this._ui._btnConfirm:
					var value: number = Number(this._ui._input.text);
					if (value) {
						if (GameLogic.selfData.diamond >= value) {
							ClubAlert.instance.show(StringUtils.format(GameConfig.language.club_recharge, value), this, this.recharge, value);
						}
						else
							AlertInGameCtrl.instance.show(GameConfig.language.diamond_not_enough, (value) => {
								if (value == AlertCtrl.CONFIRM)
									ShopCtrl.instance.show();
							})
					}
					else
						AlertInGameCtrl.instance.show(GameConfig.language.club_recharge_2, null, 0, false);
					break;
			}
		}

		private recharge(value: string): void {
			ClubManager.recharge(this._cid, Number(value));
		}

		private onRechargeSucc(cid:number):void{
			if (this._cid==cid)
				this.hide();
		}

	}
}