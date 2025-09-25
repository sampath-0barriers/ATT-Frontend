///

/*
edited on 18sep
commented is correct but old
*/


//
// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Row,
//   Col,
//   CardBody,
//   Card,
//   Table,
//   CardHeader,
//   Alert,
//   Progress
// } from 'reactstrap';
// import { Icon } from '@blueprintjs/core';
// import StepDetails from './StepDetails';
// import { useAxios } from "../../utils/AxiosProvider";
// const { errorNotification } = require('../../utils');

// const NewScan = ({ isOpen, toggle, fetchScanDetails }) => {
//   const initialValues = {
//     name: '',
//     url: '',
//     device: 'Default',
//     defineSteps: false,
//     depth: 0,
//   };
//   const [isStepDetailsOpen, setStepDetailsOpen] = useState(false);
//   const [selectAll, setSelectAll] = useState(false);
//   const [guidanceLevels, setGuidanceLevels] = useState([]);
//   const [selectedGuidances, setSelectedGuidances] = useState([]);
//   const [deviceOptions, setDeviceOptions] = useState([]);
//   const [showStepsTable, setShowStepsTable] = useState(false);
//   const [isCardMinimized, setIsCardMinimized] = useState(false);
//   const [createdSteps, setCreatedSteps] = useState([]);
//   const [successMessage, setSuccessMessage] = useState(''); // Holds success messages for form submission
//   const [errorMessage, setErrorMessage] = useState(''); // Holds error messages for form submission
//   const [projects, setProjects] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//  // const [defineSteps, setDefineSteps] = useState(0); //addedbyAman
//   const client = useAxios();

//   // Fetch guidance levels from database
//   useEffect(() => {
//     const fetchGuidanceLevels = async () => {
//       try {
//         const response = await client.get('/guidance-levels');
//         console.log("Guidance Levels Response:", response.data);
//         setGuidanceLevels(response.data.guidance_levels);

//       } catch (error) {
//         console.error('Error fetching guidance levels:', error);
//       }
//     };
//     fetchGuidanceLevels();
//   }, []);

//   // Fetch device options from database
//   useEffect(() => {
//     const fetchDeviceOptions = async () => {
//       try {
//         const response = await client.get('/device-configs');
//         setDeviceOptions(response.data.name);
//       } catch (error) {
//         console.error('Error fetching device options:', error);
//       }
//     };
//     fetchDeviceOptions();
//   }, []);

//   // Fetch projects from database
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await client.get('/projects');
//         setProjects(response.data.projects);
//         console.log("projects", response.data.projects);
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//         const errMsg =
//           error?.response?.data?.error ||
//           error?.response?.data?.message ||
//           error?.response?.data ||
//           error?.response?.message ||
//           'Something went wrong. Please try again later.';
//         errorNotification('Error', errMsg);
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Handle checkbox change for guidance levels
//   const handleCheckboxChange = (event, itemName) => {
//     const { checked } = event.target;
//     if (itemName === 'Select All') {
//       setSelectAll(checked);
//       setSelectedGuidances(checked ? guidanceLevels.map((item) => item) : []);
//     } else {
//       const updatedItems = checked
//         ? [...selectedGuidances, itemName]
//         : selectedGuidances.filter((item) => item !== itemName);
//       setSelectedGuidances(updatedItems);
//     }
//   };

//   const toggleStepDetails = () => {
//     setStepDetailsOpen(!isStepDetailsOpen);
//   };

//   const openStep = () => {
//     setStepDetailsOpen(true);
//   };

//  const handleDefineStepsChange = (event) => {
//     setShowStepsTable(event.target.checked);
//   };

//   const handleToggleCard = () => {
//     setIsCardMinimized(!isCardMinimized);
//   };

//   // Handle form submission and send scan request to backend
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     try {
//       const formData = new FormData(event.target);

//       // Fetch existing scan details to check for name uniqueness
//       const scans = await fetchScanDetails();
//       const scanNames = scans.data.map((scan) => scan.name);

//       // Clear any previous error messages
//       setErrorMessage('');

//       if (scanNames.includes(formData.get('name'))) {
//         setErrorMessage('Scan name must be unique.');
//         return;
//       }
//       console.log("formDatatyt", formData.get('projectId'));

//       const scanRequest = {
//         name: formData.get('name'),
//         scan_url: formData.get('url'),
//         device_config: formData.get('device'),
//         depth: formData.get('depth'),
//         guidance: selectedGuidances,
//         steps: createdSteps,
//         projectID: formData.get('projectId'),
//       };

//       // Send the scan request to MongoDB endpoint
//       await client.post('/create-scan', scanRequest);
//       setSuccessMessage('Scan created successfully!');
//       setIsLoading(false);

//       // Auto close the modal and refresh the page after 1.5 seconds
//       setTimeout(() => {
//         toggle();
//         window.location.reload(); // Refresh page to reflect new scan data
//       }, 1000);
//     } catch (error) {
//       console.error('Error submitting scan request:', error);
//       setErrorMessage('An unexpected error occurred. Please try again later.');
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle} size="xl" centered>
//       <ModalHeader>New Scan Details</ModalHeader>
//       <ModalBody>
//         {/* Conditionally render the error banner */}
//         {errorMessage && (
//           <Alert color="danger">
//             {errorMessage}
//           </Alert>
//         )}
//         {successMessage && (
//           <Alert color="success">
//             {successMessage}
//           </Alert>
//         )}
//         {isLoading && (
//           <Progress animated color="info" value="100" className="mb-3 scanProcessBar">
//             Processing...
//           </Progress>
//         )}
//         <Form initialValues={initialValues} onSubmit={handleSubmit}>
         
//           <Row>
//             <Col md="8">
 
//               <Row className="d-flex flex-column flex-md-row">
//             <FormGroup className="col-12 col-md-4">
//               <Label for="project">Select Project</Label>
//               <Input type="select" name="projectId" id="projectId" required>
//                 {projects.map((project) => (
//                   <option key={project._id} value={project._id}>
//                     {project.name}
//                   </option>
//                 ))}
//               </Input>
//             </FormGroup>
//             <FormGroup className="col-12 col-md-8">
//               <Label for="name">Name</Label>
//               <Input type="text" name="name" id="name" required />
//             </FormGroup>
//           </Row>
//           <FormGroup>
//                 <Label for="url">URL</Label>
//                 <Input type="text" name="url" id="url" required />
//               </FormGroup>
//               <div className="row">
//                 <FormGroup className="col-md-4">
//                   <Label for="device">Devices</Label>
//                   <Input type="select" name="device" id="device">
//                     {deviceOptions.map((device) => (
//                       <option key={device} value={device}>
//                         {device}
//                       </option>
//                     ))}
//                   </Input>
//                 </FormGroup>
//                 <FormGroup className="col-md-4">
//                   <FormGroup check style={{ marginTop: '2rem' }}>
//                     <Label for="DefiningSteps"> Define Steps </Label>
//                      <Input
//                       type="checkbox"
//                       name="defineSteps"
//                       id="defineSteps"
//                       onChange={handleDefineStepsChange}
//                     />

//                   </FormGroup>
//                 </FormGroup>
//                 <FormGroup className="col-sm-12 col-md-2">
//                   <Label for="depth">Depth</Label>
//                   <Input type="number" name="depth" id="depth" min="0" />
//                 </FormGroup>
//               </div>
//             </Col>
//             <Col md="4">
//               <Label>Guidances:</Label>
//               <Card>
//                 <CardBody style={{ height: '223px', overflowY: 'auto' }}>
//                   <FormGroup check>
//                     <Label check>
//                       <Input
//                         type="checkbox"
//                         checked={selectAll}
//                         onChange={(e) => handleCheckboxChange(e, 'Select All')}
//                       />{' '}
//                       All
//                     </Label>
//                   </FormGroup>
//                   {guidanceLevels.map((item) => (
//                     <FormGroup check key={item}>
//                       <Label check>
//                         <Input
//                           type="checkbox"
//                           checked={selectedGuidances.includes(item)}
//                           onChange={(e) => handleCheckboxChange(e, item)}
//                         />{' '}
//                         {item}
//                       </Label>
//                     </FormGroup>
//                   ))}
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//           {/* Add Steps toggled when Define Steps checkbox is ticked */}
//            {showStepsTable && (
//             <Card className="mb-3 add-steps">
//               <CardHeader className="p-3">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <span style={{ fontWeight: 'bold' }}>Add Steps</span>
//                   <Button color="link" onClick={handleToggleCard}>
//                     {isCardMinimized ? 'Expand' : 'Minimize'}
//                   </Button>
//                 </div>
//               </CardHeader>
//               <div className={isCardMinimized ? 'd-none' : ''}>
//                 <CardBody className="p-3">
//                   <div className="d-flex justify-content-end align-items-center">
//                     <Button color="success" onClick={openStep} className="mr-2 m-1">
//                       <Icon icon="plus" color="white" /> New
//                     </Button>
//                     <StepDetails
//                       isOpen={isStepDetailsOpen}
//                       toggle={toggleStepDetails}
//                       setCreatedSteps={setCreatedSteps}
//                     />
//                     <Button color="primary" className="m-1">
//                       <Icon icon="export" color="white" /> Export
//                     </Button>
//                   </div>
//                   <Table bordered hover size="sm" className="m-2">
//                     <thead>
//                        {/* <tr>{createdSteps.stepName}</tr> //added by aman */}
//                       <tr>
//                          <th>URL</th> {/*//added by aman */}
//                         <th>Element Type</th>
//                         <th>FindBy</th>
//                         <th>FindValue</th>
//                         <th>Action</th>
//                         <th>WaitTime</th>
//                         <th>IsActive</th>
//                         <th>Notes</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {createdSteps.map((step) => (
//                         <tr key={step.url}>
//                           <td title={step.url.length > 14 ? 'Full content' : ''}>  {/*//added by aman */}
//                             {step.url.length > 14 ? `${step.url.substring(0, 14)}...` : step.url}  {/*//added by aman */}
//                           </td> {/*//added by aman */}
//                           <td title={step.elemType.length > 14 ? 'Full content' : ''}>
//                             {step.elemType.length > 14 ? `${step.elemType.substring(0, 14)}...` : step.elemType}
//                           </td>
//                           <td title={step.findBy.length > 14 ? 'Full content' : ''}>
//                             {step.findBy.length > 14 ? `${step.findBy.substring(0, 14)}...` : step.findBy}
//                           </td>
//                           <td title={step.findValue.length > 14 ? 'Full content' : ''}>
//                             {step.findValue.length > 14 ? `${step.findValue.substring(0, 14)}...` : step.findValue}
//                           </td>
//                           <td title={step.stepAction.length > 14 ? 'Full content' : ''}>
//                             {step.stepAction.length > 14 ? `${step.stepAction.substring(0, 14)}...` : step.stepAction}
//                           </td>
//                           <td title={step.waitTime.length > 14 ? 'Full content' : ''}>
//                             {step.waitTime.length > 14 ? `${step.waitTime.substring(0, 14)}...` : step.waitTime}
//                           </td>
//                           <td title={step.isActive.length > 14 ? 'Full content' : ''}>
//                             {step.isActive.length > 14 ? `${step.isActive.substring(0, 14)}...` : step.isActive}
//                           </td>
//                           <td title={step.notes.length > 14 ? 'Full content' : ''}>
//                             {step.notes.length > 14 ? `${step.notes.substring(0, 14)}...` : step.notes}
//                           </td>

//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </CardBody>
//               </div>
//             </Card>
//           )}

//           <ModalFooter>
//             <Button color="secondary" onClick={toggle}>
//               <Icon icon="cross" color="white" /> Cancel
//             </Button>
//             <Button color="primary" type="submit">
//               <Icon icon="tick" color="white" /> Save
//             </Button>
//           </ModalFooter>
//         </Form>
//       </ModalBody>
//     </Modal>
//   ); 
// };

// NewScan.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   toggle: PropTypes.func.isRequired,
//   fetchScanDetails: PropTypes.func.isRequired,
// };

// export default NewScan;

//import { Icon } from '@blueprintjs/core';
 import { Trash2, Pen, CalendarClock, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  CardBody,
  Card,
  Table,
  CardHeader,
  Alert,
  Progress
} from 'reactstrap';
import { Icon } from '@blueprintjs/core';
import StepDetails from './StepDetails';
import { useAxios } from "../../utils/AxiosProvider";
const { errorNotification } = require('../../utils');

const NewScan = ({ isOpen, toggle, fetchScanDetails }) => {
  const initialValues = {
    name: '',
    url: '',
    device: 'Default',
    defineSteps: false,
    depth: 0,
  };
  const [isStepDetailsOpen, setStepDetailsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [guidanceLevels, setGuidanceLevels] = useState([]);
  const [selectedGuidances, setSelectedGuidances] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [showStepsTable, setShowStepsTable] = useState(false);
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [createdSteps, setCreatedSteps] = useState([]);
  const [successMessage, setSuccessMessage] = useState(''); // Holds success messages for form submission
  const [errorMessage, setErrorMessage] = useState(''); // Holds error messages for form submission
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 // const [defineSteps, setDefineSteps] = useState(0); //addedbyAman
  const client = useAxios();

  // Fetch guidance levels from database
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchGuidanceLevels = async () => {
      try {
        console.log("Fetching guidance levels...");
        const response = await client.get('/guidance-levels');
        console.log("Guidance Levels Response:", response.data);
        setGuidanceLevels(response.data.guidance_levels || []);
      } catch (error) {
        console.error('Error fetching guidance levels:', error);
        console.error('Error details:', error.response?.data);
        setGuidanceLevels([]);
      }
    };
    fetchGuidanceLevels();
  }, [client, isOpen]);

  // Fetch device options from database
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchDeviceOptions = async () => {
      try {
        console.log("Fetching device options...");
        const response = await client.get('/device-configs');
        console.log("Device Options Response:", response.data);
        setDeviceOptions(response.data.name || []);
      } catch (error) {
        console.error('Error fetching device options:', error);
        console.error('Error details:', error.response?.data);
        setDeviceOptions([]);
      }
    };
    fetchDeviceOptions();
  }, [client, isOpen]);

  // Fetch projects from database
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects...");
        const response = await client.get('/projects');
        console.log("Projects Response:", response.data);
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        console.error('Error details:', error.response?.data);
        const errMsg =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.response?.data ||
          error?.response?.message ||
          'Something went wrong. Please try again later.';
        errorNotification('Error', errMsg);
        setProjects([]);
      }
    };
    fetchProjects();
  }, [client, isOpen]);

  // Handle checkbox change for guidance levels
  const handleCheckboxChange = (event, itemName) => {
    const { checked } = event.target;
    if (itemName === 'Select All') {
      setSelectAll(checked);
      setSelectedGuidances(checked ? guidanceLevels.map((item) => item) : []);
    } else {
      const updatedItems = checked
        ? [...selectedGuidances, itemName]
        : selectedGuidances.filter((item) => item !== itemName);
      setSelectedGuidances(updatedItems);
    }
  };

 // Delete step handler
const handledeletestep = (index) => {
  setCreatedSteps((prevSteps) => prevSteps.filter((_, i) => i !== index));
};


  const toggleStepDetails = () => {
    setStepDetailsOpen(!isStepDetailsOpen);
  };

  const openStep = () => {
    setStepDetailsOpen(true);
  };

 const handleDefineStepsChange = (event) => {
    setShowStepsTable(event.target.checked);
  };

  const handleToggleCard = () => {
    setIsCardMinimized(!isCardMinimized);
  };

  // Handle form submission and send scan request to backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.target);

      // Fetch existing scan details to check for name uniqueness
      const scans = await fetchScanDetails();
      const scanNames = scans.data.map((scan) => scan.name);

      // Clear any previous error messages
      setErrorMessage('');

      if (scanNames.includes(formData.get('name'))) {
        setErrorMessage('Scan name must be unique.');
        return;
      }
      console.log("formDatatyt", formData.get('projectId'));

      const scanRequest = {
        name: formData.get('name'),
        scan_url: formData.get('url'),
        device_config: formData.get('device'),
        depth: formData.get('depth'),
        guidance: selectedGuidances,
        steps: createdSteps,
        projectID: formData.get('projectId'),
      };

      // Send the scan request to MongoDB endpoint
      await client.post('/create-scan', scanRequest);
      setSuccessMessage('Scan created successfully!');
      setIsLoading(false);

      // Auto close the modal and refresh the page after 1.5 seconds
      setTimeout(() => {
        toggle();
        window.location.reload(); // Refresh page to reflect new scan data
      }, 1000);
    } catch (error) {
      console.error('Error submitting scan request:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  // Debug logging
  console.log("NewScan render - guidanceLevels:", guidanceLevels);
  console.log("NewScan render - deviceOptions:", deviceOptions);
  console.log("NewScan render - projects:", projects);
  console.log("NewScan render - isOpen:", isOpen);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" centered>
      <ModalHeader>New Scan Details</ModalHeader>
      <ModalBody>
        {/* Conditionally render the error banner */}
        {errorMessage && (
          <Alert color="danger">
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert color="success">
            {successMessage}
          </Alert>
        )}
        {isLoading && (
          <Progress animated color="info" value="100" className="mb-3 scanProcessBar">
            Processing...
          </Progress>
        )}
        <Form initialValues={initialValues} onSubmit={handleSubmit}>
         
          <Row>
            <Col md="8">
 
              <Row className="d-flex flex-column flex-md-row">
            <FormGroup className="col-12 col-md-4">
              <Label for="project">Select Project</Label>
              <Input type="select" name="projectId" id="projectId" required>
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup className="col-12 col-md-8">
              <Label for="name">Name</Label>
              <Input type="text" name="name" id="name" required />
            </FormGroup>
          </Row>
          <FormGroup>
                <Label for="url">URL</Label>
                <Input type="text" name="url" id="url" required />
              </FormGroup>
              <div className="row">
                <FormGroup className="col-md-4">
                  <Label for="device">Devices</Label>
                  <Input type="select" name="device" id="device">
                    <option value="Default">Default</option>
                    {deviceOptions.map((device) => (
                      <option key={device} value={device}>
                        {device}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup className="col-md-4">
                  <FormGroup check style={{ marginTop: '2rem' }}>
                    <Label for="DefiningSteps"> Define Steps </Label>
                     <Input
                      type="checkbox"
                      name="defineSteps"
                      id="defineSteps"
                      onChange={handleDefineStepsChange}
                    />

                  </FormGroup>
                </FormGroup>
                <FormGroup className="col-sm-12 col-md-2">
                  <Label for="depth">Depth</Label>
                  <Input type="number" name="depth" id="depth" min="0" />
                </FormGroup>
              </div>
            </Col>
            <Col md="4">
              <Label>Guidances:</Label>
              <Card>
                <CardBody style={{ height: '223px', overflowY: 'auto' }}>
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
                  {guidanceLevels.map((item) => (
                    <FormGroup check key={item}>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={selectedGuidances.includes(item)}
                          onChange={(e) => handleCheckboxChange(e, item)}
                        />{' '}
                        {item}
                      </Label>
                    </FormGroup>
                  ))}
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* Add Steps toggled when Define Steps checkbox is ticked */}
           {showStepsTable && (
            <Card className="mb-3 add-steps">
              <CardHeader className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontWeight: 'bold' }}>Add Steps</span>
                  <Button color="link" onClick={handleToggleCard}>
                    {isCardMinimized ? 'Expand' : 'Minimize'}
                  </Button>
                </div>
              </CardHeader>
              <div className={isCardMinimized ? 'd-none' : ''}>
                <CardBody className="p-3">
                  <div className="d-flex justify-content-end align-items-center">
                    <Button color="success" onClick={openStep} className="mr-2 m-1">
                      <Icon icon="plus" color="white" /> New
                    </Button>
                    <StepDetails
                      isOpen={isStepDetailsOpen}
                      toggle={toggleStepDetails}
                      setCreatedSteps={setCreatedSteps}
                    />
                    <Button color="primary" className="m-1">
                      <Icon icon="export" color="white" /> Export
                    </Button>
                  </div>
                  <Table bordered hover size="sm" className="m-2">
                    <thead>
                       {/* <tr>{createdSteps.stepName}</tr> //added by aman */}
                      <tr>
                         <th>URL</th> {/*//added by aman */}
                        <th>Element Type</th>
                        <th>FindBy</th>
                        <th>FindValue</th>
                        <th>Action</th>
                        <th>WaitTime</th>
                        <th>IsActive</th>
                        <th>Notes</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {createdSteps.map((step, index) => (
                        <tr key={index}>
                          <td title={step.url.length > 14 ? 'Full content' : ''}>
                            {step.url.length > 14 ? `${step.url.substring(0, 14)}...` : step.url}
                          </td>
                          <td title={step.elemType.length > 14 ? 'Full content' : ''}>
                            {step.elemType.length > 14 ? `${step.elemType.substring(0, 14)}...` : step.elemType}
                          </td>
                          <td title={step.findBy.length > 14 ? 'Full content' : ''}>
                            {step.findBy.length > 14 ? `${step.findBy.substring(0, 14)}...` : step.findBy}
                          </td>
                          <td title={step.findValue.length > 14 ? 'Full content' : ''}>
                            {step.findValue.length > 14 ? `${step.findValue.substring(0, 14)}...` : step.findValue}
                          </td>
                          <td title={step.stepAction.length > 14 ? 'Full content' : ''}>
                            {step.stepAction.length > 14 ? `${step.stepAction.substring(0, 14)}...` : step.stepAction}
                          </td>
                          <td title={step.waitTime.length > 14 ? 'Full content' : ''}>
                            {step.waitTime.length > 14 ? `${step.waitTime.substring(0, 14)}...` : step.waitTime}
                          </td>
                          <td title={step.isActive.length > 14 ? 'Full content' : ''}>
                            {step.isActive.length > 14 ? `${step.isActive.substring(0, 14)}...` : step.isActive}
                          </td>
                          <td title={step.notes.length > 14 ? 'Full content' : ''}>
                            {step.notes.length > 14 ? `${step.notes.substring(0, 14)}...` : step.notes}
                          </td>
                          <td>
                            <Button
                              color="link"
                              size="sm"
                              onClick={() => handledeletestep(index)} // ✅ pass index
                            >
                              <Trash2 size={18} className="text-danger" />
                            </Button>
                            
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </Table>
                </CardBody>
              </div>
            </Card>
          )}

          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              <Icon icon="cross" color="white" /> Cancel
            </Button>
            <Button color="primary" type="submit">
              <Icon icon="tick" color="white" /> Save
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  ); 
};

NewScan.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  fetchScanDetails: PropTypes.func.isRequired,
};

export default NewScan;






