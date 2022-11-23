import {useEffect, useRef} from 'react';
const remote = window.require('@electron/remote');
function useContextMeun(contextMenuTmp, areaClass) {
  /* 定制右键菜单 */
  const currentEle = useRef(null);
  useEffect(() => {
    const areaEle = document.querySelector(areaClass);
    const menu = remote.Menu.buildFromTemplate(contextMenuTmp);
    const contextMenuHandle = ev => {
      if (areaEle.contains(ev.target)) {
        currentEle.current = ev.target; // 右键操作的元素
        menu.popup({window: remote.getCurrentWindow()});
      }
    };
    window.addEventListener('contextmenu', contextMenuHandle);
    return () => {
      window.removeEventListener('contextmenu', contextMenuHandle);
    };
  });
  return currentEle;
}

export default useContextMeun;
