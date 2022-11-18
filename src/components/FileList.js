import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFileAlt, faFileEdit, faTrashAlt, faTimes} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import useKeyHandler from '../hooks/useKeyHandler';

let GroupUl = styled.ul.attrs({
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
  };
  if (enterPressed && editItem) {
    saveFile(editItem, value);
    closeFn();
  }
  if (escPressed && editItem) {
    closeFn();
  }
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
            {file.id !== editItem && (
              <>
                <span style={{marginRight: '10px'}}>
                  <FontAwesomeIcon icon={faFileAlt}></FontAwesomeIcon>
                </span>
                <span
                  className='col-8'
                  onClick={() => {
                    editFile(file.id);
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
            {file.id === editItem && (
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