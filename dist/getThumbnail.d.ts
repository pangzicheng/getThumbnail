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
declare const getThumbnail: (thumbnailObj: thumbnailI) => Promise<Blob | string>;
/**
 * @description: url 转 blob
 * @param {string} urlThumbnailObj urlThumbnailObjI
 * @return {*}
 */
declare const urlToBlob: (urlThumbnailObj: urlThumbnailObjI) => Promise<Blob | string>;
/**
 * @description: 获取视频第一帧图片
 * @param {videoThumbnailObjI} videoThumbnailObj
 * @return {*}
 */
declare const getVideoSnap: (videoThumbnailObj: videoThumbnailObjI) => Promise<Blob | string>;
export { getThumbnail, urlToBlob, getVideoSnap };
