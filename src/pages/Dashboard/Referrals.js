import React from "react";
import {
  Card, CardBody, CardTitle, CardSubtitle
} from "reactstrap";
import ReactApexChart from "react-apexcharts";

const ReferralsStats = () => {
  const series = [
    {
      name: "series1",
      data: [34, 40, 28, 52, 42, 109, 100],
    },
    {
      name: "series2",
      data: [32, 60, 34, 46, 34, 52, 41],
    },
  ];

  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },

    colors: ["#556ee6", "#34c38f"],
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00",
        "2018-09-19T01:30:00",
        "2018-09-19T02:30:00",
        "2018-09-19T03:30:00",
        "2018-09-19T04:30:00",
        "2018-09-19T05:30:00",
        "2018-09-19T06:30:00",
      ],
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle>Referrals</CardTitle>
          <CardSubtitle className="mb-3">
              Referrals Stats
          </CardSubtitle>
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height="350"
          />

          
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ReferralsStats;