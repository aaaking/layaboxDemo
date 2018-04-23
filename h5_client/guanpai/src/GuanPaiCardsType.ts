/*
* @author seacole
* 关牌牌型算法;
*/
module guanpai {
	export class GuanPaiCardsType {
		constructor() {

		}

		public static cards: Array<number> = [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140,
			31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131, 141,
			32, 42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 142,
			33, 43, 53, 63, 73, 83, 93, 103, 113, 123, 133, 163];





		// 4.飞机：连续三带二，两组及以上三带二，三条必须相邻，最后一手牌，可以带0-4张任意牌






		public static DAN: number = 1;//单牌
		public static DUIZI: number = 2;//对子
		public static ZHADAN: number = 3;//炸弹 必须带一张，最后一手可不带  AAA算炸：增加“三个A带三”和“三个A带一“这两个牌型
		public static SIDAISAN: number = 4;//四带三 四张相同的牌带三张任意牌，在最后一手出牌时可以带0-3张任意牌，四带三不作为炸弹，可以被炸弹压 
		public static SANDAIER: number = 5;//三带二 三张点数一样的牌+两张其他的牌，三张必须带两张，两张牌不一定要对子，如果是最后一手牌，可以带0-2张任意牌。	
		public static DANSHUN: number = 6;
		public static SHUANGSHUN: number = 7;
		public static FEIJI: number = 8;

		public static A: number = 14;

		/**
		 * 获取牌型
		 */
		public static getType(cards: Array<number>, hasBoomAAA: boolean = false, handCardsCount: number = 0): Array<number> {
			if (cards == null || cards.length < 1) return [0];
			var tmpArr: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
			var i: number;
			var j: number;
			var flag: Boolean;
			for (i = 0; i < cards.length; ++i) {
				var num: number = Math.floor(cards[i] / 10);
				tmpArr[num]++;
			}
			var tmp1Arr: Array<number> = [];
			var tmp2Arr: Array<number> = [];
			var tmp3Arr: Array<number> = [];
			var tmp4Arr: Array<number> = [];
			for (i = 0; i < tmpArr.length; ++i) {
				if (tmpArr[i] == 1)
					tmp1Arr.push(i);
				else if (tmpArr[i] == 2)
					tmp2Arr.push(i);
				else if (tmpArr[i] == 3)
					tmp3Arr.push(i);
				else if (tmpArr[i] == 4)
					tmp4Arr.push(i);
			}

			if (cards.length == 1) {
				return [GuanPaiCardsType.DAN, tmp1Arr[0]];
			}
			if (tmp2Arr.length == 1 && cards.length == 2) {
				return [GuanPaiCardsType.DUIZI, tmp2Arr[0]];
			}
			if (tmp4Arr.length == 1) {
				if (handCardsCount >= 5 && cards.length == 5)
					return [GuanPaiCardsType.ZHADAN, tmp4Arr[0]];
				else if (handCardsCount == 4 && cards.length == 4)
					return [GuanPaiCardsType.ZHADAN, tmp4Arr[0]];
				// else if (!handCardsCount && cards.length == 5)
				// 	return [GuanPaiCardsType.ZHADAN, tmp4Arr[0]];
				// else if (!handCardsCount && cards.length == 4)
				// 	return [GuanPaiCardsType.ZHADAN, tmp4Arr[0]];

				if (handCardsCount >= 7 && cards.length == 7)
					return [GuanPaiCardsType.SIDAISAN, tmp4Arr[0]];
				else if (handCardsCount == 6 && cards.length == 6)
					return [GuanPaiCardsType.SIDAISAN, tmp4Arr[0]];
				// else if (!handCardsCount && cards.length == 6)
				// 	return [GuanPaiCardsType.SIDAISAN, tmp4Arr[0]];
				// else if (!handCardsCount && cards.length == 7)
				// 	return [GuanPaiCardsType.SIDAISAN, tmp4Arr[0]];
			}

			if (tmp3Arr.length == 1) {
				if (hasBoomAAA) {
					// 如果是AAA
					if (tmp3Arr[0] == GuanPaiCardsType.A) {
						if (handCardsCount >= 4 && cards.length == 4)
							return [GuanPaiCardsType.ZHADAN, tmp3Arr[0]];
						else if (handCardsCount == 3 && cards.length == 3)
							return [GuanPaiCardsType.ZHADAN, tmp3Arr[0]];
						// else if (!handCardsCount && cards.length == 4)
						// 	return [GuanPaiCardsType.ZHADAN, tmp3Arr[0]];
						// else if (!handCardsCount && cards.length == 3)
						// 	return [GuanPaiCardsType.ZHADAN, tmp3Arr[0]];

						if (handCardsCount >= 6 && cards.length == 6)
							return [GuanPaiCardsType.SIDAISAN, tmp3Arr[0]];
						else if (handCardsCount == 5 && cards.length == 5)
							return [GuanPaiCardsType.SIDAISAN, tmp3Arr[0]];
						// else if (!handCardsCount && cards.length == 5)
						// 	return [GuanPaiCardsType.SIDAISAN, tmp3Arr[0]];
						// else if (!handCardsCount && cards.length == 6)
						// 	return [GuanPaiCardsType.SIDAISAN, tmp3Arr[0]];
					}
				}

				if (handCardsCount >= 5 && cards.length == 5)
					return [GuanPaiCardsType.SANDAIER, tmp3Arr[0]];
				else if (handCardsCount == 4 && cards.length == 4)
					return [GuanPaiCardsType.SANDAIER, tmp3Arr[0]];
				else if (handCardsCount == 3 && cards.length == 3)
					return [GuanPaiCardsType.SANDAIER, tmp3Arr[0]];
				// else if (!handCardsCount && cards.length >= 3 && cards.length <= 5)
				// 	return [GuanPaiCardsType.SANDAIER, tmp3Arr[0]];
			}

			if (tmp1Arr.length > 4) {
				flag = true;
				for (i = 1; i < tmp1Arr.length; ++i) {
					if (tmp1Arr[i - 1] + 1 != tmp1Arr[i]) {
						flag = false;
						break;
					}
				}
				if (flag && tmp1Arr.length == cards.length) {
					return [GuanPaiCardsType.DANSHUN, tmp1Arr[0]];
				}
			}

			if (tmp2Arr.length > 1) {
				flag = true;
				for (i = 1; i < tmp2Arr.length; ++i) {
					if (tmp2Arr[i - 1] + 1 != tmp2Arr[i]) {
						flag = false;
						break;
					}
				}
				if (flag && tmp2Arr.length * 2 == cards.length) {
					return [GuanPaiCardsType.SHUANGSHUN, tmp2Arr[0]];
				}
			}

			//后面判定蛋疼的飞机
			var feijiArr: Array<number> = [];
			for (i = 0; i < tmp3Arr.length; i++) {
				feijiArr.push(tmp3Arr[i]);
			}
			for (i = 0; i < tmp4Arr.length; i++) {
				feijiArr.push(tmp4Arr[i]);
			}
			feijiArr.sort(GuanPaiCardsType.onSort2);
			var feijiType: Array<number> = [0];


			var count: number = 0;
			var feijiTmpArr: Array<number>;
			while (feijiType[0] != -1) {
				feijiTmpArr = feijiArr.concat();
				if (count == 1) {
					if (feijiTmpArr.length)
						feijiTmpArr.shift();
				}
				else if (count == 2) {
					if (feijiTmpArr.length)
						feijiTmpArr.pop();
				}
				else if (count == 3) {
					if (feijiTmpArr.length)
						feijiTmpArr.shift();
					if (feijiTmpArr.length)
						feijiTmpArr.shift();
				}
				else if (count == 4) {
					if (feijiTmpArr.length)
						feijiTmpArr.shift();
					if (feijiTmpArr.length)
						feijiTmpArr.pop();
				}
				else if (count == 5) {
					if (feijiTmpArr.length)
						feijiTmpArr.pop();
					if (feijiTmpArr.length)
						feijiTmpArr.pop();
				}
				else if (count >= 6)
					break;

				feijiType = GuanPaiCardsType.checkIsFeiji(feijiTmpArr, cards, handCardsCount);
				count++;
				if (feijiType[0] > 0)
					return feijiType;
			}
			return [0];
		}

		private static checkIsFeiji(checkArr: Array<number>, cards: Array<number>, handCardsCount: number = 0): Array<number> {
			var flag: boolean;
			var i: number;
			var needCardsCount: number;
			if (checkArr && checkArr.length > 1) {
				flag = true;
				for (i = 1; i < checkArr.length; ++i) {
					if (checkArr[i - 1] + 1 != checkArr[i]) {
						flag = false;
						break;
					}
				}
				if (flag) {
					needCardsCount = (checkArr.length * (3 + 2));
					if (handCardsCount >= needCardsCount && cards.length == needCardsCount)
						return [GuanPaiCardsType.FEIJI, checkArr.length, checkArr[0]];
					else if (handCardsCount < needCardsCount && cards.length == handCardsCount)
						return [GuanPaiCardsType.FEIJI, checkArr.length, checkArr[0]];
				}
			}
			else
				return [-1];
			return [0];
		}

		/**
		 * 检测是否能压过上一手牌
		 */
		public static checkCanUse(lastPlayCards: Array<number>, selectCards: Array<number>, hasBoomAAA: boolean = false, handCardsCount: number = 0, helpCards: Array<Array<number>> = null): boolean {
			var mTmp: Array<number> = GuanPaiCardsType.getType(selectCards, hasBoomAAA, handCardsCount);
			var lTmp: Array<number> = GuanPaiCardsType.getType(lastPlayCards, hasBoomAAA, lastPlayCards.length);
			var myCardType: number = mTmp[0];
			var lastCardType: number = lTmp[0];
			var canUse: boolean = false;
			var flag: boolean;
			//如果提示里面有,肯定能出
			if (helpCards && selectCards.length==handCardsCount) {
				for (var i: number = 0; i < helpCards.length; i++) {
					flag = true;
					for (var j: number = 0; j < helpCards[i].length; j++) {
						if (helpCards[i][j] != selectCards[j]) {
							flag = false;
							break;
						}
					}
					if (flag)
						canUse = true;
				}
			}

			if (!canUse) {
				//如果上一首出的是炸弹，需要比他更大的炸弹才行
				if (lastCardType == GuanPaiCardsType.ZHADAN) {
					if (myCardType == GuanPaiCardsType.ZHADAN && mTmp[1] > lTmp[1])
						canUse = true;
				}
				else {
					if (myCardType == GuanPaiCardsType.ZHADAN)
						canUse = true;
					else {
						if (myCardType == lastCardType) {
							if (myCardType == GuanPaiCardsType.FEIJI) {
								if (mTmp[1] == lTmp[1] && mTmp[2] > lTmp[2])
									canUse = true;
							}
							else {
								if (mTmp[1] > lTmp[1])
									canUse = true;
							}
						}
					}
				}
			}
			return canUse;
		}

		/**
		 * 返回所有大过的牌
		 */
		public static getHelper(lastPlayCards: Array<number>, handCards: Array<number>, hasBoomAAA: boolean = false): Array<Array<number>> {
			var lTmp: Array<number> = GuanPaiCardsType.getType(lastPlayCards, hasBoomAAA, lastPlayCards.length);
			var lastCardType: number = lTmp[0];
			var tmpArr: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
			var i: number;
			var j: number;
			var flag: Boolean;
			for (i = 0; i < handCards.length; ++i) {
				var num: number = Math.floor(handCards[i] / 10);
				tmpArr[num]++;
			}
			var tmp1Arr: Array<number> = [];
			var tmp2Arr: Array<number> = [];
			var tmp3Arr: Array<number> = [];
			var tmp4Arr: Array<number> = [];
			for (i = 0; i < tmpArr.length; ++i) {
				if (tmpArr[i] == 1)
					tmp1Arr.push(i);
				else if (tmpArr[i] == 2)
					tmp2Arr.push(i);
				else if (tmpArr[i] == 3)
					tmp3Arr.push(i);
				else if (tmpArr[i] == 4)
					tmp4Arr.push(i);
			}

			if (lastCardType == GuanPaiCardsType.DAN)
				return GuanPaiCardsType.getHelperDan(lTmp[1], handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, hasBoomAAA);
			else if (lastCardType == GuanPaiCardsType.DUIZI)
				return GuanPaiCardsType.getHelperDuiZi(lTmp[1], handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, hasBoomAAA);
			else if (lastCardType == GuanPaiCardsType.ZHADAN)
				return GuanPaiCardsType.getHelperZhaDan(lTmp[1], handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, hasBoomAAA);
			else if (lastCardType == GuanPaiCardsType.SIDAISAN)
				return GuanPaiCardsType.getHelperSiDaiSan(lTmp[1], handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, hasBoomAAA);
			else if (lastCardType == GuanPaiCardsType.SANDAIER)
				return GuanPaiCardsType.getHelperSanDaiEr(lTmp[1], handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, hasBoomAAA);
			else if (lastCardType == GuanPaiCardsType.DANSHUN)
				return GuanPaiCardsType.getHelperDanShun(lastPlayCards, handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, hasBoomAAA);
			else if (lastCardType == GuanPaiCardsType.SHUANGSHUN)
				return GuanPaiCardsType.getHelperShuangShun(lastPlayCards, handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, hasBoomAAA);
			else if (lastCardType == GuanPaiCardsType.FEIJI)
				return GuanPaiCardsType.getHelperFeiJi(lTmp[1], lTmp[2], handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, hasBoomAAA);
			return null;
		}

		/**
		 * 炸弹要4带1，添加后面那个1
		 * @param handCards 
		 * @param tmp1Arr 
		 * @param tmp2Arr 
		 * @param tmp3Arr 
		 * @param tmp4Arr 
		 * @param tmp4Idx 
		 */
		private static getZhaDanHelper(handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>, tmp4Idx: number): Array<number> {
			var tmpArr: Array<number> = GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[tmp4Idx], 4);
			var i: number;
			if (tmp1Arr.length)
				tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp1Arr[0], 1));
			else if (tmp2Arr.length)
				tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp2Arr[0], 1));
			else if (tmp3Arr.length)
				tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[0], 1));
			else if (tmp4Arr.length) {
				for (i = 0; i < tmp4Arr.length; i++) {
					if (i != tmp4Idx) {
						tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[i], 1));
						break;
					}
				}
			}
			return tmpArr;
		}

		/**
		 * 炸弹AAA带1，添加后面那个1
		 * @param handCards 
		 * @param tmp1Arr 
		 * @param tmp2Arr 
		 * @param tmp3Arr 
		 * @param tmp4Arr 
		 * @param tmp4Idx 
		 */
		private static getAAAHelper(handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>, tmp3Idx: number): Array<number> {
			var tmpArr: Array<number> = GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[tmp3Idx], 3);
			var i: number;
			if (tmp1Arr.length)
				tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp1Arr[0], 1));
			else if (tmp2Arr.length)
				tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp2Arr[0], 1));
			else if (tmp3Arr.length) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (i != tmp3Idx) {
						tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[i], 1));
						break;
					}
				}
			}
			else if (tmp4Arr.length)
				tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[0], 1));
			return tmpArr;
		}

		/**
		 * 检测能压过单牌的牌
		 */
		private static getHelperDan(lastNum: number, handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>, hasBoomAAA: boolean = false): Array<Array<number>> {
			var outArr: Array<Array<number>> = [];
			var i: number;
			for (i = 0; i < tmp1Arr.length; i++) {
				if (tmp1Arr[i] > lastNum)
					outArr.push(GuanPaiCardsType.getCardByNum(handCards, tmp1Arr[i], 1));
			}
			for (i = 0; i < tmp2Arr.length; i++) {
				if (tmp2Arr[i] > lastNum)
					outArr.push(GuanPaiCardsType.getCardByNum(handCards, tmp2Arr[i], 1));
			}
			for (i = 0; i < tmp3Arr.length; i++) {
				if (tmp3Arr[i] == GuanPaiCardsType.A && hasBoomAAA)
					continue;
				if (tmp3Arr[i] > lastNum)
					outArr.push(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[i], 1));
			}
			for (i = 0; i < tmp4Arr.length; i++) {
				outArr.push(GuanPaiCardsType.getZhaDanHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
			}
			//炸弹AAA
			if (hasBoomAAA) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A) {
						outArr.push(GuanPaiCardsType.getAAAHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
						break;
					}
				}
			}
			//拆炸弹
			for (i = 0; i < tmp4Arr.length; i++) {
				if (tmp4Arr[i] > lastNum)
					outArr.push(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[i], 1));
			}
			//拆AAA
			if (hasBoomAAA) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A) {
						outArr.push(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[i], 1));
						break;
					}
				}
			}
			return outArr;
		}

		/**
		 * 检测能压过对子的牌
		 */
		private static getHelperDuiZi(lastNum: number, handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>, hasBoomAAA: boolean = false): Array<Array<number>> {
			var outArr: Array<Array<number>> = [];
			var i: number;
			for (i = 0; i < tmp2Arr.length; i++) {
				if (tmp2Arr[i] > lastNum)
					outArr.push(GuanPaiCardsType.getCardByNum(handCards, tmp2Arr[i], 2));
			}
			for (i = 0; i < tmp3Arr.length; i++) {
				if (tmp3Arr[i] == GuanPaiCardsType.A && hasBoomAAA)
					continue;
				if (tmp3Arr[i] > lastNum)
					outArr.push(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[i], 2));
			}
			for (i = 0; i < tmp4Arr.length; i++) {
				outArr.push(GuanPaiCardsType.getZhaDanHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
			}
			//炸弹AAA
			if (hasBoomAAA) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A) {
						outArr.push(GuanPaiCardsType.getAAAHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
						break;
					}
				}
			}
			//拆炸弹
			for (i = 0; i < tmp4Arr.length; i++) {
				if (tmp4Arr[i] > lastNum)
					outArr.push(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[i], 2));
			}
			//拆AAA
			if (hasBoomAAA) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A) {
						outArr.push(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[i], 2));
						break;
					}
				}
			}
			return outArr;
		}

		/**
		 * 检测能压过炸弹的牌
		 */
		private static getHelperZhaDan(lastNum: number, handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>, hasBoomAAA: boolean = false): Array<Array<number>> {
			var outArr: Array<Array<number>> = [];
			var i: number;
			var j: number;
			var flag: boolean;
			var tmpArr: Array<number>;
			for (i = 0; i < tmp4Arr.length; i++) {
				if (tmp4Arr[i] > lastNum)
					outArr.push(GuanPaiCardsType.getZhaDanHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
			}
			//炸弹AAA
			if (hasBoomAAA) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A && tmp3Arr[i] > lastNum) {
						outArr.push(GuanPaiCardsType.getAAAHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
						break;
					}
				}
			}
			return outArr;
		}

		/**
		 * 检测能压过四带三的牌
		 */
		private static getHelperSiDaiSan(lastNum: number, handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>, hasBoomAAA: boolean = false): Array<Array<number>> {
			var outArr: Array<Array<number>> = [];
			var i: number;
			var j: number;
			var flag: boolean;
			var tmpArr: Array<number>;
			for (i = 0; i < tmp4Arr.length; i++) {
				outArr.push(GuanPaiCardsType.getZhaDanHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
			}
			if (hasBoomAAA) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A) {
						outArr.push(GuanPaiCardsType.getAAAHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
						break;
					}
				}
			}
			var maxCount: number = 7;
			//拆炸弹
			for (i = 0; i < tmp4Arr.length; i++) {
				if (tmp4Arr[i] > lastNum) {
					var tmpArr: Array<number> = GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[i], 4);
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp1Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp1Arr[j], 1));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp2Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp2Arr[j], 2));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp3Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[j], 3));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp4Arr.length; j++) {
							if (j != i) {
								tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[j], 4));
								if (tmpArr.length >= maxCount)
									break;
							}
						}
					}
					while (tmpArr.length > maxCount) {
						tmpArr.pop();
					}
					if (tmpArr.length >= 6)
						outArr.push(tmpArr);
				}
			}
			//拆AAA
			if (hasBoomAAA) {
				maxCount = 6;
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A && tmp3Arr[i] > lastNum) {
						var tmpArr: Array<number> = GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[i], 3);
						if (tmpArr.length < maxCount) {
							for (j = 0; j < tmp1Arr.length; j++) {
								tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp1Arr[j], 1));
								if (tmpArr.length >= maxCount)
									break;
							}
						}
						if (tmpArr.length < maxCount) {
							for (j = 0; j < tmp2Arr.length; j++) {
								tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp2Arr[j], 2));
								if (tmpArr.length >= maxCount)
									break;
							}
						}
						if (tmpArr.length < maxCount) {
							for (j = 0; j < tmp3Arr.length; j++) {
								if (j != i) {
									tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[j], 3));
									if (tmpArr.length >= maxCount)
										break;
								}
							}
						}
						if (tmpArr.length < maxCount) {
							for (j = 0; j < tmp4Arr.length; j++) {
								tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[j], 4));
								if (tmpArr.length >= maxCount)
									break;
							}
						}
						while (tmpArr.length > maxCount) {
							tmpArr.pop();
						}
						if (tmpArr.length >= 5)
							outArr.push(tmpArr);
					}
				}
			}
			return outArr;
		}

		/**
		 * 检测能压过三带二的牌
		 */
		private static getHelperSanDaiEr(lastNum: number, handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>, hasBoomAAA: boolean = false): Array<Array<number>> {
			var outArr: Array<Array<number>> = [];
			var i: number;
			var j: number;
			var flag: boolean;
			var tmpArr: Array<number>;
			var maxCount: number = 5;
			//三带二
			for (i = 0; i < tmp3Arr.length; i++) {
				if (tmp3Arr[i] == GuanPaiCardsType.A && hasBoomAAA)
					continue;
				if (tmp3Arr[i] > lastNum) {
					var tmpArr: Array<number> = GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[i], 3);
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp1Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp1Arr[j], 1));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp2Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp2Arr[j], 2));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp3Arr.length; j++) {
							if (j != i) {
								tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[j], 3));
								if (tmpArr.length >= maxCount)
									break;
							}
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp4Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[j], 4));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					while (tmpArr.length > maxCount) {
						tmpArr.pop();
					}
					outArr.push(tmpArr);
				}
			}
			//炸弹
			for (i = 0; i < tmp4Arr.length; i++) {
				outArr.push(GuanPaiCardsType.getZhaDanHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
			}
			//炸弹AAA
			if (hasBoomAAA) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A) {
						outArr.push(GuanPaiCardsType.getAAAHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
						break;
					}
				}
			}
			//拆炸弹
			for (i = 0; i < tmp4Arr.length; i++) {
				if (tmp4Arr[i] > lastNum) {
					var tmpArr: Array<number> = GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[i], 3);
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp1Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp1Arr[j], 1));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp2Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp2Arr[j], 2));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp3Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[j], 3));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp4Arr.length; j++) {
							if (j != i)
								tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[j], 4));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					while (tmpArr.length > maxCount) {
						tmpArr.pop();
					}
					outArr.push(tmpArr);
				}
			}
			//拆AAA
			for (i = 0; i < tmp3Arr.length; i++) {
				if (tmp3Arr[i] == GuanPaiCardsType.A && hasBoomAAA && tmp3Arr[i] > lastNum) {
					var tmpArr: Array<number> = GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[i], 3);
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp1Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp1Arr[j], 1));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp2Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp2Arr[j], 2));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp3Arr.length; j++) {
							if (j != i) {
								tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[j], 3));
								if (tmpArr.length >= maxCount)
									break;
							}
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp4Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[j], 4));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					while (tmpArr.length > maxCount) {
						tmpArr.pop();
					}
					if (tmpArr.length == 5)
						outArr.push(tmpArr);
				}
			}
			return outArr;
		}

		/**
		* 检测能压过单顺的牌
		*/
		private static getHelperDanShun(lastPlayCards: Array<number>, handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>, hasBoomAAA: boolean = false): Array<Array<number>> {
			var outArr: Array<Array<number>> = [];
			var lastNum: number = GuanPaiCardsType.getCardNum(lastPlayCards[0]);
			var i: number;
			var j: number;
			var flag: boolean;
			var tmp: Array<number>;
			for (i = 1; i < 8; i++) {
				flag = true;
				for (j = 0; j < lastPlayCards.length; j++) {
					if (tmp1Arr.indexOf(lastNum + i + j) == -1 && tmp2Arr.indexOf(lastNum + i + j) == -1 && tmp3Arr.indexOf(lastNum + i + j) == -1 && tmp4Arr.indexOf(lastNum + i + j) == -1) {
						flag = false;
						break;
					}
				}
				if (flag) {
					tmp = [];
					for (j = 0; j < lastPlayCards.length; j++) {
						tmp.push(GuanPaiCardsType.getCardByNum(handCards, lastNum + i + j, 1)[0]);
					}
					outArr.push(tmp);
				}
			}
			for (i = 0; i < tmp4Arr.length; i++) {
				outArr.push(GuanPaiCardsType.getZhaDanHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
			}
			//炸弹AAA
			if (hasBoomAAA) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A) {
						outArr.push(GuanPaiCardsType.getAAAHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
						break;
					}
				}
			}
			return outArr;
		}

		/**
		* 检测能压过双顺的牌
		*/
		private static getHelperShuangShun(lastPlayCards: Array<number>, handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>, hasBoomAAA: boolean = false): Array<Array<number>> {
			var outArr: Array<Array<number>> = [];
			var lastNum: number = GuanPaiCardsType.getCardNum(lastPlayCards[0]);
			var i: number;
			var j: number;
			var flag: boolean;
			var tmp1: Array<number>;
			var tmp2: Array<number>;
			for (i = 1; i < 8; i++) {
				flag = true;
				for (j = 0; j < lastPlayCards.length / 2; j++) {
					if (tmp2Arr.indexOf(lastNum + i + j) == -1 && tmp3Arr.indexOf(lastNum + i + j) == -1 && tmp4Arr.indexOf(lastNum + i + j) == -1) {
						flag = false;
						break;
					}
				}
				if (flag) {
					tmp1 = [];
					for (j = 0; j < lastPlayCards.length / 2; j++) {
						tmp2 = GuanPaiCardsType.getCardByNum(handCards, lastNum + i + j, 2);
						tmp1.push(tmp2[0], tmp2[1]);
					}
					outArr.push(tmp1);
				}
			}
			for (i = 0; i < tmp4Arr.length; i++) {
				outArr.push(GuanPaiCardsType.getZhaDanHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
			}
			//炸弹AAA
			if (hasBoomAAA) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A) {
						outArr.push(GuanPaiCardsType.getAAAHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
						break;
					}
				}
			}
			return outArr;
		}

		/**
		* 检测能压过飞机的牌
		*/
		private static getHelperFeiJi(lastCount: number, lastNum: number, handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>, hasBoomAAA: boolean = false): Array<Array<number>> {
			var outArr: Array<Array<number>> = [];
			var i: number;
			var j: number;
			var flag: boolean;
			var tmpArr: Array<number>;
			var tmp2: Array<number>;
			var maxCount: number = lastCount * (3 + 2);
			for (i = 1; i < 12; i++) {
				flag = true;
				for (j = 0; j < lastCount; j++) {
					if (tmp3Arr.indexOf(lastNum + i + j) == -1 && tmp4Arr.indexOf(lastNum + i + j) == -1) {
						flag = false;
						break;
					}
				}
				if (flag) {
					tmpArr = [];
					for (j = 0; j < lastCount; j++) {
						tmp2 = GuanPaiCardsType.getCardByNum(handCards, lastNum + i + j, 3);
						tmpArr.push(tmp2[0], tmp2[1], tmp2[2]);
					}

					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp1Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp1Arr[j], 1));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp2Arr.length; j++) {
							tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp2Arr[j], 2));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp3Arr.length; j++) {
							if (tmp3Arr[j] < (lastNum + i) || tmp3Arr[j] >= (lastNum + i + lastCount))
								tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp3Arr[j], 3));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					if (tmpArr.length < maxCount) {
						for (j = 0; j < tmp4Arr.length; j++) {
							if (tmp3Arr[j] < (lastNum + i) || tmp3Arr[j] >= (lastNum + i + lastCount))
								tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[j], 4));
							else
								tmpArr = tmpArr.concat(GuanPaiCardsType.getCardByNum(handCards, tmp4Arr[j], 1, 4));
							if (tmpArr.length >= maxCount)
								break;
						}
					}
					while (tmpArr.length > maxCount) {
						tmpArr.pop();
					}
					outArr.push(tmpArr);
				}
			}

			for (i = 0; i < tmp4Arr.length; i++) {
				outArr.push(GuanPaiCardsType.getZhaDanHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
			}
			//炸弹AAA
			if (hasBoomAAA) {
				for (i = 0; i < tmp3Arr.length; i++) {
					if (tmp3Arr[i] == GuanPaiCardsType.A) {
						outArr.push(GuanPaiCardsType.getAAAHelper(handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr, i));
						break;
					}
				}
			}

			return outArr;
		}

		/**
		 * 选中一张牌智能选牌
		 */
		public static getAutoSelectedCardsByOneCard(helpCards: Array<Array<number>>, handCards: Array<number>, card: number, ): Array<number> {
			if (helpCards && helpCards.length) {
				var cardNum: number = Math.floor(card / 10);
				var i: number;
				var j: number;
				var helpNum: number;
				var flag: boolean;
				var outArr: Array<number>;
				var tTmp: Array<number>;
				var type: any;
				var tmp: number;
				//与该牌数值相等的牌是否在提示中
				for (i = 0; i < helpCards.length; i++) {
					tTmp = GuanPaiCardsType.getType(helpCards[i], GuanPaiGameData.isBoomAAA, handCards.length)
					type = tTmp[0];
					//单顺，双顺，飞机，需要选择当前选中牌开始的顺子
					if (type == GuanPaiCardsType.DANSHUN || type == GuanPaiCardsType.SHUANGSHUN || type == GuanPaiCardsType.FEIJI) {
						helpNum = Math.floor(helpCards[i][0] / 10);
						if (helpNum == cardNum) {
							//如果选中牌是炸弹，先起炸弹。如果后面还有该牌开始的提示牌，说明有炸弹
							for (j = i + 1; j < helpCards.length; j++) {
								tmp = Math.floor(helpCards[j][0] / 10);
								if (tmp == cardNum) {
									i = j;
									break;
								}
							}
							flag = true;
							break;
						}
					}
					else {
						for (j = 0; j < helpCards[i].length; j++) {
							helpNum = Math.floor(helpCards[i][j] / 10);
							if (helpNum == cardNum) {
								flag = true;
								break;
							}
						}
					}
					if (flag)
						break;
				}
				if (flag) {
					outArr = helpCards[i].concat();
					//如果提示中包含这张牌，选择提示的牌
					if (helpCards[i].indexOf(card) != -1)
						return outArr;
					//如果提示中不包含这张牌，删除提示中与该牌数值相等的牌，把该牌与该牌临近的牌插入进去
					else {
						var count: number = 0;
						for (i = 0; i < outArr.length;) {
							helpNum = Math.floor(outArr[i] / 10);
							if (helpNum == cardNum) {
								outArr.splice(i, 1);
								count++;
							}
							else
								i++;
						}
						count -= 1;
						outArr.push(card);
						if (count > 0) {
							for (i = 1; i < 4; i++) {
								if (handCards.indexOf(card + i) != -1) {
									outArr.push(card + i);
									count--;
									if (count <= 0)
										break;
								}
							}
						}
						if (count > 0) {
							for (i = -1; i > -4; i--) {
								if (handCards.indexOf(card + i) != -1) {
									outArr.push(card + i);
									count--;
									if (count <= 0)
										break;
								}
							}
						}

						return outArr;
					}
				}
				return null;
			}
			return null;
		}



		/**
		 * 立两张牌选牌
		 */
		public static getAutoSelectedCardsByTwoCards(selectCards: Array<number>, handCards: Array<number>): Array<number> {
			var i: number;
			var startCard: number = selectCards[1];
			var endCard: number = selectCards[0];
			var startNum: number = Math.floor(startCard / 10);
			var endNum: number = Math.floor(endCard / 10);
			var tmpArr: Array<number> = [];
			var outArr: Array<number>;
			var helpNum: number;
			for (i = 0; i < handCards.length; ++i) {
				var num: number = Math.floor(handCards[i] / 10);
				if (num >= startNum && num <= endNum)
					tmpArr.push(handCards[i]);
			}
			// if (!outArr) {
			// 	outArr = GuanPaiCardsType.getSanShun(tmpArr);
			// 	if (outArr) {
			// 		if (GuanPaiCardsType.getCardNum(outArr[0]) != startNum || GuanPaiCardsType.getCardNum(outArr[outArr.length - 1]) != endNum)
			// 			outArr = null;
			// 	}
			// }
			if (!outArr) {
				outArr = GuanPaiCardsType.getShuangShun(tmpArr);
				if (outArr) {
					if (GuanPaiCardsType.getCardNum(outArr[0]) != startNum || GuanPaiCardsType.getCardNum(outArr[outArr.length - 1]) != endNum)
						outArr = null;
				}
			}
			if (!outArr) {
				outArr = GuanPaiCardsType.getDanShun(tmpArr);
				if (outArr) {
					if (GuanPaiCardsType.getCardNum(outArr[0]) != startNum || GuanPaiCardsType.getCardNum(outArr[outArr.length - 1]) != endNum)
						outArr = null;
				}
			}

			if (outArr) {
				//如果提示中包含这张牌，选择提示的牌
				if (outArr.indexOf(startCard) != -1) {
				}
				//如果提示中不包含这张牌，删除提示中与该牌数值相等的牌，把该牌与该牌临近的牌插入进去
				else {
					var count: number = 0;
					for (i = 0; i < outArr.length;) {
						helpNum = Math.floor(outArr[i] / 10);
						if (helpNum == startNum) {
							outArr.splice(i, 1);
							count++;
						}
						else
							i++;
					}
					count -= 1;
					outArr.push(startCard);
					if (count > 0) {
						for (i = 1; i < 4; i++) {
							if (handCards.indexOf(startCard + i) != -1) {
								outArr.push(startCard + i);
								count--;
								if (count <= 0)
									break;
							}
						}
					}
					if (count > 0) {
						for (i = -1; i > -4; i--) {
							if (handCards.indexOf(startCard + i) != -1) {
								outArr.push(startCard + i);
								count--;
								if (count <= 0)
									break;
							}
						}
					}
				}

				//如果提示中包含这张牌，选择提示的牌
				if (outArr.indexOf(endCard) != -1) {
				}
				//如果提示中不包含这张牌，删除提示中与该牌数值相等的牌，把该牌与该牌临近的牌插入进去
				else {
					var count: number = 0;
					for (i = 0; i < outArr.length;) {
						helpNum = Math.floor(outArr[i] / 10);
						if (helpNum == endNum) {
							outArr.splice(i, 1);
							count++;
						}
						else
							i++;
					}
					count -= 1;
					outArr.push(endCard);
					if (count > 0) {
						for (i = 1; i < 4; i++) {
							if (handCards.indexOf(endCard + i) != -1) {
								outArr.push(endCard + i);
								count--;
								if (count <= 0)
									break;
							}
						}
					}
					if (count > 0) {
						for (i = -1; i > -4; i--) {
							if (handCards.indexOf(endCard + i) != -1) {
								outArr.push(endCard + i);
								count--;
								if (count <= 0)
									break;
							}
						}
					}
				}
				return outArr;
			}
			return null;
		}

		/**
		 * 检测选中牌中是否有单顺
		 */
		private static getDanShun(handCards: Array<number>): Array<number> {
			var tmpArr: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
			var i: number;
			var j: number;
			var flag: Boolean;
			for (i = 0; i < handCards.length; ++i) {
				var num: number = Math.floor(handCards[i] / 10);
				tmpArr[num]++;
			}
			var outArr: Array<number> = [];
			var start: number;
			var end: number;
			var count: number = 0;

			for (i = 0; i < tmpArr.length; ++i) {
				if (tmpArr[i]) {
					if (count == 0)
						start = i;
					count++;
				}
				else {
					if (count >= 5) {
						end = i;
						break;
					}
					else
						count = 0;
				}
			}

			//有顺子
			if (end) {
				for (i = start; i < end; ++i) {
					for (j = 0; j < handCards.length; ++j) {
						var num: number = Math.floor(handCards[j] / 10);
						if (num == i && outArr.indexOf(handCards[j]) == -1) {
							outArr.push(handCards[j]);
							break;
						}
					}
				}
				return outArr;
			}
			else
				return null;

		}

		/**
		 * 检测选中牌中是否有双顺
		 */
		private static getShuangShun(handCards: Array<number>): Array<number> {
			var tmpArr: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
			var i: number;
			var j: number;
			var flag: Boolean;
			for (i = 0; i < handCards.length; ++i) {
				var num: number = Math.floor(handCards[i] / 10);
				tmpArr[num]++;
			}
			var outArr: Array<number> = [];
			var start: number;
			var end: number;
			var count: number = 0;

			for (i = 0; i < tmpArr.length; ++i) {
				if (tmpArr[i] > 1) {
					if (count == 0)
						start = i;
					count++;
				}
				else {
					if (count >= 2) {
						end = i;
						break;
					}
					else
						count = 0;
				}
			}

			//有顺子
			if (end) {
				for (i = start; i < end; ++i) {
					count = 0;
					for (j = 0; j < handCards.length; ++j) {
						var num: number = Math.floor(handCards[j] / 10);
						if (num == i && outArr.indexOf(handCards[j]) == -1) {
							outArr.push(handCards[j]);
							count++;
							if (count == 2)
								break;
						}
					}
				}
				return outArr;
			}
			else
				return null;
		}

		/**
		 * 检测选中牌中是否有三顺
		 */
		// private static getSanShun(handCards: Array<number>): Array<number> {
		// 	var tmpArr: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//卡牌出现的次数
		// 	var i: number;
		// 	var j: number;
		// 	var flag: Boolean;
		// 	for (i = 0; i < handCards.length; ++i) {
		// 		var num: number = Math.floor(handCards[i] / 10);
		// 		tmpArr[num]++;
		// 	}
		// 	var outArr: Array<number> = [];
		// 	var start: number;
		// 	var end: number;
		// 	var count: number = 0;

		// 	for (i = 0; i < tmpArr.length; ++i) {
		// 		if (tmpArr[i] > 2) {
		// 			if (count == 0)
		// 				start = i;
		// 			count++;
		// 		}
		// 		else {
		// 			if (count >= 3) {
		// 				end = i;
		// 				break;
		// 			}
		// 			else
		// 				count = 0;
		// 		}
		// 	}

		// 	//有顺子
		// 	if (end) {
		// 		for (i = start; i < end; ++i) {
		// 			count = 0;
		// 			for (j = 0; j < handCards.length; ++j) {
		// 				var num: number = Math.floor(handCards[j] / 10);
		// 				if (num == i && outArr.indexOf(handCards[j]) == -1) {
		// 					outArr.push(handCards[j]);
		// 					count++;
		// 					if (count == 3)
		// 						break;
		// 				}
		// 			}
		// 		}
		// 		var maxCount: number = (end - start + 1) * (3 + 2);
		// 		if (outArr.length <= maxCount) {
		// 			for (i = 0; i < tmpArr.length; ++i) {
		// 				if (tmpArr[i] == 1)
		// 					outArr = outArr.concat(GuanPaiCardsType.getCardByNum(handCards, i, 1));
		// 				if (outArr.length > maxCount)
		// 					break;
		// 			}
		// 		}
		// 		if (outArr.length <= maxCount) {
		// 			for (i = 0; i < tmpArr.length; ++i) {
		// 				if (tmpArr[i] == 2)
		// 					outArr = outArr.concat(GuanPaiCardsType.getCardByNum(handCards, i, 2));
		// 				if (outArr.length > maxCount)
		// 					break;
		// 			}
		// 		}
		// 		if (outArr.length <= maxCount) {
		// 			for (i = 0; i < tmpArr.length; ++i) {
		// 				if (tmpArr[i] == 3 && i < start && i > end)
		// 					outArr = outArr.concat(GuanPaiCardsType.getCardByNum(handCards, i, 3));
		// 				if (outArr.length > maxCount)
		// 					break;
		// 			}
		// 		}
		// 		if (outArr.length <= maxCount) {
		// 			for (i = 0; i < tmpArr.length; ++i) {
		// 				if (tmpArr[i] == 4) {
		// 					if (i < start && i > end)
		// 						outArr = outArr.concat(GuanPaiCardsType.getCardByNum(handCards, i, 4));
		// 					else
		// 						outArr = outArr.concat(GuanPaiCardsType.getCardByNum(handCards, i, 1, 4));
		// 				}
		// 				if (outArr.length > maxCount)
		// 					break;
		// 			}
		// 		}
		// 		while (outArr.length>maxCount){
		// 			outArr.pop();
		// 		}
		// 		return outArr;
		// 	}
		// 	else
		// 		return null;
		// }

		/**
		 * 拖拽选牌
		 */
		public static getDragHelp(handCards: Array<number>, handCardsCount: number = 0): Array<number> {
			var type: any = GuanPaiCardsType.getType(handCards, GuanPaiGameData.isBoomAAA, handCardsCount);
			//刚好是双顺则选中双顺
			if (type == GuanPaiCardsType.SHUANGSHUN)
				return handCards;
			//搜索单顺
			else
				return GuanPaiCardsType.getDanShun(handCards);
		}

		public static getCardNum(card: number): number {
			return Math.floor(card / 10);
		}

		public static getCardByNum(cards: Array<number>, num: number, count: number, startNum: number = 1): Array<number> {
			var i: number;
			var outArr: Array<number> = [];
			for (i = 0; i < cards.length; i++) {
				var card: number = cards[i];
				if (Math.floor(card / 10) == num && outArr.indexOf(card) == -1) {
					if (startNum > 1)
						startNum--;
					else {
						count--;
						outArr.push(card);
						if (count <= 0)
							break;
					}
				}
			}
			return outArr;
		}

		public static onSort(a: number, b: number): number {
			if (a < b) return 1;
			else return -1;
		}

		public static onSort2(a: number, b: number): number {
			if (a < b) return -1;
			else return 1;
		}
	}

}