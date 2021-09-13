import React, {Fragment, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../state/action-creators/authActions'
import axios from 'axios'

const Account = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    axios.delete('/api/clear-session/', null);
  }

  const guestLinks = () => (
    <Fragment>
      <ul className="dropdown-menu dropdown-menu-guest bg-dark" aria-labelledby="accountDropdown">
        <li className="account-dropdown-item">
          <Link id="account-btn" to="/login">Login</Link>
        </li>
        <li className="account-dropdown-item">
          <Link id="logout-btn" to="/signup">Sign Up</Link>
        </li>
      </ul>
    </Fragment>
  )

  const authLinks = () => (
    <Fragment>
      <ul className="dropdown-menu dropdown-menu-user bg-dark" aria-labelledby="accountDropdown">
        <li className="account-dropdown-item">
          <Link id="account-btn" to="/account/profile">Profile</Link>
        </li>
        <li className="account-dropdown-item">
          <a onClick={() => handleLogout()} id="logout-btn" href="#">Logout</a>
        </li>
      </ul>
    </Fragment>
  )

  return (
    <div className="bg-dark mb-3" id="account-wrapper">
      <div className="d-flex justify-content-between" style={{height: "100%"}}>
        <span className="d-flex text-white user-name-wrapper">
          <div>Hello,&nbsp;</div>
          <div className="user-name">{user && !user.is_guest ? user.username : 'Guest'}</div>
        </span>
        <div className="dropdown" style={{margin: "auto 10px"}}>
          <svg xmlns="http://www.w3.org/2000/svg" data-display="static" type="button" id="accountDropdown"
            data-bs-toggle="dropdown" aria-expanded="false" width="22" height="22" fill="currentColor"
            className="bi bi-caret-right-square dropdown-caret" viewBox="0 0 16 16">
            <path
              d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path
              d="M5.795 12.456A.5.5 0 0 1 5.5 12V4a.5.5 0 0 1 .832-.374l4.5 4a.5.5 0 0 1 0 .748l-4.5 4a.5.5 0 0 1-.537.082z" />
          </svg>
          {user && !user.is_guest ? authLinks() : guestLinks()}
        </div>
      </div>
    </div>
  )
}

export default Account
