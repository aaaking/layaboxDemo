/*
* name;
*/
class Card extends ui.cards.CardUI {
    _imgName: Laya.Image;
    constructor() {
        super();
        this._imgName = new Laya.Image();
        this._imgName.pos(0, 0);
        this.addChild(this._imgName);
    }

    public updata(): void {
        if (this.dataSource) {
            this.visible = true;
            this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png"
            this._imgName.skin = "cardsname/" + this.dataSource.cfg.icon + ".png"
        } else
            this.visible = false;
    }
}