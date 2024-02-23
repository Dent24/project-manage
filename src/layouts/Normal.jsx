import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Default = () => {
  const [userInfo, setUserInfo ] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.name) navigate('/login')
  }, [ userInfo ]);

  return (
    <>
      <Outlet />
    </>
  )
}

export default Default;