import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

export default function PurchaseCancel() {
  const navigate = useNavigate();

  return (
    <Container>
      <Row className="mt-5">
        <Col md="12" className="text-center">
          <h1>Purchase Cancelled</h1>
          <p>
            Your purchase has been cancelled. Please try again later or choose a different payment
            method.
          </p>
          <Button color="primary" onClick={() => navigate('/license/pricing')}>
            Go to Pricing
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
