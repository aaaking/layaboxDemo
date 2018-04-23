/*
* @author seacole
* log;
*/
function log(value:any):void
{
    // if (GameConfig.language && GameConfig.language.showLog=="true")
    if (value instanceof Object)
    {
        try {
             value=JSON.stringify(value);
        } catch (error) {
            console.error(error)
        }
    }       
    console.log(new Date().toLocaleTimeString() + "[GAME]" + value);
}