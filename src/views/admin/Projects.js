/**
 * Projects Component
 *
 * This component is responsible for displaying a list of projects retrieved from the backend.
 * It also provides functionality to add a new project using the `NewProject` modal.
 *
 * Dependencies:
 * - React (for managing state and rendering components)
 * - Reactstrap (for UI components like Container, Row, Col, Table, Button, etc.)
 * - Blueprint.js (for icons using the `@blueprintjs/core` library)
 * - Axios (custom Axios hook for making API requests)
 * - ComponentCard (custom reusable card component for styling sections)
 * - NewProject (custom modal component for adding a new project)
 *
 * Key Functionalities:
 * - Fetching and displaying a list of projects from the backend API.
 * - Opening a modal to create a new project.
 * - Handling state changes such as toggling the `NewProject` modal and managing the project list.
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Button,
} from 'reactstrap';
import { Trash2 } from 'lucide-react';
import { Edit2 } from 'react-feather';
import { Icon } from '@blueprintjs/core'; // For icons
import ComponentCard from '../../components/ComponentCard'; // Custom component for section cards
import NewProject from './NewProject'; // Modal component to create new projects
import EditProject from './EditProject'; //modal component to edit projects
import { useAxios } from '../../utils/AxiosProvider'; // Custom Axios instance
import Confirmation from '../../views/scans/Confirmation'; // Confirmation modal for deleting projects
import { errorNotification } from '../../utils'; // Utility function for error notifications

/**
 * Projects Component
 *
 * This component displays a list of projects and provides a modal interface to create a new project.
 */
const Projects = () => {
  // State variables
  const [isNewProjectOpen, setNewProjectOpen] = useState(false); // Controls the visibility of the NewProject modal
  const [projects, setProjects] = useState([]); // Holds the list of projects retrieved from the backend
  const [page, setPage] = useState(1); // Current page for pagination
  const [limit, setLimit] = useState(5); // Number of projects to display per page
  const [totalEntries, setTotalEntries] = useState(0); // Total number of project entries in the database
  const [totalPages, setTotalPages] = useState(1); // Total number of pages based on the number of entries

  const [isEditProjectOpen, setEditProjectOpen] = useState(false); // state to track whether we are editing project or not
  const [projectToEdit, setProjectToEdit] = useState(null); // state to hold the project we are currently editing

  const [projectToDelete, setProjectToDelete] = useState(null); // state to hold the project we are currently deleting
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // state to track whether we are deleting project or not
  const [deleteLoading, setDeleteLoading] = useState(false); // state to track whether we are currently deleting project or not
  const [deleteError, setDeleteError] = useState(''); // state to hold any error that occurs during project deletion
  const [deleteSuccess, setDeleteSuccess] = useState(false); // state to track whether project deletion was successful or not

  const client = useAxios(); // Axios instance for making HTTP requests

  const fetchProjects = async () => {
    try {
      const response = await client.get(`/projects?page=${page}&limit=${limit}`); // Fetch projects from the backend
      setProjects(response.data.projects); // Set the list of projects
      setTotalEntries(response.data.total); // Set the total number of projects
      setTotalPages(response.data.totalPages); // Set the total number of pages
    } catch (error) {
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
      console.error('Error fetching Projects:', error); // Log any errors during fetching
    }
  };

  /**
   * useEffect Hook - Fetches the list of projects from the backend when the component mounts.
   */

  useEffect(() => {
    fetchProjects(); // Call the function to fetch projects on component mount
  }, [page, limit]);

  /**
   * toggleNewProject - Toggles the visibility of the NewProject modal.
   */
  const toggleNewProject = () => {
    setNewProjectOpen(!isNewProjectOpen); // Toggle the modal open/close state
  };

  /**
   * openNew - Opens the NewProject modal.
   */
  const openNew = () => {
    setNewProjectOpen(true); // Set modal state to open
  };

  /**
   * Handles moving to the previous page, making sure we don't go below page 1.
   */
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1); // Decrement the page
    }
  };

  /**
   * Handles moving to the next page, ensuring we don't exceed the total number of pages.
   */
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1); // Increment the page
    }
  };

  /**
   * Handles changing the number of projects displayed per page (limit).
   * Resets to page 1 when the limit changes.
   * @param {number} newLimit - The new limit (number of users per page).
   */
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit); // Set the new limit
    setPage(1); // Reset to the first page whenever the limit is changed
  };

  /**
   * Toggles the visibility of the edit project modal.
   */
  const toggleEditProject = () => {
    setProjectToEdit(null);  //reset project modifications
    setEditProjectOpen(!isEditProjectOpen);
  };

  // const openEditProject = () => {
  //   setEditProjectOpen(true);
  // };

  /**
   * Handles preparation to edit project, sets up users, isActive, other needed information
   * @param {*} project
   */
  const handleEditProject = async (project) => {
    // get the usernames of user associated with project to pass to edit project modal
    console.log("project in edit", project);
    setProjectToEdit({
      projectName: project.name,
      isActive: project.active,
      selectedUsers: project.users.map(user => user._id),
    });
    setEditProjectOpen(true);
  };

  const openDeleteConfirm = (project) => {
    setProjectToDelete(project);
    setIsDeleteConfirmOpen(true);
    setDeleteError('');
    setDeleteSuccess(false);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setProjectToDelete(null);
    setDeleteError('');
    setDeleteError(false);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) {
      setDeleteError('No project selected');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    try {
      const projectId = projectToDelete._id;
      await client.delete('/project', { data: { projectId: projectId } });

      setDeleteSuccess(true);
      setTimeout(() => {
        closeDeleteConfirm();
        fetchProjects();
      }, 1000);

    } catch (error) {
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
      if (error.response && error.response.status === 404) {
        setDeleteError('Project not found');
      } else {
        setDeleteError('An error occurred while deleting the project');
      }
    }
    finally {
      setDeleteLoading(false);
    }
  };


  return (
    <Container className="mt-3">
      <Row>
        <Col sm="20" style={{margin: '0px 0px 20px 0px'}}>
      <div className="d-flex justify-content-end">
              <div className="d-flex  "> 
                {/* Button to open the NewProject modal */}
                <Button className='btn btn-info' color="success" onClick={openNew}>
                  <Icon icon="plus" color="white" /> New
                </Button>
                {/* NewProject modal component */}
                <NewProject isOpen={isNewProjectOpen} toggle={toggleNewProject} />

                {/*EditProject model component*/}
                {projectToEdit && (
                  <EditProject
                    isOpen={isEditProjectOpen}
                    toggle={toggleEditProject}
                    projectToEdit={projectToEdit}
                  />
                )}
              </div>
            </div>
            </Col>
      </Row>
      {/* Row for the "New Project" button and modal */}
      {/* <Row>
        <Col sm="20">
          <ComponentCard>
           
          </ComponentCard>
        </Col>
      </Row> */}

      {/* Row for displaying the list of projects in a table */}
      <Row>
        <Col sm="20">
          <ComponentCard title="Project Details">
            {/* Table to display the projects */}
            <Table>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Is Active</th>
                  <th>Users</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bordered">
                {/* Map over the list of projects and display each project */}
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>
                      {project.name}
                    </td>
                    <td>{project.active ? "Yes" : "No"}</td>
                    <td>
                      <UncontrolledDropdown>
                        <DropdownToggle caret color="success" className='btn btn-info'>
                          {project.users.length} User{project.users.length > 1 ? "s" : ""}
                        </DropdownToggle>
                        <DropdownMenu>
                          {project.users.map((user) => (
                            <DropdownItem key={user.id}>
                              {user.username}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                    <td>
                      {/*<button onClick={() => handleEditProject(project)}>Edit</button>*/}
                      <Button
                        color="link"
                        className="p-0"
                        onClick={() => handleEditProject(project)}
                        style={{ marginRight: '8px' }}
                      >
                        <Edit2 size={18} className="text-primary" />
                      </Button>

                      <Button
                        color="link"
                        className="p-0"
                        onClick={() => openDeleteConfirm(project)}
                      >
                        <Trash2 size={18} className="text-danger" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Row for pagination controls */}
            <Row>
              <div className="d-flex align-items-center justify-content-center">
                {/* Displaying range of entries based on pagination */}
                <span className="mx-2">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalEntries)} of{' '}
                  {totalEntries} entries
                </span>

                {/* Page navigation controls */}
                <div className="m-2">
                  <Icon icon="double-chevron-left" className="mx-2" onClick={() => setPage(1)} />
                  <Icon icon="chevron-left" className="mx-2" onClick={handlePreviousPage} />
                  <span className="mx-2">{page}</span>
                  <Icon icon="chevron-right" className="mx-2" onClick={handleNextPage} />
                  <Icon
                    icon="double-chevron-right"
                    className="mx-2"
                    onClick={() => setPage(totalPages)}
                  />
                </div>

                {/* Dropdown to select number of entries per page */}
                <UncontrolledDropdown>
                  <DropdownToggle caret color="white" className="mx-2">
                    {limit}
                  </DropdownToggle>
                  <DropdownMenu>
                    {/* Change the number of entries displayed per page */}
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

      {/* Delete Project Confirmation Modal */}
      <Confirmation
        isOpen={isDeleteConfirmOpen}
        toggle={closeDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete project "${projectToDelete?.name}"?`}
        onConfirm={handleDeleteProject}
        confirmText="Delete"
        confirmColor="danger"
        loading={deleteLoading}
        success={deleteSuccess}
        error={deleteError}
        successMessage={`Project "${projectToDelete?.name}" deleted successfully!`}
      />
    </Container>
  );
};

export default Projects;
