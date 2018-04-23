/*
* @author seacole
 * 俱乐部改名
*/
module club {
	export class ClubRename extends BaseCtrl {
		constructor() {
			super();
			this["name"] = "ClubRename";

		}

		private static _instance: ClubRename;
		static get instance(): ClubRename {
			if (!this._instance)
				this._instance = new ClubRename();
			return this._instance;
		}

		protected _ui: ui.club.ClubRenameUI;
		private _cid:number;

		public show(cid:number): void {
			this._cid=cid;
			this.showself();
		}

		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.club.ClubRenameUI();

				EventManager.instance.registerOnObject(this, this._ui._btnConfirm, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnCancel, Laya.Event.CLICK, this, this.hide);
				EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
				EventManager.instance.registerOnObject(this, this._ui._input, Laya.Event.INPUT, this, this.onInputChange);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_RENAME_SUCC, this, this.onRenameSucc);
				

			}
			super.beforeShow();
			this.onShow();
		}

        /**
        * 开启监听，配置宽高，添加到舞台
        */
		public onShow(): void {		
			super.onShow();
			this._ui._input.text="";
			this.tweenSelf();
		}
        /**
         * 离开时调度
         */
		public afterShow(): void {
			super.afterShow();
		}

		private onInputChange(e: Laya.Event): void {
			var flag: boolean;
			while (Utils.getCharCodeLength(this._ui._input.text) > 20) {
				flag = true;
				this._ui._input.text = this._ui._input.text.substring(0, this._ui._input.text.length - 1);
			}
			if (flag)
				HintCtrl.instance.show(GameConfig.language.match_name_too_long);
		}

		private onTouch(e: Laya.Event): void {
			switch (e.currentTarget) {
				case this._ui._btnConfirm:
					if (this._ui._input.text)
						ClubAlert.instance.show(StringUtils.format(GameConfig.language.club_rename, this._ui._input.text), this, this.modify, this._ui._input.text);
					else
						AlertInGameCtrl.instance.show(GameConfig.language.club_create_2,null,0,false);
					break;
			}
		}

		private modify(params:any[]): void {
			var title:string=params[0];
			ClubManager.renameClub(this._cid,title);	
		}

		private onRenameSucc():void{
			this.hide();
		}

	}
}