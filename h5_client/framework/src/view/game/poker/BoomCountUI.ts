/*
* @author seacole
* 炸弹数量界面;
*/
module poker {
	export class BoomCountUI extends ui.poker.PokerBoomUI{
		constructor() {
			super();
			//倍数美术字
			this._fontData = new FontData();
			this._fontData.init(FontConfig.FONT_WAKENG_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_WAKENG1_JSON),
				Laya.loader.getRes(ResourceConfig.BITMAP_FONT_WAKENG1_PNG), 50, BPFont.LEFT);
			this._bpFont = FontManager.instance.addFont(this._fontData);
			this.addChild(this._bpFont);
			this._bpFont.pos(41, 12);
			this._bpFont.text = "*1";
		}
		private _fontData: FontData;//倍数
		private _bpFont: BPFont;//倍数

		public set count(value: number) {
            this._bpFont.text="*"+value+"";
        }
	}
}