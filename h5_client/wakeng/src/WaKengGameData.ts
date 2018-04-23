/*
* name;
*/
class WaKengGameData {
    constructor() {

    }

    public static waKengCallScore: number;//协议外数据 挖坑叫分
    public static waKengHasBoom: boolean;//协议外数据 挖坑是否有炸弹
    public static waKengHasBlackDug: boolean;//协议外数据 挖坑是否有黑挖
    public static waKengBoomMultiply: boolean;//协议外数据 挖坑炸弹倍数

    public static getGameRule(): string {
        var str: string = "";
        if (WaKengGameData.waKengHasBoom)
            str += "炸弹";
        if (WaKengGameData.waKengHasBlackDug) {
            if (str != "")
                str += "/";
            str += "黑挖";
        }
        return str;
    }
}