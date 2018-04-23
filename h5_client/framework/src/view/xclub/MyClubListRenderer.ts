/*
* @author seacole
 * 我的俱乐部Renderer
*/
module club {
	export class MyClubListRenderer extends ui.club.MyClubListRendererUI {
		constructor() {
			super();
		}

		/**
	 * cid
	 * title
	 * role 100创始人
	 * cnt 总人数
	 * currcnt 当前人数
	 * gcnt 比赛数
	 */
		public updata(): void {
			this._labId.text = StringUtils.format(GameConfig.language.club_search_1, this.dataSource.cid);
			this._labTitle.text = this._dataSource.title;
			this._labMember.text = StringUtils.format(GameConfig.language.club_search_2,this.dataSource.currmem?this.dataSource.currmem:0,this.dataSource.maxmem?this.dataSource.maxmem:0);
			this._labCount.text = StringUtils.format(GameConfig.language.club_game_1, this.dataSource.gcnt?this.dataSource.gcnt:0);
			this._imgOwner.visible=ClubManager.isCreator(this.dataSource.role);
		}

	}
}