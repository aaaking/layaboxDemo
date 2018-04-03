var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
* name;
*/
var Card = /** @class */ (function (_super) {
    __extends(Card, _super);
    function Card() {
        return _super.call(this) || this;
    }
    Card.prototype.updata = function () {
        if (this.dataSource) {
            this._icon.visible = true;
            this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png";
        }
        else
            this._icon.visible = false;
    };
    return Card;
}(ui.cards.CardUI));
//# sourceMappingURL=Card.js.map