import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

export default function PurchaseSuccess() {
  const navigate = useNavigate();

  return (
    <Container>
      <Row className="mt-5">
        <Col md="12" className="text-center">
          <h1>Purchase Successful</h1>
          <p>
            Your purchase has been successful. You can now access the dashboard and start using the
            application.
          </p>
          <Button color="primary" onClick={() => navigate('/dashboards/crypto')}>
            Go to Dashboard
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
