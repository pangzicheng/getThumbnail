/*
 * @Description: 
 * @Author: Cheng
 * @Date: 2022-09-20 13:45:17
 * @LastEditTime: 2022-09-21 17:21:09
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


const getThumbnail = async (thumbnailObj: thumbnailI) => {
  const { target, width, height, type, rate } = thumbnailObj;
  if (target) {
    const _blob = await getBlobObj(target, width, height, type, rate);
    return _blob
  }
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
    const ctx: any = canvas.getContext('2d');
    const img = new Image;
    img.crossOrigin = 'Anonymous';	//解决Canvas.toDataURL 图片跨域问题
    img.onload = () => {
      // 压缩比例 -- 可以自己修改参数。500px宽度以下原尺寸，大于500px比例处理
      // let bili = Math.round(width / 500) || 1;
      const _rate = rate || 0.5;
      canvas.width = width || img.width * _rate;
      canvas.height = height || img.height * _rate;
      // ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let dataURL = canvas.toDataURL("image/png"); //'image/jpeg'
      // 去除标头 -- 传递给后台时一般去除头部
      // let reg = new RegExp('^data:image/[^;]+;base64,');
      // dataURL = dataURL.replace(reg, '');
      // resolve(dataURL);
      if (type === 'blob' || !type) {
        const _blob = base64toBlob(dataURL);
        resolve(_blob);
      } else if (type === 'base64') {
        resolve(dataURL)
      }
    }
    img.src = url
  })
}


const getBlobObj = (target: HTMLImageElement, width?: number, height?: number, type?: string, rate?: number): Promise<Blob | string> => {
  return new Promise((resolve, reject) => {
    var image: any = target.cloneNode();
    image.setAttribute("crossOrigin", "anonymous");
    var canvas: HTMLCanvasElement = document.createElement("canvas");
    image.onload = () => {
      let _rate = rate || 0.5;
      canvas.width = width || target.width * _rate;
      canvas.height = height || target.height * _rate;
      var ctx: any = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      var dataURL = canvas.toDataURL("image/png");
      if (type === 'blob' || !type) {
        const _blob = base64toBlob(dataURL);
        resolve(_blob);
      } else if (type === 'base64') {
        resolve(dataURL)
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
  let mime = array[1]; //(array && array.length > 1 ? array[1] : type) || type;
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


export {
  getThumbnail,
  urlToBlob
}