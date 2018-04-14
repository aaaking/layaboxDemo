/**
 * author: zhouzhihui
 */
class ParseData {
    /**
     * //解析图鉴数据
     * @param caller 
     * @param callback 
     */
    static parseWareHouseData(caller: any, callback) {
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_call, "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x3c3830342cb00000000000000000000000000000" }, "latest"], "id": 67 }, "POST", null, function (data) {
            //POST http://10.225.20.161:8118?{"jsonrpc":"2.0","method":"eth_call","params":[{"from":"0x2ee0faf9997edfd8bdc5d16939d91d1e3674a59f","to":"0xbbf97981efee7214874c304d7fed9788203cfa33","data":"0x3c3830342cb00000000000000000000000000000"},"latest"],"id":67}
            //"{"jsonrpc":"2.0","id":67,"result":"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000b5303a3130302c313a3230302c323a3330302c333a3430302c343a3530302c353a3630302c363a3730302c373a3830302c383a3930302c393a313030302c31303a313039392c31313a313230302c31323a313239382c31333a313339392c31343a313530302c31353a313539392c31363a313730302c31373a313830302c31383a313930302c31393a313030302c32303a313130302c32313a313230302c32323a313330302c32333a313339392c32343a313030302c0000000000000000000000"}"
            Constants.clearCardStar()
            console.info(data)
            var info = JSON.parse(data)
            let result = info.result.substring(130)
            result = "0x" + result
            let result1 = Utils.toAscii(result)
            console.log("result1: " + result1)
            let cards: Array<any> = result1.split(",")
            cards.pop()
            // cards = cards.concat(cards)//测试代码 50
            // cards = cards.concat(cards)//100
            // cards = cards.concat(cards)//200
            // cards = cards.concat(cards)//400
            // cards = cards.concat(cards)//800
            for (var k in cards) {
                let v = cards[k]
                let arr = v.split(":")
                var id: number = parseInt(arr[0]);
                var cfg: any = GameConfig.getCfgHeroById(id);
                var count = arr[1]
                var isHave = false
                var star: number = Math.floor(Math.random() * 8 + 3)
                cfg.star = star
                if (CardPackageManager.instance.cards) {
                    if (CardPackageManager.instance.judgeHaveById(id))
                        isHave = true
                }
                var hasRendered = false
                var originalY = -1
                var t: any = {
                    id, count, cfg, star, isHave, hasRendered, originalY
                }
                Constants.putCard(star, t)
            }
            callback()
        }.bind(caller), function () { }.bind(caller))
    }

    static parseExchangeData(data) {
        console.info(data)
        var info = JSON.parse(data)
        let result = info.result.substring(130)
        result = "0x" + result
        let result1 = Utils.toAscii(result)
        console.log("result1: " + result1)//交易ID、cardID、price、self
        let cards = result1.split(";")
        cards.pop()
        var resultData = []
        for (var k in cards) {
            let v = cards[k]
            let arr = v.split(",")
            var id: number = parseInt(arr[0]);
            var cfg: any = GameConfig.getCfgHeroById(parseInt(arr[1]));
            var price = arr[2]
            if (parseInt(price) <= 0)
                continue
            var isself = arr[3] == "1"
            var t: any = {
                id, price, cfg, isself
            }
            resultData.push(t);
        }
        console.info(resultData)
        return resultData
    }
}