/*
* @author seacole
* 挖坑单局结算;
*/
module poker {
	export class GameEndCtrl extends BaseCtrl {
		constructor() {
			super();
			this._autoHide = false;
		}

		protected _ui: any;
		protected _ani: Laya.FrameAnimation;
		protected _info: any;
		protected _infos: any = {};
		private _listData: Array<any>;

		public show(data: any): void {
			this._listData = data.playerInfo;
			if (data.hasOwnProperty("globalInfo"))
				BaseGameData.globalInfo = data.globalInfo;
			else
				BaseGameData.globalInfo = "";
			this.showself();
		}

		/**
		 * 这里完成new ui，添加注册监听等初始化工作
		 */
		public beforeShow(): void {
			super.beforeShow();
		}

		/**
		* 开启监听，配置宽高，添加到舞台
		*/
		public onShow(): void {
			if (this._info)
				this._info.removeSelf();
			if (BaseGameData.gameType == GameDef.GAME_TYPE.GUANPAI) {
				if (!this._infos[BaseGameData.gameType]) {
					this._info = new ui.guanpai.GuanPaiGameEndUI();
					this._info.centerX = 0;
					this._info.y = 213;
					this._info._list.itemRender = guanpai.GuanPaiGameEndInfoRenderer;
					this._info._list.renderHandler = new Laya.Handler(this, this.updateList);
					this._infos[BaseGameData.gameType] = this._info;
				}
				else
					this._info = this._infos[BaseGameData.gameType];
			}
			else if (BaseGameData.gameType == GameDef.GAME_TYPE.WAKENG) {
				if (!this._infos[BaseGameData.gameType]) {
					this._info = new ui.wakeng.WaKengGameEndUI();
					this._info.centerX = 0;
					this._info.y = 213;
					this._info._list.itemRender = WaKengGameEndInfoRenderer;
					this._info._list.renderHandler = new Laya.Handler(this, this.updateList);
					this._infos[BaseGameData.gameType] = this._info;
				}
				else
					this._info = this._infos[BaseGameData.gameType];
			}
			this._ui._box.addChild(this._info);
			this._info._btnNext.on(Laya.Event.CLICK, this, this.onTouch);
			this._info._btnScore.on(Laya.Event.CLICK, this, this.onTouch);

			super.onShow();
			this._ani.play(1, false);
			this._info._list.array = this._listData;
			// if (this._info._labInfo)
			// 	this._info._labInfo.text = this._globalInfo;

			if (BaseGameData.currHandCount == BaseGameData.totalHandCount) {
				this._info._btnNext.visible = false;
				this._info._btnScore.visible = true;
			}
			else {
				this._info._btnScore.visible = false;
				if (BaseGameData.selfSeatid)
					this._info._btnNext.visible = true;
				else
					this._info._btnNext.visible = false;
			}
		}
		/**
		 * 离开时调度
		 */
		public afterShow(): void {
			super.afterShow();
			this._info._list.array = [];
		}

		/***渲染单元格时的回调方法***/
		protected updateList(cell: ReportRenderer, index: number): void {
			cell.updata();
		}

		protected onTouch(e: Laya.Event): void {
			this.hide();
			switch (e.currentTarget) {
				case this._info._btnNext:
					server.playerReadyReq();
					break;

				case this._info._btnScore:
					TableEndCtrl.instance.show(BaseGameData.tableEndInfo)
					break;
			}
		}
	}
}