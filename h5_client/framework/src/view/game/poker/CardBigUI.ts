/**
* @author seacole
* 基础大号手牌 
*/
module poker {
	export class CardBigUI extends CardUI {
		constructor() {
			super();
			this._cardType = CardUI.CARD_TYPE_BIG;
			this._imgFlowerSmall = this.addChild(new Laya.Image()) as Laya.Image;
			this._imgKengZhu = this.addChild(new Laya.Image()) as Laya.Image;
			this._imgOver = this.addChild(new Laya.Image()) as Laya.Image;
			this._imgOver.alpha=0.6;
			this._imgMask = this.addChild(new Laya.Image()) as Laya.Image;
			this._imgMask.alpha=0.4;
		}

		public static borrowCard(): CardUI {
			if (!CardBigUI._pool)
				CardBigUI._pool = ObjectPool.getInstance("poker.CardBigUI", Laya.ClassUtils.getClass(poker.CardBigUI));
			return CardBigUI._pool.borrowObject() as CardUI;
		}

		public static returnCard(card: CardUI): void {
			if (CardBigUI._pool)
				CardBigUI._pool.returnObject(card);
		}


	}
}