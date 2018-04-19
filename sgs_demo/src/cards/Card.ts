/*
* name;
*/
class Card extends ui.cards.CardUI {
    constructor() {
        super();
        this._mask.size(CardList.CARD_WIDTH, CardList.CARD_HEIGHT)
    }

    public updata(): void {
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