/*
* name;
*/
class Card extends ui.cards.CardUI {
    constructor() {
        super();
    }

    public updata(): void {
        console.log(this.dataSource)
        if (this.dataSource) {
            this.visible = true;
            this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png"
            this._imgName.skin = "cardsname/" + this.dataSource.cfg.icon + ".png"
            if (this.dataSource.star) {
                this._star.skin = "star/" + this.dataSource.star + ".png"
            }
        } else
            this.visible = false;
    }
}