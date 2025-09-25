import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Alert,
  Spinner,
  Input
} from 'reactstrap';
import { useAxios } from "../../utils/AxiosProvider";
import { errorNotification } from '../../utils';

const UploadPDF = ({ isOpen, toggle }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const client = useAxios();

  useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
      setFileError(null);
      setSuccess(false);
      setLoading(false);
      setUploadProgress(0);
    }
  }, [isOpen]);

  const validateFiles = (files) => {
    for (let file of files) {
      if (file.type !== 'application/pdf') {
        return false;
      }
    }
    return true;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      if (validateFiles(files)) {
        setSelectedFiles(prev => [...prev, ...files]);
        setFileError(null);
      } else {
        setSelectedFile(null);
        setFileError('Please upload PDF files only');
      }
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      await client.post(
        '/pdf-scan/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return true;
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      const errMsg = error?.response?.data?.error || error?.response?.data || error?.response?.message || "Something went wrong. Please try again later.";
      errorNotification('Error', errMsg);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setFileError('Please select at least one PDF file');
      return;
    }

    setLoading(true);
    setFileError(null);
    setUploadProgress(0);

    try {
      let successCount = 0;

      // Process files sequentially
      for (let i = 0; i < selectedFiles.length; i++) {
        await uploadSingleFile(selectedFiles[i]);
        successCount++;
        setUploadProgress((successCount / selectedFiles.length) * 100);
      }

      setSuccess(true);
      setTimeout(() => {
        toggle();
      }, 1500);

    } catch (error) {
      console.error('Error uploading PDFs:', error);
      setFileError(error.response?.data?.message || 'Error uploading PDFs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md" centered>
      <ModalHeader toggle={toggle}>Upload PDF Documents</ModalHeader>

      <ModalBody>
        {fileError && (
          <Alert color="warning" className="mb-3">
            {fileError}
          </Alert>
        )}
        {success ? (
          <Alert color="success">
            PDFs uploaded successfully!
          </Alert>
        ) : (
          <>
            <FormGroup>
              <Label for="pdfFile">Select PDF Files</Label>
              <Input
                type="file"
                id="pdfFile"
                accept=".pdf"
                onChange={handleFileSelect}
                multiple
                key={isOpen ? 'open' : 'closed'}
              />
              {selectedFiles.length > 0 && (
                <div className="mt-3">
                  <Label>Selected Files:</Label>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center bg-light p-2 mb-2 rounded">
                      <small className="text-muted">{file.name}</small>
                      <Button
                        color="link"
                        size="sm"
                        className="p-0"
                        onClick={() => removeFile(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </FormGroup>
            {loading && (
              <div className="mt-3">
                <small className="text-muted d-block mb-1">
                  Upload Progress: {Math.round(uploadProgress)}%
                </small>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <Button
          color="primary"
          onClick={handleUpload}
          disabled={loading || success || selectedFiles.length === 0}
        >
          {loading ? <Spinner size="sm" /> : 'Upload'}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={loading}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

UploadPDF.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default UploadPDF;