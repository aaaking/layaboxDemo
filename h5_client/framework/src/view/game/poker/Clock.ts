/*
* @author seacole
* 倒计时的钟;
*/
module poker {
	export class Clock extends ui.poker.PokerClockUI {
		constructor() {
			super();
			this.init();
		}

		protected init(): void {
			this._fontData = new FontData();
			this._fontData.init(FontConfig.FONT_GUANPAI_1, Laya.loader.getRes(ResourceConfig.BITMAP_FONT_GUANPAI1_JSON),
				Laya.loader.getRes(ResourceConfig.BITMAP_FONT_GUANPAI1_PNG), 50, BPFont.CENTER, FontData.TYPE_TIME, false);
			this._fontData.text = "0";
			this._bpFont = FontManager.instance.addFont(this._fontData);
			this.addChild(this._bpFont);
			this._bpFont.pos(38, 43);
		}

		protected _fontData: FontData;
		protected _bpFont: BPFont;

		public set time(value: number) {
			this.ani1.stop();
			this._bpFont.start(value);
			if (value > 5) {
				Laya.timer.clear(this, this.onWarn);
				Laya.timer.once(value * 1000 - 5000, this, this.onWarn);
			}
			else
				this.ani1.play(0, true);
		}

		protected onWarn(): void {
			SoundManager.instance.playEffect("timeup", 0);
			this.ani1.play(0, true);
		}


		public stop(): void {
			Laya.timer.clear(this, this.onWarn);
			this._bpFont.stop();
			this.ani1.stop();
		}
	}
}