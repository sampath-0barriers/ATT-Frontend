import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Input,
  Label,
  FormGroup,
  Row,
  Col,
  Alert,
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAxios } from '../../utils/AxiosProvider';

// Component to schedule a scan. Allows user to select a date and URLs to scan.
const ScheduleScan = ({ isOpen, toggle, selectedScans, fetchScanDetails }) => {
  const [scheduledDate, setScheduledDate] = useState(null); // state to store the selected scan date
  const [selectAll, setSelectAll] = useState(false); // state to track "Select All" checkbox
  const [selectedItems, setSelectedItems] = useState([]); // state to track selected URLs
  const [scans, setScans] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // Holds error messages for scheduling
  const [successMessage, setSuccessMessage] = useState(''); // Holds success messages for scheduling
  const [isScheduling, setIsScheduling] = useState(false); // if scan is currently running or not
  const client = useAxios({ withCredentials: true }); // axios instance with credentials for HTTP requests

  // Effect to set the URLs when a scan is selected or changed
  useEffect(() => {
    try {
      if (selectedScans) {
        setScans(selectedScans); // set URLs if the selected scan has URLs
      } else {
        setScans([]); // clear URLs if no scan or no URLs are available
      }
    } catch (error) {
      console.error('Error fetching URLs:', error); // log error if fetching URLs fails
    }
  }, [selectedScans]); // trigger the effect when selectedScans changes

  // Function to handle date change from the DatePicker
  const handleDateChange = (date) => {
    setScheduledDate(date); // set the selected date in the state
  };

  // Function to handle checkbox changes for selecting URLs
  const handleCheckboxChange = (event, itemName) => {
    const { checked } = event.target;
    if (itemName === 'Select All') {
      setSelectAll(checked); // update "Select All" checkbox state
      setSelectedItems(checked ? scans.map((scan) => scan.name) : []); // if "Select All" is checked, select all URLs; otherwise, clear selections
    } else {
      if (!checked) {
        //begin by setting all checkboxes false
        setSelectAll(false);
      }
      // Update selected items list by adding/removing based on checkbox status
      const updatedItems = checked
        ? [...selectedItems, itemName] // add item if checked
        : selectedItems.filter((item) => item !== itemName); // remove item if unchecked
      setSelectedItems(updatedItems); // update state with selected items
    }
  };

  const resetSelectionClose = () => {
    setSelectAll(false);
    setSelectedItems([]);
    toggle();
  };

  /**
   * Handles the submission of a scheduled scan request.
   *
   * The function is called when the user clicks the "Schedule" button.
   * It validates the inputs (date and URLs), sends the request to the server if valid,
   * and displays success or error messages accordingly.
   *
   * @private
   * @async
   */
  const handleSubmit = async () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');

    // Validation to check if a date or URLs are not selected
    if (!scheduledDate) {
      setErrorMessage('Please select a time for the scan.');
      return;
    }
    if (selectedItems.length === 0) {
      setErrorMessage('Please select at least one scan to schedule.');
      return;
    }

    try {
      const selectedScanIds = selectedScans.map((scan) => scan._id);
      const scans = {
        scanRequestIdList: selectedScanIds,
        scheduledTime: scheduledDate,
      };

      // Send the scan information to the backend endpoint
      const response = await client.post('/schedule-scan', scans);
      await fetchScanDetails();

      setSuccessMessage(
        `Scan(s) has been successfully scheduled for ${scheduledDate?.toLocaleString()}!`,
      );

      // Auto close the modal and refresh the page after 1.5 seconds
      setTimeout(() => {
        resetSelectionClose(); // reset selections and close modal
        window.location.reload(); // refresh page to reflect new scan data
      }, 1500);
    } catch (error) {
      console.error('Error scheduling scan:', error);
      if (error.response && error.response.status === 404) {
        setErrorMessage('Selected scan(s) not found. Please try again.');
      } else if (error.response && error.response.status === 400) {
        setErrorMessage('Invalid schedule request. Please try again.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader>Schedule Scan</ModalHeader>
      <ModalBody>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        {successMessage && <Alert color="success">{successMessage}</Alert>}
        <FormGroup>
          <Label for="scheduledDate">Scheduled Date:</Label>
          <DatePicker
            id="scheduledDate"
            selected={scheduledDate} // pass selected date to DatePicker
            onChange={handleDateChange} // handle date change
            minDate={new Date()} // prevent past dates from being selected
            showTimeSelect // allow time selection
            timeFormat="HH:mm" // format for time
            timeIntervals={15} // intervals of 15 minutes
            dateFormat="MM/dd/yyyy h:mm aa" // format for date and time display
            timeCaption="Time" // label for time selection
          />
        </FormGroup>

        <Row>
          <Col md="6">
            <Label>Select Scans:</Label>
            <Card>
              <CardBody style={{ height: '223px', overflowY: 'auto' }}>
                {scans.length === 0 ? (
                  <div className="no-scans-message">
                    <p>No scans selected.</p>
                  </div>
                ) : (
                  <>
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
                    {scans.map((scan) => (
                      <FormGroup check key={scan._id}>
                        {' '}
                        {/* Use scan._id for key */}
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={selectedItems.includes(scan.name)}
                            onChange={(e) => handleCheckboxChange(e, scan.name)}
                          />{' '}
                          {scan.name}
                        </Label>
                      </FormGroup>
                    ))}
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
          <Col md="6">
            <Label>Selected:</Label>
            <Card>
              <CardBody style={{ height: '223px', overflowY: 'auto' }}>
                <div className="selected-items">
                  <ul>
                    {selectedItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          disabled={isScheduling || selectedItems.length === 0}
          onClick={handleSubmit}
        >
          {isScheduling ? 'Scheduling...' : 'Schedule'}
        </Button>{' '}
        <Button color="secondary" onClick={resetSelectionClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ScheduleScan.propTypes = {
  isOpen: PropTypes.bool.isRequired, // prop type for isOpen
  toggle: PropTypes.func.isRequired, // prop type for toggle function
  selectedScans: PropTypes.object.isRequired,
  fetchScanDetails: PropTypes.func.isRequired,
};

export default ScheduleScan;
