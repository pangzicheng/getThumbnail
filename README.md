# getThumbnail


## 功能
- 获取img标签或者图片链接的blob
- getThumbnail方法可传入 width & height 来获取图片的缩略图blob或者base64

## 安装

```bash
npm i getthumbnail
```

## 用法

```javascript
import { getThumbnail, urlToBlob } from "getthumbnail";


const getBolb = async () => {
  const _dom = document.querySelector(".imgClass");
  const _blob = await getThumbnail({ target: _dom, rate: 0.8 });
  const _blob2 = await urlToBlob({url:"https://xxx.xxx.xxx.jpg", type: "base64", rate: 0.8});
};

```

## 参数
```javascript
getThumbnail:
  targetDom: HTMLImageElement; // img dom对象
  width?: number; // 传入作为返回缩略图的宽
  height?: number; // 传入作为返回缩略图的高
  type?: string; // blob || base64; 默认不传返回blob
  rate?: number; // 缩放比率；默认0.5
 


urlToBlob  
  url: string; // 图片链接url
  width?: number; // 传入作为返回缩略图的宽
  height?: number; // 传入作为返回缩略图的高
  type?: string;  // blob || base64; 默认不传返回blob
  rate?: number; // 缩放比率；默认0.5
```
## 注意
- 传入width和height和rate时, width和height优先级高于rate,此时rate无效
- rate缩放比率默认为0.5，传入{1}则仅将原图转换为blob或者base64
- urlToBlob()方法需要文件服务器支持跨域拿到图片