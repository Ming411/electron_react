import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import {v4} from 'uuid';
import {faPlus, faFileImport} from '@fortawesome/free-solid-svg-icons';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import SearchFile from './components/SearchFile';
import initFiles from './utils/initFiles';
import FileList from './components/FileList';
import ButtonItem from './components/ButtonItem';
import TabList from './components/TabList';
import {mapArr, objToArr, readFile, writeFile, renameFile, deleteFile} from './utils/helper';
import useIpcRenderer from './hooks/useIpcRenderer';

const path = window.require('path');
const {ipcRenderer} = window.require('electron');
const remote = window.require('@electron/remote');
const Store = window.require('electron-store');
const fileStore = new Store({name: 'fileInfo'});
// 持久化存储
const saveInfoToStore = files => {
  const storeObj = objToArr(files).reduce((ret, file) => {
    const {id, title, createTime, path} = file;
    ret[id] = {
      id,
      path,
      title,
      createTime
    };
    return ret;
  }, {});
  fileStore.set('files', storeObj);
};

// 自定义左侧容器
const LeftDiv = styled.div.attrs({
  className: 'col-3 left-panel'
  // 这里编写属性
})`
  position: relative;
  color: #fff;
  /* 这里编写具体样式 */
  background-color: #102a43;
  min-height: 100vh;
  .btn_list {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    p {
      border: 0;
      border-radius: 0;
      width: 50%;
      color: #fff;
      margin-bottom: 0;
      &:nth-of-type(1) {
        background-color: skyblue;
      }
      &:nth-of-type(2) {
        background-color: orangered;
      }
    }
  }
`;
const RightDiv = styled.div.attrs({
  className: 'col-9 right-panel'
})`
  background-color: #ccc;
  .init-page {
    font: normal 28px/300px '微软雅黑';
    color: #888;
    text-align: center;
  }
`;
const App = () => {
  const [files, setFiles] = useState(fileStore.get('files') || {}); // 所有文件信息
  const [activeId, setActiveId] = useState(''); // 正在编辑的
  const [openIds, setOpenIds] = useState([]); // 当前已打开的
  const [unSaveIds, setUnSaveIds] = useState([]); // 未保存的
  // 区分左侧搜索列表与默认列表
  const [searchFiles, setSearchFiles] = useState([]);
  // 磁盘  文档对应目录
  const savedPath = remote.app.getPath('documents') + '/testMK';
  // 会自动找到项目磁盘路径创建json文件保存相关数据数据
  // console.log(remote.app.getPath('userData'));
  /* 计算已打开的文件信息 */
  const openFiles = openIds.map(openId => {
    // return files.find(file => file.id === openId);
    return files[openId]; // arrToObj之后的操作
  });
  /* 计算正在编辑的文件信息 */
  // const activeFile = files.find(file => file.id === activeId);
  const activeFile = files[activeId];
  /* 计算当前左侧列表需要显示什么样的信息 */
  // const fileList = searchFiles.length > 0 ? searchFiles : files;
  const fileList = searchFiles.length > 0 ? searchFiles : objToArr(files);
  /* 左侧点击编辑事件 */
  const openItem = id => {
    setActiveId(id);
    // 点击某个文件时 读取内容
    const currentFile = files[id];
    if (!currentFile.isLoaded) {
      readFile(currentFile.path).then(data => {
        // 设置缓存
        const newFile = {...currentFile, body: data, isLoaded: true};
        setFiles({...files, [id]: newFile});
      });
    }

    if (!openIds.includes(id)) {
      setOpenIds([...openIds, id]);
    }
  };
  /* 切换tab */
  const changeActive = id => {
    setActiveId(id);
  };
  /* tab关闭按钮 */
  const closeFile = id => {
    const retOpen = openIds.filter(openId => openId !== id);
    setOpenIds(retOpen);
    // 当前已打开文件被关闭，把高亮转移给第一个
    if (retOpen.length > 0 && activeId === id) {
      setActiveId(retOpen[0]);
    } else if (retOpen.length > 0 && activeId !== id) {
      // 非高亮tab关闭，高亮不变
      setActiveId(activeId);
    } else {
      setActiveId('');
    }
  };
  /* 编辑markdown */
  const changeFile = (id, newValue) => {
    // 将其添加到未保存文件
    if (newValue !== files[id].body) {
      if (!unSaveIds.includes(id)) {
        setUnSaveIds([...unSaveIds, id]);
      }
      // 更新后生成新的files
      /*     const newFiles = files.map(file => {
      if (file.id === id) {
        file.body = newValue;
      }
      return file;
    });
    setFiles(newFiles); */
      const newFile = {...files[id], body: newValue};
      setFiles({...files, [id]: newFile});
    }
  };
  /* 左侧删除文件项 */
  const deleteItem = id => {
    /*   const newFiles = files.filter(file => file.id !== id);
    setFiles(newFiles); */
    const file = files[id];
    if (!file.isNew) {
      deleteFile(file.path).then(() => {
        delete files[id];
        setFiles(files);
        // 若该文件已打开将其关闭
        saveInfoToStore(files);
        closeFile(id);
      });
    } else {
      delete files[id];
      setFiles(files);
      closeFile(id);
    }
  };
  /* 根据关键词搜索文件 */
  const searchFile = keyword => {
    // const newFiles = files.filter(file => file.title.includes(keyword));
    const newFiles = objToArr(files).filter(file => file.title.includes(keyword));
    setSearchFiles(newFiles);
  };
  /* 重命名 */
  const saveData = (id, newTitle, isNew) => {
    // 避免重复昵称
    const item = objToArr(files).find(file => file.title === newTitle);
    if (item) {
      newTitle += '_copy';
    }
    const newPath = isNew
      ? path.join(savedPath, `${newTitle}.md`)
      : path.join(path.dirname(files[id].path), `${newTitle}.md`);
    /*    const newFiles = files.map(file => {
      if (file.id === id) {
        file.title = newTitle;
        file.isNew = false;
      }
      return file;
    });
    setFiles(newFiles); */
    const newFile = {...files[id], title: newTitle, isNew: false, path: newPath};
    const newFiles = {...files, [id]: newFile};
    if (isNew) {
      // 创建, 操作磁盘
      writeFile(newPath, files[id].body).then(() => {
        setFiles({...files, [id]: newFile});
        saveInfoToStore(newFiles);
      });
    } else {
      // 更新,重命名
      const oldPath = files[id].path;
      renameFile(oldPath, newPath).then(() => {
        setFiles({...files, [id]: newFile});
        saveInfoToStore(newFiles);
      });
    }
    // setFiles({...files, [id]: newFile});
  };
  // 新建操作
  const createFile = () => {
    const newId = v4();
    const newFile = {
      id: newId,
      isNew: true,
      title: '',
      body: 'xxxx',
      createTime: Date.now()
    };
    // 禁止连续点击新建
    // let flag = files.find(file => file.isNew);
    const flag = objToArr(files).find(file => file.isNew);
    if (!flag) {
      // setFiles([...files, newFile]);
      setFiles({...files, [newId]: newFile});
    }
  };
  /* 保存当前正在编辑的文件 */
  const saveCurrentFile = () => {
    writeFile(activeFile.path, activeFile.body).then(() => {
      setUnSaveIds(unSaveIds.filter(id => id !== activeFile.id));
    });
  };
  /* 外部文件导入 */
  const importFile = () => {
    remote.dialog
      .showOpenDialog({
        defaultPath: __dirname,
        buttonLabel: '请选择',
        title: '选择md文件',
        properties: ['openFile', 'multiSelections'],
        filters: [
          {
            name: 'md文档',
            extensions: ['md']
          },
          {
            name: '其他类型',
            extensions: ['js', 'json', 'html']
          }
        ]
      })
      .then(ret => {
        const paths = ret.filePaths;
        // console.log(ret.filePaths);
        if (paths.length) {
          // 判断文件是否已经导入过
          const validPaths = paths.filter(filePath => {
            const existed = Object.values(files).find(file => {
              return file.path === filePath;
            });
            return !existed;
          });
          // 处理导入的文件
          const packageData = validPaths.map(filePath => {
            return {
              id: v4(),
              title: path.basename(filePath, '.md'),
              path: filePath
            };
          });
          const newFiles = {...files, ...mapArr(packageData)};
          setFiles(newFiles);

          // todo 持久化操作

          // ok 提示
          if (packageData.length) {
            remote.dialog.showMessageBox({
              type: 'info',
              title: '导入md文档',
              message: '文件导入成功'
            });
          }
        } else {
          console.log('未选择文件');
        }
      });
  };
  // 主进程与渲染进程之间通信
  useIpcRenderer({
    'execute-create-file': createFile,
    'execute-import-file': importFile,
    'execute-save-file': saveCurrentFile
  });

  return (
    <div className='App container-fluid'>
      <div className='row no-gutters'>
        <LeftDiv className='px-0'>
          <SearchFile title='我的文档' onSearch={searchFile}></SearchFile>
          <FileList
            files={fileList}
            editFile={openItem}
            deleteFile={deleteItem}
            saveFile={saveData}
          ></FileList>
          <div className='btn_list'>
            <ButtonItem title={'新建'} icon={faPlus} btnClick={createFile} />
            <ButtonItem title={'导入'} icon={faFileImport} btnClick={importFile} />
          </div>
        </LeftDiv>
        <RightDiv className='px-0'>
          {/* <button onClick={saveCurrentFile}>保存</button> */}
          {activeFile && (
            <>
              <TabList
                files={openFiles}
                activeItem={activeId}
                unSaveItems={unSaveIds}
                clickItem={changeActive}
                closeItem={closeFile}
              />
              {/* key 不同文件change独立 */}
              <SimpleMDE
                key={activeFile && activeFile.id}
                onChange={value => {
                  changeFile(activeFile.id, value);
                }}
                value={activeFile.body}
                options={{
                  autofocus: true,
                  spellChecker: false,
                  minHeight: '445px'
                }}
              />
            </>
          )}
          {!activeFile && <div className='init-page'>新建或导入具体文档</div>}
        </RightDiv>
      </div>
    </div>
  );
};

export default App;
