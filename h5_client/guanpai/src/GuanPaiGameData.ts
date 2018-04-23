/*
* @author seacole
* 关牌游戏基础数据
*/
module guanpai {
	export class GuanPaiGameData {
		constructor() {

		}
		public static isHideCardCnt: boolean;//牌数不显示"
		public static isMustPress: boolean;//必须管
		public static isBoomReward: boolean;//炸弹奖分
		public static isBoomAAA: boolean;//AAA算炸
		public static isWinerFirst: boolean;//赢家先出
		public static isCallScore: boolean;//抢关
		public static maxCards: number;//初始手牌数

		public static firstCard: number;//初始手牌

		// public static setGameRule(game_rule: any): void {
		// 	GuanPaiGameData.isHideCardCnt = game_rule.hasOwnProperty("hide_ccnt") && game_rule.hide_ccnt == 1;
		// 	GuanPaiGameData.isMustPress = game_rule.hasOwnProperty("must_do") && game_rule.must_do == 1;
		// 	GuanPaiGameData.isBoomReward = game_rule.hasOwnProperty("boom_reward") && game_rule.boom_reward == 1;
		// 	GuanPaiGameData.isBoomAAA = game_rule.hasOwnProperty("enabled_aaa") && game_rule.enabled_aaa == 1;
		// 	GuanPaiGameData.isWinerFirst = game_rule.hasOwnProperty("winner_first") && game_rule.winner_first == 1;
		// 	GuanPaiGameData.isCallScore = game_rule.hasOwnProperty("call_score") && game_rule.call_score == 1;
		// }

		public static getGameRule(): string {
			var str: string = GuanPaiGameData.maxCards + "张";
			if (GuanPaiGameData.isHideCardCnt)
				str += "/牌数不显示";
			if (GuanPaiGameData.isMustPress)
				str += "/必须管";
			if (GuanPaiGameData.isBoomReward)
				str += "/炸弹奖分";
			if (GuanPaiGameData.isBoomAAA)
				str += "/AAA算炸";
			if (GuanPaiGameData.isWinerFirst)
				str += "/赢家先出";
			if (GuanPaiGameData.isCallScore)
				str += "/抢关";

			return str;
		}
	}
}