/*
* @author seacole
* 俱乐部成员 
*/
module club {
	export class ClubMember extends BaseCtrl {
		constructor() {
			super();
			this["name"] = "ClubMember";

		}

		private static _instance: ClubMember;
		static get instance(): ClubMember {
			if (!this._instance)
				this._instance = new ClubMember();
			return this._instance;
		}

		protected _ui: ui.club.ClubMemberUI;
		private _isCreator: boolean;
		private _cid: number;
		private _data: any;

		public show(isCreator: boolean, cid: number, data: any): void {
			this._data = data;
			this._cid = cid;
			this._isCreator = isCreator;
			this.showself();
		}

		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.club.ClubMemberUI();

				EventManager.instance.registerOnObject(this, this._ui._btnKick, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_KICK_OUT_SUCC, this, this.onKickOutSucc);


			}
			super.beforeShow();
			this.onShow();
		}

        /**
        * 开启监听，配置宽高，添加到舞台
		// {"sex":"1","avatar":"","uid":363686,"nk":"zhc134"}
        */
		public onShow(): void {
			super.onShow();
			this._ui._labId.text = StringUtils.format(GameConfig.language.club_search_1, this._data.uid + "");
			this._ui._labNickname.text = this._data.nk ? this._data.nk : "";
			this._ui._btnKick.visible = this._isCreator && this._data.uid != GameLogic.selfData.uid;
			var sex: number = this._data.sex ? this._data.sex : 1;

			this._ui._imgMale.visible = sex != 2;
			this._ui._imgFemale.visible = sex == 2;

			if (this._data.avatar) {
				this._ui._imgHead.texture = null;
				this._ui._imgHead.source = null;
				this._ui._imgHead.loadImage(this._data.avatar, 0, 0, 78, 78);
			}
			else {
				this._ui._imgHead.texture = null;
				this._ui._imgHead.source = null;
			}
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
				case this._ui._btnKick:
					ClubAlert.instance.show(StringUtils.format(GameConfig.language.club_kick, this._data.nk ? this._data.nk : ""), this, () => {
						ClubManager.kick(this._cid, this._data.uid);
					})
					break;
			}
		}

		private onKickOutSucc(cid: number, uid: number): void {
			if (this._cid == cid)
				this.hide();
		}

	}
}