/*
* name;
*/
class WareHouseCard extends Card {
    constructor() {
        super();
        this._imgName = new Laya.Image();
        this._imgName.pos(14, 70);
        this.addChild(this._imgName);

        this._labCount = new Laya.Label();
        this._labCount.right = 20;
        this._labCount.bottom = 20;
        this._labCount.fontSize = 30;
        this._labCount.color = "#ffffff";
        this._labCount.stroke = 5;
        this._labCount.strokeColor = "0000000";
        this.addChild(this._labCount);
        this.on(Laya.Event.MOUSE_DOWN, this, runtime.RuntimeClickBtn.normalSmall, [this]);
        this.on(Laya.Event.MOUSE_UP, this, runtime.RuntimeClickBtn.normalBig, [this]);
        this.on(Laya.Event.MOUSE_OUT, this, runtime.RuntimeClickBtn.normalBig, [this]);
        this.on(Laya.Event.CLICK, this, this.clickCard);
    }
    private _imgName: Laya.Image;
    private _labCount: Laya.Label;

    public updata(): void {
        super.updata();
        this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png";
        this._imgName.skin = "cardsname/" + this.dataSource.cfg.icon + ".png";
        if (this.dataSource.isHave) {

            this._mask.visible = false;
        }
        else {
            this._mask.visible = true;

        }
        this._labCount.text = this.dataSource.count;
    }

    private clickCard() {

    }
}