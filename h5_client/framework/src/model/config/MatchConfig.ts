/*
* @author seacole
* 比赛配置;
*/
class MatchConfig {
    constructor() {

    }
    /**
     * 最小开赛人数
     */
    public static MIN_MEMBER: number = 8;

    /**
     * 定时赛
     */
    public static MATCH_MODE_TIME: number = 101;
    /**
     * 人满即开
     */
    public static MATCH_MODE_MEMBER: number = 102;

    // /**
    // * 官方赛  100-150个人赛 >150官方赛
    // */
    // public static MATCH_MODE_OFFICAL: number = 1;

    // /**
    //  * 个人赛
    //  */
    // public static MATCH_MODE_PERSONAL: number = 2;

    public static MATCH_STATUS_NOT_BEGIN: number = 0;
    public static MATCH_STATUS_BEGIN_CAN_SIGNIN: number = 1;
    public static MATCH_STATUS_BEGIN_CAN_NOT_SIGNIN: number = 2;

    /**
     * 是否定时赛
     */
    public static isModeTime(value: number): boolean {
        return value % 10 == 1;
    }

    /**
     * 是否人满即开赛
     */
    public static isModeMember(value: number): boolean {
        return value % 10 == 2;
    }

    /**
     * 
     * @param status 比赛是否已经开始
     */
    public static isMatchStart(status: number): boolean {
        if (status && status > 0)
            return true;
        else
            return false;
    }

    public static isMatch(value: number): boolean {
        return Number(value) > 100;
    }

}