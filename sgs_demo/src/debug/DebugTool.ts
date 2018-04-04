class DebugTool {
    static debugMode: boolean = true
    static log(message?: any, ...optionalParams: any[]) {
        if (DebugTool.debugMode) {
            console.log(message, optionalParams)
        }
    }
    private static _instance: DebugTool;
    public static get instance(): DebugTool {
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
            Laya.DebugPanel.init();
            Laya.DebugTool.init();
        }
    }
}