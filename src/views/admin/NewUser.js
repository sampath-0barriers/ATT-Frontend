/**
 * NewUser Component
 * 
 * This component provides a modal interface for creating a new user. 
 * It allows administrators to input and submit user details, manage form submission errors, 
 * and display success or failure messages.
 * 
 * Dependencies:
 * - React (for component state and rendering)
 * - PropTypes (for type checking of props)
 * - Reactstrap (for UI components like Modal, Form, Button, etc.)
 * - Axios (through a custom Axios hook for HTTP requests)
 * 
 * Key Functionalities:
 * - Displaying and toggling a modal with user input fields for username, first name, last name, email, role, and active status.
 * - Handling the "isActive" checkbox toggle and managing component state.
 * - Submitting new user data to the backend and handling responses for success or error.
 * - Displaying error messages for failed submissions (e.g., duplicate users) and success messages for successful submissions.
 * 
 * Props:
 * - `isOpen` (bool): Controls whether the modal is open or not.
 * - `toggle` (function): Function to open/close the modal.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  FormGroup,
  Row,
  Col,
  Form,
  Alert
} from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { useAxios } from "../../utils/AxiosProvider";
import { errorNotification } from '../../utils';

/**
 * NewUser - Functional component to render a form inside a modal for creating new users.
 * @param {bool} isOpen - Determines whether the modal is open.
 * @param {function} toggle - Function to toggle the modal visibility.
 */
const NewUser = ({ isOpen, toggle }) => {
  // State management for form fields and messages
  const [isActive, setIsActive] = useState(false);               // Controls "active" status of the new user
  const initialValues = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  };
  const [errorMessage, setErrorMessage] = useState('');          // Holds error messages for form submission
  const [successMessage, setSuccessMessage] = useState('');      // Holds success messages for form submission
  const client = useAxios();                                     // Custom Axios instance for making HTTP requests

  /**
   * handleIsActiveChange - Updates the `isActive` state when checkbox changes.
   * @param {object} event - The change event from the checkbox input.
   */
  const handleIsActiveChange = () => {
    setIsActive(!isActive);  // Toggle the isActive state
  };

  const switchStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const toggleStyles = {
    width: '50px',
    height: '25px',
    borderRadius: '25px',
    backgroundColor: isActive ? '#4caf50' : '#ccc',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const circleStyles = {
    width: '21px',
    height: '21px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: isActive ? '27px' : '2px',
    transition: 'left 0.3s ease',
  };

  const labelStyles = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  };

  /**
   * handleSubmit - Manages form submission to create a new user.
   * Collects form data, constructs a user object, and posts it to the backend.
   * @param {object} event - The submit event triggered by the form.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const newUser = {
        username: formData.get('userName'),
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        email: formData.get('email'),
        role: formData.get('role'),
        is_active: isActive
      };

      // Clear any previous error or success messages
      setErrorMessage('');
      setSuccessMessage('');

      // Send new user to endpoint
      await client.post('/registerClient', newUser);

      // Display success message upon successful user creation
      setSuccessMessage('User registered successfully!');

      // Reset form fields and close the modal after 1.5 seconds
      setTimeout(() => {
        setIsActive(false);
        toggle();
        window.location.reload(); // Refresh page to reflect new user data
      }, 1000);

    } catch (error) {
      console.error('Error submitting User:', error);
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
      setErrorMessage(errMsg);  // Display error message to user
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered backdrop="static">
      <ModalHeader>New User Details</ModalHeader>
      <ModalBody>
        {/* Conditionally render the error banner */}
        {errorMessage && (
          <Alert color="danger">
            {errorMessage}
          </Alert>
        )}

        {/* Conditionally render the success banner */}
        {successMessage && (
          <Alert color="success">
            {successMessage}
          </Alert>
        )}

        {/* User form for inputting user details */}
        <Form initialValues={initialValues} onSubmit={handleSubmit}>
          <Row>
            <FormGroup className='col'>
              <Label for="userName">Username</Label>
              <Input type="text" name="userName" id="userName" required />
            </FormGroup>
            <Col>
              <FormGroup className='col'>
                <Label for="firstName">First Name</Label>
                <Input type="text" name="firstName" id="firstName" required />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className='col'>
                <Label for="lastName">Last Name</Label>
                <Input type="text" name="lastName" id="lastName" required />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup className='col'>
                <Label for="email">Email</Label>
                <Input type="text" name="email" id="email" required />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className='col'>
                <Label for="role">Role</Label>
                <Input type="select" name="role" id="role" required>
                  <option>Client</option>
                  <option disabled>Admin</option>
                </Input>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="col">
                <FormGroup check style={{ marginTop: '2.3rem' }}>
                  <div style={switchStyles}>
                    <div style={toggleStyles} onClick={handleIsActiveChange}>
                      <div style={circleStyles} />
                    </div>
                    <span style={labelStyles}>{isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </FormGroup>
              </FormGroup>
            </Col>
          </Row>
          <ModalFooter>
            <Button color="primary" type='submit'>
              Create User
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

NewUser.propTypes = {
  isOpen: PropTypes.bool.isRequired,  // Prop to control modal open state
  toggle: PropTypes.func.isRequired,  // Function to toggle modal visibility
};

export default NewUser;
