/*
 * @Description: 
 * @Author: Cheng
 * @Date: 2022-09-20 13:45:17
 * @LastEditTime: 2022-09-21 18:49:27
 */

interface thumbnailI {
  target: HTMLImageElement;
  width?: number;
  height?: number;
  type?: string;
  rate?: number;
}


interface urlThumbnailObjI {
  url: string;
  type?: string;
  rate?: number;
  width?: number;
  height?: number;
}

interface videoThumbnailObjI {
  target: HTMLVideoElement;
  type?: string;
  width?: number;
  height?: number;
}

/**
 * @description: 获取图片dom对象blob 或 base缩略图 
 * @param {thumbnailI} thumbnailObj
 * @return {*}
 */
const getThumbnail = async (thumbnailObj: thumbnailI): Promise<Blob | string> => {
  const { target, width, height, type, rate } = thumbnailObj;
  const _thumbnailData = await getBlobObj(target, width, height, type, rate);
  return _thumbnailData
}

/**
 * @description: url 转 blob
 * @param {string} urlThumbnailObj urlThumbnailObjI
 * @return {*}
 */
const urlToBlob = (urlThumbnailObj: urlThumbnailObjI): Promise<Blob | string> => {
  const { url, type, rate, width, height } = urlThumbnailObj
  return new Promise((resolve, reject) => {
    let canvas: HTMLCanvasElement = document.createElement('canvas');
    const image = new Image;
    image.crossOrigin = 'Anonymous';	//解决Canvas.toDataURL 图片跨域问题
    image.onload = () => {
      try {
        const _data = imgOnloadTransform(image, canvas, rate, width, height, type);
        resolve(_data);
      } catch (error) {
        reject(error)
      }
    }
    image.src = url
  })
}

/**
 * @description: 获取视频第一帧图片
 * @param {videoThumbnailObjI} videoThumbnailObj
 * @return {*}
 */
const getVideoSnap = (videoThumbnailObj: videoThumbnailObjI): Promise<Blob | string> => {
  const { target, type, width, height } = videoThumbnailObj;
  let canvas: HTMLCanvasElement = document.createElement('canvas');
  return new Promise((resolve, reject) => {
    try {
      const _data = imgOnloadTransform(target, canvas, 0, width, height, type);
      resolve(_data);
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * @description: 通过base64获取blob对象
 * @param {HTMLImageElement} target
 * @param {number} width
 * @param {number} height
 * @param {string} type
 * @param {number} rate
 * @return {*}
 */
const getBlobObj = (target: HTMLImageElement, width?: number, height?: number, type?: string, rate?: number): Promise<Blob | string> => {
  return new Promise((resolve, reject) => {
    var image: any = target.cloneNode();
    image.setAttribute("crossOrigin", "anonymous");
    var canvas: HTMLCanvasElement = document.createElement("canvas");
    image.onload = () => {
      try {
        const _data = imgOnloadTransform(image, canvas, rate, width, height, type);
        resolve(_data);
      } catch (error) {
        reject(error)
      }
    }
  });
}

/**
 * @description: base64 转 blob
 * @param {string} base64
 * @param {string} type image/png
 * @return {*}
 */
const base64toBlob = (base64: string): Blob => {
  let _src = base64; // 拼接最终的base64
  let arr = _src.split(",");
  let array: any = arr[0].match(/:(.*?);/);
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
}

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
const imgOnloadTransform = (target: HTMLImageElement | HTMLVideoElement, canvas: HTMLCanvasElement, rate?: number, width?: number, height?: number, type?: string): Promise<Blob | string> => {
  return new Promise((resolve, reject) => {
    const _rate = rate || 0.5;
    canvas.width = _rate ? target.width * _rate || 180 : width || 180;
    canvas.height = _rate ? target.height * _rate || 180 : height || 180;
    const ctx: any = canvas.getContext("2d");
    ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
    let dataURL = canvas.toDataURL("image/png");
    if (type === 'blob' || !type) {
      const _blob = base64toBlob(dataURL);
      resolve(_blob)
    } else if (type === 'base64') {
      resolve(dataURL)
    }
  })
}


export {
  getThumbnail,
  urlToBlob,
  getVideoSnap
}