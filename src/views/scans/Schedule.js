import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Alert, Spinner } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Schedule = ({ 
  isOpen, 
  toggle,
  title = 'No title',
  message = '',
  date = new Date(),
  onDateChange,
  onConfirm,
  confirmText = 'Confirm',
  confirmColor = 'primary',
  loading = false, 
  success = false, 
  error = null,
  successMessage = 'Action completed successfully!',
  disableConfirm = false,
  cancelText = 'Cancel',
  minDate = new Date()
}) => {
  // Check if the currently selected date is today
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  // calculate minTime based on the selected date
  const minTime = isToday ? new Date(now.setSeconds(0, 0)) : new Date().setHours(0, 0, 0, 0);

  // Need to include max time if using min time. Set to end of day
  const maxTime = new Date().setHours(23, 59, 59, 999);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="sm">
        <ModalHeader toggle={toggle}>{title}</ModalHeader>

        <ModalBody>
              {error && (
                  <Alert color="danger" className="mb-3">
                      {error}
                  </Alert>
              )}
              {success ? (
                  <Alert color="success">
                      {successMessage}
                  </Alert>
              ) : (
                <FormGroup>
                  <Label for="datetime">{message}</Label>
                  <DatePicker
                      selected={date}
                      onChange={(newDate) => {
                        onDateChange(newDate);
                      }}
                      showTimeSelect
                      dateFormat="Pp"
                      className="form-control"
                      minDate={minDate}
                      minTime={isToday ? now : new Date(minTime)}
                      maxTime={new Date(maxTime)}
                  />
                </FormGroup>
              )}
        </ModalBody>

        <ModalFooter>
          <Button
              color={confirmColor}
              onClick={onConfirm}
              disabled={loading || success || disableConfirm}
          >
              {loading ? <Spinner size="sm" /> : confirmText}
          </Button>
          <Button color="secondary" onClick={toggle} disabled={loading}>
              {cancelText}
          </Button>
        </ModalFooter>
    </Modal>
  );
};

Schedule.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Schedule;
