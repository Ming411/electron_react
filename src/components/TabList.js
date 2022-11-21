/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
const TabUl = styled.ul.attrs({
  className: 'nav nav-pills'
})`
  li a {
    border-radius: 0 !important;
    &.active {
      background-color: #3e403f !important;
    }
  }
  .nav-link.unSaveMark {
    &:hover {
      .icon-close {
        display: inline-block;
      }
      .rounded-circle {
        display: none;
      }
    }
    .rounded-circle {
      display: inline-block;
      width: 11px;
      height: 11px;
      margin-left: 5px;
      background-color: #b80233;
    }
    .icon-close {
      display: none;
    }
  }
`;

const TabList = ({files, activeItem, unSaveItems, clickItem, closeItem}) => {
  return (
    <TabUl>
      {files.map(file => {
        // 定义未保存状态状态
        let unSaveMark = unSaveItems.includes(file.id);
        // 高亮类名
        let finalClass = classnames({
          'nav-link': true,
          active: activeItem === file.id,
          unSaveMark: unSaveMark
        });
        return (
          <li className='nav-item' key={file.id}>
            <a
              href='#'
              className={finalClass}
              onClick={e => {
                e.preventDefault();
                clickItem(file.id);
              }}
            >
              {file.title}
              <span
                style={{marginLeft: '5px'}}
                className='icon-close'
                onClick={e => {
                  e.stopPropagation();
                  closeItem(file.id);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
              {unSaveMark && <span className='rounded-circle '></span>}
            </a>
          </li>
        );
      })}
    </TabUl>
  );
};
TabList.propTypes = {
  files: PropTypes.array,
  activeItem: PropTypes.string,
  unSaveItems: PropTypes.array,
  clickItem: PropTypes.func,
  closeItem: PropTypes.func
};
export default TabList;
