/*
* name;
*/
class Card extends ui.cards.CardUI {
    constructor() {
        super();
    }

    public updata(): void {
        if (this.dataSource) {
            this._icon.visible = true;
            this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png";
        }
        else
            this._icon.visible = false;
    }
}