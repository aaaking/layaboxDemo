class Constants {
    static CAMP_WEI = 1
    static CAMP_SHU = 2
    static CAMP_WU = 3
    static CAMP_QUN = 4
    static CAMP_ALL = 5
    static CARD_STAR_TEN = []
    static CARD_STAR_NINE = []
    static CARD_STAR_EIGHT = []
    static CARD_STAR_SEVEN = []
    static CARD_STAR_SIX = []
    static CARD_STAR_FIVE = []
    static CARD_STAR_FOUR = []
    static CARD_STAR_THREE = []
    static CARD_STAR_TWO = []
    static CARD_STAR_ONE = []
    static clearCardStar() {
        Constants.CARD_STAR_TEN.splice(0, Constants.CARD_STAR_TEN.length)
        Constants.CARD_STAR_NINE.splice(0, Constants.CARD_STAR_NINE.length)
        Constants.CARD_STAR_EIGHT.splice(0, Constants.CARD_STAR_EIGHT.length)
        Constants.CARD_STAR_SEVEN.splice(0, Constants.CARD_STAR_SEVEN.length)
        Constants.CARD_STAR_SIX.splice(0, Constants.CARD_STAR_SIX.length)
        Constants.CARD_STAR_FIVE.splice(0, Constants.CARD_STAR_FIVE.length)
        Constants.CARD_STAR_FOUR.splice(0, Constants.CARD_STAR_FOUR.length)
        Constants.CARD_STAR_THREE.splice(0, Constants.CARD_STAR_THREE.length)
        Constants.CARD_STAR_TWO.splice(0, Constants.CARD_STAR_TWO.length)
        Constants.CARD_STAR_ONE.splice(0, Constants.CARD_STAR_ONE.length)
    }
    static putCard(star: number, card: any) {
        if (star == 10) {
            Constants.CARD_STAR_TEN.push(card)
        } else if (star == 9) {
            Constants.CARD_STAR_NINE.push(card)
        } else if (star == 8) {
            Constants.CARD_STAR_EIGHT.push(card)
        } else if (star == 7) {
            Constants.CARD_STAR_SEVEN.push(card)
        } else if (star == 6) {
            Constants.CARD_STAR_SIX.push(card)
        } else if (star == 5) {
            Constants.CARD_STAR_FIVE.push(card)
        } else if (star == 4) {
            Constants.CARD_STAR_FOUR.push(card)
        } else if (star == 3) {
            Constants.CARD_STAR_THREE.push(card)
        } else if (star == 2) {
            Constants.CARD_STAR_TWO.push(card)
        } else if (star == 1) {
            Constants.CARD_STAR_ONE.push(card)
        }
    }
    static concatListBeforeFill() {
        return new Array().concat(Constants.CARD_STAR_TEN).concat(Constants.CARD_STAR_NINE).concat(Constants.CARD_STAR_EIGHT).concat(Constants.CARD_STAR_SEVEN).concat(Constants.CARD_STAR_SIX).concat(Constants.CARD_STAR_FIVE).concat(Constants.CARD_STAR_FOUR).concat(Constants.CARD_STAR_THREE).concat(Constants.CARD_STAR_TWO).concat(Constants.CARD_STAR_ONE)
            .filter(t => t != undefined && t != null)
    }
    static concatListAfterFill() {
        return new Array().concat(Constants.CARD_STAR_TEN).concat(Constants.CARD_STAR_NINE).concat(Constants.CARD_STAR_EIGHT).concat(Constants.CARD_STAR_SEVEN).concat(Constants.CARD_STAR_SIX).concat(Constants.CARD_STAR_FIVE).concat(Constants.CARD_STAR_FOUR).concat(Constants.CARD_STAR_THREE).concat(Constants.CARD_STAR_TWO).concat(Constants.CARD_STAR_ONE)
    }
    static getCardGroupByStar() {
        var resultSet = []
        resultSet.push({ "star": Constants.CARD_STAR_TEN })
        resultSet.push({ "star": Constants.CARD_STAR_NINE })
        resultSet.push({ "star": Constants.CARD_STAR_EIGHT })
        resultSet.push({ "star": Constants.CARD_STAR_SEVEN })
        resultSet.push({ "star": Constants.CARD_STAR_SIX })
        resultSet.push({ "star": Constants.CARD_STAR_FIVE })
        resultSet.push({ "star": Constants.CARD_STAR_FOUR })
        resultSet.push({ "star": Constants.CARD_STAR_THREE })
        resultSet.push({ "star": Constants.CARD_STAR_TWO })
        resultSet.push({ "star": Constants.CARD_STAR_ONE })
        return resultSet
    }
    static fillUp() {
        Constants.CARD_STAR_TEN = Constants.fillUpImplement(Constants.CARD_STAR_TEN)
        Constants.CARD_STAR_NINE = Constants.fillUpImplement(Constants.CARD_STAR_NINE)
        Constants.CARD_STAR_EIGHT = Constants.fillUpImplement(Constants.CARD_STAR_EIGHT)
        Constants.CARD_STAR_SEVEN = Constants.fillUpImplement(Constants.CARD_STAR_SEVEN)
        Constants.CARD_STAR_SIX = Constants.fillUpImplement(Constants.CARD_STAR_SIX)
        Constants.CARD_STAR_FIVE = Constants.fillUpImplement(Constants.CARD_STAR_FIVE)
        Constants.CARD_STAR_FOUR = Constants.fillUpImplement(Constants.CARD_STAR_FOUR)
        Constants.CARD_STAR_THREE = Constants.fillUpImplement(Constants.CARD_STAR_THREE, true)
        Constants.CARD_STAR_TWO = Constants.fillUpImplement(Constants.CARD_STAR_TWO)
        Constants.CARD_STAR_ONE = Constants.fillUpImplement(Constants.CARD_STAR_ONE)
    }
    static fillUpImplement(originalData: Array<any>, end = false) {
        var data = originalData.filter(t => t != undefined && t != null)
        var length = data.length
        var remainder = length % CardList._columeCount
        var fillNum = (remainder == 0) ? 0 : CardList._columeCount - remainder
        if (end) {
            fillNum += CardList._columeCount//最后一个集合多加一行null数据
        }
        console.log("originalData:" + originalData.length + "    remainder:" + remainder + "  fillNum:" + fillNum + "  data length:" + length + "  finalLengWithNil:" + (fillNum + length))
        for (var i = 0; i < fillNum; i++) {
            data[length + i] = null
        }
        return data
    }
}