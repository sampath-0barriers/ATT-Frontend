import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Row, Col, Input } from 'reactstrap';
import DashCard from '../dashboardCards/DashCard';
import { useAxios } from "../../../utils/AxiosProvider";
import { errorNotification } from '../../../utils';

const CryptoChart = () => {
  //Line chart
  const [monthlyScans, setMonthlyScans] = useState([]);
  const client = useAxios();

  useEffect(() => {
    const fetchScanData = async () => {
      try {
        const response = await client.get('/scan_request'); // replace with actual endpoint
        const scans = response.data;

        // process scans data to count scans for each month
        const scansByMonth = Array(12).fill(0);

        scans.forEach((scan) => {
          const monthIndex = new Date(scan.date_created).getMonth();
          scansByMonth[monthIndex]++;
        });

        setMonthlyScans(scansByMonth);
      } catch (error) {
        console.error('Error fetching scan data:', error);
        const errMsg = error?.response?.data?.error || error?.response?.data || error?.response?.message || "Something went wrong. Please try again later.";
        errorNotification('Error', errMsg);
      }
    };

    fetchScanData();
  }, []);

  const optionscryptocharts = {
    chart: {
      id: 'basic-bar',
      fontFamily: '"Nunito", sans-serif',
      type: 'area',
      toolbar: {
        show: false,
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 4,
    },
    fill: {
      type: 'solid',
      opacity: [0.1, 0.2, 0.9],
    },
    colors: ['#FFBF00'],
    legend: {
      show: false,
    },
    markers: {
      size: 3,
    },
    xaxis: {
      categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      labels: {
        show: true,
        style: {
          colors: '#99abb4',
          fontSize: '12px',
          fontFamily: "'Nunito Sans', sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: '#99abb4',
          fontSize: '12px',
          fontFamily: "'Nunito Sans', sans-serif",
        },
      },
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: 'dark',
    },
  };
  const seriescryptocharts = [
    {
      name: 'Scans',
      data: monthlyScans
    }
  ];
  return (
    /*--------------------------------------------------------------------------------*/
    /* Used In Dashboard-2 [Cryptocurrency]                                           */
    /*--------------------------------------------------------------------------------*/
    <Row>
      <Col xs="12">
        <DashCard
          title="Overall Summary of Scans"
          subtitle="Monthly"
          actions={
            <Input type="select" className="custom-select">
              <option value="0">Monthly</option>
              <option value="1">Weekly</option>
              <option value="2">Daily</option>
            </Input>
          }
        >
          <div className="mt-4">
            <Chart
              options={optionscryptocharts}
              series={seriescryptocharts}
              type="area"
              height="350"
            />
          </div>
        </DashCard>
      </Col>
    </Row>
  );
};

export default CryptoChart;