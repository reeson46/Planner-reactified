import React from 'react'
import { useEffect } from 'react';
import { useAlert } from 'react-alert'
import { Fragment } from 'react';
import { useSelector } from 'react-redux';

const Alerts = () => {
  const error = useSelector(state => state.error);
  const message = useSelector(state => state.message);
  const alert = useAlert();

  useEffect(() => {
  
    message.passwordNotMatch && alert.error(message.passwordNotMatch)

    message.profileUpdated && alert.success(message.profileUpdated);

    error.msg.username && alert.error(error.msg.username.join());

    error.msg.non_field_errors && alert.error(error.msg.non_field_errors.join());

    error.msg.email && alert.error(error.msg.email.join());

    error.msg.detail && alert.error(error.msg.detail);

    error.msg.password && alert.error(error.msg.password.join());

  }, [error, message])

  return (
    <Fragment />
  )
}

export default Alerts
