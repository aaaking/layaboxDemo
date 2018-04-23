/*
* @author seacole
* 比赛报名;
*/
module matchSign {
    export class MatchSignCtrl extends BaseCtrl {
        constructor() {
            super();
            this["name"] = "MatchSignCtrl";
        }

        private static _instance: MatchSignCtrl;
        public static get instance(): MatchSignCtrl {
            if (!this._instance)
                this._instance = new MatchSignCtrl();
            return this._instance;
        }

        protected _ui: ui.matchSign.MatchSignUI;
        private _signKind: MatchSignKind;
        public show(): void {
            this.showself();
        }

        /**
         * 这里完成new ui，添加注册监听等初始化工作
         */
        public beforeShow(): void {
            if (!this._ui) {
                this._ui = new ui.matchSign.MatchSignUI();
                this._signKind = new MatchSignKind();
                this._ui.addChild(this._signKind);
                this._signKind.x = this._ui._btnCreate.x + (this._ui._btnCreate.width - this._signKind.width) * 0.5;
                this._signKind.bottom = this._ui._btnCreate.bottom + this._ui._btnCreate.height + 10;
                this._signKind.visible = false;
                EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
                EventManager.instance.registerOnObject(this, this._ui._btnCreate, Laya.Event.CLICK, this, this.onTouch);
                EventManager.instance.registerOnObject(this, this._ui._btnJoin, Laya.Event.CLICK, this, this.onTouch);
                EventManager.instance.registerOnObject(this, this._ui._btnHelp, Laya.Event.CLICK, this, this.onTouch);
                EventManager.instance.registerOnObject(this, this._ui._box, Laya.Event.CLICK, this, this.onTouch);

                EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.MATCH_LIST_CHANGE, this, this.onListChange);
                this._ui._list.itemRender = MatchSignMatchListRenderer;
                this._ui._list.scrollBar.elasticDistance = 100;
                this._ui._list.scrollBar.visible = false;
                this._ui._list.renderHandler = new Laya.Handler(this, this.updateList);
                this._ui._list.array = [];
                this._ui._list.mouseHandler = new Laya.Handler(this, this.selectList);
                // this._ui._tab.selectHandler = new Laya.Handler(this, this.checkTab);
                // this._ui._tab.selectedIndex = 0;
            }
            super.beforeShow();
            this.onShow();
        }

        /**
        * 开启监听，配置宽高，添加到舞台
        */
        public onShow(): void {
            super.onShow();
            this._signKind.visible = false;
            this.checkTab();
            this.startTimer();
        }
        /**
         * 离开时调度
         */
        public afterShow(): void {
            super.afterShow();
            for (var i: number = 0; i < this._ui._list.cells.length; i++) {
                this._ui._list.cells[i].stopTimer();
            }
            this.stopTimer();
        }


        private onTouch(e: Laya.Event): void {
            switch (e.currentTarget) {
                case this._ui._btnHelp:
                    HelpCtrl.instance.show(true, [1]);
                    e.stopPropagation();
                    break;

                case this._ui._btnCreate:
                    this._signKind.visible = !this._signKind.visible;
                    e.stopPropagation();
                    break;

                case this._ui._btnJoin:
                    JoinTableCtrl.instance.show();
                    e.stopPropagation();
                    break;

                default:
                    this._signKind.visible = false;
                    break;
            }
        }

        /***渲染单元格时的回调方法***/
        protected updateList(cell: MatchSignMatchListRenderer, index: number): void {
            cell.updata();
        }

        private selectList(e: Laya.Event, index: number): void {
            if (e.type == Laya.Event.CLICK) {
                if (e.target instanceof Laya.Button && e.target.name != "returnMatch") {

                }
                else {
                    webService.joinTable(String(this._ui._list.getItem(index).code), (response: any) => {
                        if (response.code == 0) {
                            GameConfig.setServerUrl(response.ip);
                            GameConfig.joinTable(response);
                        }
                        else {
                            AlertInGameCtrl.instance.show(GameConfig.language.match_not_exist, null, 0, false);
                            this.checkTab();
                        }
                    });
                }
            }
        }

        private checkTab(): void {
            MatchSignData.getMatchList();
            this._ui._list.scrollBar.value = 0;
        }

        private onListChange(): void {
            this._ui._labNoHistory.visible = MatchSignData._matchList.length == 0;
            this._ui._list.array = MatchSignData._matchList;
        }

        private startTimer(): void {
            this.stopTimer();
            Laya.timer.loop(10 * 1000, this, this.onTimer);
        }

        private stopTimer(): void {
            Laya.timer.clear(this, this.onTimer);
        }

        private onTimer(): void {
            if (!MatchSignInfoCtrl.instance.parent)
                MatchSignData.getStatus();
        }
    }
}