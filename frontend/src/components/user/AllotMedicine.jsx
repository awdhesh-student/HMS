import React, { useEffect, useState } from 'react';
import { Col, Input, Row, Form, Button, message } from 'antd';
import axios from 'axios';
import { Container, Alert, Table } from 'react-bootstrap';

const AllotMedicine = () => {
  const [patientDetails, setPatientDetails] = useState({
    patientId: '',
    patientName: '',
    symptoms: '',
    medicines: [],
  });

  const [medicines, setMedicines] = useState([]);

  const getMedicinesDetails = async () => {
    try {
      const res = await axios.get('http://localhost:8001/api/doctor/allmedicines', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data.success) {
        setMedicines(res.data.data);
      } else {
        message.error(res.data.success);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    getMedicinesDetails();
  }, []);

  const addInputGroup = () => {
    setPatientDetails({
      ...patientDetails,
      medicines: [...patientDetails.medicines, {}], // Add an empty medicine object
    });
  };

  const removeInputGroup = (index) => {
    const updatedMedicines = [...patientDetails.medicines];
    updatedMedicines.splice(index, 1);
    setPatientDetails({
      ...patientDetails,
      medicines: updatedMedicines,
    });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMedicines = [...patientDetails.medicines];
    updatedMedicines[index] = {
      ...updatedMedicines[index],
      [name]: value,
    };
    setPatientDetails({
      ...patientDetails,
      medicines: updatedMedicines,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:8001/api/doctor/postmedicine', patientDetails, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (res.data.success) {
        message.success(res.data.message)
        getMedicinesDetails()
      }
      else {
        message.error(res.data.message)
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }



  return (
    <>
      <Form onFinish={handleSubmit} className='m-3 p-3'>
        <h4>Patient Prescription:</h4>

        <Row className='' gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Patient ID" required>
              <Input
                onChange={(e) => setPatientDetails({ ...patientDetails, patientId: e.target.value })}
                name="patientId"
                type="text"
                placeholder="copy from appointment"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Patient Name" required>
              <Input
                onChange={(e) => setPatientDetails({ ...patientDetails, patientName: e.target.value })}
                name="patientName"
                type="text"
                placeholder="Enter Patient Name"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Symptoms" required>
              <Input
                onChange={(e) => setPatientDetails({ ...patientDetails, symptoms: e.target.value })}
                name="symptoms"
                type="text"
                placeholder="Enter symptoms"
              />
            </Form.Item>
          </Col>

          <div className="d-flex flex-column">
            <Row className='mb-4'>
              <Col xs={24} md={12} lg={8}>
                <Button onClick={addInputGroup}>➕Add Medicine</Button>
              </Col>
            </Row>
            {patientDetails.medicines.map((medicine, index) => (
              <div key={index}>
                <Row className='' key={index}>
                  <Col className='mx-2' xs={24} md={12} lg={8}>
                    <Form.Item label={`Medicine Id`} required>
                      <Input
                        onChange={(e) => handleChange(e, index)}
                        name='medicineId'
                        type='text'
                        placeholder={`Enter Medicine Id`}
                      />
                    </Form.Item>
                  </Col>
                  <Col className='mx-2' xs={24} md={12} lg={8}>
                    <Form.Item label={`Medicine Name`} required>
                      <Input
                        onChange={(e) => handleChange(e, index)}
                        name='medicineName'
                        type='text'
                        placeholder={`Enter Medicine Name`}
                      />
                    </Form.Item>
                  </Col>
                  <Col className='mx-2' xs={12} md={6} lg={6}>
                    <Form.Item label={`No. of Dose (per day)`} required>
                      <Input
                        onChange={(e) => handleChange(e, index)}
                        name='dose'
                        type='number'
                        placeholder={`Enter Dose`}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col className='mx-2' xs={24} md={12} lg={8}>
                    <Form.Item label={`Remark`}>
                      <Input
                        onChange={(e) => handleChange(e, index)}
                        name='remark'
                        type='text'
                        placeholder={`Enter Remark`}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <span style={{ cursor: 'pointer' }} onClick={() => removeInputGroup(index)}>
                      ❌
                    </span>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Row>
        <div className="d-flex justify-content-center">
          <Button className="btn btn-primary p-1" htmlType="submit">
            Allot Medicines
          </Button>
        </div>
      </Form>

      <div>
        <h2 className='p-3 text-center'>Medicine Inventory</h2>

        <Container>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Medicine ID</th>
                <th>Medicine Name</th>
                <th>Organization Name</th>
                <th>Medicine Quantity</th>
              </tr>
            </thead>
            <tbody>
              {medicines && medicines.length > 0 ? (
                medicines.reverse().map((medicine) => {
                  return (
                    <tr key={medicine._id}>
                      <td>{medicine._id}</td>
                      <td>{medicine.medicineName}</td>
                      <td>{medicine.organizationName}</td>
                      <td>{medicine.medicineQuantity}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>
                    <Alert variant="info">
                      <Alert.Heading>No Medicines to show</Alert.Heading>
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

export default AllotMedicine;
