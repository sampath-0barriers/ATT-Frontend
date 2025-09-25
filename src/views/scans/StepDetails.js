// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Row,
//   Col,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from 'reactstrap';
// import { Icon } from '@blueprintjs/core';

// const StepDetails = ({ isOpen, toggle, setCreatedSteps }) => {
//   const initialFormTemplate = {
//     elemType: '',
//     findBy: '',
//     depth: 0,
//     elemInput: '',
//     findValue: '',
//     stepAction: '',
//     waitTime: 0,
//     isActive: false,
//     notes: '',
//   };
//   const [stepName, setStepName] = useState('');
//   const [url, setUrl] = useState('');
//   const [forms, setForms] = useState([initialFormTemplate]);

//   const handleFormChange = (index, field, value) => {
//     setForms((prevForms) => {
//       const updated = [...prevForms];
//       updated[index][field] = value;
//       return updated;
//     });
//   };

//   const handleCheckboxChange = (index, field, checked) => {
//     handleFormChange(index, field, checked);
//   };

//   const handleAddAnother = () => {
//     setForms((prevForms) => [...prevForms, { ...initialFormTemplate }]);
//   };

//   const handleSaveAll = () => {
//   const newStepGroup = {
//     stepName,
//     url,
//     steps: [...forms], 
//   };
//   setCreatedSteps((prevSteps) => [...prevSteps, newStepGroup]);
//   setStepName('');
//   setUrl('');
//   setForms([initialFormTemplate]);
//   toggle(); // Close modal
// };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
//       <ModalHeader>Add Step Details</ModalHeader>
//       <ModalBody>
//         <Form>
//           {/* Global Fields */}
//           <Row>
//             <Col md="12">
//               <FormGroup>
//                 <Label for="stepName">Step Name</Label>
//                 <Input
//                   type="text"
//                   name="stepName"
//                   id="stepName"
//                   value={stepName}
//                   onChange={(e) => setStepName(e.target.value)}
//                 />
//               </FormGroup>
//             </Col>
//             <Col md="12">
//               <FormGroup>
//                 <Label for="url">URL</Label>
//                 <Input
//                   type="url"
//                   name="url"
//                   id="url"
//                   value={url}
//                   onChange={(e) => setUrl(e.target.value)}
//                 />
//               </FormGroup>
//             </Col>
//           </Row>

//           {/* Step Forms */}
//           {forms.map((form, index) => (
//             <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
//               <h5>Step {index + 1}</h5>
//               <Row>
//                 <Col md="4">
//                   <FormGroup>
//                     <Label>Element Type</Label>
//                     <Input
//                       type="select"
//                       value={form.elemType}
//                       onChange={(e) => handleFormChange(index, 'elemType', e.target.value)}
//                     >
//                       <option>Select Element</option>
//                       <option>Input</option>
//                       <option>Select</option>
//                       <option>Button</option>
//                       <option>Span</option>
//                       <option>Div</option>
//                       <option>Form</option>
//                     </Input>
//                   </FormGroup>
//                 </Col>
//                 <Col md="4">
//                   <FormGroup>
//                     <Label>Find By</Label>
//                     <Input
//                       type="select"
//                       value={form.findBy}
//                       onChange={(e) => handleFormChange(index, 'findBy', e.target.value)}
//                     >
//                       <option>Select Value</option>
//                       <option>Id</option>
//                       <option>Name</option>
//                       <option>XPath</option>
//                       <option>ClassName</option>
//                       <option>TagName</option>
//                       <option>CssSelector</option>
//                     </Input>
//                   </FormGroup>
//                 </Col>
//                 <Col md="4">
//                   <FormGroup>
//                     <Label>Depth</Label>
//                     <Input
//                       type="number"
//                       value={form.depth}
//                       min="0"
//                       onChange={(e) => handleFormChange(index, 'depth', e.target.value)}
//                     />
//                   </FormGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md="6">
//                   <FormGroup>
//                     <Label>Element Input</Label>
//                     <Input
//                       type="text"
//                       value={form.elemInput}
//                       onChange={(e) => handleFormChange(index, 'elemInput', e.target.value)}
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col md="6">
//                   <FormGroup>
//                     <Label>Find Value</Label>
//                     <Input
//                       type="text"
//                       value={form.findValue}
//                       onChange={(e) => handleFormChange(index, 'findValue', e.target.value)}
//                     />
//                   </FormGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md="4">
//                   <FormGroup>
//                     <Label>Step Action</Label>
//                     <Input
//                       type="select"
//                       value={form.stepAction}
//                       onChange={(e) => handleFormChange(index, 'stepAction', e.target.value)}
//                     >
//                       <option>Select Value</option>
//                       <option>InputText</option>
//                       <option>Click</option>
//                       <option>SelectValue</option>
//                       <option>Navigate</option>
//                     </Input>
//                   </FormGroup>
//                 </Col>
//                 <Col md="4">
//                   <FormGroup>
//                     <Label>Wait Time</Label>
//                     <Input
//                       type="number"
//                       value={form.waitTime}
//                       min="0"
//                       onChange={(e) => handleFormChange(index, 'waitTime', e.target.value)}
//                     />
//                   </FormGroup>
//                 </Col>
//                 <Col md="4">
//                   <FormGroup check style={{ marginTop: '2.3rem' }}>
//                     <Label check>
//                       <Input
//                         type="checkbox"
//                         checked={form.isActive}
//                         onChange={(e) => handleCheckboxChange(index, 'isActive', e.target.checked)}
//                       />
//                       Is Active
//                     </Label>
//                   </FormGroup>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col md="12">
//                   <FormGroup>
//                     <Label>Notes</Label>
//                     <Input
//                       type="textarea"
//                       value={form.notes}
//                       onChange={(e) => handleFormChange(index, 'notes', e.target.value)}
//                       style={{ height: '100px' }}
//                     />
//                   </FormGroup>
//                 </Col>
//               </Row>
//             </div>
//           ))}
//         </Form>
//         <Button  onClick={handleAddAnother} style={{justifyContent: 'right', backgroundColor: 'gray'}}>
//           <Icon icon="plus" color="white" /> Add Another
//         </Button>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="secondary" onClick={toggle}>
//           <Icon icon="cross" color="white" /> Cancel
//         </Button>
//         <Button color="primary" onClick={handleSaveAll}>
//           <Icon icon="tick" color="white" /> Save All
//         </Button>
        
//       </ModalFooter>
//     </Modal>
//   );
// };

// StepDetails.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   toggle: PropTypes.func.isRequired,
//   setCreatedSteps: PropTypes.func.isRequired,
// };

// export default StepDetails;



import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Icon } from '@blueprintjs/core';

const StepDetails = ({ isOpen, toggle, setCreatedSteps }) => {
  const [initialValues, setInitialValues] = useState({
    url: '',
    elemType: '',
    findBy: '',
    depth: 0,
    elemInput: 'Default',
    findValue: '',
    stepAction: 'Default',
    waitTime: 0,
    // runScan: false,
    isActive: false,
    notes: '',
  });

  const handleCheckboxChange = (event) => {
    const { checked, name } = event.target;
    
    if (name === 'isActive') {
      // Set isActive property in initialValues
      setInitialValues((prevValues) => ({...prevValues, [name]: checked}))
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Starting handleSubmit...');
    try {
      const form = document.getElementById('steps');
      const formData = new FormData(form);
      const stepRequest = {
        url: formData.get('url'),
        elemType: formData.get('elemType'),
        findBy: formData.get('findBy'),
        depth: formData.get('depth'),
        elemInput: formData.get('elemInput'),
        findValue: formData.get('findValue'),
        stepAction: formData.get('stepAction'),
        waitTime: formData.get('waitTime'),
        // runScan: formData.get('runScan'),
        isActive: formData.get('isActive'),
        notes: formData.get('notes'),
      };

      // update steps state in NewScans component
      setCreatedSteps((prevSteps) => [...prevSteps, stepRequest]);

      // send the scan request to MongoDB endpoint
     toggle(); // close the modal after submission
    } catch (error) {
      console.error('Error submitting step request:', error);
    }
  };
  

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader>Add Step Details</ModalHeader>
      <ModalBody>
        <Form id="steps" initialValues={initialValues} onSubmit={handleSubmit}>
          <Row>
          <Col md="12">
            <FormGroup>
              <Label for="url">URL</Label>
              <Input type="url" name="url" id="url" />
            </FormGroup>
          </Col>
          </Row>
          <Row>
          <Col md="4">
            <FormGroup>
            <Label for="elemType">Element Type</Label>
            <Input type="select" name="elemType" id="elemType">
              <option>Select Element</option>
              <option>Input</option>
              <option>Select</option>
              <option>Button</option>
              <option>Span</option>
              <option>Div</option>
              <option>Form</option>
              {/*
              {elemTypeOptions.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
              */}
            </Input>
            </FormGroup>
          </Col>
          <Col md="3">
          <FormGroup>
            <Label for="findBy">Find Element By</Label>
            <Input type="select" name="findBy" id="findBy">
              <option>Select Value</option>
              <option>Id</option>
              <option>Name</option>
              <option>XPath</option>
              <option>ClassName</option>
              <option>TagName</option>
              <option>CssSelector</option>
            </Input>
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup className="col-md-4">
              <Label for="depth">Depth</Label>
              <Input type="number" name="depth" id="depth" min="0" />
            </FormGroup>
          </Col>
          </Row>
          <Row>
          <Col md="12">
            <FormGroup>
              <Label for="elemInput">Element Input</Label>
              <Input type="text" name="elemInput" id="elemInput" />
            </FormGroup>
          </Col>
          </Row>
          <Row>
          <Col md="4">
            <FormGroup>
              <Label for="findValue">Find Value</Label>
              <Input type="text" name="findValue" id="findValue" />
            </FormGroup>
          </Col>
          <Col md="2">
          <FormGroup>
            <Label for="stepAction">Step Action</Label>
            <Input type="select" name="stepAction" id="stepAction">
              <option>Select Value</option>
              <option>InputText</option>
              <option>Click</option>
              <option>SelectValue</option>
              <option>Navigate</option>
            </Input>
          </FormGroup>
          </Col>
          <Col md="2">
            <FormGroup>
              <Label for="waitTime">Wait Time</Label>
              <Input type="number" name="waitTime" id="waitTime" min="0" />
            </FormGroup>
          </Col>
          <Col md="4">
            <FormGroup className="row-md-4">
              <FormGroup check inline style={{ marginTop: '2.3rem' }}>
                <Label for="runScan" check>
                  <Input 
                    type="checkbox" 
                    name="runScan"
                    id="runScan"
                    disabled
                    />
                  Run Scan
                </Label>
              </FormGroup>
              <FormGroup check inline style={{ marginTop: '2.3rem' }}>
                <Label for="isActive" check>
                  <Input 
                    type="checkbox" 
                    name="isActive" 
                    id="isActive"
                    checked={initialValues.isActive}
                    onChange={(e) => handleCheckboxChange(e)}
                    />
                  Is Active
                </Label>
              </FormGroup>
            </FormGroup>
          </Col>
          </Row>
          <Row>
          <Col md="12">
            <FormGroup>
              <Label for="notes">Notes</Label>
              <Input type="textarea" name="notes" id="notes" style={{ height: '120px'}} />
            </FormGroup>
          </Col>
          </Row>
        </Form>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
          <Icon icon='cross' color='white' /> Cancel
          </Button>
          <Button color="primary" type="submit" onClick={(event) => handleSubmit(event)}>
          <Icon icon='tick' color='white' /> Save
          </Button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

StepDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  setCreatedSteps: PropTypes.func.isRequired,
};

export default StepDetails;
