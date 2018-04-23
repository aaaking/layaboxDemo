/*
* @author seacole
 * 俱乐部搜索
*/
module club {
    export class ClubSearch extends BaseCtrl {
        constructor() {
            super();
            this["name"] = "ClubSearch";
        }

        private static _instance: ClubSearch;
        static get instance(): ClubSearch {
            if (!this._instance)
                this._instance = new ClubSearch();
            return this._instance;
        }

        protected _ui: ui.club.ClubSearchListUI;
        private _data: any;

        public show(data: any): void {
            this._data = data;
            this.showself();
        }

        public beforeShow(): void {
            if (!this._ui) {
                this._ui = new ui.club.ClubSearchListUI();
                this._ui._list.itemRender = ClubListRenderer;
                this._ui._list.scrollBar.visible = false;
                // this._ui._list.scrollBar.elasticDistance = 100;
                // this._ui._list.selectEnable = true;
                this._ui._list.renderHandler = new Laya.Handler(this, this.updateList);

                EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
                EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_JOIN_SUCC, this, this.onJoinSucc);
            }
            super.beforeShow();
            this.onShow();
        }

        /**
        * 开启监听，配置宽高，添加到舞台
        */
        public onShow(): void {
            super.onShow();
            this._ui._list.array = [this._data];
            this._ui._list.scrollBar.value = 0;
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
                // case this._btnClose:
                //     this.hide();
                //     break;
            }
        }

        /***渲染单元格时的回调方法***/
        private updateList(cell: MenuHistoryScoreRenderer, index: number): void {
            cell.updata(index);
        }

        private onJoinSucc():void{
            this.hide();
        }

    }
}