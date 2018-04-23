/*
* @author seacole
 * 比赛规则
*/
module matchSign {
    export class MatchSignRuleCtrl extends BaseCtrl {
        constructor() {
            super();
            this["name"] = "MatchSignRuleCtrl";
        }
        protected _createInfo = {}
        protected _newCreateInfo = {}
        protected _desc = {}
        public _cost
        public _costDivide
        public _costs
        private _gameType
        private static _instance: MatchSignRuleCtrl;
        public static get instance(): MatchSignRuleCtrl {
            if (!this._instance)
                this._instance = new MatchSignRuleCtrl();
            return this._instance;
        }

        protected _ui: ui.matchSign.MatchSignRuleUI;
        private _name
        public show(type): void {
            Laya.MouseManager.multiTouchEnabled = false
            this._gameType = type
            this.showself();
        }

        /**
         * 这里完成new ui，添加注册监听等初始化工作
         */
        public beforeShow(): void {
            if (!this._ui) {
                this._ui = new ui.matchSign.MatchSignRuleUI();
                EventManager.instance.registerOnObject(this, this._ui._btnConfirm, Laya.Event.CLICK, this, this.onTouch);
                EventManager.instance.registerOnObject(this, this._ui._btnCancel, Laya.Event.CLICK, this, this.hide);
                this._ui._close.on(Laya.Event.CLICK, this, this.hide)
                this._ui._panel.vScrollBar.visible = false
            }
            super.beforeShow();
            this.onShow();
        }

        /**
        * 开启监听，配置宽高，添加到舞台
        */
        public onShow(): void {
            super.onShow();
            this.checkTab();

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
                case this._ui._btnConfirm:
                    this.save();
                    HintCtrl.instance.show(GameConfig.language.modify_succ);
                    Dispatcher.dispatch(EventNames.MATCH_RULE_CHANGE);
                    this.hide();
                    break;
            }
        }

        private checkTab(): void {
            this._ui._panel.removeChildren()
            this._name = GameDef.GAME_NAME[this._gameType - 1]

            let info
            switch (this._gameType) {
                case GameDef.GAME_TYPE.SHANXI_MJ:
                    info = ShanxiMJ.createInfo
                    this._cost = ShanxiMJ.cost
                    this._costDivide = ShanxiMJ.costDivide
                    this._costs = ShanxiMJ.costs
                    break;
                case GameDef.GAME_TYPE.WAKENG:
                    info = WaKeng.createInfo
                    this._cost = WaKeng.cost
                    this._costDivide = WaKeng.costDivide
                    this._costs = WaKeng.costs
                    break;
                case GameDef.GAME_TYPE.SHISANSHUI:
                    info = ShiSanShui.createInfo
                    this._cost = ShiSanShui.cost
                    this._costDivide = ShiSanShui.costDivide
                    this._costs = ShiSanShui.costs
                    break;
                case GameDef.GAME_TYPE.JINYUN_MJ:
                    info = JinYunMJ.createInfo
                    this._cost = JinYunMJ.cost
                    this._costDivide = JinYunMJ.costDivide
                    this._costs = JinYunMJ.costs
                    break;
                case GameDef.GAME_TYPE.JINYUN_GS_MJ:
                    info = JinYunGsMJ.createInfo
                    this._cost = JinYunGsMJ.cost
                    this._costDivide = JinYunGsMJ.costDivide
                    this._costs = JinYunGsMJ.costs
                    break;
                case GameDef.GAME_TYPE.JINYUN_HZ_MJ:
                    info = JinYunHzMJ.createInfo
                    this._cost = JinYunHzMJ.cost
                    this._costDivide = JinYunHzMJ.costDivide
                    this._costs = JinYunHzMJ.costs
                    break;
                case GameDef.GAME_TYPE.SHANGQIU_MJ:
                    info = ShangQiuMJ.createInfo
                    this._cost = ShangQiuMJ.cost
                    this._costDivide = ShangQiuMJ.costDivide
                    this._costs = ShangQiuMJ.costs
                    break;

                case GameDef.GAME_TYPE.GUANPAI:
                    info = GuanPai.createInfo
                    this._cost = GuanPai.cost
                    this._costDivide = GuanPai.costDivide
                    this._costs = GuanPai.costs
                    break;
            }
            if (GameConfig.IS_BANSHU)
                this._ui._gamename.skin = "banshu/create_gameType_" + this._gameType + ".png";
            else
                this._ui._gamename.skin = "createTable/" + this._gameType + ".png"

            let text = localStorage.getItem("matchRule_" + this._name);
            this._createInfo = JSON.parse(text) || {};
            this._newCreateInfo = {}
            this._desc = {}
            let y = 0
            for (var k in info) {
                if(info[k].matchvalue >= 0){
                    this._createInfo[info[k]["key"]] = info[k].matchvalue
                    this._newCreateInfo[info[k]["key"]] = info[k].matchvalue
                    continue
                }
                let view = new CreateItem()
                view.dataSource = info[k]
                view.updata(this.updateKey.bind(this), this._createInfo, this._newCreateInfo, this._desc)
                view.y = y
                view.x = 10
                y = y + view.height

                this._ui._panel.addChild(view)
            }
            // if (!text)
                this.save();
        }

        public updateKey(key, value) {
            this._newCreateInfo[key] = value
            console.info(this._newCreateInfo)
        }

        private save(): void {
            let desc = ""
            for (var k in this._desc) {
                if (k != "undefined" && this._desc[k] != "") {
                    desc = desc + this._desc[k] + ","
                }
            }
            if (desc.length)
                desc = desc.substr(0, desc.length - 1);
            this._newCreateInfo["desc"] = desc
            var storeStr: string = JSON.stringify(this._newCreateInfo);
            localStorage.setItem("matchRule_" + this._name, storeStr);
            console.log("desc================" + desc)
        }
    }
}