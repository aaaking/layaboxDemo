/*
* @author seacole
* 桌子菜单
*/
class TableMenuUI extends ui.components.table.MenuUI {
    constructor() {
        super();
        this.name = "TableMenuUI";
        EventManager.instance.registerOnObject(this, this._btnMenu, Laya.Event.CLICK, this, this.onMenuTouch);
        EventManager.instance.registerOnObject(this, this._btnEnd, Laya.Event.CLICK, this, this.onMenuTouch);
        EventManager.instance.registerOnObject(this, this._btnSetup, Laya.Event.CLICK, this, this.onMenuTouch);
        EventManager.instance.registerOnObject(this, this._btnBack, Laya.Event.CLICK, this, this.onMenuTouch);
        EventManager.instance.registerOnObject(this, this._btnStandUp, Laya.Event.CLICK, this, this.onMenuTouch);
        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.MENU_CHECK, this, this.onCheck);
        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.MENU_TOUCH, this, this.onMenuTouch);
        this.mouseThrough = true;
    }

    private _y1: number = 1;
    private _y2: number = 73;
    private _y3: number = 145;
    private _y4: number = 217;
    private _h2: number = 146;
    private _h3: number = 218;
    private _h4: number = 290;
    private _timeCount: number;

    public addListener(): void {
        EventManager.instance.enableOnObject(this);
    }

    public removeListener(): void {
        EventManager.instance.disableOnObject(this);
    }

    private onCheck(): void {
        this._btnStandUp.visible = false;
        this._btnEnd.visible = false;
        this._btnBack.visible = false;
        this._btnSetup.visible = false;
        this._btnBack.skin = "table/table_btn_back.png";
        if (!GameConfig.IS_MATCH) {
            if (!BaseGameData.isTableStart) {
                if (BaseGameData.owner == server.uid)
                    this._btnBack.skin = "table/table_btn_back_3.png";
                else {
                    if (BaseGameData.selfSeatid)
                        this._btnBack.skin = "table/table_btn_back_3.png";
                }
            }
        }

        //返回 站起 解散 设置
        //旁观的人
        if (!BaseGameData.selfSeatid) {
            if (BaseGameData.owner == server.uid) {
                this._btnBack.visible = true;
                this._btnSetup.visible = true;
                this._btnBack.y = this._y1;
                if (!GameConfig.IS_MATCH) {
                    if (BaseGameData.isTableStart) {
                        this._imgBack.height = this._h2;
                        this._btnSetup.y = this._y2;
                    }
                    else {
                        this._btnEnd.visible = true;
                        this._imgBack.height = this._h3;
                        this._btnEnd.y = this._y2;
                        this._btnSetup.y = this._y3;
                    }
                }
                else {
                    this._imgBack.height = this._h2;
                    this._btnSetup.y = this._y2;
                }
            }
            else {
                this._btnBack.visible = true;
                this._btnSetup.visible = true;
                this._imgBack.height = this._h2;
                this._btnBack.y = this._y1;
                this._btnSetup.y = this._y2;
            }
        }
        //正在玩的玩家
        else if (BaseGameData.isTableStart) {
            this._btnBack.visible = true;
            this._btnSetup.visible = true;
            if (!GameConfig.IS_MATCH) {
                this._btnEnd.visible = true;
                this._imgBack.height = this._h3;
            } else {
                this._imgBack.height = this._h2;
            }
            this._btnBack.y = this._y1;
            if (!GameConfig.IS_MATCH) {
                this._btnEnd.y = this._y2;
                this._btnSetup.y = this._y3;
            } else {
                this._btnSetup.y = this._y2;
            }
        }
        //游戏前开始坐下的玩家 并且不是房主
        else if (BaseGameData.owner != server.uid) {
            this._btnBack.visible = true;
            this._btnSetup.visible = true;
            this._imgBack.height = this._h2;
            this._btnBack.y = this._y1;
            this._btnSetup.y = this._y2;
        }
        //游戏前开始坐下的玩家 房主
        else {
            this._btnBack.visible = true;
            this._btnSetup.visible = true;
            this._btnStandUp.visible = true;
            if (!GameConfig.IS_MATCH) {
                this._btnEnd.visible = true;
                this._imgBack.height = this._h4;
            } else {
                this._imgBack.height = this._h3;
            }
            this._btnBack.y = this._y1;
            this._btnStandUp.y = this._y2;
            if (!GameConfig.IS_MATCH) {
                this._btnEnd.y = this._y3;
                this._btnSetup.y = this._y4;
            } else {
                this._btnSetup.y = this._y3;
            }
        }
    }

    /**
     * 菜单touch
     */
    private onMenuTouch(e: Laya.Event, type: number): void {
        if (e) {
            switch (e.currentTarget) {
                case this._btnMenu:
                    this._box.visible = !this._box.visible;
                    break;

                case this._btnEnd:
                    this.onBtnEndTouch();
                    break;

                case this._btnBack:
                    this.onBtnBackTouch();
                    break;

                case this._btnSetup:
                    SetupCtrl.instance.show(false);
                    break;

                case this._btnStandUp:
                    server.standupReq();
                    break;
            }
        }
        else {
            if (type == 1)
                this.onBtnEndTouch();
            else if (type == 2)
                this.onBtnBackTouch();
        }
    }

    private onBtnEndTouch(): void {
        if (!BaseGameData.isTableStart) {
            if (server.uid == BaseGameData.owner) {
                AlertInGameCtrl.instance.show("牌局未开始，解散房间不扣钻石,<br />确定解散房间", (type: number) => {
                    if (type == AlertCtrl.CONFIRM) {
                        server.tableEndReq()
                    }
                }, 0, true, "table/jsfj.png")
            }
        } else {
            AlertInGameCtrl.instance.show("牌局已开始，解散房间不返还钻石,<br />确定解散房间", (type: number) => {
                if (type == AlertCtrl.CONFIRM) {
                    // server.tableEndReq()
                    server.playerVoteReq(1, 1, 1)
                }
            }, 0, true, "table/jsfj.png")

        }
    }

    private onBtnBackTouch(): void {
        if (BaseGameData.isTableStart && !GameConfig.IS_MATCH) {
            if (BaseGameData.selfSeatid)
                this.back3();
            else
                this.back();
        }
        //游戏未开始
        else {
            if (BaseGameData.selfSeatid && !GameConfig.IS_MATCH) {
                //自己是房主
                if (BaseGameData.owner == server.uid)
                    this.back1();
                //自己不是房主
                else
                    this.back2();
            }
            else
                this.back();
        }
    }

    private back1(): void {
        AlertInGameCtrl.instance.show(GameConfig.language.back_to_menu1, (type: number) => {
            if (type == AlertCtrl.CONFIRM) {
                this.back();
            }
        }, 0, true, ResourceConfig.ALERT_BACK_TO_MENU);
    }

    private back2(): void {
        var self: any = this;
        let text = GameConfig.language.back_to_menu2
        if (BaseGameData.divide) {
            text = StringUtils.format(GameConfig.language.back_to_menu4, BaseGameData.divide);
        }
        AlertInGameCtrl.instance.show(text, (type: number) => {
            if (type == AlertCtrl.CONFIRM) {
                server.standupReq();
                self._timeCount = 0;
                Laya.timer.loop(100, self, self.checkIsStandUp);
            }
        }, 0, true, ResourceConfig.ALERT_BACK_TO_MENU);
    }

    private back3(): void {
        AlertInGameCtrl.instance.show(GameConfig.language.back_to_menu3, (type: number) => {
            if (type == AlertCtrl.CONFIRM) {
                this.back();
            }
        }, 0, true, ResourceConfig.ALERT_BACK_TO_MENU);
    }

    private checkIsStandUp(): void {
        this._timeCount += 100;
        if (BaseGameData.selfSeatid) {
            if (this._timeCount >= 3000) {
                Laya.timer.clear(this, this.checkIsStandUp);
                this.back();
            }
        }
        else {
            Laya.timer.clear(this, this.checkIsStandUp);
            this.back();
        }
    }

    private back(): void {
        Utils.backToMenu()
        // if(GameConfig.IS_MATCH)
        //     matchSign.MatchSignData.backCode = BaseGameData.tableid
        // server.code = "";
        // AppControl.getInstance().showPage(MenuPage);
        // server.close();
    }


}