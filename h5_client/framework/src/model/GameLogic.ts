/*
* @author seacole
* 游戏主逻辑;
*/
class GameLogic {
    constructor() {

    }

    /**
     * 自己数据
     */
    public static selfData: RoleData;
    /**
     * 用户本地保存数据
     */
    public static userData: UserData;

    public static init(): void {
        this.selfData = new RoleData();
        this.userData = new UserData();
        this.userData.loadData();
    }
}