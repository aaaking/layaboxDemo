/*
* @author seacole
* 倒计时的钟;
*/
class GuanPaiClock extends poker.Clock {
	constructor() {
		super();
	}

	protected init(): void {
		this._fontData = new FontData();
		this._fontData.init(FontConfig.FONT_GUANPAI_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_GUANPAI1_JSON),
			Laya.loader.getRes(ResourceConfig.BITMAP_FONT_GUANPAI1_PNG), 50, BPFont.CENTER, FontData.TYPE_TIME, false);
		this._fontData.text = "0";
		this._bpFont = FontManager.instance.addFont(this._fontData);
		this.addChild(this._bpFont);
		this._bpFont.pos(38, 43);

		this._img.skin = "guanpai/guanpai_img_9.png";
	}

	protected onWarn(): void {
		SoundManager.instance.playEffect("timeup", 0);
		this.ani1.play(0, true);
	}
}