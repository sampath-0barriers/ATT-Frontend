// import { useState, useEffect } from 'react';
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardBody,
//   CardTitle,
//   CardSubtitle,
//   CardText,
//   Button,
//   CardImg,
// } from 'reactstrap';
// import { useAxios } from '../../utils/AxiosProvider';
// import { errorNotification, infoNotification } from '../../utils';

// export default function Pricing() {
//   const [licensePlans, setLicensePlans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const client = useAxios();

//   useEffect(() => {
//     getLicensePlans();
//   }, []);

//   const getLicensePlans = async () => {
//     try {
//       setLoading(true);
//       const response = await client.get('/license/plans');
//       console.log('License plans:', response.data);
//       setLicensePlans(response?.data);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.error('Error fetching license plans:', error);
//       const errMsg =
//         error?.response?.data?.error ||
//         error?.response?.data ||
//         error?.response?.message ||
//         'Something went wrong. Please try again later.';
//       errorNotification('Error', errMsg);
//     }
//   };

//   const handleCheckout = (planId) => {
//     console.log('Checkout for plan:', planId);
//     setLoading(true);
//     client
//       .post('license/create-checkout-session', { planId })
//       .then((res) => {
//         console.log('Checkout session created', res);
//         infoNotification('Info', 'Redirecting to payment page in a few seconds...');
//         setLoading(false);
//         setTimeout(() => {
//           window.open(res.data.url, '_blank');
//         }, 2000);
//       })
//       .catch((error) => {
//         console.log('Checkout failed', error);
//         const errMsg =
//           error?.response?.data?.error ||
//           error?.response?.data ||
//           error?.response?.message ||
//           'Something went wrong. Please try again later.';
//         errorNotification('Error', errMsg);
//         setLoading(false);
//       });
//   };

//   return (
//     <Container className="my-5">
//       <h1 className="text-center mb-4">Choose Your License</h1>
//       <Row>
//         {!licensePlans.length && loading && (
//           <Col sm="12">
//             <h3 className="text-center">Loading plans...</h3>
//           </Col>
//         )}
//         {licensePlans.map((plan) => (
//           <Col sm="12" md="4" key={plan.id}>
//             <Card className="mb-4">
//               <CardImg top width="100%" src={plan.images[0]} alt={plan.name} />
//               <CardBody>
//                 <CardTitle tag="h3">{plan.name}</CardTitle>
//                 <CardSubtitle tag="h6" className="mb-2 text-muted">
//                   {plan.description}
//                 </CardSubtitle>
//                 <CardText>
//                   <strong>Price: ${plan.price}</strong>
//                   <br />
//                   <strong>Duration: {plan.duration} days</strong>
//                   <br />
//                   <strong>Max Users: {plan.restrictions.maxUsers}</strong>
//                   <br />
//                   <strong>Max Projects: {plan.restrictions.maxProjects}</strong>
//                   <br />
//                   <strong>Max Scans: {plan.restrictions.maxScans}</strong>
//                 </CardText>
//                 <Button color="primary" onClick={() => handleCheckout(plan.id)} disabled={loading}>
//                   Select
//                 </Button>
//               </CardBody>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// }



import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
} from 'reactstrap';
import { useAxios } from '../../utils/AxiosProvider';
import { errorNotification, infoNotification } from '../../utils';

export default function Pricing() {
  const [licensePlans, setLicensePlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const client = useAxios();

  useEffect(() => {
    getLicensePlans();
  }, []);

  const getLicensePlans = async () => {
    try {
      setLoading(true);
      const response = await client.get('/license/plans');
      setLicensePlans(response?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.response?.message ||
        'Something went wrong. Please try again later.';
      errorNotification('Error', errMsg);
    }
  };

  const handleCheckout = (planId) => {
    setLoading(true);
    client
      .post('license/create-checkout-session', { planId })
      .then((res) => {
        infoNotification('Info', 'Redirecting to payment page...');
        setLoading(false);
        setTimeout(() => {
          window.open(res.data.url, '_blank');
        }, 2000);
      })
      .catch((error) => {
        const errMsg =
          error?.response?.data?.error ||
          error?.response?.data ||
          error?.response?.message ||
          'Something went wrong. Please try again later.';
        errorNotification('Error', errMsg);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="pricing-wrapper">
        <Container>
          <h3 className="text-center mb-5">Choose Your License</h3>
          <Row className="justify-content-center">
            {!licensePlans.length && loading && (
              <Col sm="12">
                <h3 className="text-center text-white">Loading plans...</h3>
              </Col>
            )}
            {licensePlans.map((plan, index) => (
              <Col key={plan.id} md="4" sm="12" className="d-flex justify-content-center mb-4">
                <Card className={`plan-card plan-${plan.name.toLowerCase()}`}>
                  <CardBody className="text-center">
                    <div className="plan-title">{plan.name}</div>
                    <div className="plan-price">
                      <sup>$</sup>{plan.price}<span className="plan-duration">/mo</span>
                    </div>
                    <div className="plan-subtitle">{plan.description}</div>
                    <Button
                      color="light"
                      className="mt-3 mb-4 plan-button"
                      onClick={() => handleCheckout(plan.id)}
                      disabled={loading}
                    >
                      GET STARTED
                    </Button>
                    <ul className="plan-features list-unstyled">
                      <li>
                        ✅ {plan.restrictions.maxProjects} new projects / month
                      </li>
                      <li>
                        {plan.restrictions.basicInteraction ? '✅' : '❌'} Basic interaction
                      </li>
                      <li>
                        {plan.restrictions.assetsLibrary ? '✅' : '❌'} Assets library
                      </li>
                    </ul>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <style>
        {`
        .pricing-wrapper {
          // background: #1f1f3d;
          min-height: 100vh;
          padding: 20px 0;
        }

        .plan-card {
          border: none;
          border-radius: 10px;
          width: 100%;
          max-width: 300px;
          padding: 30px 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          background: #fff;
        }

        .plan-card.plan-lite {
          border-top: 6px solid #a993ff;
        }

        .plan-card.plan-pro {
          border-top: 6px solid #fbc786;
        }

        .plan-card.plan-free {
          border-top: 6px solid #e0e0e0;
        }

        .plan-title {
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .plan-price {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #000;
        }

        .plan-price sup {
          font-size: 18px;
          top: -0.5em;
        }

        .plan-duration {
          font-size: 14px;
          color: #888;
        }

        .plan-subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }

        .plan-button {
          font-weight: bold;
          border: 1px solid #ccc;
        }

        .plan-features {
          font-size: 14px;
          color: #333;
        }

        .plan-features li {
          margin-bottom: 10px;
        }

        @media (max-width: 768px) {
          .plan-card {
            max-width: 100%;
          }

          .pricing-wrapper {
            padding: 30px 15px;
          }
        }
      `}
      </style>
    </>
  );
}
