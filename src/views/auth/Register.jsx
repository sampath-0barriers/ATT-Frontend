import { useState } from "react";
import { Form, Button, Input, Checkbox, Progress } from "antd";
import { Container } from 'reactstrap';
import { Link, useNavigate } from "react-router-dom";
import {
  isValidBusinessEmail,
  successNotification,
  errorNotification
} from "../../utils";
import CountrySelect from "./CountrySelect";
import { ReactComponent as LeftBg } from '../../assets/images/bg/login-bgleft.svg';
import { ReactComponent as RightBg } from '../../assets/images/bg/login-bg-right.svg';
import { useAxios } from "../../utils/AxiosProvider";

const RequiredLabel = ({ children }) => (
  <span>
    {children}
    <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>
  </span>
);

export default function Register() {
  const client = useAxios();
  const [registerUserInput, setRegisterUserInput] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
  const navigate = useNavigate();

  const passwordRequirements = [
    { regex: /[0-9]/, message: 'At least one digit [0-9]' },
    { regex: /[a-z]/, message: 'At least one lowercase character [a-z]' },
    { regex: /[A-Z]/, message: 'At least one uppercase character [A-Z]' },
    { regex: /[*!@#$%]/, message: 'At least one special character [*!@#$%]' },
    { regex: /^.{8,32}$/, message: 'Between 8 and 32 characters' },
  ];

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordValidations, setPasswordValidations] = useState(
    passwordRequirements.map(() => false)
  );
  
  const evaluatePasswordStrength = (password) => {
    const validations = passwordRequirements.map((req) => req.regex.test(password));
    setPasswordValidations(validations);
    setPasswordStrength(validations.filter((isValid) => isValid).length * 20);
  };  

  const handleRegisterUserInputChange = (changedValues) =>{
    console.log({changedValues})
    setRegisterUserInput({ ...registerUserInput, ...changedValues });
}
  const handleRegister = () => {
    if (!isPrivacyPolicyChecked) {
      errorNotification("Error", "Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }
    if (registerUserInput?.password !== registerUserInput?.confirmPassword) {
      errorNotification("Error", "Passwords do not match.");
      return;
    }
    if (passwordValidations.some((isValid) => !isValid)) {
      errorNotification("Error", "Password does not meet the required criteria.");
      return;
    }
  
    const { confirmPassword, ...registerUserInputData } = registerUserInput;
    setLoading(true);
    const payload = { ...registerUserInputData };
    if (registerUserInputData?.country_code) {
      payload.country_code = registerUserInputData.country_code.label;
    }
    client.post(
      '/register', payload
    ).then(() => {
      setLoading(false);
      successNotification("Registration Successful. Redirecting to login.");
      navigate("/auth/login");
    }).catch((err) => {
      setLoading(false);
      if (err.response) {
        errorNotification("Error", err.response.data);
      } else {
        errorNotification("Error", "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="loginBox">
      {/* <LeftBg className="position-absolute left bottom-0" />
      <RightBg className="position-absolute end-0 top" /> */}
      <Container  fluid className="h-100 login-bg">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-md-8 d-none d-lg-block"></div>
          <div className="col-md-4 mx-auto px-4">
            <div className="bg-white shadow rounded" style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {/* Header - Fixed */}
              <div className="px-4 pt-4 border-bottom">
                <h4 className="text-center mb-3">Register</h4>
              </div>

              {/* Form - Scrollable */}
              <div style={{ overflowY: 'auto', padding: '0 24px' }}>
                <Form
                  name="register"
                  layout="vertical"
                  initialValues={{ remember: true }}
                  autoComplete="off"
                  onValuesChange={handleRegisterUserInputChange}
                  requiredMark={false}
                >
                  <Form.Item
                    name="first_name"
                    label={<RequiredLabel>First Name</RequiredLabel>}
                    rules={[{ required: true, message: 'Please enter your first name' }]}
                  >
                    <Input
                      required
                      placeholder="Enter your first name"
                      maxLength={50}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="last_name"
                    label={<RequiredLabel>Last Name</RequiredLabel>}
                    rules={[{ required: true, message: 'Please enter your last name' }]}
                  >
                    <Input
                      required
                      placeholder="Enter your last name"
                      maxLength={50}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="username"
                    label={<RequiredLabel>Username</RequiredLabel>}
                    rules={[{ required: true, message: 'Please enter your username' }]}
                  >
                    <Input
                      required
                      placeholder="Enter your username"
                      maxLength={50}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<RequiredLabel>Email</RequiredLabel>}
                    name="email"
                    hasFeedback
                    rules={[
                      {
                        validator: async (_, email) => {
                          if (!isValidBusinessEmail(email)) {
                            throw new Error("Please enter a valid business email");
                          }
                        }
                      }
                    ]}
                  >
                    <Input
                      required
                      placeholder="Corporate email"
                      maxLength={50}
                    />
                  </Form.Item>

                  <Form.Item name="country_code" label="Country Code">
                    <CountrySelect
                      value={selectedCountryCode}
                      onChange={(value) => setSelectedCountryCode(value)}
                    />
                  </Form.Item>
                  
                  <Form.Item name="phone" label="Contact Phone">
                    <Input
                      type="tel"
                      required
                      placeholder="Enter your contact phone"
                      maxLength={20}
                    />
                  </Form.Item>
                  
                  <Form.Item name="company" label="Company">
                    <Input required placeholder="Enter your company" maxLength={50} />
                  </Form.Item>
                  
                  <Form.Item
                    name="password"
                    label={<RequiredLabel>Password</RequiredLabel>}
                    rules={[{ required: true, message: 'Please enter your password' }]}
                  >
                    <Input.Password
                      required
                      placeholder="Please choose a strong password"
                      maxLength={50}
                      onChange={(e) => evaluatePasswordStrength(e.target.value)}
                    />
                  </Form.Item>

                  <div style={{ marginBottom: '10px' }}>
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        style={{
                          color: passwordValidations[index] ? 'green' : 'red',
                          fontSize: '0.9em',
                        }}
                      >
                        {req.message}
                      </div>
                    ))}
                  </div>

                  <Progress percent={passwordStrength} showInfo={false} status={passwordStrength >= 100 ? 'success' : 'active'} />
                  
                  <Form.Item
                    name="confirmPassword"
                    label={<RequiredLabel>Confirm Password</RequiredLabel>}
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        validator: async (_, confirmPassword) => {
                          if (confirmPassword !== registerUserInput?.password) {
                            throw new Error("Passwords do not match");
                          }
                        }
                      }
                    ]}
                  >
                    <Input.Password
                      required
                      placeholder="Confirm your password"
                      maxLength={50}
                    />
                  </Form.Item>
                </Form>
              </div>

              {/* Footer - Fixed */}
              <div className="px-4 py-3 border-top bg-light">
                <Form.Item
                  className="text-center mb-2"
                  valuePropName="checked"
                  rules={[{ required: true, message: 'Please agree to the terms' }]}
                >
                  <Checkbox
                    required
                    checked={isPrivacyPolicyChecked}
                    onChange={(e) => setIsPrivacyPolicyChecked(e.target.checked)}
                  >
                    <RequiredLabel>I agree to the <a href="/terms">Terms of Service</a> and{" "}
                    <a href="/privacy">Privacy Policy</a></RequiredLabel>
                  </Checkbox>
                </Form.Item>
                
                <Form.Item className="text-center mb-2">
                  <Button type="primary" htmlType="submit" loading={loading} onClick={handleRegister}>
                    Register
                  </Button>
                </Form.Item>

                <Form.Item className="text-center mb-0">
                  Already have an account? <Link to="/auth/login">Login</Link>
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
