/*
* @author seacole
 * 俱乐部创建
*/
module club {
    export class ClubJoin extends BaseCtrl {
        constructor() {
            super();
            this["name"] = "ClubJoin";


        }

        private static _instance: ClubJoin;
        static get instance(): ClubJoin {
            if (!this._instance)
                this._instance = new ClubJoin();
            return this._instance;
        }

        protected _ui: ui.club.ClubJoinUI;
        private _keyboard: KeyBoardNumUI;

        public show(): void {
            this.showself();
        }

        public beforeShow(): void {
            if (!this._ui) {
                this._ui = new ui.club.ClubJoinUI();
                this._keyboard = new KeyBoardNumUI(2);
                this._keyboard.centerX = 0;
                this._keyboard.y = 192;

                this._ui._box.addChild(this._keyboard);
                EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.KEYBOARD_NUM, this, this.onInputCountChanged);
                EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_SEARCH_SUCC, this, this.onSearchSucc);
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
            this._ui._input.text = "";
            this.tweenSelf();
        }
        /**
         * 离开时调度
         */
        public afterShow(): void {
            super.afterShow();
        }

        private onInputCountChanged(key: string): void {
            var num: number;
            switch (key) {
                case "10":
                    this._ui._input.text = "";
                    break;

                case "12":
                    this.search();
                    break;

                case "11":
                    this._ui._input.text += "0";
                    break;
                default:
                    this._ui._input.text += key;
                    break;
            }
            if (this._ui._input.text.length > 9)
                this._ui._input.text = this._ui._input.text.substr(0, 9);
            // if (this._ui._input.text.length == 6)
            // this.search();
        }

        private search(): void {
            if (this._ui._input.text) {
                var cid: number = Number(this._ui._input.text);
                ClubManager.searchClub(cid);
            }
            else{
                AlertInGameCtrl.instance.show(GameConfig.language.club_create_3,null,0,false);
            }
        }

        private onSearchSucc(response): void {
            ClubSearch.instance.show(response);
            this.hide();
        }


    }
}