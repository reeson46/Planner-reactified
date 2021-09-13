import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getOrCreateUser, updateUser } from '../../state/action-creators/authActions'
import Alerts from '../Alerts'

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const isDone = useSelector(state => state.utils.isDone);
  const isUpdate = useSelector(state => state.auth.isUpdate);
  const [filedCheck, setFieldCheck] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    about: "",
    password: ""
  });

  const {username, email, first_name, last_name, about, password} = formData;

  useEffect(() => {
    formData.password !== '' ? setFieldCheck(false) : setFieldCheck(true);

  }, [formData.password])

  useEffect(() => {
    dispatch(getOrCreateUser());
    user && setFormData({
      ...formData, 
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      about: user.about
    });
 
  }, [isDone])


  if(user && user.is_guest) {
    return <Redirect to="/" />
  }
  
  const onChange = e => setFormData({
    ...formData, [e.target.name]: e.target.value
  }); 

  const onSubmit = e => {
    e.preventDefault();
    const data = {
      username,
      email,
      first_name,
      last_name,
      about,
      password
    };
    dispatch(updateUser(data));
    setFormData({
      ...formData,
      password: ""
    });
  }

  return (
    <div className="d-flex justify-content-center">
      <Alerts />
      <div className="row mt-4" id="profile-wrapper">
        <div className="card card-body shadow form-bg">
          <p className="profile-title mb-2 fs-4">Profile</p>

          <form onSubmit={e => onSubmit(e)}>
            <label className="text-white mb-1">Username</label>
            <input 
              value={username} 
              name="username" 
              onChange={e => onChange(e)} 
              type="text" 
              className="card bg-dark text-light my-form-input mb-3" 
              required
            />

            <label className="text-white mb-1">Email</label>
            <input 
              value={email} 
              name="email" 
              onChange={e => onChange(e)} 
              type="email" 
              className="card bg-dark text-light my-form-input mb-3" 
              required 
            />

            <label className="text-white mb-1">First name</label>
            <input 
              value={first_name} 
              name="first_name" 
              onChange={e => onChange(e)} 
              type="text" 
              className="card bg-dark text-light my-form-input mb-3" 
            />

            <label className="text-white mb-1">Last name</label>
            <input 
              value={last_name} 
              name="last_name" 
              onChange={e => onChange(e)} 
              type="text" 
              className="card bg-dark text-light my-form-input mb-3" 
            />

            <label className="text-white mb-1">About</label>
            <textarea 
              value={about} 
              name="about" 
              onChange={e => onChange(e)} 
              type="text" 
              className="card bg-dark text-light my-form-input mb-3" 
            />

            <hr className="text-white"/>

            <label className="text-white mb-1">Your password</label>
            <input 
              value={password} 
              name="password" 
              onChange={e => onChange(e)} 
              type="password" 
              minLength="8"
              placeholder="Enter your Password to save profile" 
              className="card bg-dark text-light my-form-input mb-3" 
              required 
            />
          
            <button className="btn btn-success btn-block py-2 mb-4 mt-2 fw500 w-100" type="submit"
              id="profile-save-btn" disabled={filedCheck}>Save</button>
          </form>

          <p className="text-center mb-0">
            <Link className="text-white-50 link-decor" to="/">Back to Dashboard</Link>
          </p>
        </div>
      </div>
    </div>

  )
}

export default Profile
