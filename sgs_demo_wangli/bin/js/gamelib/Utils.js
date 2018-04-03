/**
 * @author seacole
 * 工具类
 */
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /**
     * object转成查询字符串
     * @param obj
     * @returns {string}
     */
    Utils.obj2query = function (obj) {
        if (!obj) {
            return '';
        }
        var arr = [];
        for (var key in obj) {
            arr.push(key + '=' + obj[key]);
        }
        return arr.join('&');
    };
    Utils.injectProp = function (target, data, callback, ignoreMethod, ignoreNull, keyBefore) {
        if (data === void 0) { data = null; }
        if (callback === void 0) { callback = null; }
        if (ignoreMethod === void 0) { ignoreMethod = true; }
        if (ignoreNull === void 0) { ignoreNull = true; }
        if (keyBefore === void 0) { keyBefore = ""; }
        if (!data) {
            return false;
        }
        var result = true;
        for (var key in data) {
            var value = data[key];
            if ((!ignoreMethod || typeof value != 'function') && (!ignoreNull || value != null)) {
                if (callback) {
                    callback(target, key, value);
                }
                else {
                    target[key] = value;
                }
            }
        }
        return result;
    };
    Utils.getCharCodeLength = function (str) {
        var length = str.length;
        var arr = [];
        var charCode;
        var realLength = 0;
        var charCodelength;
        var newstr = [];
        for (var i = 0; i < length; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                charCodelength = 1;
            else
                charCodelength = 2;
            realLength = realLength + charCodelength;
        }
        return realLength;
    };
    Utils.deepCopy = function (p, c) {
        var c = c || {};
        for (var i in p) {
            if (!p.hasOwnProperty(i)) {
                continue;
            }
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                this.deepCopy(p[i], c[i]);
            }
            else {
                c[i] = p[i];
            }
        }
        return c;
    };
    Utils.removeHeadAndEndSpace = function (str) {
        while (str.length) {
            if (str.substr(0, 1) == " ")
                str = str.substring(1, str.length);
            else
                break;
        }
        while (str.length) {
            if (str.substr(str.length - 1, 1) == " ")
                str = str.substring(0, str.length - 1);
            else
                break;
        }
        return str;
    };
    return Utils;
}());
//# sourceMappingURL=Utils.js.map