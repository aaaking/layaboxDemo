/*
* @author seacole
* 俱乐部信息 设置
*/
module club {
	export class ClubInfoCtrl extends BaseCtrl {
		constructor() {
			super();
			this["name"] = "ClubInfoCtrl";
		}

		private static _instance: ClubInfoCtrl;
		public static get instance(): ClubInfoCtrl {
			if (!this._instance)
				this._instance = new ClubInfoCtrl();
			return this._instance;
		}

		protected _ui: ui.club.ClubInfoUI;
		private _cid: number;
		private _myClub: any;
		private _refreshMembersFirstPage: boolean;
		private _refreshMembersMore: boolean;
		public show(cid: number): void {
			this._cid = cid;
			this._myClub = ClubManager.getClubByCid(this._cid);
			this.showself();
		}

        /**
         * 这里完成new ui，添加注册监听等初始化工作
         */
		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.club.ClubInfoUI();
				this._ui._list.itemRender = ClubPlayerRenderer;
				this._ui._list.scrollBar.elasticDistance = 100;
				this._ui._list.scrollBar.visible = false;
				this._ui._list.renderHandler = new Laya.Handler(this, this.updateList);
				// this._ui._list.array = [];
				this._ui._list.mouseHandler = new Laya.Handler(this, this.selectList);
				this._ui._list.scrollBar.on(Laya.Event.CHANGE, this, this.onScrollMemberChanged);

				EventManager.instance.registerOnObject(this, this._ui._btnModify, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnExit, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnManager, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnDispose, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._btnBuy, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.UPDATE_MY_CLUB_MEMBERS_LIST, this, this.onUpdateMembersList);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.UPDATE_MY_CLUB_DIAMOND, this, this.onUpdateDiamond);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_RENAME_SUCC, this, this.onRenameSucc);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_QUIT_SUCC, this, this.onQuitSucc);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_DELETE_SUCC, this, this.onDeleteSucc);
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
			this._ui._list.array = [];
			this._ui._labTitle.text = this._myClub.title;
			this._ui._labId.text =StringUtils.format(GameConfig.language.club_search_1, this._myClub.cid);
			this._ui._labDiamond.text = this._myClub.diamond;
			var isCreator: boolean = ClubManager.isCreator(this._myClub.role);
			this._ui._boxDiamond.visible = this._ui._btnModify.visible = this._ui._btnDispose.visible = this._ui._btnManager.visible = isCreator;
			this._ui._btnExit.visible = !isCreator;
			this._ui._btnModify.x=this._ui._labTitle.x+this._ui._labTitle.displayWidth + 10 ;
			ClubManager.getMemberList(this._myClub.cid,1);
			this.tweenSelf();
		}
        /**
         * 离开时调度
         */
		public afterShow(): void {
			super.afterShow();
			ClubManager.removeMembers(this._cid);
		}

		private onUpdateDiamond(cid: number): void {
			if (this._myClub.cid == cid)
				this._ui._labDiamond.text = this._myClub.diamond + "";
		}

		private onUpdateMembersList(cid: number): void {
			if (this._myClub.cid == cid)
				this._ui._list.array = this._myClub.members;
		}

		private onRenameSucc(cid: number): void {
			if (this._myClub.cid == cid)
				this._ui._labTitle.text = this._myClub.title;
		}

		/***渲染单元格时的回调方法***/
		private updateList(cell: ClubPlayerRenderer, index: number): void {
			cell.updata();
		}

		/***选择单元格回调***/
		private selectList(e: Laya.Event, index): void {
			if (e.type == Laya.Event.CLICK) {
				ClubMember.instance.show(ClubManager.isCreator(this._myClub.role), this._myClub.cid, this._myClub.members[index]);
			}
		}

		private onScrollMemberChanged(e): void {
			if (this._ui._list.scrollBar.value < 0)
				this._refreshMembersFirstPage = true;
			else if (this._ui._list.scrollBar.value > 0)
				this._refreshMembersFirstPage = false

			if (this._refreshMembersFirstPage && this._ui._list.scrollBar.value == 0)
				ClubManager.getMemberList(this._myClub.cid,1);

			if (this._ui._list.scrollBar.value > this._ui._list.scrollBar.max)
				this._refreshMembersMore = true;
			else if (this._ui._list.scrollBar.value < this._ui._list.scrollBar.max)
				this._refreshMembersMore = false

			if (this._refreshMembersMore && this._ui._list.scrollBar.value == this._ui._list.scrollBar.max)
				ClubManager.getMemberList(this._myClub.cid);
		}

		private onTouch(e: Laya.Event): void {
			switch (e.currentTarget) {
				case this._ui._btnModify:
					ClubRename.instance.show(this._myClub.cid);
					break;

				case this._ui._btnExit:
					ClubAlert.instance.show(StringUtils.format(GameConfig.language.club_quit, this._myClub.title), this, () => {
						ClubManager.quitClub(this._myClub.cid);
					})
					break;

				case this._ui._btnManager:
					ClubPayType.instance.show(this._myClub.cid);
					break;

				case this._ui._btnDispose:
					ClubAlert.instance.show(StringUtils.format(GameConfig.language.club_delete, this._myClub.title), this, () => {
						ClubManager.deleteClub(this._myClub.cid);
					})
					break;

				case this._ui._btnBuy:
					ClubRecharge.instance.show(this._myClub.cid);
					break;
			}
		}

		private onQuitSucc(cid: number): void {
			if (this._myClub.cid == cid)
				this.hide();
		}

		private onDeleteSucc(cid: number): void {
			if (this._myClub.cid == cid)
				this.hide();
		}

		private onRechargeSucc(cid:number):void{
			if (this._cid==cid)
				this._ui._labDiamond.text = this._myClub.diamond;
		}
	}
}