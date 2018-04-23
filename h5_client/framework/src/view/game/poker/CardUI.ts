/**
* @author seacole
* 基础手牌 
*/
module poker {
	export class CardUI extends Laya.View {
		constructor() {
			super();
			this._imgFront = this.addChild(new Laya.Image()) as Laya.Image;
			this._imgNumber = this.addChild(new Laya.Image()) as Laya.Image;
			this._imgFlowerBig = this.addChild(new Laya.Image()) as Laya.Image;
			this._imgBack = this.addChild(new Laya.Image()) as Laya.Image;
			this.anchorX = 0.5;
			this.anchorY = 0.5;
		}
		protected _imgFront: Laya.Image;
		protected _imgKengZhu: Laya.Image;
		protected _imgNumber: Laya.Image;
		protected _imgFlowerBig: Laya.Image;
		protected _imgFlowerSmall: Laya.Image;
		protected _imgBack: Laya.Image;
		protected _imgMask: Laya.Image;
		protected _imgOver: Laya.Image;
		private _tweenUtil: TweenUtils;
		private _selected: boolean;
		private _card: number;
		private _endX: number;
		private _endY: number;
		protected static _pool: ObjectPool;
		protected static isMouseDown: boolean;
		public static mouseDownStartCard: number;
		public static mouseDownEndCard: number;

		protected static CARD_TYPE_BIG: number = 1;
		protected static CARD_TYPE_SMALL: number = 2;
		/**
		 * 黑桃
		 */
		public static FLOWER_SPADE: number = 3;
		/**
		 * 红心
		 */
		public static FLOWER_HEART: number = 2;
		/**
		 * 草花
		 */
		public static FLOWER_CLUB: number = 1;
		/**
		 * 方片
		 */
		public static FLOWER_DIAMOND: number = 0;


		protected _cardType: number;

		public set card(value: number) {
			this._card = value;
			var baseUrl: string = "";
			if (this._cardType == CardUI.CARD_TYPE_BIG)
				baseUrl = "pokerCardBig/pokerCardBig_";
			else
				baseUrl = "pokerCardSmall/pokerCardSmall_";

			if (BaseGameData.gameType == GameDef.GAME_TYPE.WAKENG)
				this._imgKengZhu.source = Laya.Loader.getRes(baseUrl + "kengZhu" + ".png");
			else if (BaseGameData.gameType == GameDef.GAME_TYPE.GUANPAI)
				this._imgKengZhu.source = Laya.Loader.getRes(baseUrl + "GuanPai" + ".png");

			if (value) {
				this._imgBack.visible = false;
				this._imgFront.visible = true;
				this._imgNumber.visible = true;
				this._imgFlowerBig.visible = true;
				if (this._imgFlowerSmall)
					this._imgFlowerSmall.visible = true;
				if (!this._imgFront.texture)
					this._imgFront.source = Laya.Loader.getRes(baseUrl + "front.png");
				if (this._imgOver && !this._imgOver.texture) {
					this._imgOver.source = Laya.Loader.getRes(baseUrl + "mask.png");
					this._imgOver.alpha = 0.2;
				}
				if (this._imgMask && !this._imgMask.texture)
					this._imgMask.source = Laya.Loader.getRes(baseUrl + "mask.png");

				var flower: number = value % 10;
				var num: number = Math.floor(value / 10);
				this._imgFlowerBig.source = Laya.Loader.getRes(baseUrl + "flower_big_" + flower + ".png");
				if (this._imgFlowerSmall)
					this._imgFlowerSmall.source = Laya.Loader.getRes(baseUrl + "flower_small_" + flower + ".png");
				var numUrl: string = baseUrl;
				if (this.isBlack(flower))
					numUrl += "black_";
				else
					numUrl += "red_";

				switch (BaseGameData.gameType) {
					case GameDef.GAME_TYPE.WAKENG:
						this.setWaKeng(num, numUrl);
						break;
					case GameDef.GAME_TYPE.SHISANSHUI:
						this.setShiSanShui(num, numUrl);
						break;
					case GameDef.GAME_TYPE.GUANPAI:
						this.setGuanPai(num, numUrl);
						break;
				}
			}
			else {
				if (!this._imgBack.texture)
					this._imgBack.source = Laya.Loader.getRes(baseUrl + "back.png");
				this._imgBack.visible = true;
				this._imgFront.visible = false;
				this._imgNumber.visible = false;
				this._imgFlowerBig.visible = false;
				if (this._imgFlowerSmall)
					this._imgFlowerSmall.visible = false;
			}
		}

		public get card(): number {
			return this._card;
		}

		public static clearMouseOver(): void {
			CardUI.isMouseDown = false;
			CardUI.mouseDownStartCard = 0;
			CardUI.mouseDownEndCard = 0;
		}

		public init(canTouch: boolean, data: any): void {
			CardUI.clearMouseOver();
			this.isOver = false;
			this.isMask = false;
			this.isMaster = false;
			this._selected = false;
			this.move(data, true, false, false);
			if (canTouch)
				this.addListener();
			else
				this.removeListener();
		}

		private setShiSanShui(num: number, numUrl: string): void {
			var imgNum: number = num;
			if (num == 14)
				imgNum = 1;
			// else if (num == 1)
			//  	imgNum = 14;
			// else if (num == 2)
			//  	imgNum = 14;
			this._imgNumber.source = Laya.Loader.getRes(numUrl + imgNum + ".png");
		}


		private setWaKeng(num: number, numUrl: string): void {
			var imgNum: number = num;
			if (num == 15)
				imgNum = 1;
			else if (num == 17)
				imgNum = 2;
			else if (num == 19)
				imgNum = 3;
			this._imgNumber.source = Laya.Loader.getRes(numUrl + imgNum + ".png");
		}

		private setGuanPai(num: number, numUrl: string): void {
			var imgNum: number = num;
			if (num == 16)
				imgNum = 2;
			else if (num == 14)
				imgNum = 1;
			this._imgNumber.source = Laya.Loader.getRes(numUrl + imgNum + ".png");
		}

		private isBlack(flower: number): boolean {
			return (flower == CardUI.FLOWER_CLUB || flower == CardUI.FLOWER_SPADE);
		}

		public set selected(value: boolean) {
			if (this._selected != value) {
				this._selected = value;
				this.move({ y: this._selected ? this._endY - 20 : this._endY }, false, false);
			}
		}

		public move(data: any, isEndPosi: boolean = false, needRemoveTouch: boolean = true, needTween: boolean = true, duration: number = 100, callback: any = null, thisObj: any = null, args: any = null, delay: number = 0): void {
			if (isEndPosi)
				this.setEndPosi(data.x, data.y);
			if (needRemoveTouch) {
				this._selected = false;
				this.removeListener();
			}
			// Laya.Tween.clearTween(this);
			if (this._tweenUtil)
				this._tweenUtil.clear();
			if (needTween) {
				if (!this._tweenUtil)
					this._tweenUtil = TweenUtils.get(this);
				this._tweenUtil.delay(delay).set({ visible: true }).to(data, duration, null, Laya.Handler.create(thisObj, callback, args));
			}

			// Laya.Tween.to(this, data, duration, null, Laya.Handler.create(thisObj, callback, args),delay);
			else
				Utils.injectProp(this, data);
		}

		public get selected(): boolean {
			return this._selected;
		}

		public set isOver(value: boolean) {
			if (this._imgOver)
				this._imgOver.visible = value;
		}

		public get isOver(): boolean {
			if (this._imgOver)
				return this._imgOver.visible;
			else
				return false;
		}

		public set isMask(value: boolean) {
			if (this._imgMask)
				this._imgMask.visible = value;
		}

		public get isMask(): boolean {
			if (this._imgMask)
				return this._imgMask.visible;
			else
				return false;
		}

		public set isMaster(value: boolean) {
			if (this._imgKengZhu)
				this._imgKengZhu.visible = value;
		}

		public get isMaster(): boolean {
			if (this._imgKengZhu)
				return this._imgKengZhu.visible;
			else
				return false;
		}

		public setEndPosi(x: number, y: number): void {
			this._endX = x;
			this._endY = y;
		}

		private addListener(): void {
			this.on(Laya.Event.CLICK, this, this.onMouseEvent);
			this.on(Laya.Event.MOUSE_DOWN, this, this.onMouseEvent);
			this.on(Laya.Event.MOUSE_UP, this, this.onMouseEvent);
			this.on(Laya.Event.MOUSE_OVER, this, this.onMouseEvent);
		}

		private removeListener(): void {
			this.off(Laya.Event.CLICK, this, this.onMouseEvent);
			this.off(Laya.Event.MOUSE_DOWN, this, this.onMouseEvent);
			this.off(Laya.Event.MOUSE_UP, this, this.onMouseEvent);
			this.off(Laya.Event.MOUSE_OVER, this, this.onMouseEvent);
		}



		private onMouseEvent(e: Laya.Event): void {
			switch (e.type) {
				case Laya.Event.MOUSE_OVER:
					if (CardUI.isMouseDown) {
						CardUI.mouseDownEndCard = this.card;
						Dispatcher.dispatch(EventNames.POKER_OVER_CHANGE, [true]);
					}
					break;
				case Laya.Event.MOUSE_DOWN:
					CardUI.isMouseDown = true;
					CardUI.mouseDownStartCard = this.card;
					this.isOver = true;
					break;
				// case Laya.Event.MOUSE_UP:
				// 	if (CardUI.isMouseDown) {
				// 		if (this.card != CardUI.mouseDownStartCard) {
				// 			CardUI.mouseDownEndCard = this.card;
				// 			Dispatcher.dispatch(EventNames.POKER_OVER_CHANGE, [false]);
				// 		}
				// 		CardUI.clearMouseOver();
				// 	}
				// 	break;
				case Laya.Event.CLICK:
					this.selected = !this.selected;
					SoundManager.instance.playEffect("touch_card_p", 0);
					if (this.selected) {

						
						Dispatcher.dispatch(EventNames.POKER_SELECTED_CHANGE, this.card);
					}
					else
						Dispatcher.dispatch(EventNames.POKER_SELECTED_CHANGE);
					break;
			}
		}

		public static borrowCard(): CardUI {
			return;
		}

		public static returnCard(card: CardUI): void {

		}

		public play() {
			this._imgFront.visible = false;
			this._imgNumber.visible = false;
			this._imgFlowerBig.visible = false;
			this._imgFlowerSmall.visible = false;
			let fanpai = new ui.shisanshui.fanpaiUI()

			fanpai._imgFlowerSmall.skin = this._imgFlowerSmall.source.url
			fanpai._imgNum.skin = this._imgNumber.source.url
			fanpai._imgFlowerBig.skin = this._imgFlowerBig.source.url
			this.addChild(fanpai)
			fanpai.ani1.play(1, false)
			Laya.timer.once(1000, this, function () {
				fanpai.ani1.stop()
				fanpai.removeSelf()
				this._imgFront.visible = true;
				this._imgNumber.visible = true;
				this._imgFlowerBig.visible = true;
				this._imgFlowerSmall.visible = true;
			})


		}
	}

}