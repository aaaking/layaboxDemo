/*
* name;
*/
class SceneMenu extends ui.scene.SceneMenuUI {
    constructor() {
        super();
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        this._btnWarehouse.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnCardPackage.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnShowcard.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnBankExchange.on(Laya.Event.CLICK, this, this.onTouch);
    }

    private static _instance: SceneMenu;
    public static get instance(): SceneMenu {
        if (!this._instance)
            this._instance = new SceneMenu();
        return this._instance;
    }

    public show(): void {
        this.onResize();
        Laya.stage.addChild(SceneMenu.instance);
        CardPackageManager.instance.testInitCards(function(){
            
        })
    }

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._btnWarehouse:
                Warehouse.instance.show(this);
                break;

            case this._btnCardPackage:
                CardPackage.instance.show(this);
                break;

            case this._btnShowcard:
                ShowCard.instance.show(this);
                break;
            case this._btnBankExchange:
                Exchange.instance.show(this);
                break;
        }
    }

    private onResize(e: Laya.Event = null): void {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }
}