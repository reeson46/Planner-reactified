import React from 'react'
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import RenamePopover from '../popovers/RenamePopover'
import DeletePopover from '../popovers/DeletePopover';
import { setActiveCategory, deleteCategory, renameCategory } from '../../state/action-creators/categoryActions';
import { getTasks } from '../../state/action-creators/taskActions';

const CategoryItem = (props) => {
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
      if(props.category.name != value) {
        dispatch(renameCategory(value, id));
      }
    }
  }

  const handleDelete = async (e, value, id) => {
    if(e.keyCode === 13 && value == 'DELETE') {
      setDeleteAnchor(null);
      await dispatch(deleteCategory(id));
      await dispatch(setActiveCategory(-1));
      await dispatch(getTasks());
    }
  }

  return(
    <li className={`row hovered-nav-item ${props.active_category == props.category.id ? "item-selected" : ""}`}>
      <span className="d-flex justify-content-between active-category" >
        <div onClick={() => props.onCategoryClick(props.category.id)} ref={popoverAnchorRef} className="category-item">
          <span  className="category-link fs-5 text-white total-tasks-number d-flex" key={props.category.id}>
            <div className="category-name" value={props.category.id}>
              {props.category.name}
            </div>

            {props.category.total_tasks > 0 ?
            (
              <div className="total-number">
                <div className="number">{props.category.total_tasks}</div>
              </div>

            ): ''}

          </span>
        </div>
        <div className="dropdown d-flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-three-dots-vertical dot-icon"
            type="button" id={`dropdownMenuButton${props.category.id}`} data-bs-toggle="dropdown" aria-expanded="false"
            viewBox="0 0 16 16">
            <path
              d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>

          <ul className="dropdown-menu dropdown-menu-sidebar dropdown-menu-dark"
            aria-labelledby={`dropdownMenuButton${props.category.id}`}>
            <li className="d-flex">
              <svg onClick={handleRenameClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                className="bi bi-pen-fill bs-icon rename-add-icon rename-add-icon-sidebar" viewBox="0 0 16 16">
                <path
                  d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" />
              </svg>
              <RenamePopover
                id={props.category.id}
                name={props.category.name}
                open={openRename}
                anchorEl={renameAnchor}
                horizontal={'right'}
                onClose={handleRenameClose}
                placeholder="Enter new name"
                handlePressEnter={handleRename}
              />
            </li>
            <li className="d-flex mt-1">
              <svg onClick={handleDeleteClick} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange"
                className="bi bi-x-lg delete-icon"
                viewBox="0 0 16 16">
                <path
                  d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
              </svg>
              <DeletePopover
                  id={props.category.id}
                  name={props.category.name}
                  open={openDelete}
                  anchorEl={deleteAnchor}
                  anchorX={'right'}
                  transformX={'left'}
                  onClose={handleDeleteClose}
                  placeholder="Type DELETE"
                  handlePressEnter={handleDelete} 
                  deleteMessage='Warning, this action will also delete every TASK associated with this category!'
                />
            </li>
          </ul>
        </div>
      </span>
    </li>
  )
}

export default CategoryItem
