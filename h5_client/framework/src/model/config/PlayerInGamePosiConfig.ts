/*
* @author seacole
* 获取不同游戏类型的位置
*/
class PlayerInGamePosiConfig {
    constructor() {

    }

    /**
     * 获取不同游戏类型，对应玩家位置的posi
     */
    public static getPosi(gameType: string, index: number): Array<number> {
        switch (gameType) {
            case GameDef.GAME_TYPE.SHANGQIU_MJ:
            case GameDef.GAME_TYPE.JINYUN_HZ_MJ:
            case GameDef.GAME_TYPE.JINYUN_GS_MJ:
            case GameDef.GAME_TYPE.JINYUN_MJ:
            case GameDef.GAME_TYPE.SHANXI_MJ:
                return PlayerInGamePosiConfig.getMJPosi(index);
            case GameDef.GAME_TYPE.WAKENG:
            case GameDef.GAME_TYPE.GUANPAI:
                return PlayerInGamePosiConfig.getWaKengPosi(index);
            case GameDef.GAME_TYPE.SHISANSHUI:
                return PlayerInGamePosiConfig.getShiSanShuiPosi(index);
        }
    }

    private static getShiSanShuiPosi(index: number): any {
        if (BaseGameData.isTableStart) {
            return ShiSanShuiLayOut.GAME_START_SEAT_LAYOUT[BaseGameData.maxPlayer - 1][index - 1]
        }
        else {
            return ShiSanShuiLayOut.SEAT_LAYOUT[BaseGameData.maxPlayer - 1][index - 1]
        }
    }
    private static getMJPosi(index: number): any {
        if (BaseGameData.isTableStart) {
            // return MaJiangLayOut.GAME_START_SEAT_LAYOUT[index-1]
            return MaJiangLayOut.GAME_START_SEAT_LAYOUT[BaseGameData.maxPlayer - 1][index - 1]
        }
        else {
            return MaJiangLayOut.SEAT_LAYOUT[BaseGameData.maxPlayer - 1][index - 1]
            //    return MaJiangLayOut.SEAT_LAYOUT[index-1]
        }
    }

    private static getWaKengPosi(index: number): any {
        if (BaseGameData.isTableStart) {
            // return WaKengLayOut.GAME_START_SEAT_LAYOUT[index - 1]
        }
        else {
            // return WaKengLayOut.SEAT_LAYOUT[index - 1]
        }
    }
}