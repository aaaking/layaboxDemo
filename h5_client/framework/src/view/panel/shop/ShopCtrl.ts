/*
*  @author seacole
* 商场;
*/
class ShopCtrl extends BaseCtrl {
    constructor() {
        super();
    }

    protected _ui: ui.panel.ShopVUI;
    protected _listData: any[];

    private static _shopCtrl: ShopCtrl;
    public static get instance(): ShopCtrl {
        if (!this._shopCtrl)
            this._shopCtrl = new ShopCtrl();
        return this._shopCtrl;
    }

    public show(): void {
        if (Laya.stage.screenMode == Laya.Stage.SCREEN_HORIZONTAL)
            ShopHCtrl.instance.showself();
        else
            ShopVCtrl.instance.showself();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        super.onShow();
        this.onRefreshRoleInfo();
        GameLogic.selfData.query();
        this.setList();
        this.tweenSelf();
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

    protected setList(): void {
        if (!this._listData) {
            this._listData = [];
            var cfg: any = GameConfig.cfgShop;
            this._ui._labDesc.text = "";
            for (var key in cfg) {
                if (key == "tips") {
                    this._ui._labDesc.text = cfg[key];
                }
                else {
                    cfg[key].id = key;
                    this._listData.push(cfg[key]);
                }
            }
            this._ui._list.array = this._listData;
        }
    }

    protected onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._ui._close:
                this.hide();
                break;
        }
    }

    /***渲染单元格时的回调方法***/
    protected updateList(cell: ShopRenderer, index: number): void {
        cell.updata();
    }

    protected selectList(e: Laya.Event, index: number): void {
        if (e.type == Laya.Event.CLICK) {
            if (GameConfig.IS_BANSHU)
                HintCtrl.instance.show("该功能未开放");
            else
                Native.instance.recharge(this._listData[index].id);
        }
    }

    protected onRefreshRoleInfo(): void {
        this._ui._labDiamond.text = StringUtils.format(GameConfig.language.diamond, GameLogic.selfData.diamond)
    }

}