/*
* @author seacole
* 大厅页签;
*/
class MenuLobbyUI extends ui.components.menu.MenuLobbyUI {
    constructor() {
        super();
        this.name = "MenuLobbyUI";
        this._head = new HeadUI();
        this._head.setLabName({ x: 106, y: 15, align: "left", color: "#000000" });
        this._head.setLabInfo(HeadUI.TYPE_GOLD, { x: 106, y: 50, align: "left", color: "#ff8e00" });
        this._head.pos(20, 10);
        this.addChildAt(this._head, 0);

        this._list.itemRender = MenuGameRenderer;
        this._list.scrollBar.visible = false;
        this._list.selectEnable=true;
        this._list.renderHandler = new Laya.Handler(this, this.updateList);
        this._list.mouseHandler = new Laya.Handler(this, this.onSelect);
        var _listArr: Array<any> = [];
        for (var idx in GameConfig.cfgGameList) {
            _listArr.push(GameConfig.cfgGameList[idx]);
        }
        this._list.array = _listArr;

        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.REFRESH_ROLE_INFO, this, this.onRefreshRoleInfo);
        EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);
    }

    private _head: HeadUI;
    public addListener(): void {
        EventManager.instance.enableOnObject(this);
        this.onResize();
    }

    public removeListener(): void {
        EventManager.instance.disableOnObject(this);
    }

    private onResize(): void {
        this.width = AppControl.getInstance().stage.width;
    }

    private onRefreshRoleInfo(): void {
        this._head.data = GameLogic.selfData;
    }

    /***渲染单元格时的回调方法***/
    private updateList(cell: MenuGameRenderer, index: number): void {
        cell.updata();
    }

    /***选择单元格回调***/
    private onSelect(e: Laya.Event): void {
        if (e.type==Laya.Event.CLICK)
        {
            log((e.target as MenuGameRenderer).dataSource);
        }            
    }
}