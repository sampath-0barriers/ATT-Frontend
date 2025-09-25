/**
 * NewProject Component
 * 
 * This component provides a modal interface for creating a new project. 
 * Users can provide a project name, mark it as active, and assign users to the project. 
 * It also handles error states and success states, including showing appropriate messages and refreshing the page on success.
 * 
 * Dependencies:
 * - React (for component state and rendering)
 * - PropTypes (for type checking of props)
 * - Reactstrap (for UI components like Modal, Form, Button, etc.)
 * - Axios (through a custom Axios hook to make HTTP requests)
 * 
 * Key Functionalities:
 * - Fetching user data from the backend to display a list of users that can be added to the project.
 * - Creating a new project by submitting the project name, active status, and selected users to the backend.
 * - Handling errors such as project duplication with appropriate messaging.
 * - Displaying success messages upon successful project creation and refreshing the page.
 * 
 * Props:
 * - `isOpen` (bool): Controls whether the modal is open or not.
 * - `toggle` (function): Function to open/close the modal.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Input, Label, FormGroup, Row, Col, Form, Alert } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';  // For date-related inputs if needed
import { useAxios } from "../../utils/AxiosProvider";  // Custom Axios instance for HTTP requests
import { errorNotification } from '../../utils';

/**
 * The NewProject component allows users to create a new project.
 * @param {bool} isOpen - Determines whether the modal is open.
 * @param {function} toggle - Function to toggle the modal visibility.
 */
const NewProject = ({ isOpen, toggle }) => {
  // State variables
  const [selectAll, setSelectAll] = useState(false);              // State to manage "Select All" checkbox for users
  const [selectedUsers, setSelectedUsers] = useState([]);         // State to store selected users (user IDs)
  const [isActive, setIsActive] = useState(false);                // State for the project's "active" status
  const [users, setUsers] = useState([]);                         // State to hold the list of users fetched from the backend
  const [errorMessage, setErrorMessage] = useState('');           // State for error message display
  const [successMessage, setSuccessMessage] = useState('');       // State for success message display
  const client = useAxios();                                      // Axios instance for making HTTP requests

  // Initial form values (optional for resetting)
  const initialvalues = {
    projectName: ''
  };

  /**
   * handleIsActiveChange - Toggles the "active" status of the project.
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
   * useEffect Hook - Fetches the list of users from the backend API when the component is mounted.
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await client.get('/users');  // Fetching users from the backend
        setUsers(response.data.users);                     // Updating the state with the list of users
      } catch (error) {
        const errMsg =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.response?.data ||
          error?.response?.message ||
          'Something went wrong. Please try again later.';
        errorNotification('Error', errMsg);
        console.error('Error fetching Users:', error);  // Log error in case of failure
      }
    };

    fetchUsers();  // Trigger user fetching on component mount
  }, []);

  /**
   * handleCheckboxChange - Handles the change of the user checkboxes, including "Select All".
   * 
   * @param {event} event - The change event from the checkbox.
   * @param {string} userId - The ID of the user or 'Select All' to toggle all users.
   */
  const handleCheckboxChange = (event, userId) => {
    const { checked } = event.target;
    if (userId === 'Select All') {
      setSelectAll(checked);  // Mark/Unmark "Select All"
      setSelectedUsers(checked ? users.map(user => user._id) : []);  // Select or Deselect all users
    } else {
      // Toggle individual user selection
      const updatedItems = checked
        ? [...selectedUsers, userId]
        : selectedUsers.filter((id) => id !== userId);
      setSelectedUsers(updatedItems);
    }
  };

  /**
   * handleSubmit - Handles the form submission for creating a new project.
   * 
   * @param {event} event - The submit event triggered by the form.
   * 
   * This function gathers form data, sends it to the backend, handles the response, and
   * displays appropriate messages or performs actions (like refreshing the page).
   */
  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent default form submission behavior
    try {
      const formData = new FormData(event.target);  // Gather form data
      const project = {
        name: formData.get('projectName'),          // Get project name
        active: isActive,                           // Get active status
        users: selectedUsers                        // Include selected user IDs
      };

      // Clear any previous error or success messages
      setErrorMessage('');
      setSuccessMessage('');

      // send new project to the backend API
      const response = await client.post('/project', project);
      const projectId = response.data.projectId;
      const newProject = await client.get(`/project?id=${projectId}`);

      // Show success message upon successful project creation
      setSuccessMessage(`Project ${newProject.data.name} created successfully!`);

      // Close the modal and refresh the page after 1.5 seconds
      setTimeout(() => {
        toggle();  // Close the modal
        window.location.reload();  // Refresh the page
      }, 1000);

    } catch (error) {
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered backdrop="static">
      <ModalHeader>New Project Details</ModalHeader>
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

        <Form initialvalues={initialvalues} onSubmit={handleSubmit} >
          <Row>
            <FormGroup className='col-md-5'>
              <Label for="projectName">Project Name</Label>
              <Input type="text" name="projectName" id="projectName" required />
            </FormGroup>
            <Col>
              <FormGroup className="col-md-4">
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
          <Row>
            <Col md="6">
              <Label>Add Users:</Label>
              <Card>
                <CardBody style={{ height: '223px', overflowY: 'auto' }}>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleCheckboxChange(e, 'Select All')}
                      />{' '}
                      All
                    </Label>
                  </FormGroup>
                  {users.map((user) => (
                    <FormGroup check key={user._id}>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={(e) => handleCheckboxChange(e, user._id)}
                        />{' '}
                        {user.username}
                      </Label>
                    </FormGroup>
                  ))}
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Label>Selected:</Label>
              <Card>
                <CardBody style={{ height: '223px', overflowY: 'auto' }}>
                  <div className="selected-items">
                    <ul>
                      {selectedUsers.map((userId) => {
                        const user = users.find(user => user._id === userId);
                        return <li key={userId}>{user?.username}</li>;
                      })}
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ModalFooter>
            <Button color="primary" type='submit' >
              Create Project
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

NewProject.propTypes = {
  isOpen: PropTypes.bool.isRequired,  // Ensure that isOpen is a required boolean
  toggle: PropTypes.func.isRequired,  // Ensure that toggle is a required function
};

export default NewProject;