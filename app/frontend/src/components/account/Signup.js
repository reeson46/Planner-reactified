import React from 'react'
import { useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { register } from '../../state/action-creators/authActions';
import { createMessage } from '../../state/action-creators/messageActions';
import { useDispatch, useSelector } from 'react-redux';
import Alerts from '../Alerts';

const Signup = () => {
  const dispatch = useDispatch();
  const isGuest = useSelector(state => state.auth.user.is_guest);
  const isRegistered = useSelector(state => state.auth.isRegistered);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const { username, email, password, password2 } = formData;

  const onChange = e => setFormData({
    ...formData, [e.target.name]: e.target.value
  });

  if(!isGuest) {
    return <Redirect to="/" />
  }

  if(isRegistered) {
    return <Redirect to="/signup-successful" />
  }

  const onSubmit = e => {
    e.preventDefault();
    if(password !== password2) {
      dispatch(createMessage({
        passwordNotMatch: 'Passwords do not match'
      }));
    } else {
      const newUser = {
        username,
        email,
        password
      };
      dispatch(register(newUser));
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <Alerts />
      <div className="row mt-4" id="register-wrapper">

        <div className="card card-body shadow form-bg">
          <form onSubmit={e => onSubmit(e)}>
          
            <label className="text-white mb-1">Username</label>
            <small className="form-text text-white-50 mb-4 small"> (Required)
            </small>
            <input 
              value={username} 
              name="username" 
              onChange={e => onChange(e)} 
              type="text" 
              placeholder="Enter Username" 
              className="card bg-dark text-light my-form-input mb-3" 
              required
            />

            <label className="text-white mb-1">Email</label>
            <small className="form-text text-white-50 mb-4 small"> (Required)
            </small>
            <input 
              value={email} 
              name="email" 
              onChange={e => onChange(e)} 
              type="email" 
              placeholder="Enter Email" 
              className="card bg-dark text-light my-form-input mb-3" 
              required 
            />

            <label className="text-white mb-1">Password
             </label>
             <small className="form-text text-white-50 mb-4 small"> At least 8 characters and 1 digit (Required)
            </small>
            
            <input 
              value={password} 
              name="password" 
              onChange={e => onChange(e)} 
              type="password" 
              minLength="8"
              placeholder="Enter Password" 
              className="card bg-dark text-light my-form-input mb-3" 
              required 
            />
            <label className="text-white mb-1">Repeat Password</label>
            <small className="form-text text-white-50 mb-4 small"> (Required)
            </small>
              <input 
              value={password2} 
              name="password2" 
              onChange={e => onChange(e)} 
              type="password" 
              minLength="8"
              placeholder="Repeat Password" 
              className="card bg-dark text-light my-form-input mb-3" 
              required 
            />

            <button className="btn btn-success btn-block py-2 mb-4 mt-4 fw500 w-100" type="submit">Sign Up</button>
            <p className="text-center">
              <Link className="text-white-50 link-decor" to="/login">Already have an account?</Link>
            </p>
            <p className="text-center mb-0">
              <Link className="text-white-50 link-decor" to="/">Back to Dashboard</Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Signup
