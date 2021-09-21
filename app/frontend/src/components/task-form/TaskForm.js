import React from 'react'
import SubtaskSection from './SubtaskSection';
import CategorySelection from './CategorySelection';
import StatusSelection from './StatusSelection';
import AddPopover from '../popovers/AddPopover';
import DeletePopover from '../popovers/DeletePopover'
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setTaskFormVisibility, isEdit } from '../../state/action-creators/taskFormActions';
import { createTask, updateTask, deleteTask, getTasks } from '../../state/action-creators/taskActions';
import { getCategories, createCategory } from '../../state/action-creators/categoryActions';
import { MyTooltip } from '../Tooltip';


const TaskForm = () => {
  const dispatch = useDispatch();
  const isEdit_ = useSelector((state) => state.taskForm.isEdit);
  const task = useSelector((state) => state.taskForm.taskToEdit);

  const category= useSelector((state) => state.category);
  const boardName = useSelector((state) => state.board.name);
  const isGuest = useSelector(state => state.auth.user.is_guest);

  const nameInputField = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(category.active);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);

  const [existingSubtasks, setExistingSubtasks] = useState([]);
  const [removedSubtaskIds, setRemovedSubtaskIds] = useState([]);

  const [createAndContinue, setCreateAndContinue] = useState(false);

  const [fieldsCheck, setFieldsCheck] = useState(false);
  const [categoryRequired, setCategoryRequired] = useState(false);
  const [nameRequired, setNameRequired] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [deleteAnchor, setDeleteAnchor] = useState(null);
  const openDelete = Boolean(deleteAnchor);

  useEffect(() => {
    requiredFieldsCheck();

  }, [name, selectedCategory])

  useEffect(() => {
    if(isEdit_) {
      task.status && setSelectedStatus(task.status);
      task.name && setName(task.name);
      task.description && setDescription(task.description);
      task.subtask && setExistingSubtasks(task.subtask);
    }

  }, [task])

  useEffect(() => {
    document.addEventListener('keydown', closeTaskFormOnEsc, false);

    nameInputField.current.focus();

    return () => {
      document.removeEventListener('keydown', closeTaskFormOnEsc, false);
    }
  }, [])

  const closeTaskFormOnEsc = useCallback((e) => {
    if(e.keyCode === 27) {
      dispatch(isEdit(false));
      dispatch(setTaskFormVisibility(false));
      resetFields();
    }
  })

  const handleAddPopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleAddPopoverClose = () => {
    setAnchorEl(null);
  }

  const handleCategorySelect = (value) => {
    setSelectedCategory(value);    
  }

  const handleStatusSelect = (value) => {
    setSelectedStatus(value);
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  const handleCreateAndContinue = (e) => {
    setCreateAndContinue(e.target.checked);
  }
  
  const handleAddCategory = (e, value) => {
    if(e.keyCode === 13 && value != '') {
      setAnchorEl(null);
      dispatch(createCategory(value, 'TASK_FORM'));
    }
  }

  const onAddOrUpdate = async () => {
    if(isEdit_) {

      const data = {
        'id': task.id,
        'category': selectedCategory,
        'status': selectedStatus,
        'name': name,
        'description': description,
        'subtasks': subtasks,
        'removedSubtasks' : removedSubtaskIds
      };
      
      await dispatch(updateTask(data));
      dispatch(isEdit(false));
      dispatch(setTaskFormVisibility(false));

      if(selectedCategory != task.category) {
        dispatch(getCategories());
      }
    }
    else {

      const data =  {
        'category': selectedCategory,
        'name': name,
        'description': description,
        'subtasks': subtasks
      };

      await dispatch(createTask(data));
      dispatch(getCategories());
      dispatch(getTasks());

      if(createAndContinue) {
        resetFields();
        nameInputField.current.focus();
      }
      else {
        dispatch(isEdit(false));
        dispatch(setTaskFormVisibility(false));
      }
    }
  }

  const onCancel = () => {
    dispatch(isEdit(false));
    dispatch(setTaskFormVisibility(false));
  }

  const requiredFieldsCheck = () => {
    if(selectedCategory != -2 && name != '') {
      setFieldsCheck(false)
    }else {
      setFieldsCheck(true)
    }

    if(selectedCategory != -2) {
      setCategoryRequired(false)
    }else {
      setCategoryRequired(true)
    }

    if(name != '') {
      setNameRequired(false)
    }else {
      setNameRequired(true)
    }
  }

  function resetFields() {
    setName('');
    setDescription('');
    setSubtaskInput('');
    setSubtasks([]);
  }

  const handleDeleteButtonClick = (e) => {
    setDeleteAnchor(e.currentTarget);
  }

  const handleDeleteClose = () => {
    setDeleteAnchor(null);
  }

  const handleDelete = async (e, value, id) => {
    if(e.keyCode === 13 && value === 'DELETE') {
      setDeleteAnchor(null);
      dispatch(isEdit(false));
      dispatch(setTaskFormVisibility(false));
      await dispatch(deleteTask(id));
      dispatch(getCategories());
    }
  }
  
  return (
    <div className="row mt-4" id="new-task-wrapper">
      <div className="card card-body shadow form-bg">
        <div className="row">
          <div className="col mb-3">
            <div className="d-flex justify-content-between mb-3">
              <div className="fs-4 newtask-boardName">
                {boardName}
              </div>

              {isEdit_ && (
                <div className="delete-task-button">
                <button onClick={handleDeleteButtonClick} className="btn btn-block btn-sm"
                  id="delete-task">
                    Delete
                </button>
                <DeletePopover 
                  id={task.id}
                  name={task.name}
                  open={openDelete}
                  anchorEl={deleteAnchor}
                  anchorX={'left'}
                  transformX={'right'}
                  onClose={handleDeleteClose}
                  placeholder={"Type DELETE"}
                  handlePressEnter={handleDelete}
                  deleteMessage={'Warning, this cannot be undone!'}
                />
              </div>
              )}
              
            </div>
            <div className="d-flex justify-content-between">
              <div className="">
                <label className="text-white mb-1">Category</label>
                <span className="d-flex">

                  <CategorySelection
                    isEdit={isEdit_}
                    task={task}
                    categoryRequired={categoryRequired}
                    category={category}
                    handleCategorySelect={handleCategorySelect}
                  />

                  <MyTooltip
                    title={isGuest && category.items.length >= 3 ?
                      "As a Guest user, you can have only 3 Categories. Sign Up for free to add more." : ""}
                      placement="right"
                  >
                    <svg onClick={handleAddPopoverClick} xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                      style={{marginLeft: "8px"}}
                      fill="orange" className={`bi bi-plus-square global-add-category-icon ${isGuest && category.items.length >= 3 ? "add-category-guest" : "rename-add-icon category-add-icon"}`} viewBox="0 0 16 16">
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
                    onClose={handleAddPopoverClose}
                    placeholder='Enter Category name'
                    handlePressEnter={handleAddCategory}
                  />
                </span>
              </div>
              {isEdit_ && 
              <StatusSelection 
              currentStatus={task.status}
              handleStatusSelect={handleStatusSelect}
              /> }
              
            </div>
          </div>
        </div>

        <label className="text-white mb-1" htmlFor="id_name">Name</label>
        <input ref={nameInputField} onChange={handleNameChange} type="text" className={`taskForm-field card  bg-dark text-light ${nameRequired && "required-field"}`} id="id_name" placeholder="Enter name" value={name} />
        <br/>
        <label className="text-white mb-1" htmlFor="id_description">Description</label>
        <textarea onChange={handleDescriptionChange} value={description} className="taskForm-field card bg-dark text-light" name="description" id="id_description" cols="30" rows="5"
          placeholder="Enter description"></textarea>
        <br/>

        <SubtaskSection
        isEdit={isEdit_}
        subtasks={subtasks}
        existingSubtasks={existingSubtasks}
        setExistingSubtasks={setExistingSubtasks}
        removedSubtaskIds={removedSubtaskIds}
        setRemovedSubtaskIds={setRemovedSubtaskIds}
        setSubtasks={setSubtasks}
        subtaskInput={subtaskInput}
        setSubtaskInput={setSubtaskInput} />
        
        <br/>

        <div className="taskForm-bottom-section row align-items-end">
          <div className={`form-check form-switch mt-2 mb-3 ms-3 custom-checkbox-wrapper ${isEdit_ && "d-none"}`}>
            <input onChange={handleCreateAndContinue} value={createAndContinue} className="form-check-input custom-checkbox" id="create-and-continue" type="checkbox"
              id="flexSwitchCheckChecked"/>
            <label className="form-check-label text-white" htmlFor="flexSwitchCheckChecked">Create and continue</label>
          </div>
          <div className="col-9">
            <button onClick={onAddOrUpdate} type="submit" className="btn btn-success btn-block fw500 w-100"
              id="create-task" disabled={fieldsCheck}>{isEdit_ ? "Update" : "Create"}</button>
          </div>
          <div className="col-3">
            <button onClick={onCancel} className="btn btn-block fw500 w-100" id="cancel-task">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskForm
