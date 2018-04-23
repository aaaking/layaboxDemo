/*
* @author seacole
* 比赛历史记录;
*/
class MatchHistoryCtrl extends BaseCtrl {
	constructor() {
		super();
		this["name"] = "MatchHistoryCtrl";
	}

	private static _instance: MatchHistoryCtrl;
	public static get instance(): MatchHistoryCtrl {
		if (!this._instance)
			this._instance = new MatchHistoryCtrl();
		return this._instance;
	}

	protected _ui: ui.components.menu.MatchHistoryUI;
	private _data: any;
	private _isFreeMatch: boolean;

	public show(data: any): void {
		this._data = data;
		this.showself();
	}

	/**
	 * 这里完成new ui，添加注册监听等初始化工作
	 */
	public beforeShow(): void {
		if (!this._ui) {
			this._ui = new ui.components.menu.MatchHistoryUI();

			this._ui._list.itemRender = MatchHistoryRenderer;
			this._ui._list.scrollBar.visible = false;
			this._ui._list.scrollBar.elasticDistance = 100;
			this._ui._list.selectEnable = true;
			this._ui._list.renderHandler = new Laya.Handler(this, this.updateList);
			this._ui._list.mouseHandler = new Laya.Handler(this, this.onSelect);

			EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);

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
		this._ui._imgName.skin = "res/gameIcon/gameIcon_matchInfo_" + this._data.gtype + ".png";
		this._ui._labMember.text = this._data.tplayer + "人";
		this._ui._labTitle.text = this._data.title;
		this._ui._labDua.text = TimeUtils.timeFormat(this._data.ttime, "{2}时{1}分");
		if (this._data.rank > 0) {
			this._ui._imgNoRank.visible = false;
			this._ui._labRank.text = this._data.rank;
		}
		else {
			this._ui._imgNoRank.visible = true;
			this._ui._labRank.text = "";
		}
		if (this._data.hasOwnProperty("list"))
			this.setList();
		else
			this._data.list = [];

	}

	/***渲染单元格时的回调方法***/
	protected updateList(cell: MatchHistoryRenderer, index: number): void {
		if (this._data.hasOwnProperty("list"))
			cell.updata(index == (this._data.list.length - 1),this.isFreeMatch);
	}

	/**
	 * 离开时调度
	 */
	public afterShow(): void {
		super.afterShow();
	}

	/***选择单元格回调***/
	private onSelect(e: Laya.Event): void {
		if (e.type == Laya.Event.MOUSE_OUT) {
			if (this._ui._list.scrollBar.value >= this._ui._list.scrollBar.max)
				this.getNextPage();
		}
	}

	private getNextPage(): void {
		if (this._data.page < this._data.pageCnt)
			webService.getHistoryMatch(this._data.gid, this._data.page + 1, this._data.gtype, "", 0, 0, 0, (response) => {
				if (response.code == 0) {
					if (response.page > this._data.page) {
						this._data.page = response.page;
						if (response.data) {
							this._data.list = this._data.list.concat(response.data);
							this.setList();
						}
					}
				}
			});
	}

	private setList(): void {
		if (this._data.list[0].hasOwnProperty("score") && Number(this._data.list[0].score) > 0)
			this.isFreeMatch = false;
		else
			this.isFreeMatch = true;
		this._ui._list.array = this._data.list;
	}

	private set isFreeMatch(value: boolean) {
		this._isFreeMatch = value;
		if (this._isFreeMatch) {
			this._ui._labNickname.centerX = 108;
			this._ui._labReward.visible = false;
		}
		else {
			this._ui._labNickname.centerX = 0;
			this._ui._labReward.visible = true;
		}
	}

	private get isFreeMatch(): boolean {
		return this._isFreeMatch;

	}
}