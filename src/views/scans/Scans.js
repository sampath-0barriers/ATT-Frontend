import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Form,
  Input,
  Container,
  Row,
  Col,
  Table,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Button,
  ButtonToolbar,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';
import { Icon } from '@blueprintjs/core';
import { Trash2, Play, CalendarClock, FileText } from 'lucide-react';
import NewScan from './NewScan';
import RunScan from './RunScan';
import ScheduleScan from './ScheduleScan';
import ComponentCard from '../../components/ComponentCard';
import DeleteScan from './DeleteScan';
import { useAxios } from '../../utils/AxiosProvider';
import ScanResults from './ScanResults';
import formatTimestamp from '../../utils/DateTimeConverter';
import Confirmation from './Confirmation';
import Schedule from './Schedule';
import { errorNotification } from '../../utils';
import sound from '../../sounds/kick-bass.mp3';

// import { Row, Col, Table, Pagination, PaginationItem, PaginationLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Button } from 'reactstrap';
// import { Play, CalendarClock, Trash2, FileText } from 'lucide-react';

/**
 * Scans Component
 *
 * This component is responsible for managing and displaying scan details, projects, and various modals for creating, running, scheduling, and deleting scans.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <Scans />
 *
 * @description
 * The Scans component fetches projects and scan details from the server and displays them in a table. It also provides functionalities to create, run, schedule, and delete scans through modals.
 *
 * @state {boolean} isNewScanOpen - Controls the visibility of the new scan modal.
 * @state {boolean} isScheduleScanOpen - Controls the visibility of the schedule scan modal.
 * @state {boolean} isRunScanOpen - Controls the visibility of the run scan modal.
 * @state {boolean} isDeleteScanOpen - Controls the visibility of the delete scan modal.
 * @state {boolean} isScanResultsModalOpen - Controls the visibility of the scan results modal.
 * @state {string} clickedScanStatus - Stores the scan status of the clicked scan to show its results.
 * @state {Array} scanDetails - Stores the list of scan details fetched from the server.
 * @state {Array} scanResults - Stores the results of a particular scan.
 * @state {Array} projects - Stores the list of projects fetched from the server.
 * @state {Object|null} selectedProject - Stores the currently selected project.
 * @state {Object|null} selectedScan - Tracks the scan that is selected via a checkbox.
 *
 * @function fetchProjects - Fetches projects from the server and updates the projects state.
 * @function fetchScanDetails - Fetches scan details from the server and updates the scanDetails state.
 * @function fetchScanResults - Fetches scan results for a particular scanId and updates the scanResults state.
 * @function handleRefresh - Refreshes the scan details by calling fetchScanDetails.
 * @function toggleNewScan - Toggles the visibility of the new scan modal.
 * @function openNew - Opens the new scan modal.
 * @function toggleRunScan - Toggles the visibility of the run scan modal.
 * @function openRun - Opens the run scan modal.
 * @function toggleScheduleScan - Toggles the visibility of the schedule scan modal.
 * @function openSchedule - Opens the schedule scan modal.
 * @function ToggleDeleteScan - Toggles the visibility of the delete scan modal.
 * @function openDelete - Opens the delete scan modal.
 * @function toggleScanResults - Toggles the visibility of the scan results modal.
 * @function openScanResults - Fetches and displays the results for the selected scan.
 * @function handleProjectChange - Handles the project change and updates the selectedProject state.
 * @function handleCheckboxChange - Handles the checkbox change for selecting a scan and updates the selectedScan state.
 *
 * @dependencies
 * - useAxios: Custom hook for making HTTP requests.
 * - useEffect: React hook for performing side effects.
 * - useState: React hook for managing state.
 * - Container, Row, Col, Button, ButtonToolbar, Form, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Table, UncontrolledCollapse: Various components from a UI library.
 * - ComponentCard: Custom component for displaying a card.
 * - Icon: Custom component for displaying icons.
 * - NewScan, RunScan, ScheduleScan, DeleteScan: Custom components for displaying respective modals.
 */
const Scans = () => {
  const isSoundOn = useSelector((state) => state.customizer.isSoundOn);

  const [isNewScanOpen, setNewScanOpen] = useState(false); // control the visibility of creating new scan
  const [isScheduleScanOpen, setScheduleScanOpen] = useState(false); // control the visibility of scheduling a scan
  const [isRunScanOpen, setRunScanOpen] = useState(false); // control the visibility of running a scan
  const [isDeleteScanOpen, setDeleteScanOpen] = useState(false); // control the visibility of deleting a scan

  const [scanDetails, setScanDetails] = useState([]); // stores the list of scan details
  const [scanResults, setScanResults] = useState([]); // stores the results of a particular scan
  const [projects, setProjects] = useState([]); // stores list of projects fetched from the server
  const [selectedProject, setSelectedProject] = useState(null); // stores the currently selected project
  const [selectedScans, setSelectedScans] = useState([]); // tracks the scan that is selected via a checkbox

  // Filtering and pagination
  const [searchTerm, setSearchTerm] = useState(''); // stores the search term in the search bar
  const [currentPage, setCurrentPage] = useState(1); // current page
  const [itemsPerPage, setItemsPerPage] = useState(10); // items per page

  // tracks the visibility of the scan details
  const [isScanResultsOpen, setIsScanResultsOpen] = useState(false);

  // stores the scan status of the clicked scan (to show its results)
  const [clickedScanStatus, setClickedScanStatus] = useState('');

  const [scanInRow, setScanInRow] = useState(null);

  // States for individual scan actions
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const [isRunConfirmOpen, setIsRunConfirmOpen] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [runError, setRunError] = useState('');
  const [runSuccess, setRunSuccess] = useState(false);

  const [isScheduleConfirmOpen, setIsScheduleConfirmOpen] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // sound
  var sounds = new Audio(sound);
  const client = useAxios();

  // filter the scan details based on the search term
  const filteredScans = scanDetails.filter(
    (scan) => scan.name && scan.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // slice the filteredScans array based on the current page and items per page and calculate total pages
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPageScans = filteredScans.slice(indexOfFirstItem, indexOfLastItem);
  console.log({ currentPageScans });
  // const [guidances , setGuidances] = useState([])
  const playSound = () => {
    if (isSoundOn) sounds.play();
  };
  useEffect(() => { }, []);
  const printGuidance = (item) => {
    console.log('call to ho raha h');
    // item contains the guidance array
    // if item is array then join with comma
    // else return item
    if (Array.isArray(item)) {
      return item.join(', ');
    }
    return item;
  };
  // const x = currentPageScans.map((scan) => {
  // console.log(scan.guidance)
  // {
  // scan.guidance.slice(',').map((item) => {
  // console.log(item)
  // })
  // }
  // })
  const totalPages = Math.ceil(filteredScans.length / itemsPerPage);

  const itemsPerPageArray = [10, 25, 50, 100]; // items per page options

  // fetch projects from the server
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await client.get('/projects');
        setProjects(response.data.projects);
      } catch (error) {
        console.error('Error fetching Projects:', error);
        const errMsg =
          error?.response?.data?.error ||
          error?.response?.data ||
          error?.response?.message ||
          'Something went wrong. Please try again later.';
        errorNotification('Error', errMsg);
      }
    };

    fetchProjects();
  }, []);

  // fetch scan details from the server
  const fetchScanDetails = async () => {
    try {
      let url = '/scan_request';
      if (selectedProject) {
        url += `?projectID=${selectedProject._id}`;
      }
      const response = await client.get(url); // replace with actual endpoint
      setScanDetails(response.data.reverse());
      return response;
    } catch (error) {
      console.error('Error fetching Scan Details:', error);
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
    }
  };

  // get scan details to populate the rows
  useEffect(() => {
    fetchScanDetails();
  }, [selectedProject]);

  // fetch scan results for a particular scanId
  const fetchScanResults = async (scanRequestId) => {
    try {
      const response = await client.get(`/scan/?scanRequestId=${scanRequestId}`);
      setScanResults(response.data);
    } catch (error) {
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
      console.error('Error fetching Scan Results:', error);
    }
  };

  // run all scans in the project
  // disable it for performance reasons as it will run all scans in the project
  // const runAllScans = async () => {
  //   playSound();
  //   try {
  //     const response = await fetchScanDetails();
  //     const scanIds = response.data.map((scan) => scan._id);
  //     console.log(response.data.map((scan) => scan.name));
  //     runNotification();
  //     await client.post('/run-scan', { scanRequestIdList: scanIds }); // Beware when running this, it will run all scans in the project
  //   } catch (error) {
  //     console.error('Error running all scans:', error);
  //     const errMsg =
  //       error?.response?.data?.error ||
  //       error?.response?.data ||
  //       error?.response?.message ||
  //       'Something went wrong. Please try again later.';
  //     errorNotification('Error', errMsg);
  //   }
  // };
  // refresh the scan details
  const handleRefresh = () => {
    fetchScanDetails();
    playSound();
  };

  // toggle the visibility of the new scan modal
  const toggleNewScan = () => {
    setNewScanOpen(!isNewScanOpen);
  };

  // open the new scan modal
  const openNew = () => {
    setNewScanOpen(true);
    playSound();
  };

  // toggle the visibility of the run scan modal
  const toggleRunScan = () => {
    setRunScanOpen(!isRunScanOpen);
  };

  // open the run scan modal
  const openRun = () => {
    setRunScanOpen(true);
  };

  // toggle the visibility of the schedule scan modal
  const toggleScheduleScan = () => {
    setScheduleScanOpen(!isScheduleScanOpen);
  };

  // open the schedule scan modal
  const openSchedule = () => {
    setScheduleScanOpen(true);
  };

  // toggle the visibility of the delete scan modal
  const ToggleDeleteScan = () => {
    setDeleteScanOpen(!isDeleteScanOpen);
  };

  // open the delete scan modal
  const openDelete = () => {
    setDeleteScanOpen(true);
  };

  // open the scan details modal
  const toggleScanResults = () => {
    setIsScanResultsOpen(!isScanResultsOpen);
  };

  const openScanResults = async (scanId) => {
    await fetchScanResults(scanId);
    toggleScanResults(); // Open the active scan modal
  };

  // handle project change
  const handleProjectChange = async (project) => {
    setSelectedProject(project);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const handleCheckboxChange = (event, scan) => {
    const checked = event.target.checked;
    const updatedScans = checked
      ? [...selectedScans, scan]
      : selectedScans.filter((item) => item.name !== scan.name);
    setSelectedScans(updatedScans);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const getPaginationItems = (currentPage, totalPages) => {
    const paginationItems = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        // currentPage is near the start
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + 2 >= totalPages) {
        // currentPage is near the end
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // currentPage is in the middle
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    if (startPage > 2) {
      paginationItems.push(1);
      paginationItems.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(i);
    }
    if (endPage < totalPages - 1) {
      paginationItems.push('...');
      paginationItems.push(totalPages);
    }

    return paginationItems;
  };

  const openDeleteConfirm = (scan) => {
    setScanInRow(scan);
    setIsDeleteConfirmOpen(true);
    setDeleteError('');
    setDeleteSuccess(false);
  };

  const closeDeleteConfirm = () => {
    setScanInRow(null);
    setIsDeleteConfirmOpen(false);
    setDeleteError('');
    setDeleteSuccess(false);
  };

  const handleDirectDelete = async () => {
    if (!scanInRow) return;

    setDeleteLoading(true);
    setDeleteError('');

    try {
      const scanRequestIds = [scanInRow._id];
      await client.delete('/scan/delete-multiple-scans', { data: { scanRequestIds } });

      setDeleteSuccess(true);
      setTimeout(() => {
        closeDeleteConfirm();
        fetchScanDetails(); // Refresh the scan list
      }, 1000);
    } catch (error) {
      if (error.response?.status === 404) {
        setDeleteError('Scan not found.');
      } else if (error.response?.status === 400) {
        setDeleteError('Invalid scan ID. Please try again.');
      } else {
        setDeleteError('Error deleting scan. Please try again later.');
        const errMsg =
          error?.response?.data?.error ||
          error?.response?.data ||
          error?.response?.message ||
          'Something went wrong. Please try again later.';
        errorNotification('Error', errMsg);
      }
      console.error('Error deleting scan:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openRunConfirm = (scan) => {
    setScanInRow(scan);
    setIsRunConfirmOpen(true);
    setRunError('');
    setRunSuccess(false);
  };

  const closeRunConfirm = () => {
    setScanInRow(null);
    setIsRunConfirmOpen(false);
    setRunError('');
    setRunSuccess(false);
  };

  const handleDirectRun = async () => {
    if (!scanInRow) return;

    setRunLoading(true);
    setRunError('');

    try {
      const scans = {
        scanRequestIdList: [scanInRow._id],
      };

      await client.post('/run-scan', scans);
      setRunSuccess(true);

      setTimeout(() => {
        closeRunConfirm();
        fetchScanDetails();
      }, 1000);
    } catch (error) {
      if (error.response?.status === 404) {
        setRunError('Scan not found.');
      } else if (error.response?.status === 400) {
        setRunError('Invalid scan ID. Please try again.');
      } else {
        setRunError('Error running scan. Please try again later.');
      }
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
      console.error('Error running scan:', error);
    } finally {
      setRunLoading(false);
    }
  };

  const openScheduleConfirm = (scan) => {
    setScanInRow(scan);
    setSelectedDate(new Date());
    setIsScheduleConfirmOpen(true);
    setScheduleError('');
    setScheduleSuccess(false);
  };

  const closeScheduleConfirm = () => {
    setScanInRow(null);
    setIsScheduleConfirmOpen(false);
    setScheduleError('');
    setScheduleSuccess(false);
  };

  const handleDirectSchedule = async (date) => {
    if (!scanInRow) return;

    setScheduleLoading(true);
    setScheduleError('');

    try {
      const scans = {
        scanRequestIdList: [scanInRow._id],
        scheduledTime: selectedDate,
      };

      await client.post('/schedule-scan', scans);
      setScheduleSuccess(true);

      setTimeout(() => {
        closeScheduleConfirm();
        fetchScanDetails();
      }, 1000);
    } catch (error) {
      setScheduleError('Error scheduling scan. Please try again later.');
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
      console.error('Error scheduling scan:', error);
    } finally {
      setScheduleLoading(false);
    }
  };

  return (
    <Container >
      <Row>
        <Col sm="20">
          <ComponentCard style={{ paddingTop: '0px!important', paddingBottom: '0px!important' }}>
            <div className="" >
              <div className='row' >
            <div className="col-md-3">
              <div className='d-flex justify-content-start'>
              <div className="d-flex align-items-center">
                <h4 style={{ marginRight: '10px' }}>Project</h4>
                <UncontrolledDropdown>
                  <DropdownToggle caret color="white" >
                    {selectedProject ? selectedProject.name : 'All Projects'}
                  </DropdownToggle>
                  <DropdownMenu>
                    {/* eslint-disable no-underscore-dangle */}
                    {
                      <DropdownItem onClick={() => handleProjectChange(null)}>
                        All Projects
                      </DropdownItem>
                    }
                    {projects.map((project) => (
                      <DropdownItem key={project._id} onClick={() => handleProjectChange(project)}>
                        {/* eslint-enable no-underscore-dangle */}
                        {project.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
              </div>
            </div>

              <div className="col-md-9">
                <div className='d-flex justify-content-end'>
              <ButtonToolbar>
                  <Form className="m-1">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <Icon icon="search" />
                        </span>
                      </div>
                      <Input
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search..."
                      />
                    </div>
                  </Form>
                  <Button color="info" onClick={openNew} className="text-center m-1">
                    <Icon icon="plus" color="white" /> New
                  </Button>
                  <NewScan
                    isOpen={isNewScanOpen}
                    toggle={toggleNewScan}
                    fetchScanDetails={fetchScanDetails}
                  />
                  <UncontrolledDropdown className="text-center m-1">
                    <DropdownToggle caret color="info" onClick={playSound}>
                      Select Action
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={openRun}>Run Scan</DropdownItem>
                      <DropdownItem onClick={openSchedule}>Schedule Scan</DropdownItem>
                      <DropdownItem onClick={openDelete}>Delete Scan</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <RunScan
                    isOpen={isRunScanOpen}
                    toggle={toggleRunScan}
                    selectedScans={selectedScans}
                    fetchScanDetails={fetchScanDetails}
                  />
                  <ScheduleScan
                    isOpen={isScheduleScanOpen}
                    toggle={toggleScheduleScan}
                    selectedScans={selectedScans}
                    fetchScanDetails={fetchScanDetails}
                  />
                  <DeleteScan
                    isOpen={isDeleteScanOpen}
                    toggle={ToggleDeleteScan}
                    selectedScans={selectedScans}
                  />
                  <Button color="info" onClick={handleRefresh} className="text-center m-1">
                    <Icon icon="refresh" color="white" /> Refresh
                  </Button>
                </ButtonToolbar>
                </div>
              </div>
             </div>
              <div>
              
              </div>
            </div>
          </ComponentCard>
        </Col>
      </Row>
      <Row>
  <Col sm="12">
    <ComponentCard title="Scan Details">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '50vh',
          overflow: 'hidden',
        }}
      >
        <div className="data-table-view">
          <Table bordered hover size="sm" className='data-table-table'>
            <thead>
              <tr>
                <th style={{ width: '3%' }}></th>
                <th style={{ width: '10%' }}>Name</th>
                <th style={{ width: '18%' }}>URL</th>
                <th style={{ width: '7%' }}>Depth</th>
                <th style={{ width: '10%' }}>Guidances</th>
                <th style={{ width: '10%' }}>Score</th>
                <th style={{ width: '12%' }}>Last Run</th>
                <th style={{ width: '10%' }}>Scheduled</th>
                <th style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>

            <tbody className="bordered">
              <ScanResults
                isOpen={isScanResultsOpen}
                toggle={toggleScanResults}
                scanResults={scanResults}
                scanStatus={clickedScanStatus}
              />

              {currentPageScans.map((scan, index) => (
                <tr key={scan.id}>
                  <td>
                    <Input type="checkbox" onChange={(e) => handleCheckboxChange(e, scan)} />
                  </td>
                  <td>{scan.name ?? '-'}</td>
                  <td>{scan.url ?? '-'}</td>
                  <td>{scan.depth ?? '-'}</td>
                  <td>{scan.guidance ? printGuidance(scan.guidance) : '-'}</td>
                  <td>{scan?.weighted_score ? scan.weighted_score.toString() : '-'}</td>
                  <td>{scan?.date_last_ran ? formatTimestamp(scan.date_last_ran) : '-'}</td>
                  <td>{scan?.scheduled_time ? formatTimestamp(scan.scheduled_time) : '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Button color="link" className="p-0" onClick={() => openRunConfirm(scan)}>
                      <Play size={18} className="text-primary" />
                    </Button>
                    <Button color="link" className="p-0" onClick={() => openScheduleConfirm(scan)}>
                      <CalendarClock size={18} className="text-primary" />
                    </Button>
                    <Button color="link" className="p-0" onClick={() => openDeleteConfirm(scan)}>
                      <Trash2 size={18} className="text-danger" />
                    </Button>
                    <Button
                      color="link"
                      id={`chevron${index}`}
                      onClick={() => {
                        openScanResults(scan._id);
                        setClickedScanStatus(scan.status);
                      }}
                      title="Result"
                    >
                      <FileText size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Pagination controls */}
        <Row>
          <div className="d-flex align-items-center justify-content-center flex-wrap">
            <span className="mx-2">
              Showing {Math.min(indexOfFirstItem + 1, filteredScans.length)} to{' '}
              {Math.min(indexOfLastItem, filteredScans.length)} of {filteredScans.length} entries
            </span>

            <Pagination aria-label="Page navigation" className="m-1">
              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink first onClick={() => handlePageChange(1)} />
              </PaginationItem>

              <PaginationItem disabled={currentPage === 1}>
                <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
              </PaginationItem>

              {getPaginationItems(currentPage, totalPages).map((item, index) => (
                <PaginationItem key={index} active={item === currentPage} disabled={item === '...'}>
                  {item === '...' ? (
                    <PaginationLink disabled>{item}</PaginationLink>
                  ) : (
                    <PaginationLink onClick={() => handlePageChange(item)}>{item}</PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
              </PaginationItem>

              <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink last onClick={() => handlePageChange(totalPages)} />
              </PaginationItem>
            </Pagination>

            <UncontrolledDropdown>
              <DropdownToggle caret color="white" className="mx-2">
                {itemsPerPage}
              </DropdownToggle>
              <DropdownMenu>
                {itemsPerPageArray.map((numItems) => (
                  <DropdownItem key={numItems} onClick={() => handleItemsPerPageChange(numItems)}>
                    {numItems}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </Row>
      </div>
    </ComponentCard>
  </Col>
</Row>

{/* 
<container>
<div style={{ overflowX: 'auto' }}>
          <Table bordered hover responsive className="text-nowrap">
            <thead>
              <tr>
                <th></th>
                <th>Scan Name</th>
                <th>Base URL</th>
                <th>Depth</th>
                <th>Guidances</th>
                <th>Weighted Score</th>
                <th>Last Scan Run</th>
                <th>Next Scheduled On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageScans.map((scan, index) => (
                <tr key={index}>
                  <td>
                    <Input type="checkbox" />
                  </td>
                  <td>{scan.name}</td>
                  <td>{scan.url}</td>
                  <td>{scan.depth}</td>
                  <td>{scan.guidance}</td>
                  <td>{scan.weighted_score}</td>
                  <td>{scan.date_last_ran}</td>
                  <td>{scan.scheduled_time}</td>
                  <td> 
                    <Button size="sm" color="link">
                      <Play size={16} className="text-primary" />
                    </Button>
                    <Button size="sm" color="link">
                      <CalendarClock size={16} className="text-primary" />
                    </Button>
                    <Button size="sm" color="link">
                      <Trash2 size={16} className="text-danger" />
                    </Button>
                    <Button size="sm" color="link">
                      <FileText size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
</container>  */}



      <Confirmation
        isOpen={isDeleteConfirmOpen}
        toggle={closeDeleteConfirm}
        title="Delete Scan"
        message={`Are you sure you want to delete the scan "${scanInRow?.name || 'Unnamed Scan'}"?`}
        onConfirm={handleDirectDelete}
        confirmText="Delete"
        confirmColor="danger"
        loading={deleteLoading}
        success={deleteSuccess}
        error={deleteError}
        successMessage="Scan deleted successfully!"
      />

      <Confirmation
        isOpen={isRunConfirmOpen}
        toggle={closeRunConfirm}
        title="Run Scan"
        message={`Are you sure you want to run the scan "${scanInRow?.name || 'Unnamed Scan'}"?`}
        onConfirm={handleDirectRun}
        confirmText="Run Scan"
        confirmColor="primary"
        loading={runLoading}
        success={runSuccess}
        error={runError}
        successMessage="Scan started successfully!"
      />

      {/* Individual Schedule Scan Modal */}
      <Schedule
        isOpen={isScheduleConfirmOpen}
        toggle={closeScheduleConfirm}
        title="Schedule Scan"
        message={`Select a date and time to schedule the scan "${scanInRow?.name || 'Unnamed Scan'
          }"`}
        date={selectedDate}
        onDateChange={setSelectedDate}
        onConfirm={handleDirectSchedule}
        confirmText="Schedule Scan"
        confirmColor="primary"
        loading={scheduleLoading}
        success={scheduleSuccess}
        error={scheduleError}
        successMessage="Scan scheduled successfully!"
      />
    </Container>
  );
};

export default Scans;




// // ✅ UPDATED: Responsive & Scrollable Scans Page
// // With horizontal scroll for table and improved layout

// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import {
//   Container,
//   Row,
//   Col,
//   Input,
//   Form,
//   Button,
//   ButtonToolbar,
//   Table,
//   Pagination,
//   PaginationItem,
//   PaginationLink,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   UncontrolledDropdown,
// } from 'reactstrap';
// import { Icon } from '@blueprintjs/core';
// import { Trash2, Play, CalendarClock, FileText } from 'lucide-react';
// import ComponentCard from '../../components/ComponentCard';

// const Scans = () => {
//   const isSoundOn = useSelector((state) => state.customizer.isSoundOn);
//   const [scanDetails, setScanDetails] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const filteredScans = scanDetails.filter(
//     (scan) => scan.name && scan.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentPageScans = filteredScans.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredScans.length / itemsPerPage);

//   useEffect(() => {
//     // Simulate scan data
//     setScanDetails([
//       { name: 'Scan One', url: 'https://site.com', depth: 3, guidance: 'Guideline 1', weighted_score: 66.5, date_last_ran: '2025-01-25', scheduled_time: '2025-02-01' },
//     ]);
//   }, []);

//   return (
//     <Container className="mt-4">
//       <ComponentCard>
//         <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
//           <div className="d-flex align-items-center flex-wrap gap-2">
//             <h4 className="mb-0">Project</h4>
//             <UncontrolledDropdown>
//               <DropdownToggle caret color="light">
//                 All Projects
//               </DropdownToggle>
//               <DropdownMenu>
//                 <DropdownItem>Project 1</DropdownItem>
//               </DropdownMenu>
//             </UncontrolledDropdown>
//           </div>

//           <div className="d-flex flex-wrap gap-2">
//             <Form>
//               <div className="input-group">
//                 <span className="input-group-text">
//                   <Icon icon="search" />
//                 </span>
//                 <Input
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search..."
//                 />
//               </div>
//             </Form>
//             <Button color="info">+ New</Button>
//             <Button color="info">Select Action</Button>
//             <Button color="info">Refresh</Button>
//           </div>
//         </div>
//       </ComponentCard>

//       <ComponentCard title="Scan Details">
        // <div style={{ overflowX: 'auto' }}>
        //   <Table bordered hover responsive className="text-nowrap">
        //     <thead>
        //       <tr>
        //         <th></th>
        //         <th>Scan Name</th>
        //         <th>Base URL</th>
        //         <th>Depth</th>
        //         <th>Guidances</th>
        //         <th>Weighted Score</th>
        //         <th>Last Scan Run</th>
        //         <th>Next Scheduled On</th>
        //         <th>Actions</th>
        //       </tr>
        //     </thead>
        //     <tbody>
        //       {currentPageScans.map((scan, index) => (
        //         <tr key={index}>
        //           <td>
        //             <Input type="checkbox" />
        //           </td>
        //           <td>{scan.name}</td>
        //           <td>{scan.url}</td>
        //           <td>{scan.depth}</td>
        //           <td>{scan.guidance}</td>
        //           <td>{scan.weighted_score}</td>
        //           <td>{scan.date_last_ran}</td>
        //           <td>{scan.scheduled_time}</td>
        //           <td>
        //             <Button size="sm" color="link">
        //               <Play size={16} className="text-primary" />
        //             </Button>
        //             <Button size="sm" color="link">
        //               <CalendarClock size={16} className="text-primary" />
        //             </Button>
        //             <Button size="sm" color="link">
        //               <Trash2 size={16} className="text-danger" />
        //             </Button>
        //             <Button size="sm" color="link">
        //               <FileText size={16} />
        //             </Button>
        //           </td>
        //         </tr>
        //       ))}
        //     </tbody>
        //   </Table>
        // </div>

//         {/* Pagination */}
//         <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
//           <div>
//             Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredScans.length)} of {filteredScans.length} entries
//           </div>
//           <Pagination className="mb-0">
//             <PaginationItem disabled={currentPage === 1}>
//               <PaginationLink first onClick={() => setCurrentPage(1)} />
//             </PaginationItem>
//             <PaginationItem disabled={currentPage === 1}>
//               <PaginationLink previous onClick={() => setCurrentPage(currentPage - 1)} />
//             </PaginationItem>
//             {[...Array(totalPages)].map((_, i) => (
//               <PaginationItem active={i + 1 === currentPage} key={i}>
//                 <PaginationLink onClick={() => setCurrentPage(i + 1)}>{i + 1}</PaginationLink>
//               </PaginationItem>
//             ))}
//             <PaginationItem disabled={currentPage === totalPages}>
//               <PaginationLink next onClick={() => setCurrentPage(currentPage + 1)} />
//             </PaginationItem>
//             <PaginationItem disabled={currentPage === totalPages}>
//               <PaginationLink last onClick={() => setCurrentPage(totalPages)} />
//             </PaginationItem>
//           </Pagination>
//         </div>
//       </ComponentCard>
//     </Container>
//   );
// };

// export default Scans;



