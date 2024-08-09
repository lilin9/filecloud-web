import { ElMessage } from "element-plus";

const ImgMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml'
];
const FileDownloadApi = '/myFile/download/';

export default {
    //日期格式化
    formatDate(time) {
        if (time == null || time == '' || time == undefined) {
            return time;
        }
        const date = new Date(time);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },

    //传入文件的MIME类型，判断是否是图片
    judgeImg(mimeType) {
        if (mimeType == null || mimeType == '' || mimeType == undefined) {
            return false;
        }
        return ImgMimeTypes.includes(mimeType);
    },

    //调用浏览器进行文件下载
    async startDownload(fileUrl) {
        if (typeof fileUrl != 'string' || fileUrl.length <= 0) {
            return;
        }

        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch(err) {
            ElMessage.error('文件下载失败，请重试');
            console.log(err);
        }
    }
}