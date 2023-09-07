import React, { useEffect, useState } from 'react'
import { Badge, Row } from 'antd';
import Notification from '../common/Notification';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicationIcon from '@mui/icons-material/Medication';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Container } from 'react-bootstrap';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import ApplyDoctor from './ApplyDoctor';
import UserAppointments from './UserAppointments';
import DoctorList from './DoctorList';
import AllotBlood from './AllotBlood';
import AllotBed from './AllotBed';
import AllotMedicine from './AllotMedicine';



const UserHome = () => {
   const [doctors, setDoctors] = useState([])
   const [userdata, setUserData] = useState({})
   const [activeMenuItem, setActiveMenuItem] = useState('');

   const getUser = () => {
      const user = JSON.parse(localStorage.getItem('userData'))
      if (user) {
         setUserData(user)
      }
   }

   const getUserData = async () => {
      try {
         await axios.post('http://localhost:8001/api/user/getuserdata', {}, {
            headers: {
               Authorization: "Bearer " + localStorage.getItem('token')
            },
         });
      } catch (error) {
         console.log(error);
      }
   };

   const getDoctorData = async () => {
      try {
         const res = await axios.get('http://localhost:8001/api/user/getalldoctorsu', {
            headers: {
               Authorization: "Bearer " + localStorage.getItem('token')
            },
         });
         if (res.data.success) {
            setDoctors(res.data.data)
         }
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getUser();
      getUserData();
      getDoctorData()
   }, []);

   const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      window.location.href = "/";
   };

   const handleMenuItemClick = (menuItem) => {
      setActiveMenuItem(menuItem);
   };

   return (
      <>
         <div className='main'>
            <div className="layout">
               <div className="sidebar">
                  <div className="logo">
                     <h2>HMS</h2>
                  </div>
                  <div className="menu">
                     <div className={`menu-items ${activeMenuItem === 'userappointments' ? 'active' : ''}`} onClick={() => handleMenuItemClick('userappointments')}>
                        <CalendarMonthIcon className='icon' /><Link>Appointments</Link>
                     </div>

                     {userdata.isdoctor === true ?
                        <>
                           <div className={`menu-items ${activeMenuItem === 'allotmedicine' ? 'active' : ''}`} onClick={() => handleMenuItemClick('allotmedicine')}>
                              <MedicationIcon className='icon' /><Link>Medicine</Link>
                           </div>

                           <div className={`menu-items ${activeMenuItem === 'allotblood' ? 'active' : ''}`} onClick={() => handleMenuItemClick('allotblood')}>
                              <WaterDropIcon className='icon' /><Link>Blood</Link>
                           </div>

                           <div className={`menu-items ${activeMenuItem === 'allotbed' ? 'active' : ''}`} onClick={() => handleMenuItemClick('allotbed')}>
                              <SingleBedIcon className='icon' /><Link>Bed</Link>
                           </div>
                        </> :
                        <>
                           <div className={`menu-items ${activeMenuItem === 'applyDoctor' ? 'active' : ''}`} onClick={() => handleMenuItemClick('applyDoctor')}>
                              <MedicationIcon className='icon' /><Link>Apply doctor</Link>
                           </div>


                        </>
                     }
                     <div className="menu-items" onClick={logout}>
                        <LogoutIcon className='icon' /><Link>Logout</Link>
                     </div>
                  </div>
               </div>
               <div className="content">
                  <div className="header">
                     <div className="header-content" style={{ cursor: 'pointer', float: 'right' }}>

                        <Badge className={`notify ${activeMenuItem === 'notification' ? 'active' : ''}`} onClick={() => handleMenuItemClick('notification')} count={userdata?.notification ? userdata.notification.length : 0}>
                           <NotificationsIcon className="icon" />
                        </Badge>

                        {userdata.isdoctor === true && <h3>Dr.</h3>}
                        <h3>{userdata.fullName}</h3>
                     </div>
                  </div>
                  <div className="body">
                     {activeMenuItem === 'applyDoctor' && <ApplyDoctor userId={userdata._id} />}
                     {activeMenuItem === 'notification' && <Notification />}
                     {activeMenuItem === 'userappointments' && <UserAppointments />}
                     {activeMenuItem === 'allotblood' && <AllotBlood />}
                     {activeMenuItem === 'allotbed' && <AllotBed />}
                     {activeMenuItem === 'allotmedicine' && <AllotMedicine />}

                     {
                        activeMenuItem !== 'allotmedicine' &&
                        activeMenuItem !== 'allotbed' &&
                        activeMenuItem !== 'allotblood' &&
                        activeMenuItem !== 'applyDoctor' &&
                        activeMenuItem !== 'notification' &&
                        activeMenuItem !== 'userappointments' &&
                        <Container>
                           <h2 className="text-center p-2">Home</h2>
                           {userdata.isdoctor === true ? <></> : <Row>
                              {doctors && doctors.length > 0 ?
                                 doctors.map((doctor, i) => {
                                    let notifyDoc = doctor.userId
                                    return (
                                       <DoctorList userDoctorId={notifyDoc} doctor={doctor} userdata={userdata} key={i} />
                                    )
                                 }) : <>No Doctors to show</>}
                           </Row>}
                        </Container>
                     }
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default UserHome;
