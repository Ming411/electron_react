import React from 'react';
import styled from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
// 自定义左侧容器
let LeftDiv = styled.div.attrs({
  className: 'col-3 left-panel'
  // 这里编写属性
})`
  /* 这里编写具体样式 */
  background-color: pink;
  min-height: 100vh;
`;
let RightDiv = styled.div.attrs({
  className: 'col-9 right-panel'
})`
  min-height: 100vh;
  background-color: #ccc;
`;
const App = () => {
  return (
    <div className='App container-fluid px-0'>
      <div className='row no-gutters'>
        <LeftDiv>left</LeftDiv>
        <RightDiv>right</RightDiv>
      </div>
    </div>
  );
};

export default App;
