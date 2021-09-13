import React from 'react'

const SignupSuccessful = () => {
  return (
    <div className="d-flex justify-content-center">
      <div className="row mt-4">
        <div className="card card-body shadow form-bg">
          <p className="text-center fs-5 mb-0" style={{color: "orange"}}>
            Sign Up successful. Account verification link has been sent to your email.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupSuccessful
