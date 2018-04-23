/*
* @author seacole
 * 俱乐部
*/
module club {
	export class ClubCtrl extends BaseCtrl {
		constructor() {
			super();
			this["name"] = "ClubCtrl";
		}

		private static _instance: ClubCtrl;
		public static get instance(): ClubCtrl {
			if (!this._instance)
				this._instance = new ClubCtrl();
			return this._instance;
		}

		protected _ui: ui.club.ClubUI;
		private _p: Laya.View;
		private _lastCid: number;
		private _isGetMyClubCd: boolean;
		public show(p: Laya.View): void {
			this._p = p;
			this.showself();
		}

        /**
         * 这里完成new ui，添加注册监听等初始化工作
         */
		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.club.ClubUI();
				this._ui._list.itemRender = MyClubListRenderer;
				this._ui._list.scrollBar.elasticDistance = 100;
				this._ui._list.scrollBar.visible = false;
				this._ui._list.renderHandler = new Laya.Handler(this, this.updateList);
				this._ui._list.array = [];
				this._ui._list.mouseHandler = new Laya.Handler(this, this.selectList);

				EventManager.instance.registerOnObject(this, this._ui._btnCreate, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnJoin, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnAdd, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnCreate2, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnJoin2, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._boxMask, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.UPDATE_MY_CLUB_LIST, this, this.onUpdateClubList);

			}
			super.beforeShow();
			this.onShow();
		}

        /**
        * 开启监听，配置宽高，添加到舞台
        */
		public onShow(): void {
			if (!this._ui.parent) {
				this._p.addChild(this._ui);
				this._ui.zOrder = 1;
			}
			this.boxVis = false;
			super.onShow(4);			
			this.onUpdateClubList();

			if (this._lastCid || !this._isGetMyClubCd) {
				this._ui._btnCreate.visible = this._ui._btnJoin.visible = false;
				ClubManager.getMyClub();
				this._isGetMyClubCd = true;
				Laya.timer.once(5000, this, () => {
					this._isGetMyClubCd = false;
				});
			}

			if (this._lastCid)
				MyClubCtrl.instance.show(this._lastCid);
		}
        /**
         * 离开时调度
         */
		public afterShow(): void {
			super.afterShow();
		}

		public hide(): void {
			this._lastCid = 0;
			super.hide();
		}

		private onTouch(e: Laya.Event): void {
			switch (e.currentTarget) {
				case this._ui._btnCreate:
				case this._ui._btnCreate2:
					if (ClubManager.isClubFull()) {
						var str: string = GameConfig.language.club_web_error_code[1204];
						if (str) {
							AlertInGameCtrl.instance.show(str, null, 0, false);
						}
					}
					else
						ClubCreate.instance.show();
					this.boxVis = false;
					break;

				case this._ui._btnJoin:
				case this._ui._btnJoin2:
					ClubJoin.instance.show();
					this.boxVis = false;
					break;

				case this._ui._btnAdd:
					this.boxVis = !this._ui._boxAdd.visible;
					break;

				case this._ui._boxMask:
					this.boxVis = false;
					break;
			}
		}

		private set boxVis(value: boolean) {
			this._ui._boxAdd.visible = this._ui._boxMask.visible = value;
			this._ui.zOrder = value ? 4 : 1;
		}

		public addChild(node: Laya.Node): void {
			this._ui.addChild(node);
		}


		/***渲染单元格时的回调方法***/
		protected updateList(cell: ClubListRenderer, index: number): void {
			cell.updata();
		}

		private selectList(e: Laya.Event, index: number): void {
			if (e.type == Laya.Event.CLICK) {
				this._lastCid = this._ui._list.array[index].cid;
				MyClubCtrl.instance.show(this._ui._list.array[index].cid);
			}
		}

		private onUpdateClubList(): void {
			if (ClubManager.myClubs && ClubManager.myClubs.length) {
				this._ui._list.array = ClubManager.myClubs;
				this._ui._btnCreate.visible = this._ui._btnJoin.visible = false;
				this._ui._list.visible = true;
			}
			else {
				this._ui._list.array = [];
				this._ui._btnCreate.visible = this._ui._btnJoin.visible = true;
				this._ui._list.visible = false;
			}
		}

		public get lastCid(): number {
			return this._lastCid;
		}
	}
}