/*
* @author seacole
 * 俱乐部Renderer
*/
module club {
    export class ClubListRenderer extends ui.club.ClubListRendererUI {
        constructor() {
            super();
            this._btnJoin.on(Laya.Event.CLICK, this, this.onTouch);
            this._btnLook.on(Laya.Event.CLICK, this, this.onTouch);
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
            this._labMember.text = StringUtils.format(GameConfig.language.club_search_2, this.dataSource.currmem ? this.dataSource.currmem : 0, this.dataSource.maxmem ? this.dataSource.maxmem : 0);
            var isInClub: boolean = ClubManager.isInClub(this.dataSource.cid);
            this._btnJoin.visible = !isInClub;
            this._btnLook.visible = isInClub;
        }

        private onTouch(e: Laya.Event): void {
            switch (e.currentTarget) {
                case this._btnJoin:
                    ClubAlert.instance.show(StringUtils.format(GameConfig.language.club_search_3, this.dataSource.title), this, this.ask, this.dataSource.cid);
                    break;

                case this._btnLook:
                    ClubSearch.instance.hide();
                    MyClubCtrl.instance.show(this.dataSource.cid);
                    break;
            }

        }

        private ask(params: any[]): void {
            ClubManager.joinClub(params[0]);
        }
    }
}