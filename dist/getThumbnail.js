"use strict";
/*
 * @Description:
 * @Author: Cheng
 * @Date: 2022-09-20 13:45:17
 * @LastEditTime: 2022-09-21 18:49:27
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideoSnap = exports.urlToBlob = exports.getThumbnail = void 0;
/**
 * @description: 获取图片dom对象blob 或 base缩略图
 * @param {thumbnailI} thumbnailObj
 * @return {*}
 */
const getThumbnail = (thumbnailObj) => __awaiter(void 0, void 0, void 0, function* () {
    const { target, width, height, type, rate } = thumbnailObj;
    const _thumbnailData = yield getBlobObj(target, width, height, type, rate);
    return _thumbnailData;
});
exports.getThumbnail = getThumbnail;
/**
 * @description: url 转 blob
 * @param {string} urlThumbnailObj urlThumbnailObjI
 * @return {*}
 */
const urlToBlob = (urlThumbnailObj) => {
    const { url, type, rate, width, height } = urlThumbnailObj;
    return new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas');
        const image = new Image;
        image.crossOrigin = 'Anonymous'; //解决Canvas.toDataURL 图片跨域问题
        image.onload = () => {
            try {
                const _data = imgOnloadTransform(image, canvas, rate, width, height, type);
                resolve(_data);
            }
            catch (error) {
                reject(error);
            }
        };
        image.src = url;
    });
};
exports.urlToBlob = urlToBlob;
/**
 * @description: 获取视频第一帧图片
 * @param {videoThumbnailObjI} videoThumbnailObj
 * @return {*}
 */
const getVideoSnap = (videoThumbnailObj) => {
    const { target, type, width, height } = videoThumbnailObj;
    let canvas = document.createElement('canvas');
    return new Promise((resolve, reject) => {
        try {
            const _data = imgOnloadTransform(target, canvas, 0, width, height, type);
            resolve(_data);
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.getVideoSnap = getVideoSnap;
/**
 * @description: 通过base64获取blob对象
 * @param {HTMLImageElement} target
 * @param {number} width
 * @param {number} height
 * @param {string} type
 * @param {number} rate
 * @return {*}
 */
const getBlobObj = (target, width, height, type, rate) => {
    return new Promise((resolve, reject) => {
        var image = target.cloneNode();
        image.setAttribute("crossOrigin", "anonymous");
        var canvas = document.createElement("canvas");
        image.onload = () => {
            try {
                const _data = imgOnloadTransform(image, canvas, rate, width, height, type);
                resolve(_data);
            }
            catch (error) {
                reject(error);
            }
        };
    });
};
/**
 * @description: base64 转 blob
 * @param {string} base64
 * @param {string} type image/png
 * @return {*}
 */
const base64toBlob = (base64) => {
    let _src = base64; // 拼接最终的base64
    let arr = _src.split(",");
    let array = arr[0].match(/:(.*?);/);
    let mime = (array && array.length > 1 ? array[1] : "image/png") || "image/png";
    let bytes = window.atob(arr[1]);
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
        type: mime,
    });
};
/**
 * @description:
 * @param {HTMLImageElement | HTMLVideoElement} target
 * @param {number} rate
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 * @param {string} type
 * @return {*}
 */
const imgOnloadTransform = (target, canvas, rate, width, height, type) => {
    return new Promise((resolve, reject) => {
        const _rate = rate || 0.5;
        canvas.width = _rate ? target.width * _rate || 180 : width || 180;
        canvas.height = _rate ? target.height * _rate || 180 : height || 180;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
        let dataURL = canvas.toDataURL("image/png");
        if (type === 'blob' || !type) {
            const _blob = base64toBlob(dataURL);
            resolve(_blob);
        }
        else if (type === 'base64') {
            resolve(dataURL);
        }
    });
};
