/*
 * @author seacole
 * 三带二动画
*/
module poker {
	export class EffectSanDaiEr extends ui.poker.sandaierUI {
		constructor() {
			super();			
		}
		private static _pool:ObjectPool;

		public static borrow(): poker.EffectSanDaiEr {
			if (!EffectSanDaiEr._pool)
				EffectSanDaiEr._pool = ObjectPool.getInstance("poker.EffectSanDaiEr", Laya.ClassUtils.getClass(poker.EffectSanDaiEr));
			return EffectSanDaiEr._pool.borrowObject() as poker.EffectSanDaiEr;
		}

		public static return(effect: poker.EffectSanDaiEr): void {
			if (EffectSanDaiEr._pool)
				EffectSanDaiEr._pool.returnObject(effect);
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