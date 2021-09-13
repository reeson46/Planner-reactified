import React from 'react';
import AddPopover from '../popovers/AddPopover';
import BoardItem from './BoardItem';
import { createBoard, setActiveBoard } from '../../state/action-creators/boardActions';
import { getCategories } from '../../state/action-creators/categoryActions';
import { getTasks } from '../../state/action-creators/taskActions';
import { useDispatch, useSelector } from 'react-redux';
import { MyTooltip } from '../Tooltip';


const BoardSection = () => {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.board.items);
  const active_board = useSelector((state) => state.board.active);
  const user = useSelector(state => state.auth.user);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const onBoardClick = async (id) => {
    if(active_board != id) {
      await dispatch(setActiveBoard(id));
      dispatch(getCategories());
      dispatch(getTasks());
    }
  }

  const single_board = boards && boards.map((board) => {
    return (
      <BoardItem key={board.id} board={board} boards={boards} active_board={active_board} onBoardClick={onBoardClick} />
    )
  })

  const handleClick = (event) => {
    !user.is_guest && setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdd = (e, value) => {
    if(e.keyCode === 13 && value != '') {
      setAnchorEl(null);
      dispatch(createBoard(value));
    }
  }

  return (
    <div className="bg-dark mb-3" id="board-wrapper">
      <div className="container mb-2 mt-2">
        <div className="row">
          <span className="d-flex justify-content-between">
            <div className="fs-4 text-white">
              Boards
            </div>
            <MyTooltip
              title={user && user.is_guest ? "As a Guest user, you can have only 1 Board. Sign Up for free to add more." : ""}
              placement="right"
            >
              <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="orange" 
              className={`bi bi-plus-square ${user && !user.is_guest ? "rename-add-icon sidebar-add-icon" : "sidebar-add-board-guest"}`} viewBox="0 0 16 16">
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
              placeholder="Enter Board name"
              handlePressEnter={handleAdd}
            />
          </span>
        </div>
      </div>
      <div className="container" id="sidebar-boards">
        {single_board}
      </div>
    </div>
  )
}

export default BoardSection
