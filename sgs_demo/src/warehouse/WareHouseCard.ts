/*
* name;
*/
class WareHouseCard extends Card {
    _canSee = false
    _originalY = 0
    constructor() {
        super();
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
        this.on(Laya.Event.CLICK, this, this.clickCard)
        this.x = this.x + (this.width / 2)
        this.y = this.y + (this.height / 2) + Warehouse.STAR_TITLE_HEIGHT
        this.anchorX = this.anchorY = 0.5
    }
    private _labCount: Laya.Label;

    public updata(): void {
        super.updata();
        if (this.dataSource) {
            this._mask.visible = !this.dataSource.isHave
            this._labCount.text = this.dataSource.count
            this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png";
            if (!this.dataSource.hasRendered) {
                this._originalY = this.y
                this.dataSource.originalY = this.y
                this.dataSource.hasRendered = true
            }
            // this.y = this.dataSource.originalY + (1 + 10 - this.dataSource.star) * Warehouse.STAR_TITLE_HEIGHT
            // console.log(this.dataSource + "   y:" + this.y + " this.dataSource.originalY:" + this.dataSource.originalY)
            if (!this._canSee) {
                this._canSee = true
            }
        } else {

        }
    }

    private clickCard(e: Laya.Event) {
        // console.log(DebugTool.debugMode)
        // console.log(window.location)
        // console.log(Utils.isRelease())
        if (/*DebugTool.debugMode*/!Utils.isRelease()) {
            new HeroDetail(this, e.stageX, e.stageY)
        }
    }
}