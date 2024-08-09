import eventBus from "./eventBus";

//发布事件
export default {
    emitEnableTopOptions(val) {
        eventBus.emit('enableTopOptions', val);
    },
    emitTableChanged(val) {
        eventBus.emit('parentRowData', val);
    },
    emitLoadFileList(val) {
        eventBus.emit('loadFileList', val);
    },
    emitSelectedTableRow(val) {
        eventBus.emit('selectedTableRow', val);
    }
}