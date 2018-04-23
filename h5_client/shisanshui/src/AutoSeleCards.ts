module shisanshui {
    export class CardsType {
        public isSpecial : boolean;
        public types : number[];
        public cards : number[];

        constructor(isSpecial : boolean, types : number[], cards : number[]) {
            this.isSpecial = isSpecial;
            this.types = types;
            this.cards = cards;
        }
    }

    export class Card {
        public rank : number;
        public suit : number;

        constructor(rank:number, suit:number) {
            this.rank = rank;
            this.suit = suit;            
        }

        public cardNumber(rank, suit) : number {
            return rank * 10 + suit;
        }

        public toNumber() : number {
            return this.cardNumber(this.rank, this.suit);
        }

        public static newCard(c : number) {
            let rank = Math.floor( c / 10 );
            let suit = Math.floor( c % 10 );
            return new Card(rank, suit);
        }
    }

    class NormalTypesTree {
        public type : number;
        public cards : Card[];
        public nextRow : NormalTypesTree[];
        public preRow : NormalTypesTree;

        constructor(type : number, cards : Card[], node : NormalTypesTree) {
            this.type = type;
            this.cards = cards;
            this.nextRow = [];
            this.preRow = node;

            if (node) {
                node.nextRow.push(this);
            }
        }
    }

    const shifter_rank = 0;
    const shifter_suit = -1;

    function getJokerPlace(rank : number) : Card {
        return new Card(rank, shifter_suit);
    }

    function straightJokers(rankCnt : number[], n : number, len : number) : number {
        let needCnt = 0;

        for(let i = n; i < n + len; i++) {
            if (i == 1 || i == 14) {
                if (rankCnt[14] <= 0) {
                    needCnt++;
                }
            } else {
                if (rankCnt[i] <= 0) {
                    needCnt++;
                }
            }
        }

        return needCnt;
    }

    //至尊清龙
    function isRoyalLong(obj : AutoSeleCards, cards : Card[]) : boolean {
        return AutoSeleCards.isOneSuit(obj.cards) && isLong(obj, cards);
    }

    //一条龙
    function isLong(obj : AutoSeleCards, cards : Card[]) : boolean {
        if (obj.cardCnt[0] + obj.jokerCnt == 13) {
            let n = 0;
            let rank;
            for (let i = 0; i < 13; i++) {
                rank = 14 - i;
                if (obj.cards[n].rank == rank) {
                    cards[i] = obj.cards[n];
                    n++;
                } else {
                    cards[i] = getJokerPlace(rank);
                }
            }
            return true;
        }
    }

    //十二皇族
    function is12Royal(obj : AutoSeleCards, cards : Card[]) : boolean {
        for (let i = 0; i < obj.cards.length; i++) {
            if (obj.cards[i].rank < 11) {
                return false;
            }
        }

        obj.setResultCards1(cards);
        return true;
    }

    //三同花顺
    function is3StraightFlush(obj : AutoSeleCards, cards : Card[]) : boolean {
        return obj.isNStraightFlush(3, cards);
    }

    //三分天下
    function is3Four(obj : AutoSeleCards, cards : Card[]) : boolean {
        let r = false;
        if (obj.cardCnt[0] > 0) {
            if (obj.jokerCnt >= obj.cardCnt[2] + obj.cardCnt[1] * 2 + (obj.cardCnt[0] - 1) * 3) {
                r = true;
            }
        } else {
            if (obj.jokerCnt >= obj.cardCnt[2] + obj.cardCnt[1] * 2) {
                r = true;
            }
        }

        if (r) {
            obj.setResultCards2(cards, 4);
        }

        return r;
    }

    //全大
    function isAllBig(obj : AutoSeleCards, cards : Card[]) : boolean {
        for (let i = 0; i < obj.cards.length; i++) {
            if (obj.cards[i].rank < 8) {
                return false;
            }
        }
        obj.setResultCards1(cards);
        return true;
    }

    //全小
    function isAllSmall(obj : AutoSeleCards, cards : Card[]) : boolean {
        for (let i = 0; i < obj.cards.length; i++) {
            if (obj.cards[i].rank > 8) {
                return false;
            }
        }

        obj.setResultCards1(cards);
        return true;
    }

    //凑一色
    function isOneColor(obj : AutoSeleCards, cards : Card[]) : boolean {
        let color = obj.cards[0].suit % 2;
        for (let i=1; i < obj.cards.length; i++) {
            if (color != obj.cards[i].suit % 2) {
                return false;
            }
        }

        obj.setResultCards1(cards);
        return true;
    }

    //四套三条
    function is4Three(obj : AutoSeleCards, cards : Card[]) : boolean {
        let r = false;
        if (obj.cardCnt[0] + obj.cardCnt[3] > 0) {
            r =  obj.jokerCnt >= obj.cardCnt[1] + (obj.cardCnt[0] + obj.cardCnt[3] - 1) * 2
        } else {
            r = obj.jokerCnt >= obj.cardCnt[1];
        }

        if (r) {
            obj.setResultCards2(cards, 3);
        }

        return r;
    }

    //五对三条
    function is5PairsThree(obj : AutoSeleCards, cards : Card[]) : boolean {
        let r = false;
        if (obj.cardCnt[2] > 0) {
            r = obj.jokerCnt >= obj.cardCnt[2] + obj.cardCnt[0] - 1;
        } else {
            r = obj.jokerCnt >= obj.cardCnt[0] + 1
        }

        if (r) {
            obj.setResultCards3(cards);
        }

        return r;
    }

    //六对半
    function is6PairsSingle(obj : AutoSeleCards, cards : Card[]) : boolean {
        if (obj.jokerCnt >= obj.cardCnt[2] + obj.cardCnt[0] - 1) {
            obj.setResultCards2(cards, 2);

            return true;
        }

        return false;
    }

    //三顺子
    function is3Straight(obj : AutoSeleCards, cards : Card[]) : boolean {
        obj.cleanStacks();
        return obj.isNStraight(3, cards);
    }

    //三同花
    function is3Color(obj : AutoSeleCards, cards : Card[]) : boolean {
        let jokerCnt = obj.jokerCnt;

        obj.cleanStacks();

        let suitMaxRank = [0, 0, 0, 0];
        let suitInit = [0, 0, 0, 0];
        let suitCardsCnt = [[], [], [], []];
        let suitStack = [];
        obj.cards.forEach(c => {
            suitCardsCnt[c.suit].push(c);
        });

        let colorCnt;
        for (let i = 0; i < 3; i++) {
            colorCnt = 0;
            for (let j = 0; j < 4; j++) {
                if (suitCardsCnt[j].length - suitInit[j] > 0) {
                    colorCnt++;
                }
            }

            if (colorCnt > 3 - i) {
                return false;
            }

            let max = 0;
            let maxSuit;
            for (let j = 0; j < 4; j++) {
                if (suitCardsCnt[j].length - suitInit[j] > max) {
                    maxSuit = j;
                    max = suitCardsCnt[j].length - suitInit[j];
                }
            }

            let len = AutoSeleCards.lengths[i];
            if (max + jokerCnt < len) {
                return false;
            } else {
                if (max < len) {
                    jokerCnt = jokerCnt + max - len;
                    suitInit[maxSuit] = suitCardsCnt[maxSuit].length;
                } else {
                    suitInit[maxSuit] = suitInit[maxSuit] + len;
                }

                obj.cardStack.push(maxSuit);
                suitStack.push(suitInit[maxSuit]);
            }
        }

        let len, suit, cnt;
        let init = 0;
        let n = 0;
        for (let i = 0; i < 3; i++) {
            len = AutoSeleCards.lengths[i];
            suit = obj.cardStack[i];
            cnt = suitStack[i];

            for (let j = init; j < cnt; j++) {
                cards[n] = suitCardsCnt[suit][j];
                n++;
            }

            for (let j = 0; j < len - cnt; j++) {
                cards[n] = getJokerPlace(shifter_rank);
                n++;
            }
        }

        return true;
    }

    const typeCates = {
        royalLong       : 1012,
        long            : 1011,
        royal           : 1010,
        thrStrFlush     : 1009,
        threeFour       : 1008,
        allBig          : 1007,
        allSmall        : 1006,
        oneColor        : 1005,
        fourThree       : 1004,
        fivePair        : 1003,
        sixPair         : 1002,
        threeStraight   : 1001,
        threeFlush      : 1000,

        five            : 10,
        straightFlush   : 9,
        four            : 8,
        fullHouse       : 7,
        flush           : 6,
        straight        : 5,
        three           : 4,
        twoPair         : 3,
        pair            : 2,
        highCard        : 1,
    }

    let typeCatesStr = {};
    for (const k in typeCates) {
        typeCatesStr[typeCates[k]] = k;
    }

    const typeFuncs = {
        1012 : isRoyalLong,
        1011 : isLong,
        1010 : is12Royal,
        1009 : is3StraightFlush,
        1008 : is3Four,
        1007 : isAllBig,
        1006 : isAllSmall,
        1005 : isOneColor,
        1004 : is4Three,
        1003 : is5PairsThree,
        1002 : is6PairsSingle,
        1001 : is3Straight,
        1000 : is3Color,
    }

    export class AutoSeleCards {
        public static lengths = [5, 5, 3];

        public cards : Card[] = [];
        public jokerCnt : number = 0;
        public rankCnt : number[] = [];
        private suitCnt : number[] = [0, 0, 0, 0];

        public cardCnt : number[] = [0, 0, 0, 0];

        public cardStack : number[] = [];
        private jokerStack : number[] = [];

        private rankCardsCnt : Card[][];
        private suitCardsCnt : Card[][];

        private jokerCards : number[];

        private suitRankCnt : number[][];
        private allTypeChoices : CardsType[]; 
        //A2345第二大 要放在AKQJ10后面比较
        private straightOrder : number[] = [14, 5, 13, 12, 11, 10, 9, 8, 7, 6]

        constructor(cards:number[]) {
            cards.forEach(c => {
                this.cards.push(Card.newCard(c));
            });

            AutoSeleCards.sortCards(this.cards);

            this.jokerCards = [];
            this.jokerCnt = AutoSeleCards.removeJokerCards(this.cards, this.jokerCards);

            for (let i = 2; i < 15; i++) {
                this.rankCnt[i] = 0;
            }

            this.cards.forEach(c => {
                this.rankCnt[c.rank]++;
                this.suitCnt[c.suit]++;
            });

            for (let i = 2; i < 15; i++) {
                if (this.rankCnt[i] > 0) {
                    this.cardCnt[this.rankCnt[i]-1]++;
                }
            }

            this.initSuitRankCnt();
            this.initSuitCardsCnt();
            this.initRankCardsCnt();
        }

        public static checkBadBeat(cs : number[]) {
            let types = [];
            let allCards : Card[][] = [];
            let n = 0;
            let cards : Card[];
            for (let i = 0; i < 3; i++) {
                cards = [];
                allCards[i] = cards;
                for (let j = 0; j < AutoSeleCards.lengths[i]; j++) {
                    cards[j] = Card.newCard(cs[n]);
                    n++;
                }

                types[i] = AutoSeleCards.normalType(cards);

                if (types[i-1]) {
                    if (AutoSeleCards.compareTypeCards(types[i], allCards[i], types[i-1], allCards[i-1]) == 2) {
                        return true;
                    }
                }
            }

            return false;
        }

        private static insertStraightJokers(cards : Card[], jokerCnt : number) {
            if (jokerCnt <= 0) {
                return;
            }

            let rank;
            let n = cards.length;
            for (let i = 1; i < n; i++) {
                if (cards[i-1].rank - cards[i].rank > 1) {
                    rank == cards[i-1].rank - 1
                    if (rank == 1) {
                        cards.splice(0, 0, getJokerPlace(14));
                    } else {
                        cards.splice(i, 0, getJokerPlace(rank));
                    }
                    n++;
                    jokerCnt--;
                }
            }

            let maxRank = cards[0].rank
            if (maxRank <= 5) {
                cards.splice(0, 0, getJokerPlace(14));
                jokerCnt--;
                for (let i = 0; i < jokerCnt; i++) {
                    cards.splice(1, 0, getJokerPlace(5-i));
                }
            } else {
                n = Math.min(maxRank + jokerCnt, 14);
                for (let i = maxRank; i < n; i++) {
                    cards.splice(0, 0, getJokerPlace(i+1));
                    jokerCnt--;
                }

                let minRank = cards[cards.length-1].rank
                for (let i = 0; i < jokerCnt; i++) {
                    cards.push(getJokerPlace(minRank-i-1));
                }
            }
        }

        private static sortCardsPrior(cards : Card[], prior) {
            cards.sort((a : Card, b : Card) : number => {
                let ap = prior[a.rank] || 0;
                let bp = prior[b.rank] || 0;
                if (ap > bp) {
                    return -1;
                } else if (ap < bp) {
                    return 1;
                } else {
                    return AutoSeleCards.compareCard(a, b);
                }
            });
        }

        private static normalType(cards : Card[]) : number {
            let jokerCards : number[] = [];
            let cardsLen = cards.length;
            let jokerCnt;
            AutoSeleCards.sortCards(cards);
            jokerCnt = AutoSeleCards.removeJokerCards(cards, jokerCards);

            if (cardsLen == 5) {
                if (AutoSeleCards.isOneSuit(cards)) {
                    if (AutoSeleCards.isStraight(cards, jokerCnt)) {
                        AutoSeleCards.insertStraightJokers(cards, jokerCnt);
                        return 9;
                    } else {
                        for (let i = 0; i < jokerCnt; i++) {
                            cards.push(getJokerPlace(shifter_rank));
                        }
                        return 6;
                    }  
                }

                if (AutoSeleCards.isStraight(cards, jokerCnt)) {
                    AutoSeleCards.insertStraightJokers(cards, jokerCnt);
                    return 5;
                }
            }

            let rankCnt = [];
            for (let i = 0; i < 15; i++) {
                rankCnt[i] = 0;
            }
            cards.forEach(c => {
                rankCnt[c.rank]++;
            })

            let maxRank = 0;
            let maxLen = 0;
            for (let i = 14; i >= 2; i--) {
                if (rankCnt[i] > maxLen) {
                    maxLen = rankCnt[i];
                    maxRank = i;
                }
            }

           let secRank;
            switch (maxLen + jokerCnt) {
                case 5:
                    for (let i = 0; i < jokerCnt; i++) {
                        cards.push(getJokerPlace(maxRank));
                    }
                    return 10;
                case 4:
                    AutoSeleCards.sortCardsPrior(cards, {[maxRank] : 1})
                    for (let i = 0; i < jokerCnt; i++) {
                        cards.splice(-2, 0, getJokerPlace(maxRank));
                    }
                    return 8;
                case 3:
                    for (let i = 0; i <= 14; i++) {
                        if (rankCnt[i] == 2 && i != maxRank) {
                            AutoSeleCards.sortCardsPrior(cards, {[i] : 1, [maxRank] : 2})
                            for (let i = 0; i < jokerCnt; i++) {
                                cards.splice(-3, 0, getJokerPlace(maxRank));
                            }
                            return 7;
                        }
                    }

                    AutoSeleCards.sortCardsPrior(cards, { [maxRank] : 2})
                    for (let i = 0; i < jokerCnt; i++) {
                        cards.splice(-3, 0, getJokerPlace(maxRank));
                    }
                    return 4;
                case 2:
                    for (let i = 0; i <= 14; i++) {
                        if (rankCnt[i] == 2 && i != maxRank) {
                            AutoSeleCards.sortCardsPrior(cards, {[i] : 1, [maxRank] : 2})
                            for (let i = 0; i < jokerCnt; i++) {
                                cards.splice(-4, 0, getJokerPlace(maxRank));
                            }
                            return 3;
                        }
                    }
                    AutoSeleCards.sortCardsPrior(cards, {[maxRank] : 2})
                    for (let i = 0; i < jokerCnt; i++) {
                        cards.splice(-4, 0, getJokerPlace(maxRank));
                    }
                    return 2;
                default:
                    for (let i = 0; i < jokerCnt; i++) {
                        cards.push(getJokerPlace(shifter_rank));
                    }
                    return 1;
            }
        }

        private static compareTypeCards(t1 : number, c1 : Card[], t2 : number, c2 : Card[]) {
            if (t1 > t2) {
                return 2;
            } else if (t1 < t2) {
                return 1;
            } else {
                return AutoSeleCards.compareCards(c1, c2);
            }
        }

        private static sortCards(cards : Card[]) {
            cards.sort(AutoSeleCards.compareCard);
            // cards.sort((a : Card, b : Card) : number => {
            //     if (a.rank > b.rank) {
            //         return -1;
            //     } else if (a.rank == b.rank) {
            //         if (a.suit > b.suit) {
            //             return -1;
            //         } else if (a.suit == b.suit) {
            //             return 0;
            //         } else {
            //             return 1;
            //         }
            //     } else {
            //         return 1;
            //     }
            // })
        }

        private static removeJokerCards(cards : Card[], jokers : number[]) : number {
            let jokerCnt = 0;
            for (let i = cards.length-1; i >= 0; i--) {
                if (cards[i].rank == shifter_rank) {
                    jokers.push(cards.pop().toNumber());
                    jokerCnt++;
                } else {
                    break;
                }
            }

            return jokerCnt;
        }

        public typeChoice() : CardsType[]  {
            if (this.allTypeChoices) {
                return this.allTypeChoices;
            }

            this.allTypeChoices = [];

            this.cleanStacks();
            let node = new NormalTypesTree(9999999, null, null);
            this.allNormalTypes(3, node);

            this.allTypeChoices.sort((a : CardsType, b : CardsType) : number => {
                for (let i = 0; i < a.types.length; i++) {
                    if (a.types[i] < b.types[i]) {
                        return 1;
                    } else if (a.types[i] > b.types[i]) {
                        return -1;
                    }
                }
                return 0;
            })
            //普通牌型会遍历allTypeChoices 所以最后算特殊牌型 减少循环次数
            let typeCards : Card[] = [];
            let type = this.specialType(typeCards);
            if (type > 0) {
                let cards = [];
                let c : Card;
                let jokerIndex = 0;
                for (let i = 0; i < typeCards.length; i++) {
                    c = typeCards[i];
                    if (c.suit == shifter_suit) {
                        cards[i] = this.jokerCards[jokerIndex];
                        jokerIndex++;
                    } else {
                        cards[i] = typeCards[i].toNumber();
                    }
                }
                //特殊牌型要放在第一位
                this.allTypeChoices.splice(0, 0, new CardsType(true , [type], cards));
            }
            
            return this.allTypeChoices;
        }

        private specialType(t_cards : Card[]) : number {
            for (let i = typeCates.royalLong; i >= typeCates.threeFlush; i--) {
                let func = typeFuncs[i];
                if (func(this, t_cards)) {
                    console.assert(t_cards.length == 13, typeCatesStr[i], "result cards' length is", t_cards.length)
                    return i;
                }
            }

            return 0;
        }

        //从大到小找剩下的牌
        private nextCardIter : number[];
        private clearIterator() {
            this.nextCardIter = [14, -1];
        }
        private nextSingleCard() : Card {
            let rank = this.nextCardIter[0];
            let index = this.nextCardIter[1] + 1;
            for (let i = rank; i >= 2; i--) {
                if (this.rankCnt[i] > 0 && this.rankCardsCnt[i][index]) {
                    this.nextCardIter[0] = i;
                    this.nextCardIter[1] = index;
                    return this.rankCardsCnt[i][index];
                }
                index = 0;
            }
        }

        private pushCardsInTypeChoice(node : NormalTypesTree, types : number[]) {
            //当两排牌型一样时有可能出现爆牌情况，因此要重新排序
            let tempN : NormalTypesTree = node;
            let rowCards : Card[][] = [];
            let rowN = 3
            for(let i = 0; i < rowN; i++) {
                rowCards[i] = [];
                tempN.cards.forEach( c => {
                    rowCards[i].push(c);
                })

                tempN = tempN.nextRow[tempN.nextRow.length - 1]
            }

            let tmp : Card[]
            for (let i = 1; i < rowN; i++) {
                for (let j = i; j > 0; j--) {
                    if (types[j] == types[j-1] && 
                        AutoSeleCards.compareCards(rowCards[j], rowCards[j-1]) == 2) {
                        tmp = rowCards[j];
                        rowCards[j] = rowCards[j-1];
                        rowCards[j-1] = tmp;
                    } else {
                        break;
                    }
                }
            }

            let cards = [];
            let choice = new CardsType(false, types, cards);

            this.clearIterator();

            let c : Card;
            let jokerIndex : number = 0;
            for (let i = 0; i < 3; i++) {
                rowCards[i].forEach( c => {
                    if (c.suit == shifter_suit) {
                        cards.push(this.jokerCards[jokerIndex]);
                        jokerIndex++;
                    } else {
                        cards.push(c.toNumber());
                    }
                });

                for (let j = 0; j < AutoSeleCards.lengths[i]-rowCards[i].length; j++) {
                    cards.push(this.nextSingleCard().toNumber());
                }
            }

            this.allTypeChoices.push(choice);
        }

        private hasBigType(types : number[]) {
            let type, n, e;
            for (let i = 0; i < this.allTypeChoices.length; i++) {
                n = 0;
                e = 0;
                type = this.allTypeChoices[i].types;
                for (let j = 0; j < 3; j++) {
                    if (types[j] < type[j]) {
                        n++;
                    } else if (types[j] > type[j]) {
                        n--;
                    } else {
                        e++;
                    }
                }

                if (e + n == 3) {
                    return false;           //三排都小于丢掉
                } else if (e - n == 3) {
                    this.allTypeChoices.splice(i, 1);       //三排都大于丢掉小的
                    return true;
                }
            }

            return true;
        }

        private allNormalTypes( n: number, node : NormalTypesTree) {
            let len = AutoSeleCards.lengths[AutoSeleCards.lengths.length - n];
            let maxRank, maxLen = 0;
            let secRank, secLen = 0;
            for (let i = 14; i >= 2; i--) {
                if (this.rankCnt[i] > maxLen) {
                    maxLen = this.rankCnt[i];
                    maxRank = i;
                }
            }

            if (n == 1) {
                let cards, type;
                if (maxLen + this.jokerCnt >= 3) {
                    if (node.type > typeCates.three || (node.type == typeCates.three && node.cards[0].rank > maxRank)) {
                        cards = [];
                        type = typeCates.three;

                        if (maxLen >= 3) {
                            for (let i = 0; i < len; i++) {
                                cards[i] = this.rankCardsCnt[maxRank][i];
                            }
                        } else {
                            for (let i = 0; i < maxLen; i++) {
                                cards[i] = this.rankCardsCnt[maxRank][i];
                            }

                            for (let i = 0; i < 3-maxLen; i++) {
                                cards[maxLen+i] = getJokerPlace(maxRank);
                            }
                        }
                    }
                } else if (maxLen + this.jokerCnt == 2) {
                    if (node.type > typeCates.pair || (node.type == typeCates.pair && node.cards[0].rank > maxRank)) {
                        cards = [];
                        type = typeCates.pair;

                        for (let i = 0; i < maxLen; i++) {
                            cards[i] = this.rankCardsCnt[maxRank][i];
                        }

                        for (let i = 0; i < this.jokerCnt; i++) {
                            cards[maxLen+i] = getJokerPlace(maxRank);
                        }
                    }
                    
                } else {
                    cards = [];
                    type = typeCates.highCard;
                    cards[0] = this.rankCardsCnt[maxRank][0];
                }

                if (!cards) {
                    node.preRow.nextRow.pop();
                } else {
                    let types = [node.preRow.type, node.type, type];
                    if (this.hasBigType(types)) {
                        this.decreaseCardsCnt(cards);
                        new NormalTypesTree(type, cards, node);
                        
                        this.pushCardsInTypeChoice(node.preRow, types)
                        this.increaseCardsCnt(cards);
                    }
                }
                return;
            }

            let needCnt, rowType, cards, newNode;
            if (len >= 5 && node.type >= typeCates.straightFlush) {
                let i 
                for (let t = 0; t < this.straightOrder.length; t++) {
                    i = this.straightOrder[t];
                    for (let j = 3; j >=0; j--) {
                        needCnt = straightJokers(this.suitRankCnt[j], i-4, 5);
                        if (needCnt <= this.jokerCnt) {
                            rowType = typeCates.straightFlush;
                            cards = this.generateStraightFlushCards(5, i, j);
                            if ((rowType == node.type && AutoSeleCards.compareCards(node.cards, cards) == 2)
                            || node.type > rowType) {
                                this.decreaseCardsCnt(cards);
                                newNode = new NormalTypesTree(rowType, cards, node);
                                this.allNormalTypes(n-1, newNode);
                                this.increaseCardsCnt(cards);
                            }
                        }
                    }
                }
            }

            if (len >= 5 && node.type >= typeCates.flush) {
                for (let i = 3; i >= 0; i--) {
                    if (this.suitCnt[i] >= 5) {
                        for (let j = 0; j <= this.jokerCnt; j++) {
                            cards = [];
                            this.calcAllFlush(cards, this.suitCardsCnt[i], this.suitCardsCnt[i].length, 5-j, n, node);
                        }                        
                    } else {
                        for (let j = 5-this.suitCnt[i]; j <= this.jokerCnt; j++) {
                            cards = [];
                            this.calcAllFlush(cards, this.suitCardsCnt[i], this.suitCardsCnt[i].length, 5-j, n, node);
                        }
                    }
                }
            }

            let rank;
            if (len >= 5 && node.type >= typeCates.straight) {
                let i
                for (let t = 0; t < this.straightOrder.length; t++) {
                    i = this.straightOrder[t]
                    needCnt = straightJokers(this.rankCnt, i-4, 5);
                    if (needCnt <= this.jokerCnt) {
                        cards = []
                        let rankCards, rank;
                        for (let j = 0; j < 5; j++) {
                            rank = i - j;
                            if (rank == 1) {
                                rank = 14;
                                rankCards = this.rankCardsCnt[rank];
                                if (rankCards && rankCards.length > 0) {
                                    cards.splice(0, 0, rankCards[0]);
                                } else {
                                    cards.splice(0, 0, getJokerPlace(rank));
                                }
                            } else {
                                rankCards = this.rankCardsCnt[rank];
                                if (rankCards && rankCards.length > 0) {
                                    cards[j] = rankCards[0];
                                } else {
                                    cards[j] = getJokerPlace(rank);
                                }
                            }
                        }

                        if (!AutoSeleCards.isOneSuit(cards)) {
                            if ((node.type == typeCates.straight && AutoSeleCards.compareCards(node.cards, cards) == 2) || 
                                node.type > typeCates.straight) {
                                    this.decreaseCardsCnt(cards);
                                    let newNode = new NormalTypesTree(typeCates.straight, cards, node);
                                    this.allNormalTypes(n - 1, newNode);
                                    this.increaseCardsCnt(cards);
                            }
                        }
                    }
                }
            }

            cards = [];
            let cards1;
            switch (maxLen) {
                case 5: 
                    if (node.type >= typeCates.five) {
                        for (let i = 0; i < maxLen; i++) {
                            cards[i] = this.rankCardsCnt[maxRank][i];
                        } 
                        newNode = new NormalTypesTree(typeCates.five, cards, node);
                        this.decreaseCardsCnt(cards);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards);
                    }
                    break;
                case 4:
                    for (let i = 0; i < maxLen; i++) {
                        cards[i] = this.rankCardsCnt[maxRank][i];
                    } 
                    if (this.jokerCnt > 0 && node.type >= typeCates.five) {
                        cards1 = this.copyCards(cards);
                        cards1[4] = getJokerPlace(maxRank);
                        newNode = new NormalTypesTree(typeCates.five, cards1, node);
                        this.decreaseCardsCnt(cards1);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards1);
                    }

                    if (node.type >= typeCates.four) {
                        newNode = new NormalTypesTree(typeCates.four, cards, node);
                        this.decreaseCardsCnt(cards);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards);
                    }
                    break;
                case 3:
                    for (let i = 0; i < maxLen; i++) {
                        cards[i] = this.rankCardsCnt[maxRank][i];
                    } 
                    if (this.jokerCnt >= 2 && node.type >= typeCates.five) {
                        cards1 = this.copyCards(cards);
                        cards1[3] = getJokerPlace(maxRank);
                        cards1[4] = getJokerPlace(maxRank);
                        newNode = new NormalTypesTree(typeCates.five, cards1, node);
                        this.decreaseCardsCnt(cards1);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards1);
                    }

                    if (this.jokerCnt >= 1 && node.type >= typeCates.four) {
                        cards1 = this.copyCards(cards);
                        cards1[3] = getJokerPlace(maxRank);
                        newNode = new NormalTypesTree(typeCates.four, cards1, node);
                        this.decreaseCardsCnt(cards1);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards1);
                    }

                    for (let i = 2; i <= 14; i++) {
                        if (this.rankCnt[i] == 2) {
                            secLen = 2;
                            secRank = i;
                        }
                    }

                    if (!secRank) {
                        for (let i = 2; i < maxRank; i++) {
                            if (this.rankCnt[i] == 3) {
                                secLen = 3;
                                secRank = i;
                            }
                        }
                    }

                    if (secRank && node.type >= typeCates.fullHouse) {
                        cards1 = this.copyCards(cards);
                        cards1[3] = this.rankCardsCnt[secRank].pop();
                        cards1[4] = this.rankCardsCnt[secRank].pop();

                        newNode = new NormalTypesTree(typeCates.fullHouse, cards1, node);
                        this.decreaseCardsCnt(cards1);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards1);

                        secRank = 0;
                        secLen = 0;
                    }

                    if (node.type >= typeCates.three) {
                        newNode = new NormalTypesTree(typeCates.three, cards, node);
                        this.decreaseCardsCnt(cards);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards);
                    }
                    break;
                case 2:
                    for (let i = 0; i < maxLen; i++) {
                        cards[i] = this.rankCardsCnt[maxRank][i];
                    } 
                    if (this.jokerCnt >= 3 && node.type >= typeCates.five) {
                        cards1 = this.copyCards(cards);
                        for (let i = maxLen; i < 5; i++) {
                            cards1[i] = getJokerPlace(maxRank);
                        }
                        newNode = new NormalTypesTree(typeCates.five, cards1, node);
                        this.decreaseCardsCnt(cards1);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards1);
                    }

                    if (this.jokerCnt >= 2 && node.type >= typeCates.four) {
                        cards1 = this.copyCards(cards);
                        cards1[2] = getJokerPlace(maxRank);
                        cards1[3] = getJokerPlace(maxRank);
                        newNode = new NormalTypesTree(typeCates.four, cards1, node);
                        this.decreaseCardsCnt(cards1);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards1);
                    }

                    if (this.jokerCnt >= 1) {
                        cards1 = this.copyCards(cards);
                        cards1[2] = getJokerPlace(maxRank);
                        if (node.type >= typeCates.fullHouse) {
                            for (let i = 2; i < maxRank; i++) {
                                if (this.rankCnt[i] == 2) {
                                    secLen = 2;
                                    secRank = i;
                                }
                            }

                            if (secRank) {
                                let cards2 = this.copyCards(cards1);
                                cards2[3] = this.rankCardsCnt[secRank].pop();
                                cards2[4] = this.rankCardsCnt[secRank].pop();

                                newNode = new NormalTypesTree(typeCates.fullHouse, cards2, node);
                                this.decreaseCardsCnt(cards2);
                                this.allNormalTypes(n-1, newNode);
                                this.increaseCardsCnt(cards2);

                                secRank = 0;
                                secLen = 0;
                            }
                        }

                        if (node.type >= typeCates.three) {
                            newNode = new NormalTypesTree(typeCates.three, cards1, node);
                            this.decreaseCardsCnt(cards1);
                            this.allNormalTypes(n-1, newNode);
                            this.increaseCardsCnt(cards1);
                        }
                    }

                    if (node.type >= typeCates.twoPair) {
                        for (let i = 2; i < maxRank; i++) {
                            if (this.rankCnt[i] == 2) {
                                secLen = 2;
                                secRank = i;
                            }
                        }

                        if (secRank) {
                            cards1 = this.copyCards(cards);
                            cards1[2] = this.rankCardsCnt[secRank].pop();
                            cards1[3] = this.rankCardsCnt[secRank].pop();

                            newNode = new NormalTypesTree(typeCates.twoPair, cards1, node);
                            this.decreaseCardsCnt(cards1);
                            this.allNormalTypes(n-1, newNode);
                            this.increaseCardsCnt(cards1);
                        }

                    }

                    if (node.type >= typeCates.pair) {
                        newNode = new NormalTypesTree(typeCates.pair, cards, node);
                        this.decreaseCardsCnt(cards);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards);
                    }
                    break;
                case 1:
                    cards[0] = this.rankCardsCnt[maxRank][0];
                    if (this.jokerCnt >= 4 && node.type >= typeCates.five) {
                        cards1 = this.copyCards(cards);
                        for (let i = maxLen; i < 5; i++) {
                            cards1[i] = getJokerPlace(maxRank);
                        }
                        newNode = new NormalTypesTree(typeCates.five, cards1, node);
                        this.decreaseCardsCnt(cards1);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards1);
                    }

                    if (this.jokerCnt >= 3 && node.type >= typeCates.four) {
                        cards1 = this.copyCards(cards);
                        for (let i = maxLen; i < 4; i++) {
                            cards1[i] = getJokerPlace(maxRank);
                        }
                        newNode = new NormalTypesTree(typeCates.four, cards1, node);
                        this.decreaseCardsCnt(cards1);
                        this.allNormalTypes(n-1, newNode);
                        this.increaseCardsCnt(cards1);
                    }

                    if (this.jokerCnt >= 2) {
                        cards1 = this.copyCards(cards);
                        for (let i = maxLen; i < 3; i++) {
                            cards1[i] = getJokerPlace(maxRank);
                        }
                        if (node.type >= typeCates.three) {
                            newNode = new NormalTypesTree(typeCates.three, cards1, node);
                            this.decreaseCardsCnt(cards1);
                            this.allNormalTypes(n-1, newNode);
                            this.increaseCardsCnt(cards1);
                        }
                    }

                    if (this.jokerCnt >= 1 && node.type >= typeCates.pair) {
                        cards1 = this.copyCards(cards);
                        for (let i = maxLen; i < 2; i++) {
                            cards1[i] = getJokerPlace(maxRank);
                        }
                        if (node.type >= typeCates.pair) {
                            newNode = new NormalTypesTree(typeCates.pair, cards1, node);
                            this.decreaseCardsCnt(cards1);
                            this.allNormalTypes(n-1, newNode);
                            this.increaseCardsCnt(cards1);
                        }
                    }

                    newNode = new NormalTypesTree(typeCates.highCard, cards, node);
                    this.decreaseCardsCnt(cards);
                    this.allNormalTypes(n-1, newNode);
                    this.increaseCardsCnt(cards);
                default:
                    break;
            }

        }

        //遍历所有的同花
        private calcAllFlush(cards : Card[],  suitCards: Card[], n : number, m : number, row : number, node : NormalTypesTree) {
            if (m == 0) {
                let jokerCnt = 5 - cards.length;
                if (!AutoSeleCards.isStraight(cards, jokerCnt)) {
                    let cards1 = this.copyCards(cards);
                    for (let i = cards1.length; i < 5; i++) {
                        cards1[i] = getJokerPlace(shifter_rank);
                    }

                    this.decreaseCardsCnt(cards1);
                    let newNode = new NormalTypesTree(typeCates.flush, cards1, node);
                    this.allNormalTypes(row-1, newNode);
                    this.increaseCardsCnt(cards1);
                }
                return;
            }

            for (let i = n; i >= m; i--) {
                cards[m-1] = suitCards[i-1];
                this.calcAllFlush(cards, suitCards, i-1, m-1, row, node);
            }
        }

        private static isStraight(cards : Card[], jokerCnt : number) : boolean {
            let gap = 0;
            for (let i = 1; i < cards.length; i++) {
                if (cards[i].rank == cards[i-1].rank) {
                    return false;
                }
                gap = gap + cards[i-1].rank - cards[i].rank - 1;
            }

            if (gap <= jokerCnt) {
                return true;
            } else {
                return AutoSeleCards.isA2345(cards, jokerCnt);
            }
        }

        private static isA2345(cards : Card[], jokerCnt : number) {
            if (cards[0].rank != 14 && cards[0].rank > 5) {
                return false;
            }

            for (let i = 1; i < cards.length; i++) {
                if (cards[i].rank == cards[i-1].rank || cards[i].rank > 5) {
                    return false;
                }
            }

            return true;
        }

        public static isOneSuit(cards : Card[]) {
            let suit;
            for (let i = 0; i < cards.length; i++) {
                if ( i == 0 || suit == shifter_suit) {
                    suit = cards[i].suit;
                } else if (cards[i].suit != shifter_suit && suit != cards[i].suit) {
                    return false;
                }
            }

            return true;
        }

        private decreaseCardsCnt(cards : Card[]) {
            let suitCards : Card[], rankCards : Card[];
            cards.forEach(e => {
                if (e.suit == shifter_suit) {
                    this.jokerCnt--;
                } else {
                    this.suitRankCnt[e.suit][e.rank]--;
                    this.rankCnt[e.rank]--;
                    this.suitCnt[e.suit]--;

                    suitCards = this.suitCardsCnt[e.suit];
                    for (let i = 0; i < suitCards.length; i++) {
                        if (suitCards[i].rank == e.rank) {
                            suitCards.splice(i, 1);
                            break;
                        }
                    }

                    rankCards = this.rankCardsCnt[e.rank];
                    for(let i = 0; i < rankCards.length; i++) {
                        if (rankCards[i].suit == e.suit) {
                            rankCards.splice(i, 1);
                            break;
                        }
                    }
                }
            });
        }

        private increaseCardsCnt(cards : Card[]) {
            let suitCards : Card[], rankCards : Card[];
            let temp : Card;
            cards.forEach(e => {
                if (e.suit == shifter_suit) {
                    this.jokerCnt++;
                } else {
                    this.suitRankCnt[e.suit][e.rank]++;
                    this.rankCnt[e.rank]++;
                    this.suitCnt[e.suit]++;

                    suitCards = this.suitCardsCnt[e.suit];
                    suitCards.push(e);

                    for (let i = suitCards.length-2; i >= 0; i--) {
                        if (suitCards[i].rank < e.rank) {
                            temp = suitCards[i]
                            suitCards[i] = suitCards[i+1];
                            suitCards[i+1] = temp
                        } else {
                            break;
                        }
                    }

                    rankCards = this.rankCardsCnt[e.rank];
                    rankCards.push(e);

                    for(let i = rankCards.length-2; i >= 0; i--) {
                        if (rankCards[i].suit < e.suit) {
                            temp = rankCards[i]
                            rankCards[i] = rankCards[i+1];
                            rankCards[i+1] = temp
                        } else {
                            break;
                        }
                    }
                }
            });
        }

        private generateStraightFlushCards(len : number, initR : number, suit : number) : Card[] {
            let rankCnt = this.suitRankCnt[suit];
            let cards = [];
            if (initR == 5) {
                if (rankCnt[14] > 0) {
                    cards.push(new Card(14, suit));
                } else {
                    cards.push(getJokerPlace(14));
                }

                for (let i = 5; i > 1; i--) {
                    if (rankCnt[i] > 0) {
                        cards.push(new Card(i, suit))
                    } else {
                        cards.push(getJokerPlace(i));
                    }
                }            
            } else {
                for (let i = initR; i > initR - len; i--) {
                    if (rankCnt[i] > 0) {
                        cards.push(new Card(i, suit))
                    } else {
                        cards.push(getJokerPlace(i));
                    }
                }
            }
            return cards;
        }

        private static hasJokers(c : Card[]) {
            c.forEach( e => {
                if (e.suit == shifter_suit) {
                    return true;
                }
            })

            return false;
        }

        private static compareCards(c1 : Card[], c2 : Card[]) {
            let ca, cb;
            //先比较大小
            for (let i = 0; i < c1.length; i++) {
                ca = c1[i];
                cb = c2[i];
                if (ca.rank < cb.rank) {
                    return 1;
                } else if (ca.rank > cb.rank) {
                    return 2;
                }
            }

            //大小一样没有赖子的大
            if (this.hasJokers(c1) && !this.hasJokers(c2)) {
                return 2;
            } 

            if (this.hasJokers(c2) && !this.hasJokers(c1)) {
                return 1;
            }

            //都有或者都没有赖子比花色
            for (let i = 0; i < c1.length; i++) {
                ca = c1[i];
                cb = c2[i];
                if (ca.suit < cb.suit) {
                    return 1;
                } else if (ca.suit > cb.suit) {
                    return 2;
                }
            }

            //都一样
            return 0;
        }

        private static compareCard(a : Card, b : Card) : number {
            if (a.rank > b.rank) {
                return -1;
            } else if (a.rank == b.rank) {
                if (a.suit > b.suit) {
                    return -1;
                } else if (a.suit == b.suit) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        }

        private initSuitRankCnt() {
            this.suitRankCnt = [];
            for (let i = 0; i < 4; i++) {
                this.suitRankCnt[i] = [];
                for (let j = 0; j < 15; j++) {
                    this.suitRankCnt[i][j] = 0;
                }
            }

            let c;
            for (let i = 0; i < this.cards.length; i++) {
                c = this.cards[i];
                this.suitRankCnt[c.suit][c.rank]++;
            }
        }

        //从大到小的牌型排序
        public setResultCards1(cards : Card[]) {
            for (let i = 0; i < this.cards.length; i++) {
                cards[i] = this.cards[i];
            }

            let n = 13 - cards.length;
            if (n > 0) {
                for(let i = 0; i < n; i++) {
                    cards.push(getJokerPlace(shifter_rank));
                }
            }
        }

        //最后一张是单张的特殊牌型排序
        public setResultCards2(cards : Card[], n : number) {
            let minRank = 99;
            for (let i = 2; i < 15; i++) {
                if (this.rankCnt[i] == 1 && i < minRank) {
                    minRank = i;
                }
            }

            let c : Card;
            let j = 0, k = 0;
            for (let i = 0; i < this.cards.length; i++) {
                c = this.cards[i];
                if (c.rank == minRank) {
                    cards[12] = c;
                } else {
                    k++;
                    cards[j] = c;
                    j++;

                    if (k == n) {
                        k = 0;
                    } else if (!this.cards[i+1] || this.cards[i+1].rank != c.rank) {
                        for (let m = 0; m < n-k; m++) {
                            cards[j] = getJokerPlace(c.rank);
                            j++;
                        }
                        k = 0;
                    }
                }
            }

            if (cards.length == 12) {
                cards.push(getJokerPlace(shifter_rank));
            }
        }

        //五对三条排序
        public setResultCards3(cards : Card[]) {
            let maxRank = 0, maxLen = 0;
            for (let i = 2; i < 15; i++) {
                if (this.rankCnt[i] > maxLen) {
                    maxLen = this.rankCnt[i];
                    maxRank = i;
                } else if (this.rankCnt[i] == maxLen && i > maxRank) {
                    maxRank = i;
                }
            }

            let c;
            let j = 3, k = 0, n = 2;
            let x = 0;
            for (let i = 0; i < this.cards.length; i++) {
                c = this.cards[i];
                if (c.rank == maxRank) {
                    cards[x] = c;
                    x++;
                } else {
                    k++;
                    cards[j] = c;
                    j++;

                    if (k == n) {
                        k = 0;
                    } else if (!this.cards[i+1] || this.cards[i+1].rank != c.rank) {
                        for (let m = 0; m < n-k; m++) {
                            cards[j] = getJokerPlace(c.rank);
                            j++;
                        }
                        k = 0;
                    }
                }
            }

            for (; x < 3; x++) {
                cards[x] = getJokerPlace(maxRank);
            }
        }

        public isNStraight(n : number, result : Card[]) : boolean {
            if (n == 0) {
                return true;
            }

            let len = AutoSeleCards.lengths[AutoSeleCards.lengths.length - n];
            let needCnt, i
            for (let k = 0; k < this.straightOrder.length; k++) {
                i = this.straightOrder[k] - 4
                needCnt = straightJokers(this.rankCnt, i, len);
                if (needCnt <= this.jokerCnt) {
                    this.pushJokers(needCnt);
                    this.pushStraightCards(this.rankCnt, i, len);

                    let r = this.isNStraight(n-1, result);
                    this.popJokers();
                    if (r) {
                        this.popStraightCards(this.rankCnt, i, len, result, n, null);
                        return true;
                    } else {
                        for (let j = 0; j < len - needCnt; j++) {
                            let rank = this.cardStack.pop();
                            this.rankCnt[rank] += 1;
                        }
                    }

                }
            }
            
            return false;
        }

        private currentSuitCnt() : number {
            let suitCnt = 0;
            let colorLen;
            for (let i = 0; i < this.suitRankCnt.length; i++) {
                colorLen = 0;
                for (let j = 0; j < this.suitRankCnt[i].length; j++) {
                    if (this.suitRankCnt[i][j] > 0) {
                        colorLen++;
                    }
                }

                if (colorLen > 0) {
                    suitCnt++;
                }
            }

            return suitCnt;
        }

        private maxLenSuit() : [number, number] {
            let colorLen, suit;
            let maxColorLen = 0;
            for (let i = 0; i < this.suitRankCnt.length; i++) {
                colorLen = 0;
                for (let j = 0; j < this.suitRankCnt[i].length; j++) {
                    if (this.suitRankCnt[i][j] > 0) {
                        colorLen++;
                    }
                }

                if (colorLen > maxColorLen) {
                    suit = i;
                    maxColorLen = colorLen
                }
            }

            return [suit, maxColorLen];
        }

        public isNStraightFlush(n : number, result : Card[]) : boolean {
            if (n == 0) {
                return true;
            }

            let suitCnt = this.currentSuitCnt();
            if (suitCnt > n) {
                return false
            }

            let len = AutoSeleCards.lengths[AutoSeleCards.lengths.length - n];

            let t = this.maxLenSuit();
            let maxSuit = t[0];
            let maxLen = t[1];

            if (maxLen + this.jokerCnt < len) {
                return false;            
            }

            let rankCnt = this.suitRankCnt[maxSuit];
            let needCnt, i
            for (let k = 0; k < this.straightOrder.length; k++) {
                i = this.straightOrder[k]-4
                needCnt = straightJokers(rankCnt, i, len);
                if (needCnt <= this.jokerCnt) {
                    this.pushJokers(needCnt);
                    this.pushStraightCards(rankCnt, i, len);

                    let r = this.isNStraightFlush(n-1, result);
                    this.popJokers();
                    if (r) {
                        this.popStraightCards(rankCnt, i, len, result, n, maxSuit)
                        return true;
                    } else {
                        for (let j = 0; j < len - needCnt; j++) {
                            let rank = this.cardStack.pop();
                            rankCnt[rank] += 1;
                        }

                        return false;
                    }

                }
            }

            return false;
        }

        private pushStraightCards(rankCnt, n, len) {
            let rank : number;
            for (let i = n; i < n + len; i++) {
                rank = i
                if (rank == 1) {
                rank = 14;
                } 

                if (rankCnt[rank] > 0) {
                    this.cardStack.push(i)
                    rankCnt[rank]--;
                }
            }
        }

        private popStraightCards(rankCnt : number[], n : number, len : number, result : Card[], row : number, suit : number) {
            let index, c;
            let rank = this.cardStack.pop();
            rankCnt[rank]++;
            let rank1:number, rank2:number;
            for (let i = len-1; i >= 0; i--) {
                rank1 = i + n
                rank2 = rank1
                if (rank2 == 1) {
                    index = (3-row) * 5
                    rank2 = 14
                } else if (n == 1) {
                    index = (3-row) * 5 + len - i
                } else {
                    index = (3-row) * 5 + len - i - 1
                }

                if (rank1 == rank) {
                    if (suit) {
                        result[index] = new Card(rank2, suit)
                    } else {
                        result[index] = this.rankCardsCnt[rank2].pop()
                    }

                    rank = this.cardStack.pop();
                    rankCnt[rank]++;
                } else {
                    result[index] = getJokerPlace(rank2);
                }
            }

            this.cardStack.push(rank)
            rankCnt[rank]--;
        }

        public cleanStacks() {
            if (this.cardStack.length > 0) {
                this.cardStack = [];
            }

            if (this.jokerStack.length > 0) {
                this.jokerStack = [];
            }
        }

        private pushJokers(cnt) {
            this.jokerStack.push(cnt);
            this.jokerCnt -= cnt;
        }

        private popJokers() {
            let cnt = this.jokerStack.pop();
            this.jokerCnt += cnt;
        }

        public initRankCardsCnt() {
            this.rankCardsCnt = [];
            let c;
            for (let i = this.cards.length - 1; i >=0; i--) {
                c = this.cards[i];
                this.rankCardsCnt[c.rank] = this.rankCardsCnt[c.rank] || [];
                this.rankCardsCnt[c.rank].push(c);
            }
        }

        private initSuitCardsCnt() {
            this.suitCardsCnt = [[], [], [], []];
            this.suitCnt = [0, 0, 0, 0];
            let c;
            for (let i = 0; i < this.cards.length; i++) {
            // for (let i = this.cards.length-1; i >= 0; i--) {
                c = this.cards[i];
                this.suitCardsCnt[c.suit].push(c);

                this.suitCnt[c.suit]++;
            }

        }

        private copyCards(cards : Card[]) : Card[] {
            let c1 = [];
            for (let i = 0; i < cards.length; i++) {
                c1[i] = cards[i];
            }

            return c1;
        }

    }
}