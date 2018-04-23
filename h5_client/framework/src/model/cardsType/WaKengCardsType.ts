/*
* @author seacole
* 挖坑牌型算法;
*/
class WaKengCardsType {
    constructor() {

    }

    public static cards: Array<number> = [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 150, 170, 190,
        41, 51, 61, 71, 81, 91, 101, 111, 121, 131, 151, 171, 191,
        42, 52, 62, 72, 82, 92, 102, 112, 122, 132, 152, 172, 192,
        43, 53, 63, 73, 83, 93, 103, 113, 123, 133, 153, 173, 193];

    public static DAN: number = 1;
    public static DUIZI: number = 2;
    public static SANZHANG: number = 3;
    public static ZHADAN: number = 4;
    public static DANSHUN: number = 5;
    public static SHUANGSHUN: number = 6;
    public static SANSHUN: number = 7;

    /**
     * 获取牌型
     */
    public static getType(cards: Array<number>): number {
        if (cards == null || cards.length < 1) return 0;
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
            return WaKengCardsType.DAN;
        }
        if (tmp2Arr.length == 1 && cards.length == 2) {
            return WaKengCardsType.DUIZI;
        }
        if (tmp3Arr.length == 1 && cards.length == 3) {
            return WaKengCardsType.SANZHANG;
        }
        if (tmp4Arr.length == 1 && cards.length == 4) {
            return WaKengCardsType.ZHADAN;
        }
        if (tmp1Arr.length > 2) {
            flag = true;
            for (i = 1; i < tmp1Arr.length; ++i) {
                if (tmp1Arr[i - 1] + 1 != tmp1Arr[i]) {
                    flag = false;
                    break;
                }
            }
            if (flag && tmp1Arr.length == cards.length) {
                return WaKengCardsType.DANSHUN;
            }
        }
        if (tmp2Arr.length > 2) {
            flag = true;
            for (i = 1; i < tmp2Arr.length; ++i) {
                if (tmp2Arr[i - 1] + 1 != tmp2Arr[i]) {
                    flag = false;
                    break;
                }
            }
            if (flag && tmp2Arr.length * 2 == cards.length) {
                return WaKengCardsType.SHUANGSHUN;
            }
        }
        if (tmp3Arr.length > 2) {
            flag = true;
            for (i = 1; i < tmp3Arr.length; ++i) {
                if (tmp3Arr[i - 1] + 1 != tmp3Arr[i]) {
                    flag = false;
                    break;
                }
            }
            if (flag && tmp3Arr.length * 3 == cards.length) {
                return WaKengCardsType.SANSHUN;
            }
        }
        return 0;
    }

    /**
     * 检测是否能压过上一手牌
     */
    public static checkCanUse(lastPlayCards: Array<number>, selectCards: Array<number>): boolean {
        var myCardType: number = WaKengCardsType.getType(selectCards);
        var lastCardType: number = WaKengCardsType.getType(lastPlayCards);
        var canUse: boolean
        //如果上一首出的是炸弹，需要比他更大的炸弹才行
        if (lastCardType == WaKengCardsType.ZHADAN) {
            if (myCardType == WaKengCardsType.ZHADAN && WaKengCardsType.getCardNum(selectCards[selectCards.length - 1]) > WaKengCardsType.getCardNum(lastPlayCards[0]))
                canUse = true;
            else
                canUse = false;
        }
        else {
            if (WaKengGameData.waKengHasBoom && myCardType == WaKengCardsType.ZHADAN)
                canUse = true;
            else {
                if (myCardType == lastCardType && lastPlayCards.length == selectCards.length && WaKengCardsType.getCardNum(selectCards[selectCards.length - 1]) > WaKengCardsType.getCardNum(lastPlayCards[0]))
                    canUse = true;
                else
                    canUse = false;
            }
        }
        return canUse;
    }

    /**
     * 返回所有大过的牌
     */
    public static getHelper(lastPlayCards: Array<number>, handCards: Array<number>): Array<Array<number>> {
        var lastCardType: number = WaKengCardsType.getType(lastPlayCards);
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

        if (lastCardType == WaKengCardsType.DAN)
            return WaKengCardsType.getHelperDan(lastPlayCards, handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr);
        else if (lastCardType == WaKengCardsType.DUIZI)
            return WaKengCardsType.getHelperDuiZi(lastPlayCards, handCards, tmp2Arr, tmp3Arr, tmp4Arr);
        else if (lastCardType == WaKengCardsType.SANZHANG)
            return WaKengCardsType.getHelperSanZhang(lastPlayCards, handCards, tmp3Arr, tmp4Arr);
        else if (lastCardType == WaKengCardsType.ZHADAN)
            return WaKengCardsType.getHelperZhaDan(lastPlayCards, handCards, tmp4Arr);
        else if (lastCardType == WaKengCardsType.DANSHUN)
            return WaKengCardsType.getHelperDanShun(lastPlayCards, handCards, tmp1Arr, tmp2Arr, tmp3Arr, tmp4Arr);
        else if (lastCardType == WaKengCardsType.SHUANGSHUN)
            return WaKengCardsType.getHelperShuangShun(lastPlayCards, handCards, tmp2Arr, tmp3Arr, tmp4Arr);
        else if (lastCardType == WaKengCardsType.SANSHUN)
            return WaKengCardsType.getHelperSanShun(lastPlayCards, handCards, tmp3Arr, tmp4Arr);
        return null;
    }

    /**
     * 检测能压过单牌的牌
     */
    private static getHelperDan(lastPlayCards: Array<number>, handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>): Array<Array<number>> {
        var outArr: Array<Array<number>> = [];
        var lastNum: number = WaKengCardsType.getCardNum(lastPlayCards[0]);
        var i: number;
        for (i = 0; i < tmp1Arr.length; i++) {
            if (tmp1Arr[i] > lastNum)
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp1Arr[i], 1));
        }
        for (i = 0; i < tmp2Arr.length; i++) {
            if (tmp2Arr[i] > lastNum)
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp2Arr[i], 1));
        }
        for (i = 0; i < tmp3Arr.length; i++) {
            if (tmp3Arr[i] > lastNum)
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp3Arr[i], 1));
        }
        if (WaKengGameData.waKengHasBoom) {
            for (i = 0; i < tmp4Arr.length; i++) {
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp4Arr[i], 4));
            }
        }
        for (i = 0; i < tmp4Arr.length; i++) {
            if (tmp4Arr[i] > lastNum)
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp4Arr[i], 1));
        }
        return outArr;
    }

    /**
     * 检测能压过对子的牌
     */
    private static getHelperDuiZi(lastPlayCards: Array<number>, handCards: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>): Array<Array<number>> {
        var outArr: Array<Array<number>> = [];
        var lastNum: number = WaKengCardsType.getCardNum(lastPlayCards[0]);
        var i: number;
        for (i = 0; i < tmp2Arr.length; i++) {
            if (tmp2Arr[i] > lastNum)
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp2Arr[i], 2));
        }
        for (i = 0; i < tmp3Arr.length; i++) {
            if (tmp3Arr[i] > lastNum)
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp3Arr[i], 2));
        }
        if (WaKengGameData.waKengHasBoom) {
            for (i = 0; i < tmp4Arr.length; i++) {
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp4Arr[i], 4));
            }
        }
        for (i = 0; i < tmp4Arr.length; i++) {
            if (tmp4Arr[i] > lastNum)
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp4Arr[i], 2));
        }
        return outArr;
    }

    /**
     * 检测能压过三张的牌
     */
    private static getHelperSanZhang(lastPlayCards: Array<number>, handCards: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>): Array<Array<number>> {
        var outArr: Array<Array<number>> = [];
        var lastNum: number = WaKengCardsType.getCardNum(lastPlayCards[0]);
        var i: number;
        for (i = 0; i < tmp3Arr.length; i++) {
            if (tmp3Arr[i] > lastNum)
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp3Arr[i], 3));
        }
        if (WaKengGameData.waKengHasBoom) {
            for (i = 0; i < tmp4Arr.length; i++) {
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp4Arr[i], 4));
            }
        }
        for (i = 0; i < tmp4Arr.length; i++) {
            if (tmp4Arr[i] > lastNum)
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp4Arr[i], 3));
        }
        return outArr;
    }

    /**
     * 检测能压过炸弹的牌
     */
    private static getHelperZhaDan(lastPlayCards: Array<number>, handCards: Array<number>, tmp4Arr: Array<number>): Array<Array<number>> {
        var outArr: Array<Array<number>> = [];
        var lastNum: number = WaKengCardsType.getCardNum(lastPlayCards[0]);
        var i: number;
        for (i = 0; i < tmp4Arr.length; i++) {
            if (tmp4Arr[i] > lastNum)
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp4Arr[i], 4));
        }
        return outArr;
    }

    /**
    * 检测能压过单顺的牌
    */
    private static getHelperDanShun(lastPlayCards: Array<number>, handCards: Array<number>, tmp1Arr: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>): Array<Array<number>> {
        var outArr: Array<Array<number>> = [];
        var lastNum: number = WaKengCardsType.getCardNum(lastPlayCards[0]);
        var i: number;
        var j: number;
        var flag: boolean;
        var tmp: Array<number>;
        for (i = 1; i < 11; i++) {
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
                    tmp.push(WaKengCardsType.getCardByNum(handCards, lastNum + i + j, 1)[0]);
                }
                outArr.push(tmp);
            }
        }
        if (WaKengGameData.waKengHasBoom) {
            for (i = 0; i < tmp4Arr.length; i++) {
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp4Arr[i], 4));
            }
        }
        return outArr;
    }

    /**
    * 检测能压过双顺的牌
    */
    private static getHelperShuangShun(lastPlayCards: Array<number>, handCards: Array<number>, tmp2Arr: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>): Array<Array<number>> {
        var outArr: Array<Array<number>> = [];
        var lastNum: number = WaKengCardsType.getCardNum(lastPlayCards[0]);
        var i: number;
        var j: number;
        var flag: boolean;
        var tmp1: Array<number>;
        var tmp2: Array<number>;
        for (i = 1; i < 11; i++) {
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
                    tmp2 = WaKengCardsType.getCardByNum(handCards, lastNum + i + j, 2);
                    tmp1.push(tmp2[0], tmp2[1]);
                }
                outArr.push(tmp1);
            }
        }
        if (WaKengGameData.waKengHasBoom) {
            for (i = 0; i < tmp4Arr.length; i++) {
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp4Arr[i], 4));
            }
        }
        return outArr;
    }

    /**
    * 检测能压过三顺的牌
    */
    private static getHelperSanShun(lastPlayCards: Array<number>, handCards: Array<number>, tmp3Arr: Array<number>, tmp4Arr: Array<number>): Array<Array<number>> {
        var outArr: Array<Array<number>> = [];
        var lastNum: number = WaKengCardsType.getCardNum(lastPlayCards[0]);
        var i: number;
        var j: number;
        var flag: boolean;
        var tmp1: Array<number>;
        var tmp2: Array<number>;
        for (i = 1; i < 11; i++) {
            flag = true;
            for (j = 0; j < lastPlayCards.length / 3; j++) {
                if (tmp3Arr.indexOf(lastNum + i + j) == -1 && tmp4Arr.indexOf(lastNum + i + j) == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                tmp1 = [];
                for (j = 0; j < lastPlayCards.length / 3; j++) {
                    tmp2 = WaKengCardsType.getCardByNum(handCards, lastNum + i + j, 3);
                    tmp1.push(tmp2[0], tmp2[1], tmp2[2]);
                }
                outArr.push(tmp1);
            }
        }
        if (WaKengGameData.waKengHasBoom) {
            for (i = 0; i < tmp4Arr.length; i++) {
                outArr.push(WaKengCardsType.getCardByNum(handCards, tmp4Arr[i], 4));
            }
        }
        return outArr;
    }

    /**
     * 选中一张牌智能选牌
     */
    public static getAutoSelectedCardsByOneCard(helpCards: Array<Array<number>>, handCards: Array<number>, card: number): Array<number> {
        if (helpCards && helpCards.length) {
            var cardNum: number = Math.floor(card / 10);
            var i: number;
            var j: number;
            var helpNum: number;
            var flag: boolean;
            var outArr: Array<number>;
            var type: number;
            var tmp: number;
            //与该牌数值相等的牌是否在提示中
            for (i = 0; i < helpCards.length; i++) {
                type = WaKengCardsType.getType(helpCards[i]);
                //单顺，双顺，三顺，需要选择当前选中牌开始的顺子
                if (type == WaKengCardsType.DANSHUN || type == WaKengCardsType.SHUANGSHUN || type == WaKengCardsType.SANSHUN) {
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
        if (!outArr) {
            outArr = WaKengCardsType.getSanShun(tmpArr);
            if (outArr) {
                if (WaKengCardsType.getCardNum(outArr[0]) != startNum || WaKengCardsType.getCardNum(outArr[outArr.length - 1]) != endNum)
                    outArr = null;
            }
        }
        if (!outArr) {
            outArr = WaKengCardsType.getShuangShun(tmpArr);
            if (outArr) {
                if (WaKengCardsType.getCardNum(outArr[0]) != startNum || WaKengCardsType.getCardNum(outArr[outArr.length - 1]) != endNum)
                    outArr = null;
            }
        }
        if (!outArr) {
            outArr = WaKengCardsType.getDanShun(tmpArr);
            if (outArr) {
                if (WaKengCardsType.getCardNum(outArr[0]) != startNum || WaKengCardsType.getCardNum(outArr[outArr.length - 1]) != endNum)
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
                if (count >= 3) {
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
                if (count >= 3) {
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
    private static getSanShun(handCards: Array<number>): Array<number> {
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
            if (tmpArr[i] > 2) {
                if (count == 0)
                    start = i;
                count++;
            }
            else {
                if (count >= 3) {
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
                        if (count == 3)
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
     * 拖拽选牌
     */
    public static getDragHelp(handCards: Array<number>): Array<number> {
        var type: number = WaKengCardsType.getType(handCards);
        //刚好是双顺三顺 则选中双顺 三顺
        if (type == WaKengCardsType.SHUANGSHUN || type == WaKengCardsType.SANSHUN)
            return handCards;
        //搜索单顺
        else
            return WaKengCardsType.getDanShun(handCards);
    }

    public static getCardNum(card: number): number {
        return Math.floor(card / 10);
    }

    public static getCardByNum(cards: Array<number>, num: number, count: number): Array<number> {
        var i: number;
        var outArr: Array<number> = [];
        for (i = 0; i < cards.length; i++) {
            var card: number = cards[i];
            if (Math.floor(card / 10) == num && outArr.indexOf(card) == -1) {
                count--;
                outArr.push(card);
                if (count <= 0)
                    break;
            }
        }
        return outArr;
    }

    public static onSort(a: number, b: number): number {
        if (a < b) return 1;
        else return -1;
    }
}