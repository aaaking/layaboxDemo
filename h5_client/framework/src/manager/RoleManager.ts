/*
* @author seacole
 * 玩家集
*/
class RoleManager {
    constructor() {

    }

    // "sex":"1","avatar":"","uid":363686,"nk":"zhc134"
    public static dic: any = {};

    public static addRoleByInfos(data: Array<any>): void {
        if (data) {
            for (var i: number = 0; i < data.length; i++) {
                RoleManager.dic[data[i].uid] = data[i];
                RoleManager.dic[data[i].uid].nickname = data[i].nk || data[i].nickname;
            }
        }
    }

    public static getRole(uid: number): any {
        if (RoleManager.dic[uid])
            return RoleManager.dic[uid];
        return null;
    }

}