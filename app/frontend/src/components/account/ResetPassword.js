import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { requestPasswordResetEmail } from '../../state/action-creators/authActions'
import Alerts from '../Alerts'

const ResetPassword = () => {
  const dispatch = useDispatch();
  const isPwdResetLink = useSelector(state => state.auth.isPwdResetLink);
  const [email, setEmail] = useState('');

  const onChange = e => {
    setEmail(e.target.value)
  }

  const onSubmit = e => {
    e.preventDefault();
    dispatch(requestPasswordResetEmail(email));
  }


  return (
    <div className="d-flex justify-content-center">
      <Alerts />
      <div className="row mt-4" id="">

        <div className="card card-body shadow form-bg">
        {!isPwdResetLink ? 
          <form onSubmit={onSubmit}>

            <p className="text-center mb-3 fs-4" style={{color: "orange"}}>
              Enter your email to obtain password reset link
            </p>
            <input 
            type="email"
            value={email}
            onChange={onChange}
            placeholder="Enter you email"
            className="card bg-dark text-light form-control mb-3"
            />
            

            <button className="btn btn-success btn-block py-2 mb-4 fw500 w-100" type="submit">Send email</button>

            <p className="text-center mb-0">
              <Link className="text-white-50 link-decor" to="/">Back to Dashboard</Link>
            </p>
          </form>
          :
          <>
            <p className="text-center mb-3 fs-4" style={{color: "orange"}}>
              Password Reset link sent
            </p>
            <p className="text-center mb-3 text-white">
              Check you email for instructions
            </p>
          </>}

        </div>

      </div>
    </div>
  )
}

export default ResetPassword