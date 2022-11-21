import React, {useState} from 'react';
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
// 自定义左侧容器
let LeftDiv = styled.div.attrs({
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
let RightDiv = styled.div.attrs({
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
  const [files, setFiles] = useState(initFiles); // 所有文件信息
  const [activeId, setActiveId] = useState(''); // 正在编辑的
  const [openIds, setOpenIds] = useState([]); // 当前已打开的
  const [unSaveIds, setUnSaveIds] = useState([]); // 未保存的

  // 区分左侧搜索列表与默认列表
  const [searchFiles, setSearchFiles] = useState([]);

  /* 计算已打开的文件信息 */
  const openFiles = openIds.map(openId => {
    return files.find(file => file.id === openId);
  });
  /* 计算正在编辑的文件信息 */
  const activeFile = files.find(file => file.id === activeId);
  /* 计算当前左侧列表需要显示什么样的信息 */
  const fileList = searchFiles.length > 0 ? searchFiles : files;
  /* 左侧点击编辑事件 */
  const openItem = id => {
    setActiveId(id);
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
    // 当高亮文件被关闭，把高亮转移给第一个
    if (retOpen.length > 0) {
      setActiveId(retOpen[0]);
    } else {
      setActiveId('');
    }
  };
  /* 编辑markdown */
  const changeFile = (id, newValue) => {
    // 将其添加到未保存文件
    if (!unSaveIds.includes(id)) {
      setUnSaveIds([...unSaveIds, id]);
    }
    // 更新后生成新的files
    const newFiles = files.map(file => {
      if (file.id === id) {
        file.body = newValue;
      }
      return file;
    });
    setFiles(newFiles);
  };
  /* 左侧删除文件项 */
  const deleteItem = id => {
    const newFiles = files.filter(file => file.id !== id);
    setFiles(newFiles);
    // 若该文件已打开将其关闭
    closeFile(id);
  };
  /* 根据关键词搜索文件 */
  const searchFile = keyword => {
    const newFiles = files.filter(file => file.title.includes(keyword));
    // console.log(newFiles);
    // setFiles(newFiles);
    setSearchFiles(newFiles);
  };
  /* 重命名 */
  const reName = (id, newTitle) => {
    const newFiles = files.map(file => {
      if (file.id === id) {
        file.title = newTitle;
        file.isNew = false;
      }
      return file;
    });
    setFiles(newFiles);
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
    setFiles([...files, newFile]);
  };
  return (
    <div className='App container-fluid'>
      <div className='row no-gutters'>
        <LeftDiv className='px-0'>
          <SearchFile title='我的文档' onSearch={searchFile}></SearchFile>
          <FileList
            files={fileList}
            editFile={openItem}
            deleteFile={deleteItem}
            saveFile={reName}
          ></FileList>
          <div className='btn_list'>
            <ButtonItem title={'新建'} icon={faPlus} btnClick={createFile} />
            <ButtonItem title={'导入'} icon={faFileImport} />
          </div>
        </LeftDiv>
        <RightDiv className='px-0'>
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
