import React from 'react';

import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';

import ComponentCard from '../../components/ComponentCard';

const ContactUs = () => {
  return (
    <div>
      <Row>
        <Col md="12">
          <ComponentCard title="Email">
            <Form>
              <FormGroup>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  type="subject"
                  name="subject"
                  id="subject"
                  placeholder="Subject Here"
                />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input type="textarea" rows="10" />
              </FormGroup>
              <Button color="primary">Submit</Button>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};

export default ContactUs;
