/*
 * @author seacole
 * 四带三动画
*/
module poker {
	export class EffectSiDaiSan extends ui.poker.sidaisanUI {
		constructor() {
			super();			
		}
		private static _pool:ObjectPool;

		public static borrow(): poker.EffectSiDaiSan {
			if (!EffectSiDaiSan._pool)
				EffectSiDaiSan._pool = ObjectPool.getInstance("poker.EffectSiDaiSan", Laya.ClassUtils.getClass(poker.EffectSiDaiSan));
			return EffectSiDaiSan._pool.borrowObject() as poker.EffectSiDaiSan;
		}

		public static return(effect: poker.EffectSiDaiSan): void {
			if (EffectSiDaiSan._pool)
				EffectSiDaiSan._pool.returnObject(effect);
		}

		public play(scale:number):void
		{					
			this.scale(scale,scale);	
			this.ani1.play(1,false);		
			this.ani1.on(Laya.Event.COMPLETE,this,this.onComplete);	
		}

		private onComplete():void
		{
			this.ani1.off(Laya.Event.COMPLETE,this,this.onComplete);
			this.ani1.stop();
			this.removeSelf();
		}
	}
}