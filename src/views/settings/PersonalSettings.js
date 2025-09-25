import React from 'react';
import { Button, Row, Col, Label, FormGroup } from 'reactstrap';
import { Formik, Form, Field } from 'formik';

const PersonalSettingsComponent = () => {

    // Define the initial values for the form
    const initialValues = {
        'first-name': '',
        'last-name': '',
        'display-name': '',
        'email': '',
        'time-zone': ''
    };

    // Define the submit handler
    const handleSubmit = (values) => {
        console.log('Form Values:', values);
    };

    return (
        <Row>
            <Col sm="12">
                <Formik
                    initialValues={initialValues} // Add initial values
                    onSubmit={handleSubmit}       // Add submit handler
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col>
                                    <FormGroup controlId="file" className='mb-3'>
                                        <Label>Profile Picture</Label>
                                        <div className="m-0">
                                            <input className="d-none" type="file"/>
                                            <button className="btn btn-info" type="button">
                                                <i className="bi bi-upload"></i> Upload
                                            </button>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="mb-3" controlId="formBasicEmail">
                                        <Label>First Name</Label>
                                        <Field
                                            name="first-name"
                                            type="text"
                                            className='form-control'
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup className='mb-3' controlId="formBasicEmail">
                                        <Label>Last Name</Label>
                                        <Field
                                            name="last-name"
                                            type="text"
                                            className="form-control"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup className='mb-3' controlId="formBasicEmail">
                                        <Label>Display Name</Label>
                                        <Field
                                            name="display-name"
                                            type="text"
                                            className="form-control"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className='mb-3' controlId="formBasicEmail">
                                        <Label>Email</Label>
                                        <Field
                                            name="email"
                                            type="email" // Change type to email for validation
                                            className="form-control"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup className='mb-3' controlId="formGridTime">
                                        <Label>Time Zone</Label>
                                        <Field name="time-zone" as="select" className="form-control">
                                            <option value="">Choose...</option>
                                            {/* Add options here */}
                                            <option value="GMT">GMT</option>
                                            <option value="PST">PST</option>
                                            <option value="CST">CST</option>
                                        </Field>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className='btn btn-info'>
                                        <Button type="submit" color="info" className="btn">
                                            Update
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
            </Col>
        </Row>
    );
};

export default PersonalSettingsComponent;