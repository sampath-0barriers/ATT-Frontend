import React from 'react';
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button
} from 'reactstrap';

const ShowPDF = ({ isOpen, toggle, fileName, fileData }) => {
  if (!fileData) {
    return null;
  }

  // Since the file is already a base64 string, just need to add the data URL prefix
  const pdfUrl = `data:application/pdf;base64,${fileData}`;
  const title = fileName ? fileName : 'Unnamed PDF';

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="xl">
      <ModalHeader toggle={toggle}>{title}</ModalHeader>

      <ModalBody>
        <div style={{ height: '70vh' }}>
          <iframe
            src={pdfUrl}
            title={title}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            type="application/pdf"
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ShowPDF;