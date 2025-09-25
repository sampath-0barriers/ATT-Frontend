import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Button
} from 'reactstrap';
import { Icon } from '@blueprintjs/core';
import NewUser from './NewUser';
import ComponentCard from '../../components/ComponentCard';
import { useAxios } from "../../utils/AxiosProvider";
import { errorNotification } from '../../utils';

const Users = () => {
  // State to control the visibility of the "New User" modal
  const [isNewUserOpen, setNewUserOpen] = useState(false);

  // State to store the list of users
  const [users, setUsers] = useState([]);

  // Pagination state: current page and limit of users displayed per page
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // State for managing total entries and pages for pagination
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // State to show a success message inline after approving a user
  const [successMessage, setSuccessMessage] = useState(null);

  // Axios client for making API requests
  const client = useAxios();

  // Fetch users from the backend whenever `page` or `limit` changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Send a GET request to fetch users with pagination
        const response = await client.get(`/users?page=${page}&limit=${limit}`);
        setUsers(response.data.users); // Set the list of users from the response
        setTotalEntries(response.data.total); // Update total number of entries
        setTotalPages(response.data.totalPages); // Update total number of pages
      } catch (error) {
        const errMsg =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.response?.data ||
          error?.response?.message ||
          'Something went wrong. Please try again later.';
        errorNotification('Error', errMsg);
        console.error('Error fetching Users:', error); // Log error if API call fails
      }
    };

    fetchUsers(); // Trigger the fetch function
  }, [page, limit]);

  // Toggle the "New User" modal
  const toggleNewUser = () => {
    setNewUserOpen(!isNewUserOpen);
  };

  // Open the "New User" modal
  const openNew = () => {
    setNewUserOpen(true);
  };

  // Navigate to the previous page, ensuring it doesn't go below page 1
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Navigate to the next page, ensuring it doesn't exceed total pages
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Change the limit (number of users per page) and reset to the first page
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Handle approval of a user
  const handleApprove = async (userToApprove) => {
    try {
      // Send a PUT request to approve the user
      const userIdToApprove = userToApprove._id;
      await client.put('/user/approve', { userId: userIdToApprove });

      // Update the user status locally (mark them as approved)
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userIdToApprove ? { ...user, approved: true } : user
        )
      );

      // Show a success message and auto-clear it after 3 seconds
      setSuccessMessage(`User ${userToApprove?.username} approved successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error(`Error approving user ${userToApprove?.username}:`, error);
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
      alert(`Failed to approve user ${userToApprove?.username}.`); // Display an error alert
    }
  };

  return (
    <Container className="mt-3">

<Row>
        <Col sm="20" style={{margin: '0px 0px 20px 0px'}}>
      <div className="d-flex justify-content-end">
      <div className='d-flex '>
              <div className='d-flex '>
                {/* Button to open the "New User" modal */}
                <Button className='btn btn-info' onClick={openNew}>
                  <Icon icon='plus' color='white' /> New
                </Button>
                {/* New User modal component */}
                <NewUser isOpen={isNewUserOpen} toggle={toggleNewUser} />
              </div>
            </div>
            </div>
            </Col>
      </Row>
      {/* Header row with the "New User" button */}
      {/* <Row>
        <Col sm="20">
          <ComponentCard>
            
          </ComponentCard>
        </Col>
      </Row> */}

      {/* Main user table */}
      <Row>
        <Col sm="20">
          <ComponentCard title="User Details">
            {/* Success message displayed inline above the table */}
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
            <Table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>IsActive</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className='bordered'>
                {/* Render rows for each user */}
                {users.map((user) => (
                  <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.admin === false ? 'User' : 'Admin'}</td>
                    <td>{user.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      {/* Show "Approved" if already approved; otherwise show an "Approve" button */}
                      {user.approved ? (
                        <span>Approved</span>
                      ) : (
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => handleApprove(user)}
                        >
                          Approve
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination controls */}
            <Row>
              <div className='d-flex align-items-center justify-content-center'>
                {/* Showing the range of entries */}
                <span className='mx-2'>
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
                </span>

                {/* Navigation buttons */}
                <div className='m-2'>
                  <Icon icon="double-chevron-left" className='mx-2' onClick={() => setPage(1)} />
                  <Icon icon="chevron-left" className='mx-2' onClick={handlePreviousPage} />
                  <span className='mx-2'>{page}</span>
                  <Icon icon="chevron-right" className='mx-2' onClick={handleNextPage} />
                  <Icon icon="double-chevron-right" className='mx-2' onClick={() => setPage(totalPages)} />
                </div>

                {/* Dropdown to change the number of users per page */}
                <UncontrolledDropdown>
                  <DropdownToggle caret color="white" className='mx-2'>
                    {limit}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => handleLimitChange(5)}>5</DropdownItem>
                    <DropdownItem onClick={() => handleLimitChange(10)}>10</DropdownItem>
                    <DropdownItem onClick={() => handleLimitChange(25)}>25</DropdownItem>
                    <DropdownItem onClick={() => handleLimitChange(50)}>50</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </Row>
          </ComponentCard>
        </Col>
      </Row>
    </Container>
  );
};

export default Users;
