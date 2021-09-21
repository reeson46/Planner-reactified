import React from 'react'
import CategoryItem from './CategoryItem'
import AddPopover from '../popovers/AddPopover'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks } from '../../state/action-creators/taskActions';
import { createCategory, setActiveCategory } from '../../state/action-creators/categoryActions';
import { MyTooltip } from '../Tooltip';
import LoadingCircle from '../LoadingCircle';

const CategorySection = () => {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.category.items);
  const active_category = useSelector((state) => state.category.active);
  const isLoadingCategories = useSelector(state => state.category.isLoading);
  const user = useSelector(state => state.auth.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const open = Boolean(anchorEl);

  useEffect(() => {
    sumTasks();
  }, [categories])

  function sumTasks() {
    let sum = categories && categories.reduce((total, current) => total = total + current.total_tasks, 0);
    setTotalTasks(sum);
  }

  const onCategoryClick = async (id) => {
    if(active_category != id) {
      await dispatch(setActiveCategory(id));
      dispatch(getTasks());
    }
  }

  const single_category = categories && categories.map((category) => {
    return(
      <CategoryItem key={category.id} category={category} active_category={active_category} onCategoryClick={onCategoryClick} />
    )
  })

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddCategory = (e, value) => {
    if(e.keyCode === 13 && value != '') {
      setAnchorEl(null);
      dispatch(createCategory(value, 'SIDEBAR'));
    }
  }
  
  return (
    <div className="bg-dark mb-3" id="category-wrapper">
      <div className="container mt-2 mb-2">
        <div className="row">
          <span className="d-flex justify-content-between">
            <div className="fs-4 text-white">
              Categories
            </div>
            <MyTooltip
              title={user && user.is_guest && categories.length >= 3 ?
              "As a Guest user, you can have only 3 Categories. Sign Up for free to add more." : ""}
              placement="right"
            >
              <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="orange" id="sidebar-add-category"
                className={`bi bi-plus-square global-add-category-icon ${user && user.is_guest && categories.length >= 3 ? "add-category-guest" : "rename-add-icon category-add-icon"}`} viewBox="0 0 16 16">
                <path
                  d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path
                  d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </MyTooltip>
            <AddPopover 
              open={open}
              anchorEl={anchorEl}
              horizontal={30}
              onClose={handleClose}
              placeholder="Enter Category name"
              handlePressEnter={handleAddCategory}
            />
          </span>
        </div>
      </div>
      <div className="container" id="sidebar-categories">
        <li className={`row hovered-nav-item active-category ${active_category == -1 ? "item-selected" : ""}`}>
          <span onClick={() => onCategoryClick(-1)} className="category-link category-item fs-5 d-flex " id="sidebar-all-tasks" value="-1">
            <div className="all-tasks-text">All</div>

            {totalTasks > 0 ? (
              <div className="total-number">
                <div className="number">{totalTasks}</div>
              </div>
            ):''}

          </span>
        </li>
        <div id="categories-loop">
          {single_category}
        </div>
        
        {isLoadingCategories ?
          <div style={{
            position: "absolute",
            top: "34%",
            left: "35%"
            }}>
            <LoadingCircle size={70} thickness={3} />
          </div>
          :
          ""
        }

      </div>
    </div>
  )
}

export default CategorySection
