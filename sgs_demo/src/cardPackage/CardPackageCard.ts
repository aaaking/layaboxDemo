/*
* name;
*/
class CardPackageCard extends Card {
    constructor() {
        super();
        this._btnSell = new Laya.Button("menu/btn_sell.png")
        this._btnSell.stateNum = 2
        // this._btnSell.anchorX = this._btnSell.anchorY = 0.5
        this._btnSell.centerX = 0;
        this._btnSell.bottom = 0;
        this._btnSell.on(Laya.Event.CLICK, this, this.onTouch);
        this.addChild(this._btnSell);
    }
    private _btnSell: Laya.Button;

    public updata(): void {
        super.updata();
        this._mask.visible = false
        if (this.dataSource) {
            this._btnSell.visible = true
        } else {
            this._btnSell.visible = false
        }
    }

    private onTouch(e: Laya.Event): void {
        Dispatcher.dispatch("showSellCards", this.dataSource);
    }

    // public updata(): void {
    //     super.updata();
    //     if (this.dataSource.isHave) {
    //         this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png";
    //         this._imgName.visible = false;
    //     }
    //     else {
    //         this._imgName.visible = true;
    //         this._imgName.skin = "cardsname/" + this.dataSource.cfg.icon + ".png";
    //         this._icon.skin = "cards/" + "0" + ".png";
    //     }
    //     this._labCount.text = this.dataSource.count;
    // }
}