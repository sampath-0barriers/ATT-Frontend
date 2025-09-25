// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Table,
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   Alert,
//   Badge
// } from 'reactstrap';
// import formatTimestamp from '../../utils/DateTimeConverter';
// import { Download } from 'lucide-react';
// import { useAxios } from "../../utils/AxiosProvider";

// const ScanResults = ({ isOpen, toggle, scanResults, scanStatus }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [error, setError] = useState('');
//   const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

//   const client = useAxios();

//   const handleExport = async (format) => {
//     try {
//       setError('');
//       const scanRequestId = scanResults[0]?.scanRequestId;

//       if (!scanRequestId) {
//         throw new Error('No scan request ID found');
//       }

//       const response = await client.get(`/scan/${scanRequestId}/report/?format=${format}`, {
//         responseType: 'blob'
//       });

//       const blob = new Blob([response.data], {
//         type: response.headers['content-type']
//       });

//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');

//       const contentDisposition = response.headers['content-disposition'];
//       const fileName = contentDisposition
//         ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
//         : `scan-results-${scanRequestId}.${format}`;

//       a.href = url;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Export error:', error);
//       const errorMessage = error.response
//         ? `Export failed: ${error.response.status} ${error.response.statusText}`
//         : 'An error occurred during export. Please try again.';
//       setError(errorMessage);
//     }
//   };

//   const modalStyle = {
//     maxWidth: '80%',
//   };

//   const tableContainerStyle = {
//     maxHeight: '60vh',
//     overflowY: 'auto',
//     overflowX: 'auto',
//     borderRadius: '4px',
//     border: '1px solid #dee2e6',
//   };

//   const stickyHeaderStyle = {
//     position: 'sticky',
//     top: 0,
//     backgroundColor: '#f8f9fa',
//     zIndex: 1,
//   };

//   // Custom scrollbar styles
//   const scrollbarStyles = `
//     .custom-scrollbar {
//       scrollbar-width: thin;
//       scrollbar-color: #888 #f1f1f1;
//     }
//     .custom-scrollbar::-webkit-scrollbar {
//       width: 8px;
//       height: 8px;
//     }
//     .custom-scrollbar::-webkit-scrollbar-track {
//       background: #f1f1f1;
//       border-radius: 4px;
//     }
//     .custom-scrollbar::-webkit-scrollbar-thumb {
//       background: #888;
//       border-radius: 4px;
//     }
//     .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//       background: #555;
//     }
//   `;

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'completed':
//         return 'success';
//       case 'in_progress':
//         return 'warning';
//       default:
//         return 'secondary';
//     }
//   };

//   return (
//     <>
//       <style>{scrollbarStyles}</style>
//       <Modal isOpen={isOpen} toggle={toggle} size="xl" centered backdrop="static" style={modalStyle}>
//         <ModalHeader toggle={toggle} className="bg-white border-bottom-0">
//           <span className="h5 mb-0">Scan Results</span>
//         </ModalHeader>

//         <ModalBody>
//           {error && (
//             <Alert color="danger" className="mb-4" toggle={() => setError('')}>
//               {error}
//             </Alert>
//           )}
//           <div className="custom-scrollbar" style={tableContainerStyle}>
//             <Table bordered hover className="mb-0">
//               <thead style={stickyHeaderStyle}>
//               <tr>
//                 <th className="bg-light">Page</th>
//                 <th className="bg-light">Timestamp</th>
//                 <th className="bg-light">Score</th>
//                 <th className="bg-light">Status</th>
//               </tr>
//               </thead>
//               <tbody>
//               {scanResults.map((result, index) => (
//                 <tr key={result.id || `scan-result-${index}`}>
//                   <td>{result.url || 'N/A'}</td>
//                   <td>{result?.timestamp ? formatTimestamp(result.timestamp) : 'N/A'}</td>
//                   <td>
//                     <Badge color="info" pill>
//                       {result.score?.toString() || 'N/A'}
//                     </Badge> 
                    
//                   </td>
//                   <td>
//                     <Badge
//                       color={getStatusColor(scanStatus)}
//                       pill
//                     >
//                       {scanStatus || 'N/A'}
//                     </Badge>
                   
//                   </td>
//                 </tr>
//               ))}
//               </tbody>
//             </Table>
//           </div>
//         </ModalBody>

//         <ModalFooter className="border-top-0">
//           {scanResults.length > 0 && (
//             <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
//               <DropdownToggle
//                 color="info"
//                 className="d-flex align-items-center"
//                 style={{ gap: '0.5rem' }}
//               >
//                 <Download size={16} />
//                 Export
//               </DropdownToggle>
//               <DropdownMenu end>
//                 <DropdownItem onClick={() => handleExport('pdf')}>
//                   Export as PDF
//                 </DropdownItem>
//                 <DropdownItem onClick={() => handleExport('csv')}>
//                   Export as CSV
//                 </DropdownItem>
//                 <DropdownItem onClick={() => handleExport('html')}>
//                   Export as HTML
//                 </DropdownItem>
//               </DropdownMenu>
//             </Dropdown>
//           )}
//         </ModalFooter>
//       </Modal>
//     </>
//   );
// };

// ScanResults.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   toggle: PropTypes.func.isRequired,
//   scanResults: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       url: PropTypes.string.isRequired,
//       timestamp: PropTypes.string.isRequired,
//       score: PropTypes.number.isRequired,
//       status: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   scanStatus: PropTypes.string,
// };

// export default ScanResults;


//newfile:
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
  Badge
} from 'reactstrap';
import formatTimestamp from '../../utils/DateTimeConverter';
import { Download } from 'lucide-react';
import { useAxios } from "../../utils/AxiosProvider";

const ScanResults = ({ isOpen, toggle, scanResults, scanStatus }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [guidance, setGuidance] = useState([]);
  const client = useAxios();

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  // Fetch guidance when modal opens
  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        const scanRequestId = scanResults[0]?.scanRequestId;
        if (!scanRequestId) return;

        const response = await client.get(`/scan_request/${scanRequestId}`);
        if (response.data?.guidance) {
          setGuidance(response.data.guidance);
        }
      } catch (err) {
        console.error("Error fetching guidance:", err);
      }
    };

    if (isOpen && scanResults.length > 0) {
      fetchGuidance();
    }
  }, [isOpen, scanResults, client]);

  const handleExport = async (format) => {
    try {
      setError('');
      const scanRequestId = scanResults[0]?.scanRequestId;

      if (!scanRequestId) {
        throw new Error('No scan request ID found');
      }

      const response = await client.get(`/scan/${scanRequestId}/report/?format=${format}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
        : `scan-results-${scanRequestId}.${format}`;

      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error.response
        ? `Export failed: ${error.response.status} ${error.response.statusText}`
        : 'An error occurred during export. Please try again.';
      setError(errorMessage);
    }
  };

  const modalStyle = { maxWidth: '80%' };
  const tableContainerStyle = {
    maxHeight: '60vh',
    overflowY: 'auto',
    overflowX: 'auto',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
  };

  const stickyHeaderStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: '#f8f9fa',
    zIndex: 1,
  };

  const scrollbarStyles = `
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #888 #f1f1f1;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <Modal isOpen={isOpen} toggle={toggle} size="xl" centered backdrop="static" style={modalStyle}>
        <ModalHeader toggle={toggle} className="bg-white border-bottom-0">
          <span className="h5 mb-0">Scan Results</span>
        </ModalHeader>

        <ModalBody>
          {error && (
            <Alert color="danger" className="mb-4" toggle={() => setError('')}>
              {error}
            </Alert>
          )}
          <div className="custom-scrollbar" style={tableContainerStyle}>
            <Table bordered hover className="mb-0">
              <thead style={stickyHeaderStyle}>
                <tr>
                  <th className="bg-light">Page</th>
                  <th className="bg-light">Timestamp</th>
                  <th className="bg-light">Guidance</th>
                  <th className="bg-light">Score</th>
                  <th className="bg-light">Status</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.map((result, index) => (
                  <tr key={result.id || `scan-result-${index}`}>
                    <td>{result.url || 'N/A'}</td>
                    <td>{result?.timestamp ? formatTimestamp(result.timestamp) : 'N/A'}</td>
                    <td>
                      {guidance.length > 0
                        ? guidance.join(', ')
                        : 'N/A'}
                    </td>
                    <td>
                      <Badge color="info" pill>
                        {result.score?.toString() || 'N/A'}
                      </Badge>
                    </td>
                    <td>
                      <Badge color={getStatusColor(scanStatus)} pill>
                        {scanStatus || 'N/A'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </ModalBody>

        <ModalFooter className="border-top-0">
          {scanResults.length > 0 && (
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle
                color="info"
                className="d-flex align-items-center"
                style={{ gap: '0.5rem' }}
              >
                <Download size={16} />
                Export
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem onClick={() => handleExport('pdf')}>Export as PDF</DropdownItem>
                <DropdownItem onClick={() => handleExport('csv')}>Export as CSV</DropdownItem>
                <DropdownItem onClick={() => handleExport('html')}>Export as HTML</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
};

ScanResults.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  scanResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
      timestamp: PropTypes.string,
      score: PropTypes.number,
      status: PropTypes.string,
    })
  ).isRequired,
  scanStatus: PropTypes.string,
};

export default ScanResults;

