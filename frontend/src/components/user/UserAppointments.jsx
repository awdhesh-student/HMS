import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { message } from 'antd';

const UserAppointments = () => {
  const [userid, setUserId] = useState();
  const [type, setType] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [bloodRequest, setBloodRequest] = useState([])
  const [bedRequest, setBedRequest] = useState([])
  const [medicineRequest, setMedicineRequest] = useState([])

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      const { _id, isdoctor } = user;
      setUserId(_id);
      setType(isdoctor);
    } else {
      alert('No user to show');
    }
  };

  const getUserAppointment = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/user/getuserappointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          userId: userid,
        },
      });
      if (res.data.success) {
        setUserAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  const getDoctorAppointment = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/doctor/getdoctorappointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          userId: userid,
        },
      });
      if (res.data.success) {
        setDoctorAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  const handleStatus = async (userid, appointmentId, status) => {
    try {
      const res = await axios.post('http://localhost:8001/api/doctor/handlestatus', {
        userid,
        appointmentId,
        status,
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      if (res.data.success) {
        message.success(res.data.message)
        getDoctorAppointment();
        getUserAppointment();
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    getUser();
  }, [userid]);


  const getAllBloodRequest = async () => {
    let res;
    try {
      if (type === true) {
        res = await axios.get('http://localhost:8001/api/doctor/getallbloodallotment', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
      } else {
        res = await axios.get('http://localhost:8001/api/user/getallbloodrequest', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
      }
      if (res.data.success) {
        setBloodRequest(res.data.data)
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }

  const getAllBedRequest = async () => {
    let res;
    try {
      if (type === true) {
        res = await axios.get('http://localhost:8001/api/doctor/getallbedallotment', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
      } else {
        res = await axios.get('http://localhost:8001/api/user/getallbedrequest', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
      }
      if (res.data.success) {
        setBedRequest(res.data.data)
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }

  const getAllMedicineRequest = async () => {
    let res;
    try {
      if (type === true) {
        res = await axios.get('http://localhost:8001/api/doctor/getallprecriptionallotment', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
      } else {
        res = await axios.get('http://localhost:8001/api/user/getallprecriptionallotment', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
      }
      if (res.data.success) {
        setMedicineRequest(res.data.data)
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }



  useEffect(() => {
    if (type === true) {
      getDoctorAppointment();
    } else {
      getUserAppointment();
    }
    getAllBloodRequest()
    getAllBedRequest()
    getAllMedicineRequest()
  }, [type])

  const handleDownload = async (url, appointId) => {
    try {
      const res = await axios.get('http://localhost:8001/api/doctor/getdocumentdownload', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        params: { appointId },
        responseType: 'blob'
      });
      console.log(res.data)
      if (res.data) {
        const fileUrl = window.URL.createObjectURL(new Blob([res.data], { "type": "application/pdf" }));
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        downloadLink.setAttribute("href", fileUrl);

        // Extract the file name from the url parameter
        const fileName = url.split("/").pop(); // Assuming the URL is in the format "uploads/document.pdf"

        console.log(fileUrl, downloadLink, fileName)
        // Set the file name for the download
        downloadLink.setAttribute("download", fileName);
        downloadLink.style.display = "none";
        downloadLink.click();
      } else {
        message.error(res.data.error);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  const handleBloodPayemnt = async (requestId, status) => {
    try {
      const res = await axios.patch(`http://localhost:8001/api/user/handlebloodpayment/${requestId}`, status, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.data.success) {
        message.info(res.data.message)
        getAllBloodRequest()
      }
      else {
        console.log(res.data.error)
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }

  const handleBedPayemnt = async (requestId, status) => {
    try {
      const res = await axios.patch(`http://localhost:8001/api/user/handlebedpayment/${requestId}`, status, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.data.success) {
        message.info(res.data.message)
        getAllBedRequest()
      }
      else {
        console.log(res.data.error)
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }

  const handleDischarge = async (requestId, status) => {
    try {
      const res = await axios.patch(`http://localhost:8001/api/doctor/handledischarge/${requestId}`, { status }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (res.data.success) {
        message.info(res.data.message)
        getAllBedRequest()
      }
      else {
        console.log(res.data.error)
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }


  return (
    <div>
      <h2 className='p-3 text-center'>All Appointments</h2>
      <Container>
        {type === true ? (
          <>
            {/********************appointment doctor****************************/}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Date of Appointment</th>
                  <th>Phone</th>
                  <th>Document</th>
                  <th>Appo. Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctorAppointments.length > 0 ? (
                  doctorAppointments.map((appointment) => {
                    return (
                      <tr key={appointment._id}>
                        <td>{appointment.userId}</td>
                        <td>{appointment.userInfo.fullName}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.userInfo.phone}</td>
                        {
                          appointment.document.filename !== null ? <td><Button variant='link' onClick={() => handleDownload(appointment.document.path, appointment._id)}>{appointment.document.filename}</Button></td>
                            : <>No docs</>
                        }
                        <td>{appointment.payment}</td>
                        <td>{appointment.status}</td>
                        <td>{appointment.status === 'approved' ? <></> : <Button onClick={() => handleStatus(appointment.userInfo._id, appointment._id, 'approved')}>Approve</Button>}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <Alert variant="info">
                        <Alert.Heading>No Appointments to show</Alert.Heading>
                      </Alert>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/********************doctor blood allotment****************************/}
            <div>
              <h2 className='p-3 text-center'>All Blood Allotment</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Blood Type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Blood Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodRequest.length > 0 ? (
                    bloodRequest.map((request) => {
                      return (
                        <tr key={request._id}>
                          <td>{request.patientName}</td>
                          <td>{request.bloodType}</td>
                          <td>{request.quantity}</td>
                          <td>{request.price}</td>
                          <td>{request.Payment}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        <Alert variant="info">
                          <Alert.Heading>No Request to show</Alert.Heading>
                        </Alert>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            {/********************doctor bed allotment****************************/}
            <div>
              <h2 className='p-3 text-center'>All Bed Allotment</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Bed Type</th>
                    <th>Patient Name</th>
                    <th>Price</th>
                    <th>Bed Payment</th>
                    <th>Patient status</th>
                    <th>Discharge Action</th>

                  </tr>
                </thead>
                <tbody>
                  {bedRequest.length > 0 ? (
                    bedRequest.map((request) => {
                      return (
                        <tr key={request._id}>
                          <td>{request.bedType}</td>
                          <td>{request.patientName}</td>
                          <td>{request.price}</td>
                          <td>{request.Payment}</td>
                          <td>{request.status}</td>
                          <td>{request.Payment === 'paid' && request.status !== 'discharge' ? <Button size='sm' className="btn btn-primary p-1" onClick={() => handleDischarge(request._id, 'discharge')}>
                            Discharge
                          </Button> : <></>}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <Alert variant="info">
                          <Alert.Heading>No Request to show</Alert.Heading>
                        </Alert>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/********************doctor medicine allotment****************************/}
            <div>
              <h2 className='p-3 text-center'>All Medicines Allotment</h2>
              {medicineRequest.length > 0 ? (
                <table className='table table-striped table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Patient Name</th>
                      <th>Symptoms</th>
                      <th>Medicines</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineRequest.map((request) => (
                      <tr key={request._id}>
                        <td>{request.patientId}</td>
                        <td>{request.patientName}</td>
                        <td>{request.symptoms}</td>
                        <td>
                          <ol>
                            {request.medicines.map((medicine) => (
                              <li key={medicine.medicineId}>
                                {medicine.medicineName} - {medicine.dose} dose - {medicine.remark}
                              </li>
                            ))}
                          </ol>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='alert alert-info'>
                  <p>No Requests to show</p>
                </div>
              )}
            </div>


          </>

        ) : (
          <>
            {/********************appointment patient****************************/}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Date of Appointment</th>
                  <th>Appo. Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userAppointments.length > 0 ? (
                  userAppointments.map((appointment) => {
                    return (
                      <tr key={appointment._id}>
                        <td>{appointment.docName}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.payment}</td>
                        <td>{appointment.status}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <Alert variant="info">
                        <Alert.Heading>No Appointments to show</Alert.Heading>
                      </Alert>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/********************patient blood ****************************/}
            <div>
              <h2 className='p-3 text-center'>All Blood Request</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Blood Type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Blood Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodRequest.length > 0 ? (
                    bloodRequest.map((request) => {
                      return (
                        <tr key={request._id}>
                          <td>{request.bloodType}</td>
                          <td>{request.quantity}</td>
                          <td>{request.price}</td>
                          <td>{request.Payment}</td>
                          <td>{request.Payment === 'unpaid' ? <Button size='sm' className="btn btn-primary p-1" onClick={() => handleBloodPayemnt(request._id, 'paid')}>
                            Pay
                          </Button> : <></>}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        <Alert variant="info">
                          <Alert.Heading>No Request to show</Alert.Heading>
                        </Alert>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/********************patient bed ****************************/}
            <div>
              <h2 className='p-3 text-center'>All Bed Allotment</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Bed Type</th>
                    <th>Patient Name</th>
                    <th>Price</th>
                    <th>Bed Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bedRequest.length > 0 ? (
                    bedRequest.map((request) => {
                      return (
                        <tr key={request._id}>
                          <td>{request.bedType}</td>
                          <td>{request.patientName}</td>
                          <td>{request.price}</td>
                          <td>{request.Payment}</td>
                          <td>{request.Payment === 'unpaid' ? <Button size='sm' className="btn btn-primary p-1" onClick={() => handleBedPayemnt(request._id, 'paid')}>
                            Pay
                          </Button> : <></>}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <Alert variant="info">
                          <Alert.Heading>No Request to show</Alert.Heading>
                        </Alert>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            {/*************all patient pricription ************************/}
            <div>
              <h2 className='p-3 text-center'>All Medicines Allotment</h2>
              {medicineRequest.length > 0 ? (
                <table className='table table-striped table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Doctor ID</th>
                      <th>Patient Name</th>
                      <th>Symptoms</th>
                      <th>Medicines</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineRequest.map((request) => (
                      <tr key={request._id}>
                        <td>{request.patientId}</td>
                        <td>{request.docId}</td>
                        <td>{request.patientName}</td>
                        <td>{request.symptoms}</td>
                        <td>
                          <ol>
                            {request.medicines.map((medicine) => (
                              <li key={medicine.medicineId}>
                                {medicine.medicineName} - {medicine.dose} dose - {medicine.remark}
                              </li>
                            ))}
                          </ol>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='alert alert-info'>
                  <p>No Requests to show</p>
                </div>
              )}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default UserAppointments;
