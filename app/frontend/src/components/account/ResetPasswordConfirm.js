import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { passwordResetConfirm } from '../../state/action-creators/authActions'
import { createMessage } from '../../state/action-creators/messageActions'
import Alerts from '../Alerts'

const ResetPasswordConfirm = ({match}) => {
  const dispatch = useDispatch();
  const isPWdResetComplete = useSelector(state => state.auth.isPWdResetComplete);
  const [formData, setFormData] = useState({
    password: "",
    password2: ""
  });

  const { password, password2 } = formData;

  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const onSubmit = e => {
    e.preventDefault();
    if(password !== password2) {
      dispatch(createMessage({
        passwordNotMatch: 'Passwords do not match'
      }));
    }else {
      const uid = match.params.uid;
      const token = match.params.token;
      dispatch(passwordResetConfirm(uid, token, password));
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <Alerts />
      <div className="row mt-4">

        <div className="card card-body shadow form-bg">
        {!isPWdResetComplete ?
          <>
            <form onSubmit={onSubmit}>
              <p className="text-center mb-3 fs-4" style={{color: "orange"}}>
                Enter your new password
              </p>

              <label className="text-white mb-1">New password</label>
              <input
                className="card bg-dark text-light form-control mb-3" 
                placeholder="New password"
                type="password" 
                name="password"
                value={password}
                onChange={onChange}
              />

              <label className="text-white mb-1">Repeat password</label>
              <input
                className="card bg-dark text-light form-control mb-3" 
                placeholder="Repeat password"
                type="password" 
                name="password2"
                value={password2}
                onChange={onChange}
              />

              <ul className="text-white">
                <li>Your password can’t be too similar to your other personal information.</li>
                <li>Your password must contain at least 8 characters.</li>
                <li>Your password can’t be a commonly used password.</li>
                <li>Your password can’t be entirely numeric.</li>
              </ul>
              <button className="btn btn-success btn-block py-2 mb-4 mt-3 fw500 w-100" type="submit">Submit</button>
            </form>
            <p className="text-center">
              <Link className="text-white-50 link-decor" to="/account/reset-password">
                Resend email
              </Link>
            </p>
          </>
          :
          <>
            <p className="mb-3 fs-4" style={{color: "orange"}}>
              Password Reset successful
            </p>
            <p className="text-center">
              <Link className="text-white-50 link-decor" to="/login">
                Login
              </Link>
            </p>
          </>}

        </div>
      </div>
    </div>
  )
}

export default ResetPasswordConfirm