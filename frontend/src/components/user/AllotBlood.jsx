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

const AllotBlood = () => {
   const [bloodDetails, setBloodDetails] = useState({
      bloodId: '',
      bloodType: '',
      quantity: '',
      patientId: '',
      patientName: '',
      price: ''
   });

   const [bloods, setBloods] = useState([])

   const handleBloodTypeSelect = (type) => {
      setBloodDetails({
         ...bloodDetails,
         bloodType: type,
      });
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      let calculatedPrice = 0;

      // Assuming bloods is an array containing blood details from the inventory
      const blood = bloods.find((item) => item._id === bloodDetails.bloodId);

      if (name === 'quantity' && blood) {
         const quantity = parseFloat(value);
         calculatedPrice = quantity * blood.price;
      }

      setBloodDetails({
         ...bloodDetails,
         [name]: value,
         price: calculatedPrice, // Assuming you want to display the price with two decimal places
      });
   };


   const getBloodDetails = async () => {
      try {
         const res = await axios.get('http://localhost:8001/api/user/allblood', {
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

   useEffect(() => {
      getBloodDetails()
   }, [])



   const handleSubmit = async (bloodId, bloodQuantity, status) => {
      console.log(bloodId, bloodQuantity, status)
      let blood = bloods.find((blood) => {
         return blood._id === bloodId
      })
      if (bloodQuantity > blood.quantity) {
         message.warning("Your quantity is greater than present in inventory")
      }
      else {
         try {
            const res = await axios.post('http://localhost:8001/api/doctor/allotmentblood', { bloodDetails, status }, {
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

   };

   return (
      <>
         <Form onFinish={() => handleSubmit(bloodDetails.bloodId, bloodDetails.quantity, 'requested')} className='m-3 p-3'>
            <h4>Blood Details:</h4>
            <Row className='my-3' gutter={20}>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Blood ID" required>
                     <Input onChange={handleChange} name='bloodId' type='text' placeholder='copy from inventory below' />
                  </Form.Item>
               </Col>
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
               <Col xs={12} md={6} lg={6}>
                  <Form.Item label="Blood Quantity (in ml)" required>
                     <Input onChange={handleChange} name='quantity' type='text' placeholder='Enter quantity' />
                  </Form.Item>
               </Col>
               <Col xs={12} md={6} lg={6}>
                  <Form.Item label="Blood Price (per ml)" required>
                     <Input
                        onChange={handleChange}
                        name="price"
                        type="number"
                        placeholder="Enter quantity"
                        value={bloodDetails.price}
                        readOnly
                     />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Patient ID" required>
                     <Input onChange={handleChange} name='patientId' type='text' placeholder='copy from appointment' />
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
                  Allot Blood
               </Button>
            </div>
         </Form>

         {/***************table of Blood *******************************/}
         <div>
            <h2 className='p-3 text-center'>Blood Inventory</h2>

            <Container>
               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>Blood Id</th>
                        <th>Blood Type</th>
                        <th>Price (per ml)</th>
                        <th>Quantity (in ml)</th>
                     </tr>
                  </thead>
                  <tbody>
                     {bloods && bloods.length > 0 ? (
                        bloods.map((blood) => {
                           return (
                              <tr key={blood._id}>
                                 <td>{blood._id}</td>
                                 <td>{blood.bloodType}</td>
                                 <td>{blood.price}</td>
                                 <td>{blood.quantity}</td>
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
      </>
   );
};


export default AllotBlood








