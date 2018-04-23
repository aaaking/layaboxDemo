/*
* @author seacole
 * 俱乐部创建弹窗
*/
module club {
	export class ClubAlert extends BaseCtrl {
		constructor() {
			super();
			this["name"] = "ClubAlert";
			this._autoHide=false;
		}
		private static _instance: ClubAlert;
		static get instance(): ClubAlert {
			if (!this._instance)
				this._instance = new ClubAlert();
			return this._instance;
		}

		protected _ui: ui.club.ClubAlertUI;

		private _msg: string;
		private _thisObj: Laya.Sprite;
		private _callBack: any;
		private _params: any[];

		public show(msg: string, thisObj: any, callback: any, ...params): void {
			this._msg = msg;
			this._thisObj = thisObj;
			this._callBack = callback;
			this._params = params;
			this.showself();
		}

		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.club.ClubAlertUI();

				EventManager.instance.registerOnObject(this, this._ui._btnConfirm, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnCancel, Laya.Event.CLICK, this, this.onTouch);

			}
			super.beforeShow();
			this.onShow();
		}

        /**
        * 开启监听，配置宽高，添加到舞台
        */
		public onShow(): void {
			super.onShow();
			this._ui._labMsg.style.align = "center";
			this._ui._labMsg.style.color = "#9b5036";
			this._ui._labMsg.style.fontSize = 24;
			this._ui._labMsg.style.leading = 10;
			this._ui._labMsg.style.valign = "middle";
			this._ui._labMsg.innerHTML = this._msg;
			this._ui._labMsg.y = 71 + (115 - this._ui._labMsg.contextHeight) * 0.5;
			this.tweenSelf();
		}
        /**
         * 离开时调度
         */
		public afterShow(): void {
			super.afterShow();
		}

		private onTouch(e: Laya.Event): void {
			switch (e.currentTarget) {
				case this._ui._btnConfirm:
					this.hide();
					if (this._callBack)
						this._callBack.call(this._thisObj,this._params);
					break;

				case this._ui._btnCancel:
					this.hide();
					break;
			}
		}
	}
}