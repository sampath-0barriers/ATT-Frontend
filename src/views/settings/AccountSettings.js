import React, { useState } from 'react';
import { Button, Input, Form, FormGroup, Label, Container, Col } from 'reactstrap';
import { notification } from 'antd';

const AccountSettingsComponent = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // handling the password update logic
  const updatePassword = () => {
    if (password.trim() === '' || newPassword.trim() === '' || confirmPassword.trim() === '') {
      notification.error({ message: 'Password Empty', description: 'Password, New Password, and Confirm Password should not be empty!' });
    } else if (newPassword.trim() !== confirmPassword.trim()) {
      notification.error({ message: 'Password Mismatch', description: 'New Password and Confirm Password should match!' });
    } else if (newPassword.trim() === password.trim()) {
      notification.error({ message: 'Password Error', description: 'Password and New Password should be different!' });
    } else {
      const regexp = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*!@#$%]).{8,32}$');
      if (regexp.test(newPassword.trim())) {
        // Call your password update service here
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        notification.success({ message: 'Password Updated', description: 'Password updated successfully!' });
      } else {
        const validations = [
          'At least one digit [0-9].',
          'At least one lowercase character [a-z].',
          'At least one uppercase character [A-Z].',
          'At least one special character [*!@#$%].',
          'At least 8 characters in length, but no more than 32.',
        ];
        notification.error({ message: 'Weak Password', description: validations.join('\n') });
      }
    }
  };

  return (
    <div>
      <Container>
        <Form>
            <Col sm="14">
                <FormGroup row>
                    <Label sm="4" for="txtPassword">Current Password</Label>
                    <Col sm="8">
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          id="txtPassword"
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm="4" for="txtNewPassword">New Password</Label>
                    <Col sm="8">
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          id="txtNewPassword"
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm="4" for="txtConfirmPassword">Confirm Password</Label>
                    <Col sm="8">
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          id="txtConfirmPassword"
                        />
                    </Col>
                </FormGroup>
            </Col>
          <Button color="info" htmlType="submit" onClick={updatePassword}>
            Reset Password
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AccountSettingsComponent;
