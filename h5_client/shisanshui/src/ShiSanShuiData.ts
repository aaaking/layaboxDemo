class ShiSanShuiData extends BaseGameData{
    public static _scoreInfo
    public static _gunInfo
    public static _specialInfo
    public static init(): void {
        super.init()
        ShiSanShuiData._scoreInfo = []
        ShiSanShuiData._gunInfo = []
        ShiSanShuiData._specialInfo = []
    }

    public static clearData(){
        ShiSanShuiData._scoreInfo = []
        ShiSanShuiData._gunInfo = []
        ShiSanShuiData._specialInfo = []
    }
}