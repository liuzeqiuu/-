export function initializeBMap (ak) {
  return new Promise(function (resolve, reject) {
    if (window.BMap) {
      resolve(window.BMap)
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=globalInitializeBMap'
      script.onerror = reject
      document.body.appendChild(script)
      // 地图实例初始化后的回调
      window.globalInitializeBMap = function () {
        // 销毁全局hook
        window.initializeBMap = null
        resolve(window.BMap)
      }
    }
  })
}
