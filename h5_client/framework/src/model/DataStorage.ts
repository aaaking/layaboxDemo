/**
 * @author seacole
 * 数据存储类
 */

class DataStorage{
	name:string = 'save';
	save:any;
	prefix:string;

	/**
	 * 加载存储数据
	 */
	loadData():void{
		this.save = localStorage.getItem(this.name);
		try {
			this.save=JSON.parse(this.save);
		} catch (error) {
			
		}
		if (!this.save)
			this.save={};
	}

	/**
	 * 清空存储数据
	 */
	clearData(exclude:string[] = null):void{
		if(exclude){
			for(let key in this.save){
				if(exclude.indexOf(key) < 0){
					delete this.save[key];
				}
			}
		}else{
			this.save = {};
		}

		this.saveData();
	}

	/**
	 * 保存存储数据
	 */
	saveData():void{
		try {
			var str:string=JSON.stringify(this.save);
			localStorage.setItem(this.name, str);
		} catch (error) {
			
		}
		
	}

	/**
	 * 获取数据项
	 * @param key
	 * @param defaultValue  默认数据
	 * @returns {*}
	 */
	getItem(key:string, defaultValue:any = null):any{
		let item = this.save[key];
		if(item === null){
			item = defaultValue;
		}		
		return item;
	}

	/**
	 * 设置数据项
	 * @param key
	 * @param value
	 * @param autoSave  是否自动保存(false)
	 * @returns {*}     旧的数据
	 */
	setItem(key:string, value:any, autoSave:boolean = false):any{
		let oldValue = this.save[key];
		this.save[key] = value;

		if(autoSave){
			this.saveData();
		}

		return oldValue;
	}

	/**
	 * 改变数值
	 * @param key
	 * @param value
	 * @param autoSave
	 * @returns {*}
	 */
	changeItem(key:string, value:any, autoSave:boolean = false):any{
		let oldValue = this.save[key];
		this.save[key] = oldValue + value;

		if(autoSave){
			this.saveData();
		}

		return oldValue;
	}
}