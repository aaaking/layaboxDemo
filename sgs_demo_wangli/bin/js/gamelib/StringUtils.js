/**
 * @author seacole
 * string辅助
 */
var StringUtils = /** @class */ (function () {
    function StringUtils() {
    }
    StringUtils.makeRandomString = function (len) {
        var s = "";
        var cl = this.chars.length;
        for (var i = 0; i < len; i++) {
            s += this.chars.charAt(MathUtils.makeRandomInt(cl));
        }
        return s;
    };
    StringUtils.makeRandomIntString = function (len) {
        var s = "";
        for (var i = 0; i < len; i++) {
            s += MathUtils.makeRandomInt(10);
        }
        return s;
    };
    StringUtils.stringCut = function (str, len, fill) {
        if (fill === void 0) { fill = '...'; }
        var result = str;
        if (str.length > len) {
            result = str.substr(0, len) + fill;
        }
        return result;
    };
    StringUtils.supplement = function (value, count) {
        var index = count - value.toString().length - 1;
        if (index < 0) {
            return value.toString();
        }
        return this.zeros[index] + value;
    };
    StringUtils.format = function (formatStr) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var result = formatStr;
        for (var i = 0, len = params.length; i < len; i++) {
            result = result.replace("{" + i + "}", params[i]);
        }
        return result;
    };
    /**
     * 将下划线变成驼峰
     */
    StringUtils.transformStrToHump = function (str) {
        var re = /_(\w)/g;
        return str.replace(re, function (all, letter) {
            return letter.toUpperCase();
        });
    };
    StringUtils.getColor = function (content, color) {
        return "<font color='#" + color.toString(16) + "'>" + content + "</font>";
    };
    StringUtils.getIconName = function (path) {
        if (!path) {
            return "";
        }
        var pos = path.lastIndexOf('/');
        var name = path.substring(pos + 1, path.length);
        name = "props/Mobile_" + name + ".png";
        return name;
    };
    StringUtils.getShopPicName = function (path) {
        var pos = path.lastIndexOf('/');
        var name = path.substring(pos + 1, path.length);
        name = "props/" + name + ".png";
        return name;
    };
    StringUtils.chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    StringUtils.zeros = [
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000"
    ];
    return StringUtils;
}());
//# sourceMappingURL=StringUtils.js.map