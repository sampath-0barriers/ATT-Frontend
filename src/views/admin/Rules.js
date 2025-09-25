import {
  Button,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";
import ComponentCard from "../../components/ComponentCard";
import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAxios } from "../../utils/AxiosProvider";
import { errorNotification } from "../../utils";


const Rules = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [violations, setViolations] = useState([]);
  const [error, setError] = useState("");

  const fetchViolations = async () => {
    try {
      setError('');
      const response = await client.get('/violations/descriptions');
      const violations = await response.data;
      setViolations(Object.keys(violations).map(id => ({ violation_id: id, description: violations[id] })));
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
  useEffect(() => {
    fetchViolations();
  }, []);
  const client = useAxios(); // Axios instance for making HTTP requests

  const handleUploadViolationDescriptions = async () => {
    if (!csvFile) {
      setUploadStatus('Please select a CSV file first');
      return;
    }

    setIsUploading(true);
    setUploadStatus('');

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await client.post('/violations/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('Violation descriptions updated successfully!');
      setCsvFile(null);
      // Reset file input
      const fileInput = document.getElementById('csvFileInput');
      if (fileInput) fileInput.value = '';
      fetchViolations();
    } catch (error) {
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
      setUploadStatus(error.response?.data?.error || 'Error uploading violation descriptions');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setUploadStatus('');
    } else {
      setCsvFile(null);
      setUploadStatus('Please select a valid CSV file');
    }
  };

  return (
    <Container className="mt-3">
      {/* Row for the "Update Violation Descriptions" section */}
      <Row className="mb-4">
        <Col sm="20">
          <ComponentCard title="Update Violation Descriptions">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3">
                <input
                  type="file"
                  id="csvFileInput"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="form-control"
                  style={{ maxWidth: '400px' }}
                />
                <Button
                  color="primary"
                  onClick={handleUploadViolationDescriptions}
                  disabled={!csvFile || isUploading}
                >
                  {isUploading ? (
                    <span className="d-flex align-items-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="d-flex align-items-center gap-2">
                      <Upload size={18} />
                      Upload Descriptions
                    </span>
                  )}
                </Button>
              </div>
              {uploadStatus && (
                <div
                  className={`alert ${uploadStatus.includes('success') ? 'alert-success' : 'alert-danger'
                    }`}
                  role="alert"
                >
                  {uploadStatus}
                </div>
              )}
              <small className="text-muted">
                Upload a CSV file with violation ID and new description columns to customize violation descriptions.
                <br />
                Format: violation_id,new_description
              </small>
            </div>
          </ComponentCard>
        </Col>
      </Row>
      <Table bordered hover size="sm" className={"m-auto"} style={{ tableLayout: 'fixed', width: '80%' }}>
        <thead>
          <tr>
            <th style={{ width: '10%' }}>Violation ID</th>
            <th style={{ width: '70%' }}>Customized Description</th>
          </tr>
        </thead>
        <tbody>
          {violations.map(violation => (
            <tr key={violation.violation_id}>
              <td>{violation.violation_id}</td>
              <td>{violation.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Rules;