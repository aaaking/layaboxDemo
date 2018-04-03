/**
 * @author seacole
 * 数学算法
 */
var MathUtils = /** @class */ (function () {
    function MathUtils() {
    }
    /**
     * 计算距离
     * @param p1
     * @param p2
     * @returns {number}
     */
    MathUtils.distancePoint = function (p1, p2) {
        return this.distance(p1.x, p1.y, p2.x, p2.y);
    };
    /**
     * 计算距离
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @returns {number}
     */
    MathUtils.distance = function (x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    };
    /**
     * 计算两点直线的斜率
     * @param p1
     * @param p2
     * @returns {number}
     */
    MathUtils.angle = function (p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    };
    /**
     * 获取一个随机整数
     * @param max
     * @param min
     * @returns {number}
     */
    MathUtils.makeRandomInt = function (max, min) {
        if (min === void 0) { min = 0; }
        return Math.floor(Math.random() * (max - min)) + min;
    };
    /**
     * 获取一个随机浮点数
     * @param max
     * @param min
     * @returns {number}
     */
    MathUtils.makeRandomFloat = function (max, min) {
        if (min === void 0) { min = 0; }
        return Math.random() * (max - min) + min;
    };
    /**
     * 生成一个基于value的range偏移的随机数
     * @param value
     * @param range
     * @returns {number}
     */
    MathUtils.makeRandomByRange = function (value, range) {
        return value + (Math.random() * range * 2 - range);
    };
    /**
     * 生成一个随机整数数组
     * @param len
     * @returns {string}
     */
    MathUtils.makeRandomIntArr = function (len, max, min) {
        if (min === void 0) { min = 0; }
        var target = [];
        for (var i = 0; i < len; i++) {
            target.push(this.makeRandomInt(max));
        }
        return target;
    };
    /**
     * 生成一个范围数组
     * @param to
     * @param from
     * @param step
     * @returns {Array<number>}
     */
    MathUtils.makeOrderIntArray = function (to, from, step) {
        if (from === void 0) { from = 0; }
        if (step === void 0) { step = 1; }
        var result = [];
        for (var i = from; i <= to; i += step) {
            result.push(i);
        }
        return result;
    };
    /**
     * 打乱一个数组
     * @param arr
     * @returns {any}
     */
    MathUtils.mixArray = function (arr) {
        for (var i = 0, len = Math.round(arr.length / 2); i < len; i++) {
            var a = this.makeRandomInt(arr.length);
            var b = this.makeRandomInt(arr.length);
            var temp = arr[a];
            arr[a] = arr[b];
            arr[b] = temp;
        }
        return arr;
    };
    /**
     * 打乱一个二维数组
     * @param arr
     * @returns {Array<Array<any>>}
     */
    MathUtils.mixArray2 = function (arr) {
        var cH = arr[0].length;
        var cV = arr.length;
        var pos0;
        var pos1;
        for (var i = 0, len = Math.round(cH * cV / 2); i < len; i++) {
            pos0 = [this.makeRandomInt(cH), this.makeRandomInt(cV)];
            pos1 = [this.makeRandomInt(cH), this.makeRandomInt(cV)];
            var temp = arr[pos0[0]][pos0[1]];
            arr[pos0[0]][pos0[1]] = arr[pos1[0]][pos1[1]];
            arr[pos1[0]][pos1[1]] = temp;
        }
        return arr;
    };
    /**
     * 随机从一个数组中取出一项
     * @param arr
     * @returns {*}
     */
    MathUtils.getRandomFromArray = function (arr) {
        return arr[this.makeRandomInt(arr.length)];
    };
    /**
     * 根据范围阻隔
     * @param value
     * @param lower
     * @param upper
     * @returns {number}
     */
    MathUtils.fixRange = function (value, lower, upper) {
        if (value < lower) {
            value = lower;
        }
        else if (value > upper) {
            value = upper;
        }
        return value;
    };
    /**
     * 根据范围补足
     * @param value
     * @param max
     * @param min
     * @returns {number}
     */
    MathUtils.roundFix = function (value, max, min) {
        if (min === void 0) { min = 0; }
        if (value < min) {
            value += max - min;
        }
        else if (value >= max) {
            value -= max - min;
        }
        return value;
    };
    /**
     * 弧度转角度
     * @param radius
     * @returns {number}
     */
    MathUtils.radiusToAngle = function (radius) {
        return radius * 180 / Math.PI;
    };
    /**
     * 角度转弧度
     * @param angle
     * @returns {number}
     */
    MathUtils.angleToRadius = function (angle) {
        return angle * Math.PI / 180;
    };
    /**
     * 数组向右旋转
     * @param arr
     * @returns {Array}
     */
    MathUtils.turnRight = function (arr) {
        var temp = [];
        for (var t = 0, tl = arr.length; t < tl; t++) {
            temp.push([]);
        }
        for (var i = 0, il = arr.length; i < il; i++) {
            for (var j = 0, jl = arr[i].length; j < jl; j++) {
                temp[i][j] = arr[jl - j - 1][i];
            }
        }
        return temp;
    };
    /**
     * 数组向左旋转
     * @param arr
     * @returns {Array}
     */
    MathUtils.turnLeft = function (arr) {
        var temp = [];
        for (var t = 0, tl = arr.length; t < tl; t++) {
            temp.push([]);
        }
        for (var i = 0, il = arr.length; i < il; i++) {
            for (var j = 0, jl = arr[i].length; j < jl; j++) {
                temp[i][j] = arr[j][jl - i - 1];
            }
        }
        return temp;
    };
    /**
     * 根据两点计算量化方向,用于手势识别
     * @param x0
     * @param y0
     * @param x1
     * @param y1
     * @returns {number}
     */
    MathUtils.calDir = function (x0, y0, x1, y1) {
        if (x0 == x1 && y0 == y1) {
            return -1;
        }
        var r = Math.atan2(y1 - y0, x1 - x0);
        var d;
        if (Math.abs(r) < Math.PI / 4) {
            d = 0;
        }
        else if (Math.abs(r) > Math.PI / 4 * 3) {
            d = 2;
        }
        else if (r > 0) {
            d = 1;
        }
        else {
            d = 3;
        }
        return d;
    };
    /**
     * 数值正负计算
     * @param num
     * @returns {number}
     */
    MathUtils.sign = function (num) {
        return num == 0 ? 0 : (num > 0 ? 1 : -1);
    };
    return MathUtils;
}());
//# sourceMappingURL=MathUtils.js.map