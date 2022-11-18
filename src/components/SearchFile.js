import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes, faSearch} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import useKeyHandler from '../hooks/useKeyHandler';
let SearchDiv = styled.div.attrs({
  className: 'd-flex align-items-center justify-content-between'
})`
  border-bottom: 1px solid #fff;
  span {
    color: #fff;
    padding: 0 10px;
    font: normal 16px/40px '微软雅黑';
  }
`;

const SearchFile = ({title, onSearch}) => {
  const [searchActive, setSearchActive] = useState(false);
  const [value, setValue] = useState('');
  const enterPressed = useKeyHandler(13);
  const escPressed = useKeyHandler(27);
  const oInput = useRef(null);
  const closeSearch = () => {
    setSearchActive(false);
    setValue('');
  };
  if (enterPressed && searchActive) {
    onSearch(value);
  }
  if (escPressed && searchActive) {
    closeSearch();
  }

  /* useEffect(() => {
    const searchHandle = e => {
      const {keyCode} = e;
      // 13 enter   27 esc
      if (keyCode === 13 && searchActive) {
        onSearch(value);
      }
      if (keyCode === 27 && searchActive) {
        closeSearch();
      }
    };
    document.addEventListener('keyup', searchHandle);
    return () => {
      document.removeEventListener('keyup', searchHandle);
    };
  }); */
  useEffect(() => {
    if (searchActive) {
      oInput.current.focus();
    }
  }, [searchActive]);

  return (
    <>
      {!searchActive && (
        <>
          <SearchDiv>
            <span>{title}</span>
            <span
              onClick={() => {
                setSearchActive(true);
              }}
            >
              <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            </span>
          </SearchDiv>
        </>
      )}
      {searchActive && (
        <>
          <SearchDiv>
            <input ref={oInput} value={value} onChange={e => setValue(e.target.value)} />
            <span onClick={closeSearch}>
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            </span>
          </SearchDiv>
        </>
      )}
    </>
  );
};
SearchFile.propTypes = {
  title: PropTypes.string,
  onSearch: PropTypes.func.isRequired
};
// 设置默认值
SearchFile.defaultProps = {
  title: 'coder'
};

export default SearchFile;
