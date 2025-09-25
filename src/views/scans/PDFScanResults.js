import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, Table } from 'reactstrap';
import formatTimestamp from '../../utils/DateTimeConverter';

const PDFScanResults = ({ isOpen, toggle, scanResults, scanStatus }) => {
  console.log('scanStatus:', scanStatus);
  const modalBodyStyle = {
    overflow: 'auto', // Enable scrolling if content exceeds modal height
  };

  const tableStyle = {
    width: '100%',    // Ensure the table takes the full width of the modal
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" centered>
      <ModalHeader toggle={toggle}>Scan Results</ModalHeader>
      <ModalBody style={modalBodyStyle}>
        <Table bordered style={tableStyle}>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Date Ran</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {scanResults.map((result) => (
              <tr key={result.id ?? '-'}>
                <td>{result.fileName ?? '-'}</td>
                <td>{result.createdAt ? formatTimestamp(result.createdAt) : '-'}</td>
                <td>{result.score ? (result.score * 100).toFixed(1) : '-'}</td>
                <td>{result.status ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

PDFScanResults.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  scanResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PDFScanResults;
