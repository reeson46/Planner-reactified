import React from 'react'

const Misc = () => {
  return (
    <div className="bg-dark" id="misc-wrapper">
      <div className="container">
        <li className="row misc-item">
          <a href="#" className="d-flex misc-link justify-content-between">
            <div className="misc-text fs-5">Support</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="bi bi-wrench misc-icon"
              viewBox="0 0 16 16">
              <path
                d="M.102 2.223A3.004 3.004 0 0 0 3.78 5.897l6.341 6.252A3.003 3.003 0 0 0 13 16a3 3 0 1 0-.851-5.878L5.897 3.781A3.004 3.004 0 0 0 2.223.1l2.141 2.142L4 4l-1.757.364L.102 2.223zm13.37 9.019.528.026.287.445.445.287.026.529L15 13l-.242.471-.026.529-.445.287-.287.445-.529.026L13 15l-.471-.242-.529-.026-.287-.445-.445-.287-.026-.529L11 13l.242-.471.026-.529.445-.287.287-.445.529-.026L13 11l.471.242z" />
            </svg>
          </a>
        </li>
      </div>
      <div className="container">
        <li className="row misc-item">
          <a href="#" className="d-flex misc-link justify-content-between">
            <div className="misc-text fs-5">About</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
              className="bi bi-info-square misc-icon" viewBox="0 0 16 16">
              <path
                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              <path
                d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </a>
        </li>
      </div>
    </div>
  )
}

export default Misc
