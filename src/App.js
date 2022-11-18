import React from 'react';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchFile from './components/SearchFile';
import initFiles from './utils/initFiles';
import FileList from './components/FileList';
// 自定义左侧容器
let LeftDiv = styled.div.attrs({
  className: 'col-3 left-panel'
  // 这里编写属性
})`
  /* 这里编写具体样式 */
  background-color: #102a43;
  min-height: 100vh;
`;
let RightDiv = styled.div.attrs({
  className: 'col-9 right-panel'
})`
  background-color: #ccc;
`;
const App = () => {
  return (
    <div className='App container-fluid px-0'>
      <div className='row no-gutters'>
        <LeftDiv>
          <SearchFile
            title='我的文档'
            onSearch={value => {
              console.log(value);
            }}
          ></SearchFile>
          <FileList
            files={initFiles}
            editFile={id => {
              console.log(id);
            }}
            deleteFile={id => {
              console.log('del', id);
            }}
            saveFile={(id, value) => {
              console.log(id, value);
            }}
          ></FileList>
        </LeftDiv>
        <RightDiv>right</RightDiv>
      </div>
    </div>
  );
};

export default App;
