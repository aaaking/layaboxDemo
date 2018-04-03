/**
 * @author seacole 
 * 事件抛出器
 */
class Dispatcher {
		static eventDispatcher:Laya.EventDispatcher;

		static init():void {
			Dispatcher.eventDispatcher = new Laya.EventDispatcher();
		}

		static dispatch(eventName:string, params:any = null):void {		
			Dispatcher.eventDispatcher.event(eventName,params);			
		}

		static on(eventName:string, thisObj:any,callback:Function):void {
			Dispatcher.eventDispatcher.on(eventName,thisObj,callback);
		}

		static off(eventName:string,  thisObj:any,callback:Function):void {
			Dispatcher.eventDispatcher.off(eventName, thisObj, callback);
		}
	}
