/*
* @author seacole
* 玩家头像 供list用
*/
class HeadRenderer extends HeadUI {
    constructor() {
        super();
    }

    public updata(): void {
        if (this.dataSource) {
            this.getInfo(this.dataSource);
        }
    }
}