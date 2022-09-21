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
declare const getThumbnail: (thumbnailObj: thumbnailI) => Promise<string | Blob | undefined>;
/**
 * @description: url 转 blob
 * @param {string} urlThumbnailObj urlThumbnailObjI
 * @return {*}
 */
declare const urlToBlob: (urlThumbnailObj: urlThumbnailObjI) => Promise<Blob | string>;
export { getThumbnail, urlToBlob };
