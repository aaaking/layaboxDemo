/*
* @author seacole
* 开房页签;
*/
class MenuFindUI extends ui.components.menu.MenuFindUI {
    constructor() {
        super();
        this.name = "MenuFindUI";
        this._head = new HeadUI();
        this._head.setImageBounds(88, 88)
        this._head.nameLimit = 20
        this._head.setLabName({ x: 106, y: 15, align: "left", color: "#0d0d0d", fontSize: 24 });
        this._head.setLabInfo(HeadUI.TYPE_UID, { x: 106, y: 53, align: "left", color: "#bee7fe", fontSize: 22 });
        this._head.pos(20, 10);
        this._headInfo.addChild(this._head);
        this._panel.vScrollBar.visible = false
        this._panel.visible=false;
        let games = GameDef.showGames
        let skins = []
        let i = 0
        this.arrgame = []
        for (var k in games) {
            let v = games[k]
            // skins.push("res/menu/create_"+v+".png")
            let button :component.BaseButton;
             if (GameConfig.IS_BANSHU)
             {
                  button= new component.BaseButton("banshu/create_" + k + ".png");
                //   button.skin
                //  button.skin = Laya.loader.getRes("res/banshu/create_" + v + ".png");
             }
                
            else
                 button= new component.BaseButton("res/menu/create_" + k + ".png");      
            // button.skin = "res/menu/create_"+v+".png"
            button.stateNum = 2
            // this.addChild(button)
            // button.centerX = 0
            button.centerX = (i%2) == 0 ? -150 : 150
            button.y = Math.floor(i/2) * 190 + 160
            button.name = String(k)
            EventManager.instance.registerOnObject(this, button, Laya.Event.CLICK, this, this.onGameTouch,[v]);
            i++
            if(GameConfig.IS_IOS_EXAMINE && i>1) break
            this.arrgame.push({"k":k,"games":v})
        }
        this.arrgame.sort(function(a,b){
            if (GameDef._showDes[a.k] > GameDef._showDes[b.k]) return 1;
            else return -1;
        })

        this._list.itemRender = component.BaseButton;
        this._list.scrollBar.visible = false;
        this._list.renderHandler = new Laya.Handler(this, this.updateListResult);
        this._list.selectEnable = true;
        this._list.mouseHandler = new Laya.Handler(this, this.goToPage);
        this._list.array = this.arrgame
        this._list.selectHandler = new Laya.Handler(this, this.goToPage)
        
        this._btnJoinMatch.top =  Math.ceil(i/2) * 180 +200
        this._btnJoin.top = this._btnJoinMatch.top+this._btnJoinMatch.height + 20
        if (Native.instance.isNative)
            this._ani.removeSelf();
        else
            this._ani.hitArea = new Laya.Rectangle(-115, -48, 230, 97);
        // Laya.loader.load(skins, Laya.Handler.create(this, this.onUIAssetsLoaded.bind(this)));

        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.REFRESH_ROLE_INFO, this, this.onRefreshRoleInfo);
        EventManager.instance.registerOnObject(this, this._ani, Laya.Event.CLICK, this, this.onTouch);
        
        EventManager.instance.registerOnObject(this, this._btnJoin, Laya.Event.CLICK, this, this.onTouch);
        EventManager.instance.registerOnObject(this, this._btnJoinMatch, Laya.Event.CLICK, this, this.onTouch);
        EventManager.instance.registerOnObject(this, this._btnRecharge, Laya.Event.CLICK, this, this.onTouch);
        EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);
    }
    private arrgame
    private updateListResult(cell: component.BaseButton, index: number): void {
        cell.skin = "res/menu/create_" + this.arrgame[index].k + ".png"
        cell.stateNum = 2
        cell.width = 280
        cell.height = 180
    }

    private goToPage(e:Laya.Event,index:number){
        if(e.type == "click"){
            console.log("index============="+index)
             if (GameLogic.selfData.game_code) {
                this.showPop()
            } else
                this.create(this.arrgame[index].k,this.arrgame[index].games);
        }
    }

    // protected onUIAssetsLoaded() {
    //     let games = GameDef.currentGames
    //     for (var k in games) {
    //         let v = games[k]
    //         let button = new component.BaseButton()
    //         if (GameConfig.IS_BANSHU)
    //             button.skin = "res/banshu/create_" + v + ".png";
    //         else
    //             button.skin = "res/menu/create_" + v + ".png"
    //         button.stateNum = 2
    //         this._panel.addChild(button)
    //         button.centerX = 0
    //         button.y = parseInt(k) * 180
    //         button.name = String(v)
    //         button.on(Laya.Event.CLICK, this, this.onTouch)
    //     }
    // }
    //100官方赛  101个人赛 <100普通局
    private _head: HeadUI;
    public addListener(): void {
        EventManager.instance.enableOnObject(this);
        if (GameLogic.selfData.game_code > 0) {
            this._btnJoin.skin = "menu/back.png"
        } else {
            this._btnJoin.skin = "menu/jrfj.png"
        }
        // webService.getUserInfo(server.uid, function (param) {
        //     if (param.diamond)
        //         this._diamond.text = StringUtils.format(GameConfig.language.diamond, param.diamond)
        // }.bind(this));
        if (!Native.instance.isNative)
            this._ani.play(1, true);
        this.onResize();
    }

    public removeListener(): void {
        if (!Native.instance.isNative)
            this._ani.stop();
        EventManager.instance.disableOnObject(this);
    }

    private onResize(): void {
        this.width = AppControl.getInstance().stage.width;
        this.height = (this.parent as Laya.Sprite).height - 80;
        this._ani.x = this.width - 230 * 0.5 - 20;
        var tmp: number = this.height;
        if (this.height > 1280)
            tmp = 1280;
        this._ani.y = tmp - 97 * 0.5 - 20;
    }

    private onRefreshRoleInfo(): void {
        this._head.data = GameLogic.selfData;
        if (GameLogic.selfData.game_code > 0) {
            this._btnJoin.skin = "menu/back.png"
        } else {
            this._btnJoin.skin = "menu/jrfj.png"
        }
        this._diamond.text = StringUtils.format(GameConfig.language.diamond, GameLogic.selfData.diamond)
    }

    private onGameTouch(param, e: Laya.Event){
        if (e.currentTarget.name) {
            if (GameLogic.selfData.game_code) {
                this.showPop()
            } else
                this.create(e.currentTarget.name,param);
        }
    }


    /**
    * 鼠标点击事件
    */
    private onTouch(e: Laya.Event,param) {
        switch (e.currentTarget) {
            // case this._btnCreate:
            //     if (GameLogic.selfData.game_code) {
            //         this.showPop()
            //     } else
            //         this.create(GameDef.GAME_TYPE.SHANXI_MJ);

            //     break;

            // case this._btnCreate2:
            //     if (GameLogic.selfData.game_code) {
            //         this.showPop()
            //     } else
            //         this.create(GameDef.GAME_TYPE.WAKENG);
            //     break;

            // case this._btnCreate3:
            //     if (GameLogic.selfData.game_code) {
            //         this.showPop()
            //     } else
            //         this.create(GameDef.GAME_TYPE.SHISANSHUI);
            //     break;
            // case this._btnCreate4:
            //     if (GameLogic.selfData.game_code) {
            //         this.showPop()
            //     } else
            //         this.create(GameDef.GAME_TYPE.JINYUN_MJ);
            //     break;

            case this._ani:
                Native.instance.gotoDownload();
                break;

            case this._btnJoin:
                this.join();
                break;

            case this._btnJoinMatch:
                matchSign.MatchSignCtrl.instance.show();
                break;

            case this._btnRecharge:
                ShopCtrl.instance.show();
                break;
        }
        if (e.currentTarget.name) {
            if (GameLogic.selfData.game_code) {
                this.showPop()
            } else
                this.create(e.currentTarget.name,param);
        }

    }

    private showPop() {
        AlertInGameCtrl.instance.show(StringUtils.format(GameConfig.language.alreadySeat, GameLogic.selfData.game_code), (code: number) => {
            if (code == AlertCtrl.CONFIRM) {
                this.join()
            } else {

            }
        });
    }
    private create(type: string,param): void {
        CreateTableCtrl.instance.show(type,param);
    }

    private join(): void {
        if (GameLogic.selfData.game_code > 0) {
            webService.joinTable(String(GameLogic.selfData.game_code), (response: any) => {
                if (response.code == 0) {
                    // this._ui._labRoom.focus = false;
                    GameConfig.setServerUrl(response.ip);
                    GameConfig.joinTable(response)
                }
                else {
                    GameLogic.selfData.game_code = 0
                    this.onRefreshRoleInfo();
                    AlertInGameCtrl.instance.show(GameConfig.language.join_fail, null, 0, false);
                    GameLogic.selfData.getInfo(true);
                }
            });
        } else {
            JoinTableCtrl.instance.show();
        }
    }
}