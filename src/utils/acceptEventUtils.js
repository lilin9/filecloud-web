import eventBus from "./eventBus";
// 接收事件
export default {
    //绑定 enableTopOptions 事件
    onEnableTopOptions(callback) {
        eventBus.on('enableTopOptions', callback);
    },
    //销毁 enableTopOptions 事件
    offEnableTopOptions(callback) {
        eventBus.off('enableTopOptions', callback);
    },


    onParentRowData(callback) {
        eventBus.on('parentRowData', callback);
    },
    offParentRowData(callback) {
        eventBus.off('parentRowData', callback);
    },

    
    onLoadFileList(callback) {
        eventBus.on('loadFileList', callback);
    },
    offLoadFileList(callback) {
        eventBus.off('loadFileList', callback);
    },

    onSelectedTableRow(callback) {
        eventBus.on('selectedTableRow', callback);
    },
    offSelectedTableRow(callback) {
        eventBus.off('selectedTableRow', callback);
    },
}