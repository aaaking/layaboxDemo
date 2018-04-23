/*
* @author seacole
 * 创建桌子
*/
class CreateTableCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "CreateTableCtrl";
    }
    protected _createInfo = {}
    protected _newCreateInfo = {}
    protected _desc = {}
    public _cost
    public _costDivide
    public _costs
    private _gameType
    private static _instance: CreateTableCtrl;
    public static get instance(): CreateTableCtrl {
        if (!this._instance)
            this._instance = new CreateTableCtrl();
        return this._instance;
    }

    protected _ui: ui.panel.CreateTableUI;
    private _name
    private _data
    private _tabBtns
    private _cid: number;
    private _paytype: number;
    public show(type, param, cid: number = 0, paytype: number = 0): void {
        Laya.MouseManager.multiTouchEnabled = false
        this._gameType = type
        this._data = param
        this._cid = cid;
        this._paytype = paytype
        this.showself();
    }

    /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.CreateTableUI();
            EventManager.instance.registerOnObject(this, this._ui._btnCreate, Laya.Event.CLICK, this, this.onTouch);
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
            case this._ui._btnCreate:
                this.create();
                break;
        }
    }

    private showCreateInfo(type) {
        this._ui._panel.removeChildren()
        this._name = GameDef.GAME_NAME[type - 1]

        let info
        switch (String(type)) {
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

        let text = localStorage.getItem(this._name);
        this._createInfo = JSON.parse(text) || {};
        this._newCreateInfo = {}
        this._desc = {}
        let y = 0
        for (var k in info) {
            let view = new CreateItem()
            if (info[k].key == "charge_type" && this._cid && this._paytype == 1) {
                var tmp: any = {};
                Utils.deepCopy(info[k], tmp);
                tmp.des = ["俱乐部支付"];
                tmp.texts = ["俱乐部支付"];
                tmp.values = [2];
                view.dataSource = tmp;
            }
            else
                view.dataSource = info[k]

            view.updata(this.updateKey.bind(this), this._createInfo, this._newCreateInfo, this._desc)
            view.y = y
            view.x = 10
            y = y + view.height

            this._ui._panel.addChild(view)
        }
    }

    private checkTab(): void {
        if (this._data.length > 1) {
            this._ui._panel.top = 160
            this._ui._wanfa.removeChildren()
            this._tabBtns = []
            for (let k in this._data) {
                let btn = new component.BaseButton("createTable/gameTab.png", GameDef.GAME_NAME_CH[parseInt(this._data[k]) - 1])
                btn.stateNum = 3
                btn.labelSize = 28
                btn.labelColors = "#fff7b2,#fff7b2,#fff7b2,#fff7b2"

                btn.labelStrokeColor = "#cb5a20"
                btn.on(Laya.Event.CLICK, this, this.chooseWanFa, [this._data[k]])
                if (k == "0") {
                    btn.selected = true
                    btn.labelStroke = 3
                } else {
                    btn.labelStroke = 0
                }
                this._ui._wanfa.addChild(btn)
                this._tabBtns.push(btn)
                btn.pos(172 * parseInt(k) + 30, 5)
            }
            this.showCreateInfo(this._data[0])
        } else {
            this._ui._panel.top = 110
            this._ui._wanfa.removeChildren()
            this.showCreateInfo(this._gameType)
        }
        this._ui._diamond.text = "当前剩余钻石：" + GameLogic.selfData.diamond
    }

    private chooseWanFa(type, e) {
        for (var k in this._tabBtns) {
            let v = this._tabBtns[k]
            if (v == e.currentTarget) {
                v.selected = true
                v.labelStroke = 3
            } else {
                v.selected = false
                v.labelStroke = 0
            }
        }
        this._gameType = type

        this.showCreateInfo(type)

    }


    public updateKey(key, value) {
        this._newCreateInfo[key] = value
        console.info(this._newCreateInfo)
    }



    private create(): void {

        let desc = ""
        for (var k in this._desc) {
            if (k != "undefined" && this._desc[k] != "") {
                desc = desc + this._desc[k] + ","
            }
        }
        if (desc.length)
            desc = desc.substr(0, desc.length - 1);
        console.log("desc================" + desc)

        var str: string = JSON.stringify(this._newCreateInfo);

        console.info(this._desc)
        var score: string = "0"
        var count: string = this._newCreateInfo["max_hand_cnt"]
        webService.createTable(this._cid, this._gameType, this._name, count, this._newCreateInfo["max_player"], str, (response: any) => {
            if (response.code == 0) {
                this._newCreateInfo["desc"] = desc
                var storeStr: string = JSON.stringify(this._newCreateInfo);
                localStorage.setItem(this._name, storeStr);
                GameConfig.DESC[response.game_code] = desc;
                GameConfig.setServerUrl(response.ip);
                GameConfig.joinTable(response)
            }
            else {
                if (!club.ClubManager.dealClubErrorCode(response.code)) {
                    if (response.code == 1005) {
                        AlertInGameCtrl.instance.show(GameConfig.language.diamond_out, function (type) {
                            if (type == AlertCtrl.CONFIRM) {
                                ShopCtrl.instance.show();
                            }
                        }, 0, true, "", null, ["tongyong/tongyong_btn_buy.png"]);
                    } else if (response.code == 9001) {
                        HintCtrl.instance.show("操作太过频繁");
                    } else {
                        HintCtrl.instance.show(GameConfig.language.create_table_fail + " code:" + response.code);
                    }
                }
            }


        });
    }

}