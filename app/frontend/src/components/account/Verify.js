import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { verify } from '../../state/action-creators/authActions'
import Alerts from '../Alerts'

const Verify = ({match}) => {
  const dispatch = useDispatch();
  const isVerified = useSelector(state => state.auth.isVerified);
  const history = useHistory();
  const [time, setTime] = useState(5);

  useEffect(() => {
    
    return () => {
      clearInterval(timer)
    }
  }, [])

  const onClick = () => {
    const uid = match.params.uid;
    const token = match.params.token;
    dispatch(verify(uid, token));
  }

  if(isVerified) {
    var timer = setInterval(function(){
      setTime(time - 1);
      if (time === 0) {
        clearInterval(timer)
        history.push("/");
      }
    }, 1000);
  }


  return (
    <div className="d-flex justify-content-center">
      <Alerts />
      <div className="row mt-4">
        <div className="card card-body shadow form-bg">
          {!isVerified ? 
          <>
            <p className="text-center fs-5 mb-0" style={{color: "orange"}}>
            Verify you Account
            </p>
            <button 
            className="btn btn-success btn-block py-2 mt-4 fw500 w-100" 
            type="button" 
            onClick={onClick}
            >
              Verify
            </button>
          </>
           : 
           <p className="text-center fs-5 mb-0" style={{color: "orange"}}>
           Your account has been successfully verified. You will be redirected back to Dashboard in <span className="redirect-time">{time}</span> seconds...
           </p> 
          }      
        </div>
      </div>
    </div>
  )
}

export default Verify