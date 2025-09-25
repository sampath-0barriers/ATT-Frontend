import { React, useState } from 'react';
import { Button, Label, FormGroup, Container, Row, Col, Card, CardBody, Spinner } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
//import LoginLogo from '../../assets/images/bg/login-logo.png'
import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import { errorNotification } from "../../utils";
import { useAxios } from "../../utils/AxiosProvider";
const { storeExpiry } = require('../../utils/LocalStorageEncryption');



const LoginFormik = () => {
  const client = useAxios();
  const [credentials, setCredentials] = useState({});
  const [loading, setLoading] = useState(false);

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      // .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await client.post(
        '/login',
        credentials
      );
      setLoading(false);
      storeExpiry("accessToken", response.data.accessToken, true);
      storeExpiry("refreshToken", response.data.refreshToken, true);
      storeExpiry("user", response.data.user, true);
      window.location.href = "/dashboards/crypto";
    } catch (error) {
      setLoading(false);
      console.log(error);
      const errMsg = error?.response?.data?.error || error?.response?.data || error?.response?.message || "Something went wrong. Please try again later.";
      errorNotification('Error', errMsg);
    }
  };

  return (
    <div className="loginBox" style={{ height: '100vh', overflow: 'hidden' }}>
      <Container fluid className="h-100 login-bg">
        <Row className="justify-content-center align-items-center h-100">
         <Col lg="8" className="d-none d-lg-block">
         </Col>
         <Col lg="4" className="loginContainer">
            <Card>
              <CardBody className="p-4 m-1">
                <h4 className="mb-4 text-center">Login</h4>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleLogin}
                  render={({ errors, touched, handleChange }) => (
                    <Form>
                      <FormGroup>
                        <Label htmlFor="username">Username</Label>
                        <Field
                          name="username"
                          type="text"
                          className={`form-control${errors.username && touched.username ? ' is-invalid' : ''
                            }`}
                          placeholder="Enter Username"
                          onChange={(e) => {
                            handleChange(e);
                            setCredentials({ ...credentials, username: e.target.value });
                          }}
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Field
                          name="password"
                          type="password"
                          className={`form-control${errors.password && touched.password ? ' is-invalid' : ''
                            }`}
                          placeholder="Enter Password"
                          onChange={(e) => {
                            handleChange(e);
                            setCredentials({ ...credentials, password: e.target.value });
                          }}
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                      </FormGroup>
                      <FormGroup className="form-check d-flex" inline>
                        <Link className="ms-auto text-decoration-none" to="/auth/forgotPwd">
                          <small>Forgot Password?</small>
                        </Link>
                      </FormGroup>
                      <FormGroup>
                        <div className='d-grid gap-2'>
                          <Button
                            type='submit'
                            color="primary"
                            className="btn"
                          >
                            {loading ? <Spinner size="sm" /> : null}
                            <span>
                              {' '}Login
                            </span>
                          </Button>
                        </div>
                      </FormGroup>
                    </Form>
                  )}
                />
                <h6 className='text-center fw-normal mb-n2'>Don&apos;t have an account? <Link to="/auth/register">Register</Link></h6>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginFormik;

