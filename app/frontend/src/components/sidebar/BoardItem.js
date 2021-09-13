import React from 'react'
import RenamePopover from '../popovers/RenamePopover'
import DeletePopover from '../popovers/DeletePopover';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { deleteBoard, renameBoard } from '../../state/action-creators/boardActions';

const BoardItem = (props) => {
  const dispatch = useDispatch();
  
  const [renameAnchor, setRenameAnchor] = useState(null);
  const openRename = Boolean(renameAnchor);
  
  const [deleteAnchor, setDeleteAnchor] = useState(null);
  const openDelete = Boolean(deleteAnchor);
  
  const popoverAnchorRef = useRef(null);

  const handleRenameClick = () => {
    setRenameAnchor(popoverAnchorRef.current);
  };
  
  const handleRenameClose = () => {
    setRenameAnchor(null);
  };

  const handleDeleteClick = () => {
    setDeleteAnchor(popoverAnchorRef.current);
  };
  
  const handleDeleteClose = () => {
    setDeleteAnchor(null);
  };

  const handleRename = (e, value, id) => {
    if(e.keyCode === 13 && value != '') {
      setRenameAnchor(null);
      if(props.board.name != value){
        dispatch(renameBoard(value, id))
      }
    }
  }

  const handleDelete = (e, value, id) => {
    if(e.keyCode === 13 && value == 'DELETE') {
      setDeleteAnchor(null);
      dispatch(deleteBoard(id));
    }
  }

  return (
    <li key={props.board.id} className={`row hovered-nav-item board-item ${props.active_board == props.board.id ? "item-selected" : ""}`}>
      <span className="d-flex justify-content-between">
        <div onClick={() => props.onBoardClick(props.board.id)} ref={popoverAnchorRef} className="fs-5 text-white board-name">
          {props.board.name}
        </div>
        <div className="dropdown sidebar-dropdown d-flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-three-dots-vertical dot-icon"
            type="button" id={`dropdownMenuButton${props.board.id}`} data-bs-toggle="dropdown" aria-expanded="false"
            viewBox="0 0 16 16">
            <path
              d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>

          <ul className="dropdown-menu dropdown-menu-sidebar dropdown-menu-dark"
            aria-labelledby={`dropdownMenuButton${props.board.id}`}>
            <li className="d-flex">
              <svg onClick={handleRenameClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                className="bi bi-pen-fill rename-add-icon rename-add-icon-sidebar"
                viewBox="0 0 16 16">
                <path
                  d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
              </svg>
              <RenamePopover
                id={props.board.id}
                name={props.board.name}
                open={openRename}
                anchorEl={renameAnchor}
                horizontal={'right'}
                onClose={handleRenameClose}
                placeholder="Enter new name"
                handlePressEnter={handleRename}
              />
  
            </li>
            {props.boards.length > 1 ? (
              <li className="d-flex mt-1">
                <svg onClick={handleDeleteClick}  xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange"
                  className="bi bi-x-lg delete-icon" viewBox="0 0 16 16">
                  <path
                    d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
                </svg>
                <DeletePopover
                  id={props.board.id}
                  name={props.board.name}
                  open={openDelete}
                  anchorEl={deleteAnchor}
                  anchorX={'right'}
                  transformX={'left'}
                  onClose={handleDeleteClose}
                  placeholder={"Type DELETE"}
                  handlePressEnter={handleDelete} 
                  deleteMessage={'Warning, this action will also delete every CATEGORY and TASK associated with this board!'}
                />
              </li>
            ) : ''}
          </ul>
        </div>
      </span>
    </li>
  )
}

export default BoardItem
