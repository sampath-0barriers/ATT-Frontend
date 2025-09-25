import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Card, CardBody, Input, Label, FormGroup, Row, Col } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { useAxios } from "../../utils/AxiosProvider";
import ConfirmationModal from './Confirmation';

const RunScan = ({ isOpen, toggle, selectedScans, fetchScanDetails }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const client = useAxios();

  useEffect(() => {
    try {
      if (selectedScans) {
        setScans(selectedScans);
      } else {
        setScans([]);
      }
    } catch (error) {
      console.error('Error fetching Scans:', error);
    }
  }, [selectedScans]);

  useEffect(() => {
    if (!isOpen) {
      setIsCompleted(false);
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleCheckboxChange = (event, itemName) => {
    const checked = event.target.checked;
    if (itemName === 'Select All') {
      setSelectAll(checked);
      setSelectedItems(checked ? scans.map((scan) => scan.name) : []);
    } else {
      if (!checked) {
        setSelectAll(false);
      }
      const updatedItems = checked
        ? [...selectedItems, itemName]
        : selectedItems.filter((item) => item !== itemName);
      setSelectedItems(updatedItems);
    }
  };

  const resetSelectionClose = () => {
    setSelectAll(false);
    setSelectedItems([]);
    setShowConfirmation(false);
    toggle();
  };

  const handleRunConfirmation = () => {
    setShowConfirmation(true);
    toggle();
  };

  const handleRun = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const selectedScanIds = selectedScans.map((scan) => scan._id);
      const scans = {
        scanRequestIdList: selectedScanIds,
      };

      await client.post('/run-scan', scans);
      await fetchScanDetails();
      setIsCompleted(true);

      // Automatically close the modal after completion
      setTimeout(() => {
        setShowConfirmation(false);
        setSelectAll(false);
        setSelectedItems([]);
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error running scan:', error);
      if (error.response && error.response.status === 404) {
        setErrorMessage('One or more scans not found.');
      } else if (error.response && error.response.status === 400) {
        setErrorMessage('Invalid scan request. Please try again.');
      } else {
        setErrorMessage('Error running scans. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setErrorMessage('');
    setIsCompleted(false);
  };

  if (showConfirmation) {
    return (
      <ConfirmationModal
        isOpen={showConfirmation}
        toggle={handleConfirmationClose}
        title="Run Scans"
        message={
          isCompleted
            ? "Scans completed successfully!"
            : selectedItems.length > 0
            ? (
              <>
                <p>Are you sure you want to run these scans?</p>
                {selectedItems.map((scanName, index) => (
                  <div key={scanName}>
                    {index + 1}. {scanName}
                  </div>
                ))}
              </>
            )
            : "No Scans Selected"
        }
        onConfirm={handleRun}
        confirmText="Run Scans"
        confirmColor="primary"
        loading={isLoading}
        success={isCompleted}
        error={errorMessage}
        successMessage="Scans completed successfully!"
      />
    );
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader>Run Scan</ModalHeader>
      <ModalBody>
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
        <Button color="primary" disabled={selectedItems.length === 0} onClick={handleRunConfirmation}>
          Start Scan
        </Button>{' '}
        <Button color="secondary" onClick={resetSelectionClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

RunScan.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selectedScans: PropTypes.array.isRequired,
  fetchScanDetails: PropTypes.func.isRequired,
};

export default RunScan;
