import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFileAlt, faFileEdit, faTrashAlt, faTimes} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import useKeyHandler from '../hooks/useKeyHandler';

const GroupUl = styled.ul.attrs({
  className: 'list-group list-group-flush'
})`
  li {
    color: #fff;
    background: none;
  }
`;

const FileList = ({files, editFile, saveFile, deleteFile}) => {
  const [editItem, setEditItem] = useState(false);
  const [value, setValue] = useState('');
  const enterPressed = useKeyHandler(13);
  const escPressed = useKeyHandler(27);
  const closeFn = () => {
    setEditItem(false);
    setValue('');
    // 新建时按esc 退出并关闭
    /*    const currentFile = files.find(file => file.id === editItem);
    if (currentFile && currentFile.isNew) {
      deleteFile(currentFile.id);
    } */
  };

  // 新建未完成又去编辑了其他文件,需要删除未新建完成的文件
  useEffect(() => {
    const newFile = files.find(file => file.isNew);
    if (newFile && editItem !== newFile.id) {
      deleteFile(newFile.id);
    }
  }, [editItem]);

  useEffect(() => {
    const newFile = files.find(file => file.isNew);
    if (newFile) {
      setEditItem(newFile.id);
      setValue(newFile.title);
    }
  }, [files]);

  useEffect(() => {
    // 回车 and 退出, 并且不能为空
    if (enterPressed && editItem && value.trim() !== '') {
      const file = files.find(file => file.id === editItem);
      saveFile(editItem, value, file.isNew);
      closeFn();
    }
    if (escPressed && editItem) {
      closeFn();
    }
  });
  /* useEffect(() => {
    const keyboardHandle = ev => {
      let {keyCode} = ev;
      if (keyCode === 13 && editItem) {
        saveFile(editItem, value);
        closeFn();
      }
      if (keyCode === 27 && editItem) {
        closeFn();
      }
    };
    document.addEventListener('keyup', keyboardHandle);
    return () => {
      document.removeEventListener('keyup', keyboardHandle);
    };
  }); */

  return (
    <GroupUl>
      {files.map(file => {
        return (
          <li className='list-group-item d-flex align-items-center' key={file.id}>
            {file.id !== editItem && !file.isNew && (
              <>
                <span style={{marginRight: '10px'}}>
                  <FontAwesomeIcon icon={faFileAlt}></FontAwesomeIcon>
                </span>
                <span
                  className='col-8'
                  onClick={() => {
                    editFile(file.id);
                    closeFn(); // 编辑时打开其他文件，关闭编辑操作
                  }}
                >
                  {file.title}
                </span>
                <span
                  className='col-2'
                  onClick={() => {
                    setEditItem(file.id);
                  }}
                >
                  <FontAwesomeIcon icon={faFileEdit}></FontAwesomeIcon>
                </span>
                <span className='col-2' onClick={() => deleteFile(file.id)}>
                  <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                </span>
              </>
            )}
            {(file.id === editItem || file.isNew) && (
              // 编辑状态
              <>
                <input
                  className='col-10'
                  value={value}
                  onChange={e => {
                    setValue(e.target.value);
                  }}
                />
                <span className='col-2' onClick={closeFn}>
                  <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                </span>
              </>
            )}
          </li>
        );
      })}
    </GroupUl>
  );
};

FileList.propTypes = {
  files: PropTypes.array,
  editFile: PropTypes.func,
  saveFile: PropTypes.func,
  deleteFile: PropTypes.func
};

export default FileList;
