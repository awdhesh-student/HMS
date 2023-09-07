import React, { useEffect, useState } from 'react';
import { Col, Input, Row, Form, Button, message } from 'antd';

import axios from 'axios';
import { Container, Alert, Table } from 'react-bootstrap';


const Medicine = () => {
   const [medicineDetails, setMedicineDetails] = useState({
      medicineName: '',
      organizationName: '',
      medicineQuantity: '',
   });

   const [selectedMedicineId, setSelectedMedicineId] = useState(null);

   const [mediciness, setMedicines] = useState([])

   const handleChange = (e) => {
      setMedicineDetails({
         ...medicineDetails,
         [e.target.name]: e.target.value,
      });
   };

   const getMedicinesDetails = async () => {
      try {
         const res = await axios.get('http://localhost:8001/api/admin/allmedicines', {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         })
         if (res.data.success) {
            setMedicines(res.data.data)
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
      getMedicinesDetails()
   }, [])

   const handleDelete = async (medicineId) => {
      try {
         const res = await axios.delete(`http://localhost:8001/api/admin/deletemedicine/${medicineId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         })
         if (res.data.success) {
            message.success(res.data.message)
            getMedicinesDetails()
         }
         else {
            message.error(res.data.success)
         }
      } catch (error) {
         console.log(error)
         message.error('Something went wrong')
      }
   }

   const handleUpdate = (medicineId) => {
      const selectedMedicine = mediciness.find((medicineDetails) => medicineDetails._id === medicineId);
      setSelectedMedicineId(medicineId);
      setMedicineDetails(selectedMedicine);
    };

   const handleSubmit = async () => {
      try {
         let res;
         if (selectedMedicineId) {
            // Update existing blood entry
            res = await axios.put(`http://localhost:8001/api/admin/updateMedicine/${selectedMedicineId}`, medicineDetails, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
               }
            });
         } else {
            // Add new blood entry
            res = await axios.post('http://localhost:8001/api/admin/addMedicine', medicineDetails, {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
               }
            });
         }
         if (res.data.success) {
            message.success(res.data.message);
            setSelectedMedicineId(null);
            setMedicineDetails({
               medicineName: '',
               organizationName: '',
               medicineQuantity: '',
            });
            getMedicinesDetails()
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
            <h4>Medicines Details:</h4>
            <Row className='my-3' gutter={20}>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Medicine Name" required>
                     <Input value={medicineDetails.medicineName} onChange={handleChange} name='medicineName' type='text' placeholder='Enter Medicine Name' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Organization Name" required>
                     <Input value={medicineDetails.organizationName} onChange={handleChange} name='organizationName' type='text' placeholder='Enter Organization Name' />
                  </Form.Item>
               </Col>
               <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Medicine Quantity (in packs)" required>
                     <Input value={medicineDetails.medicineQuantity} onChange={handleChange} name='medicineQuantity' type='text' placeholder='Enter Medicine Quantity' />
                  </Form.Item>
               </Col>
               

            </Row>
            <div className="d-flex justify-content-center">
               <Button size='sm' className="btn btn-primary p-1" htmlType="submit">
                  Add Medicine
               </Button>
            </div>
         </Form>

         {/***************table of medicine *******************************/}
         <div>
            <h2 className='p-3 text-center'>Medicine Inventory</h2>

            <Container>
               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>Medicine Name</th>
                        <th>Organization Name</th>
                        <th>Quantity (in packs)</th>
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {mediciness && mediciness.length > 0 ? (
                        mediciness.map((medicine) => {
                           return (
                              <tr key={medicine._id}>
                                 <td>{medicine.medicineName}</td>
                                 <td>{medicine.organizationName}</td>
                                 <td>{medicine.medicineQuantity}</td>
                                 <td>
                                    <Button onClick={() => handleDelete(medicine._id)} className='mx-2' size='sm' danger>
                                       Delete
                                    </Button>

                                    <Button onClick={() => handleUpdate(medicine._id)} className='mx-2' size='sm' primary>
                                       Edit
                                    </Button></td>
                              </tr>
                           )
                        })
                     ) : (
                        <tr>
                           <td colSpan={5}>
                              <Alert variant="info">
                                 <Alert.Heading>No Medicine to show</Alert.Heading>
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


export default Medicine







