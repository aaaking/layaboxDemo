/**
 * @author seacole
 * 赋值
 */
class Model {
	public constructor() {
        
	}
	
    /**
     * 属性赋值
     */
    public set data(value: Object) {
        value["__proto__"] = null;
        for (var item in value) {
            if (this.hasOwnProperty("_" + item)) {
                if (item == "gold")
                    this["_" + item] = Number(value[item]);
                else if (item == "nickname")
                    this["_" + item] = Base64.decode(value[item]);
                else
                    this["_" + item] = value[item];
            }
        }
    }
       
    
	
}
