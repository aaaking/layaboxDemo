/**
* @author seacole
* 基础小号手牌 
*/
module poker {
	export class CardSmallUI extends CardUI {
		constructor() {
			super();
			this._imgKengZhu = this.addChild(new Laya.Image()) as Laya.Image;
			this._cardType = CardUI.CARD_TYPE_SMALL;
		}

		public static borrowCard(): CardUI {
			if (!CardSmallUI._pool)
				CardSmallUI._pool = ObjectPool.getInstance("poker.CardSmallUI", Laya.ClassUtils.getClass(poker.CardSmallUI));
			return CardSmallUI._pool.borrowObject() as CardUI;
		}

		public static returnCard(card:CardUI): void {
			if (CardSmallUI._pool)
				CardSmallUI._pool.returnObject(card);
		}
	}
}