import React, { useEffect, useState } from 'react';
import { Col, Input, Row, Form, Dropdown, Menu, Button, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Container, Alert, Table } from 'react-bootstrap';


const items = [
   {
      label: 'A+',
      key: '1',
   },
   {
      label: 'A-',
      key: '2',
   },
   {
      label: 'AB-',
      key: '3',
   },
   {
      label: 'AB+',
      key: '4',
   },
   {
      label: 'B-',
      key: '5',
   }
   
];

const Blood = () => {
   const [bloodDetails, setBloodDetails] = useState({
      bloodType: '',
      quantity: '',
      price: ''
   });

   const [selectedBloodId, setSelectedBloodId] = useState(null);

   const [bloods, setBloods] = useState([])
   const [bloodRequest, setBloodRequest] = useState([])

   const handleBloodTypeSelect = (type) => {
      setBloodDetails({
         ...bloodDetails,
         bloodType: type,
      });
   };

   const handleChange = (e) => {
      setBloodDetails({
         ...bloodDetails,
         [e.target.name]: e.target.value,
      });
   };

   const getBloodDetails = async () => {
      try {
         const res = await axios.get('http://localhost:8001/api/admin/allblood', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         })
         if (res.data.success) {
            setBloods(res.data.data)
         }
         else {
            message.error(res.data.success)
         }
      } catch (error) {
         console.log(error)
         message.error('Something went wrong')
      }
   }

   const getBloodDetailsRequest = async () => {
      try {
         const res = await axios.get('http://localhost:8001/api/admin/getbloodrequest', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         })
         if (res.data.success) {
            setBloodRequest(res.data.data)
         }
         else {
            message.error(res.data.success)
         }
      } catch (error) {
         console.log(error)
         message.error('Something went wrong')
      }
   }

   useEffect(() => {
      getBloodDetails()
      getBloodDetailsRequest()
   }, [])

   const handleDelete = async (bloodId) => {
      try {
         const res = await axios.delete(`http://localhost:8001/api/admin/deleteblood/${bloodId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         })
         if (res.data.success) {
            message.success(res.data.message)
            getBloodDetails()
         }
         else {
            message.error(res.data.success)
         }
      } catch (error) {
         console.log(error)
         message.error('Something went wrong')
      }
   }

   const handleUpdate = (bloodId) => {
      const selectedBlood = bloods.find(blood => blood._id === bloodId);
      setSelectedBloodId(bloodId);
      setBloodDetails({
         bloodType: selectedBlood.bloodType,
         quantity: selectedBlood.quantity,
         price: selectedBlood.price,
      });
   };

   const handleSubmit = async () => {
      try {
         let res;
         if (selectedBloodId) {
            // Update existing blood entry
            res = await axios.put(`http://localhost:8001/api/admin/updateblood/${selectedBloodId}`, bloodDetails, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
               }
            });
         } else {
            // Add new blood entry
            res = await axios.post('http://localhost:8001/api/admin/addblood', bloodDetails, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
               }
            });
         }
         if (res.data.success) {
            message.success(res.data.message);
            setSelectedBloodId(null);
            setBloodDetails({
               bloodType: '',
               quantity: '',
               price: ''
            });
            getBloodDetails();
         } else {
            message.error(res.data.success);
         }
      } catch (error) {
         console.log(error);
         message.error('Something went wrong');
      }
   };

   return (
      <>
         <Form onFinish={handleSubmit} className='m-3 p-3'>
            <h4>Blood Details:</h4>
            <Row className='my-3' gutter={20}>
               <Col xs={12} md={6} lg={4}>
                  <Form.Item label="Blood Type" required>
                     <Dropdown
                        overlay={
                           <Menu>
                              {items.map((item) => (
                                 <Menu.Item
                                    key={item.key}
                                    onClick={() => handleBloodTypeSelect(item.label)}
                                 >
                                    {item.label}
                                 </Menu.Item>
                              ))}
                           </Menu>
                        }
                        trigger={['click']}
                     >
                        <span className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                           {bloodDetails.bloodType || ''} <DownOutlined />
                        </span>
                     </Dropdown>
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Blood Quantity (in ml)" required>
                     <Input value={bloodDetails.quantity} onChange={handleChange} name='quantity' type='text' placeholder='Enter quantity' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Price (per ml)" required>
                     <Input value={bloodDetails.price} onChange={handleChange} name='price' type='number' placeholder='Enter price' />
                  </Form.Item>
               </Col>
               <div className="d-flex justify-content-end">
                  <Button size='sm' className="btn btn-primary p-1" htmlType="submit">
                     Submit
                  </Button>
               </div>
            </Row>
         </Form>

         {/***************table of Blood *******************************/}
         <div>
            <h2 className='p-3 text-center'>Blood Inventory</h2>

            <Container>
               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>Blood Type</th>
                        <th>Quantity (in ml)</th>
                        <th>Price (per ml)</th>
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {bloods && bloods.length > 0 ? (
                        bloods.map((blood) => {
                           return (
                              <tr key={blood._id}>
                                 <td>{blood.bloodType}</td>
                                 <td>{blood.quantity}</td>
                                 <td>{blood.price}</td>
                                 <td>
                                    <Button onClick={() => handleDelete(blood._id)} className='mx-2' size='sm' danger>
                                       Delete
                                    </Button>

                                    <Button onClick={() => handleUpdate(blood._id)} className='mx-2' size='sm' info>
                                       Edit
                                    </Button></td>
                              </tr>
                           )
                        })
                     ) : (
                        <tr>
                           <td colSpan={5}>
                              <Alert variant="info">
                                 <Alert.Heading>No Blood to show</Alert.Heading>
                              </Alert>
                           </td>
                        </tr>

                     )}
                  </tbody>
               </Table>
            </Container>
         </div>


         {/***************table of Blood Request *******************************/}
         <div>
            <h2 className='p-3 text-center'>Blood Request</h2>

            <Container>
               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>Doctor ID</th>
                        <th>Blood Type</th>
                        <th>Quantity (in ml)</th>
                        <th>Payment</th>
                     </tr>
                  </thead>
                  <tbody>
                     {bloodRequest && bloodRequest.length > 0 ? (
                        bloodRequest.map((request) => {
                           return (
                              <tr key={request._id}>
                                 <td>{request.DocId}</td>
                                 <td>{request.bloodType}</td>
                                 <td>{request.quantity}</td>
                                 <td>{request.Payment}</td>
                              </tr>
                           )
                        })
                     ) : (
                        <tr>
                           <td colSpan={5}>
                              <Alert variant="info">
                                 <Alert.Heading>No Blood Request to show</Alert.Heading>
                              </Alert>
                           </td>
                        </tr>

                     )}
                  </tbody>
               </Table>
            </Container>
         </div>
      </>
   );
};


export default Blood
