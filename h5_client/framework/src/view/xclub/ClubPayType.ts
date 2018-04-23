/*
* @author seacole
 * 俱乐部paytype
*/
module club {
    export class ClubPayType extends BaseCtrl {
        constructor() {
            super();
            this["name"] = "ClubPayType";

        }

        private static _instance: ClubPayType;
        static get instance(): ClubPayType {
            if (!this._instance)
                this._instance = new ClubPayType();
            return this._instance;
        }

        protected _ui: ui.club.ClubPayTypeUI;
        private _cid: number;
        private _myClub: any;

        public show(cid: number): void {
            this._cid = cid;
            this._myClub = ClubManager.getClubByCid(this._cid);
            this.showself();
        }

        public beforeShow(): void {
            if (!this._ui) {
                this._ui = new ui.club.ClubPayTypeUI();

                EventManager.instance.registerOnObject(this, this._ui._btnConfirm, Laya.Event.CLICK, this, this.onTouch);
                EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
                EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_PAY_TYPE_CHANGE, this, this.onPayTypeChange);


            }
            super.beforeShow();
            this.onShow();
        }

        /**
        * 开启监听，配置宽高，添加到舞台
        */
        public onShow(): void {
            super.onShow();
            if (this._myClub.paytype == 1)
                this._ui._rad.selectedIndex = 0;
            else
                this._ui._rad.selectedIndex = 1;
        }
        /**
         * 离开时调度
         */
        public afterShow(): void {
            super.afterShow();
        }



        private onTouch(e: Laya.Event): void {
            switch (e.currentTarget) {
                case this._ui._btnConfirm:
                    var paytype: number;
                    if (this._ui._rad.selectedIndex == 0)
                        paytype = 1;
                    else
                        paytype = 0;
                    ClubManager.setClubPaytype(this._myClub.cid, paytype);
                    break;
            }
        }

        private onPayTypeChange(cid: number): void {
            if (this._myClub.cid == cid)
                this.hide();
        }

    }
}