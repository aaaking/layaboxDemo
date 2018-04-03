/**
 * @author seacole
 * 事件抛出器
 */
var Dispatcher = /** @class */ (function () {
    function Dispatcher() {
    }
    Dispatcher.init = function () {
        Dispatcher.eventDispatcher = new Laya.EventDispatcher();
    };
    Dispatcher.dispatch = function (eventName, params) {
        if (params === void 0) { params = null; }
        Dispatcher.eventDispatcher.event(eventName, params);
    };
    Dispatcher.on = function (eventName, thisObj, callback) {
        Dispatcher.eventDispatcher.on(eventName, thisObj, callback);
    };
    Dispatcher.off = function (eventName, thisObj, callback) {
        Dispatcher.eventDispatcher.off(eventName, thisObj, callback);
    };
    return Dispatcher;
}());
//# sourceMappingURL=Dispatcher.js.map