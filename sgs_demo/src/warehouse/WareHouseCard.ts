/*
* name;
*/
class WareHouseCard extends Card {
    _canSee = false
    _originalY = 0
    constructor() {
        super();
        this.on(Laya.Event.MOUSE_DOWN, this, menu.MenuCard.normalSmall, [this]);
        this.on(Laya.Event.MOUSE_UP, this, menu.MenuCard.normalBig, [this]);
        this.on(Laya.Event.MOUSE_OUT, this, menu.MenuCard.normalBig, [this]);
        this.on(Laya.Event.CLICK, this, this.clickCard)
        this.anchorX = this.anchorY = 0.5
        this.height = this._bottomBox.y + (this._bottomBox.height)//360
        this._bottomBox.visible = true
        this.x = this.x + (this.width / 2)
        this.y = this.y + (this.height / 2) + Warehouse.STAR_TITLE_HEIGHT
    }

    private setCount() {
        this._middle.text = this.dataSource.count
        this._middle.x = this._left.x + this._left.width
        this._right.x = this._middle.x + this._middle.width
        this._bottomBox.centerX = 0
    }

    public updata(): void {
        super.updata();
        if (this.dataSource) {
            this._mask.visible = !this.dataSource.isHave
            this.setCount()
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
        if (DebugUtil.debugMode) {
            new HeroDetail(this, e.stageX, e.stageY)
        }
    }
}