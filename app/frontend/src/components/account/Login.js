import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from "../../state/action-creators/authActions";
import Alerts from '../Alerts';


const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = formData;
  const onChange = e => setFormData({
    ...formData, [e.target.name]: e.target.value
  });

  const onSubmit = e => {
    e.preventDefault();
    dispatch(login(username, password));
  }

  if(user && !user.is_guest) {
    return <Redirect to="/" />
  }

  return (
    <div className="d-flex justify-content-center">
      <Alerts />
      <div className="row mt-4" id="login-wrapper">
        <div className="card card-body shadow form-bg">
          <form onSubmit={e => onSubmit(e)}>
            <label className="text-white mb-1">Email</label>
            <input 
              value={username} 
              name="username" 
              onChange={e => onChange(e)} 
              type="email" 
              placeholder="Email" 
              className="card bg-dark text-light my-form-input mb-3" 
              required 
            />

            <label className="text-white mb-1">Password</label>
            <input 
              value={password} 
              name="password" 
              onChange={e => onChange(e)} 
              type="password" 
              minLength="8"
              placeholder="Password" 
              className="card bg-dark text-light my-form-input mb-3" 
              required 
            />

            <button className="btn btn-success btn-block py-2 mb-4 mt-4 fw500 w-100" type="submit" value="Log-in">Login</button>
            <p className="text-center">
              <Link className="text-white-50 link-decor" to="/signup">Don't have an account?</Link>
            </p>
            <p className="text-center">
              <Link className="text-white-50 link-decor" to="/account/reset-password">Forgot you password?</Link>
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

export default Login
