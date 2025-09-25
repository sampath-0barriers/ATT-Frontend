import React from 'react';
import { Button, Label, FormGroup, Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import LeftBg from '../../assets/images/left-bg.png';

const RegisterFormik = () => {
  const initialValues = {
    UserName: '',
    email: '',
    contactPhone: '',
    address: '',
    country: '',
    company: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  };

  const validationSchema = Yup.object().shape({
    UserName: Yup.string().required('UserName is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    acceptTerms: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
  });

  return (
    <div className="loginBox">
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="7" className="d-none d-lg-block">
            <LeftBg className="position-absolute left bottom-0" />
          </Col>
          <Col lg="5" xs="12" className="loginContainer">
            <Card style={{ maxWidth: '500px' }}>
              <CardBody className="p-4 m-1">
                <h5 className="mb-0 text-center">Register</h5>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(fields) => {
                    // eslint-disable-next-line no-alert
                    alert(`SUCCESS!! :-)\n\n${JSON.stringify(fields, null, 4)}`);
                  }}
                  render={({ errors, touched }) => (
                    <Form>
                      <FormGroup>
                        <Label htmlFor="firstName">Name</Label>
                        <Field
                          name="UserName"
                          type="text"
                          className={`form-control ${
                            errors.UserName && touched.UserName ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage
                          name="UserName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Field
                          name="email"
                          type="text"
                          className={`form-control${
                            errors.email && touched.email ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Field
                          name="contactPhone"
                          type="text"
                          className={`form-control${
                            errors.contactPhone && touched.contactPhone ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage name="contactPhone" component="div" className="invalid-feedback" />
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="address">Address</Label>
                        <Field
                          name="address"
                          type="text"
                          className={`form-control${
                            errors.address && touched.address ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage name="address" component="div" className="invalid-feedback" />
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="country">Country</Label>
                        <Field
                          name="country"
                          type="text"
                          className={`form-control${
                            errors.country && touched.country ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage name="country" component="div" className="invalid-feedback" />
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="company">Company</Label>
                        <Field
                          name="company"
                          type="text"
                          className={`form-control${
                            errors.company && touched.company ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage name="company" component="div" className="invalid-feedback" />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Field
                          name="password"
                          type="password"
                          className={`form-control${
                            errors.password && touched.password ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Field
                          name="confirmPassword"
                          type="password"
                          className={`form-control${
                            errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : ''
                          }`}
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="invalid-feedback"
                        />
                      </FormGroup>
                      <FormGroup inline className="form-check">
                        <Field
                          type="checkbox"
                          name="acceptTerms"
                          id="acceptTerms"
                          className={`form-check-input ${
                            errors.acceptTerms && touched.acceptTerms ? ' is-invalid' : ''
                          }`}
                        />
                        <Label htmlFor="acceptTerms" className="form-check-label">
                        I agree to the Terms of Service and Privacy Policy
                        </Label>
                        <ErrorMessage
                          name="acceptTerms"
                          component="div"
                          className="invalid-feedback"
                        />
                      </FormGroup>
                      <FormGroup className="d-flex justify-content-center">
                        <Button type="submit" color="info" className="me-2">
                          Register
                        </Button>
                      </FormGroup>
                      <small className="pb-4 d-block text-center">
                        Already have an account? <Link to="/auth/loginformik">Login</Link>
                      </small>
                    </Form>
                  )}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterFormik;
