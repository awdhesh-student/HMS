import React, { useEffect, useState } from 'react';
import { Col, Input, Row, Form, Dropdown, Menu, Button, message } from 'antd';
import axios from 'axios';
import { Container, Alert, Table } from 'react-bootstrap';
import { DownOutlined } from '@ant-design/icons';

const items = [
   {
      label: 'Premium',
      key: '1',
   },
   {
      label: 'Normal',
      key: '2',
   },
];

const AllotBed = () => {
   const [bedDetails, setBedDetails] = useState({
      patientId: '',
      bedId: '',
      bedType: '',
      patientName: ''
   });
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
         const res = await axios.get('http://localhost:8001/api/user/allbed', {
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

   useEffect(() => {
      getBedDetails()
   }, [])



   const handleSubmit = async (bedId, status) => {
      let bed = beds.find((bed) => {
         return bed._id === bedId
      })
      if (bed.quantity > 0) {
         try {
            const res = await axios.post('http://localhost:8001/api/doctor/allotmentbed', { bedDetails, status }, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
               }
            })
            if (res.data.success) {
               message.success(res.data.message)
            }
            else {
               message.error(res.data.success)
            }
         } catch (error) {
            console.log(error)
            message.error('Something went wrong')
         }
      }
      else {
         message.warning("bed is not available")
      }

   };

   return (
      <>
         <Form onFinish={() => handleSubmit(bedDetails.bedId, 'requested')} className='m-3 p-3'>
            <h4>Bed Details:</h4>
            <Row className='my-3' gutter={20}>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Patient ID" required>
                     <Input onChange={handleChange} name='patientId' type='text' placeholder='copy from appointment' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Bed ID" required>
                     <Input onChange={handleChange} name='bedId' type='text' placeholder='copy from inventory below' />
                  </Form.Item>
               </Col>
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
                  <Form.Item label="Patient Name" required>
                     <Input onChange={handleChange} name='patientName' type='text' placeholder='Enter Patient Name' />
                  </Form.Item>
               </Col>

            </Row>
            <div className="d-flex justify-content-center">
               <Button className="btn btn-primary p-1" htmlType="submit">
                  Alot Bed
               </Button>
            </div>
         </Form>
         <div>
            <h2 className='p-3 text-center'>Bed Inventory</h2>

            <Container>
               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>Bed Id</th>
                        <th>Bed Type</th>
                        <th>Quantity</th>
                        <th>Price(per/head)</th>
                     </tr>
                  </thead>
                  <tbody>
                     {beds && beds.length > 0 ? (
                        beds.map((bed) => {
                           return (
                              <tr key={bed._id}>
                                 <td>{bed._id}</td>
                                 <td>{bed.bedType}</td>
                                 <td>{bed.quantity}</td>
                                 <td>{bed.price}</td>
                              </tr>
                           )
                        })
                     ) : (
                        <tr>
                           <td colSpan={5}>
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
      </>
   );
};


export default AllotBed









