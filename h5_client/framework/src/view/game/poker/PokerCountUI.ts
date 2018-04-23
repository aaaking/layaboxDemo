/*
* @author seacole
* 手牌数量界面;
*/
module poker {
    export class PokerCountUI extends ui.poker.PokerCountUI {
        constructor() {
            super();

            this._fontData = new FontData();
            this._fontData.init(FontConfig.FONT_WAKENG_3, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_WAKENG3_JSON),
                Laya.loader.getRes(ResourceConfig.BITMAP_FONT_WAKENG3_PNG), 42, BPFont.CENTER);
            // this._fontData.text = "10";
            this._bpFont = FontManager.instance.addFont(this._fontData);
            this.addChild(this._bpFont);
            this._bpFont.pos(7, 22);
        }

        private _fontData: FontData;
        private _bpFont: BPFont;

        public set count(value: number) {
            this._bpFont.text=value+"";
        }
    }
}