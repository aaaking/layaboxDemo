/** 
 * @author seacole
 * 事件管理器
 */
class EventManager {
	private static _instance: EventManager;
	public static get instance(): EventManager {
		if (this._instance == undefined) {
			this._instance = new EventManager();
		}
		return this._instance;
	}

	private _groups: any = {};

	register(groupName: string, target: any, eventName: string, thisObj: any, callback: Function, params: any[]=[]): void {
		let item: RegisterItem = new RegisterItem();
		Utils.injectProp(item, { target, eventName, callback, thisObj, params}, null, false);

		let group: any = this._groups[groupName];
		if (!group) {
			group = this._groups[groupName] = { enable: false, items: [] };
		}
		group.items.push(item);
	}

	registerOnObject(obj: any, target: any, eventName: string, thisObj: any, callback: Function, params: any[]=[]): void {
		this.register(obj['name'], target, eventName, thisObj, callback,  params);
	}

	enable(groupName: string): void {
		let group: any = this._groups[groupName];
		if (group && !group.enable) {
			group.enable = true;
			group.items.forEach((item: RegisterItem) => {
				item.target['on'](item.eventName, item.thisObj , item.callback, item.params);
			});
		}
	}

	enableOnObject(obj: any): void {
		this.enable(obj['name']);
	}

	disable(groupName: string): void {
		let group: any = this._groups[groupName];
		if (group && group.enable) {
			group.enable = false;
			group.items.forEach((item: RegisterItem) => {
				item.target['off'](item.eventName, item.thisObj,item.callback);
			});
		}
	}

	disableOnObject(obj: any): void {
		this.disable(obj['name']);
	}

	dump(groupName: string = null): void {
		for (let key in this._groups) {
			let group: any = this._groups[key];
			console.log(key + '[' + group.items.length + ']: ' + (group.enable ? '● enable' : '○ disable'));
			console.log(group.items.map((item: RegisterItem) => { return item.eventName; }).join(','));
		}
	}

}
class RegisterItem {
	target: any;
	eventName: string;
	callback: Function;
	thisObj: any;
	params: any[];

}
