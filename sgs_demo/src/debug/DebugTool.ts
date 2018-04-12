class DebugTool {
    static debugMode: boolean = true
    static log(message?: any, ...optionalParams: any[]) {
        if (DebugTool.debugMode) {
            console.log(message, optionalParams)
        }
    }
    private static _instance: DebugTool;
    public static get instance(): DebugTool {
        DebugTool.debugMode = !Utils.isRelease()
        if (!this._instance)
            this._instance = new DebugTool();
        return this._instance;
    }
    constructor() {
        if (!DebugTool.debugMode) {
            return
        }
        // <script type="text/javascript" src= "libs/laya.debugtool.js" > </script>
        var scriptDebug: any = Laya.Browser.createElement("script")
        scriptDebug.src = "libs/laya.debugtool.js"
        Laya.Browser.document.body.appendChild(scriptDebug)
        scriptDebug.onload = function () {
            Laya.Stat.show(500, 0)
            Laya.DebugPanel.init();
            Laya.DebugTool.init();
        }
        Laya.stage.on(Laya.Event.RESIZE, this, function () {
            console.log("browser width: " + Laya.Browser.width + " browser height" + Laya.Browser.height)
            console.log("stage width: " + Laya.stage.width + " stage height" + Laya.stage.height)
        });
    }
}