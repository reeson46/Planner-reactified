import React from 'react'
import { useEffect, useState } from 'react';

const CategorySelection = (props) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if(props.isEdit){
      setValue(props.task.category);
      props.handleCategorySelect(props.task.category);
    }
    else {

      if(props.category.items.length === 0) {
        setValue(-2);
        props.handleCategorySelect(-2);
      }
      else {
        
        if(props.category.active === -1) {
          setValue(props.category.items[0].id);
          props.handleCategorySelect(props.category.items[0].id);
          
        }
        else {
          setValue(props.category.active)
        }
      }
    
    }
  }, [props.task, props.category])

  const categories = props.category.items && props.category.items.map(category => {
    return(
      <option key={category.id} value={category.id}>{category.name}</option>
    )
  })

  const handleChange = (e) => {
    setValue(e.target.value);
    props.handleCategorySelect(e.target.value)
  }
  
  return (
    <select
      name="category"
      className={`taskForm-field card bg-dark text-light newtask-categorySelect ${props.categoryRequired && "required-field"}`}
      value={value}
      onChange={handleChange}
    >
      {props.category.items.length != 0 ?
        categories :
        <option value={-2}>No Categories</option>
      }
    </select>
  )
}

export default CategorySelection
