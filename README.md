## 微信小程序 城市/区县定位选择器   WeChat mini program city/county selector

### 主要功能
* **自动定位** 城市、区县（也支持手动重新定位）
* 手动 **汉字、拼音搜索** 城市，支持搜索数量335个，覆盖地级市
* 亦可通过 **侧边栏** 选择，城市按拼音首字母排列
* 选择好城市后，自动显示 **辖下区县**
### Features
* Automatic positioning, or you can pick a city manually by the sidebar, the counties under the jurisdiction of it will be displayed
* Search 335 cities across China, all prefecture-level cities included
* Support Chinese character search & pinyin search
* Support associative search

### 动图演示 / GIF Demonstration
**在真机预览的画面是非常流畅的**

**lagging because of the screen recorder, running smoothly on mobile**

![image](./citySelectorDemo.gif)

### 说明
* 使用（且小程序只能使用）腾讯地图的API
* 将utils目录中，`config.default.js`文件改名为`config.js`
* 并将其中的`key`改为自己的腾讯地图key（申请快速且免费）
* ES6
* 将模块集成到项目时，涉及到不同页面间数据通信的问题,见[小程序页面间通信](http://blog.csdn.net/beijiyang999/article/details/73109815)
* 关于搜索框的实现，见[小程序实现城市名称拼音搜索框 汉字/拼音](http://blog.csdn.net/beijiyang999/article/details/73135682)
* 关于搜索框的改进，见[这一篇](http://blog.csdn.net/beijiyang999/article/details/77985416)
* 可 **直接作为模块使用，如果对您有帮助，请star**

### 更新
* 实现了首页与城市选择页面之间的数据通信效果
* 针对真机调试发现的，输入汉字时，输入法行为与开发环境不一致的问题，做了修改优化。
* 针对定位模块在IOS中，侧面字母条的显示问题，进行了样式优化
* 优化了demo样式
* 升级了搜索功能，支持搜索335个城市(及相应级别地区)。截至目前，最新的[国家统计局2016年统计年鉴](http://www.stats.gov.cn/tjsj/ndsj/2016/indexch.htm)中,地级市291个，地级行政区划334个。

### mpvue 版本
[Leon originalix](https://github.com/originalix) 同学基于此项目写了 mpvue 版本（[项目地址](https://github.com/originalix/citySelector)）。

使用 mpvue 的同学们可以参考。
### mpvue version
Here is the [mpvue version](https://github.com/originalix/citySelector) based on this project by [Leon originalix](https://github.com/originalix).
