import React, { useEffect, useState } from 'react';
import { Col, Input, Row, Form, Dropdown, Menu, Button, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Container, Alert, Table } from 'react-bootstrap';

const items = [
   {
      label: 'Premium Bed',
      key: '1',
   },
   {
      label: 'Normal Bed',
      key: '2',
   },

];

const Bed = () => {
   const [bedDetails, setBedDetails] = useState({
      bedType: '',
      quantity: '',
      price: ''
   });

   const [bedRequest, setBedRequest] = useState([])

   const [selectedBedId, setSelectedBedId] = useState(null);

   const [beds, setBeds] = useState([])

   const handleBedTypeSelect = (type) => {
      setBedDetails({
         ...bedDetails,
         bedType: type,
      });
   };

   const handleChange = (e) => {
      setBedDetails({
         ...bedDetails,
         [e.target.name]: e.target.value,
      });
   };

   const getBedDetails = async () => {
      try {
         const res = await axios.get('http://localhost:8001/api/admin/allbed', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         })
         if (res.data.success) {
            setBeds(res.data.data)
         }
         else {
            message.error(res.data.success)
         }
      } catch (error) {
         console.log(error)
         message.error('Something went wrong')
      }
   }

   const getBedDetailsRequest = async () => {
      try {
         const res = await axios.get('http://localhost:8001/api/admin/getbedrequest', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         })
         if (res.data.success) {
            setBedRequest(res.data.data)
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
      getBedDetails()
      getBedDetailsRequest()
   }, [])

   const handleDelete = async (bedId) => {
      try {
         const res = await axios.delete(`http://localhost:8001/api/admin/deletebed/${bedId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         })
         if (res.data.success) {
            message.success(res.data.message)
            getBedDetails()
         }
         else {
            message.error(res.data.success)
         }
      } catch (error) {
         console.log(error)
         message.error('Something went wrong')
      }
   }

   const handleUpdate = (bedId) => {
      const selectedBed = beds.find(bed => bed._id === bedId);
      setSelectedBedId(bedId);
      setBedDetails({
         bedType: selectedBed.bedType,
         quantity: selectedBed.quantity,
         price: selectedBed.price,
      });
   };

   const handleSubmit = async () => {
      try {
         let res;
         if (selectedBedId) {
            // Update existing bed entry
            res = await axios.put(`http://localhost:8001/api/admin/updatebed/${selectedBedId}`, bedDetails, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
               }
            });
         } else {
            // Add new bed entry
            res = await axios.post('http://localhost:8001/api/admin/addbed', bedDetails, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
               }
            });
         }
         if (res.data.success) {
            message.success(res.data.message);
            setSelectedBedId(null);
            setBedDetails({
               bedType: '',
               quantity: '',
               price: ''
            });
            getBedDetails();
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
            <h4>Bed Details:</h4>
            <Row className='my-3' gutter={20}>
               <Col xs={12} md={6} lg={4}>
                  <Form.Item label="Bed Type" required>
                     <Dropdown
                        overlay={
                           <Menu>
                              {items.map((item) => (
                                 <Menu.Item
                                    key={item.key}
                                    onClick={() => handleBedTypeSelect(item.label)}
                                 >
                                    {item.label}
                                 </Menu.Item>
                              ))}
                           </Menu>
                        }
                        trigger={['click']}
                     >
                        <span className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                           {bedDetails.bedType || ''} <DownOutlined />
                        </span>
                     </Dropdown>
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Bed Quantity" required>
                     <Input value={bedDetails.quantity} onChange={handleChange} name='quantity' type='number' placeholder='Enter quantity' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Price(per/head)" required>
                     <Input value={bedDetails.price} onChange={handleChange} name='price' type='number' placeholder='Enter Price' />
                  </Form.Item>
               </Col>
               <div className="d-flex justify-content-end">
                  <Button className="btn btn-primary p-1" htmlType="submit">
                     Submit
                  </Button>
               </div>
            </Row>
         </Form>

         {/***************table of Bed *******************************/}
         <div>
            <h2 className='p-3 text-center'>Bed Inventory</h2>
            <Container>
               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>Bed Type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {beds && beds.length > 0 ? (
                        beds.map((bed) => {
                           return (
                              <tr key={bed._id}>
                                 <td>{bed.bedType}</td>
                                 <td>{bed.quantity}</td>
                                 <td>{bed.price}</td>
                                 <td>
                                    <Button onClick={() => handleDelete(bed._id)} className='mx-2' size='sm' danger>
                                       Delete
                                    </Button>
                                    <Button onClick={() => handleUpdate(bed._id)} className='mx-2' size='sm' info>
                                       Edit
                                    </Button></td>
                              </tr>
                           )
                        })
                     ) : (
                        <tr>
                           <td colSpan={4}>
                              <Alert variant="info">
                                 <Alert.Heading>No Bed to show</Alert.Heading>
                              </Alert>
                           </td>
                        </tr>

                     )}
                  </tbody>
               </Table>
            </Container>
         </div>

         {/***************table of Bed Request *******************************/}
         <div>
            <h2 className='p-3 text-center'>Bed Allotment Request</h2>

            <Container>
               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>Doctor ID</th>
                        <th>Bed Type</th>
                        <th>Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {bedRequest && bedRequest.length > 0 ? (
                        bedRequest.map((request) => {
                           return (
                              <tr key={request._id}>
                                 <td>{request.DocId}</td>
                                 <td>{request.bedType}</td>
                                 <td>{request.Payment}</td>
                              </tr>
                           )
                        })
                     ) : (
                        <tr>
                           <td colSpan={5}>
                              <Alert variant="info">
                                 <Alert.Heading>No Bed Request to show</Alert.Heading>
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


export default Bed








