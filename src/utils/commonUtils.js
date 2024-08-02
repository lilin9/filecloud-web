import axios from "axios";
import { saveAs } from 'file-saver'
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
    startDownload(fileUrl) {
        const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

        if (typeof fileUrl !== 'string' || fileUrl.length <= 0) return
        let f = document.createElement('a')
        f.id = 'download-' + new Date().getTime()
        f.href = fileUrl
        f.download = fileName || '下载'
        f.style.opacity = '0'
        f.style.height = '1px'
        f.style.width = '1px'
        f.style.overflow = 'hidden'
        f.style.position = 'fixed'
        f.style.top = '-1'
        f.style.left = '-1'
        f.style.zIndex = '-1'
        f.style.display = 'none'
        f.target = '_blank'
        document.body.appendChild(f)
        document.querySelector('#' + f.id).click()
        document.body.removeChild(document.getElementById(f.id))


        // fileUrl = FileDownloadApi + fileUrl;
        // fetch(fileUrl).then(res => res.blob())
        // .then(blob => {
        //     let url = window.URL.createObjectURL(blob)
        //     let a = document.createElement('a')
        //     a.style.display = 'none'
        //     a.href = url
        //     a.download = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        //     document.body.appendChild(a)
        //     a.click()
        //     window.URL.revokeObjectURL(url)
        //     document.body.removeChild(a)
        // })

        // if (fileUrl == null || fileUrl == '' || fileUrl == undefined) {
        //     return;
        // }

        // const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        // const apiUrl = FileDownloadApi + fileUrl;
        // axios.post(apiUrl).then(res => {
        //     saveAs(res.data, fileName);
        // }).catch(err => {
        //     ElMessage.error('文件下载失败，请重试');
        // });

        // const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        // const x = new XMLHttpRequest();
        // x.open('GET', fileUrl, true);
        // x.responseType = 'blob';
        // x.setRequestHeader = {'access-control-allow-origin': '*'};
        // x.onload = e => {
        //     const url = window.URL.createObjectURL(x.response);
        //     const a = document.createElement('a');
        //     a.href = url;
        //     a.download = fileName;
        //     a.click();
        // }
        // x.send();

        // try {
        //     const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        //     const a = document.createElement('a');
        //     a.href = fileUrl + '&response-content-disposition=' + encodeURIComponent('attachment;filename="' + fileName + '"');
        //     a.download = fileName;
        //     document.body.appendChild(a);
        //     a.click();
        //     document.body.removeChild(a);
        // } catch (error) {
        //     ElMessage.error('文件下载失败，请重试');
        // }
    }
}