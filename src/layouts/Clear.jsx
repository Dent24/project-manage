import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import '../assets/css/clear.css'

const Clear = () => {
  const [userInfo, setUserInfo ] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});
  const navigate = useNavigate();

  useEffect(() => {
    if (!!userInfo.name) navigate('/')
  }, [ userInfo ]);

  return (
    <>
      <Outlet />
    </>
  )
}

export default Clear;