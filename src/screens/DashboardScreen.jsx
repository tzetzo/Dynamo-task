import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Space } from "antd";
import Highcharts from "highcharts";
import PieChart from "highcharts-react-official";

const boxStyles = {
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: "1.2em",
  display: "grid",
  justifyContent: "center",
  alignItems: "center",
  padding: "50px",
  border: "6px solid black",
  fontWeight: 700,
  textTransform: "uppercase",
};

const chartOptions = {
  title: {
    text: "Portfolio Distribution",
  },
  chart: {
    type: "pie",
  },
  tooltip: {
    valueSuffix: "%",
  },
  plotOptions: {
    series: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: [
        {
          enabled: true,
          distance: 20,
        },
        {
          distance: -40,
          format: "{point.percentage:.1f}%",
          style: {
            fontSize: "1.2em",
            textOutline: "none",
            opacity: 0.7,
          },
        },
      ],
    },
  },
  series: [
    {
      name: "Percentage",
      colorByPoint: true,
      width: "100%",
      data: [],
    },
  ],
};

const DashboardScreen = () => {
  const [assets, setAssets] = useState([]);
  const [investedValue, setInvestedValue] = useState([]);
  const chartComponentRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("https://interviews-live.deno.dev/assets/");
      const buyAssets = res.data.items.filter((item) => item.type === "buy");
      setAssets(buyAssets);

      setInvestedValue(
        res.data.items.reduce(
          (acc, curr) => curr.amount * curr.pricePerUnit + acc,
          0
        )
      );

      // format chart data
      const chartData = {};
      buyAssets.forEach((asset) => {
        if (!chartData[asset.assetType]) chartData[asset.assetType] = 1;
        else chartData[asset.assetType] = chartData[asset.assetType] + 1;
      });

      const chartDataArray = [];
      for (const property in chartData) {
        chartDataArray.push({
          name: property.replaceAll(/_/g, " "),
          y: Number(
            ((chartData[property] * 100) / buyAssets.length).toFixed(2)
          ),
        });
      }

      chartComponentRef.current.chart.series[0].setData(chartDataArray);
    }
    fetchData();
  }, []);

  const renderCards = () => {
    return assets.map((asset, i) => {
      return (
        <Card title={<b>Investment card</b>} key={i}>
          <div style={{ color: "grey" }}>
            <p>Name: {asset.name}</p>
            <p>Type of Asset: {asset.assetType}</p>
            <p>Value: {asset.amount * asset.pricePerUnit}</p>
          </div>
          <Space>
            <Button>
              <b>Buy/Sell</b>
            </Button>
            <Button>
              <b>T. History</b>
            </Button>
          </Space>
        </Card>
      );
    });
  };

  return (
    <div style={{ padding: "50px" }}>
      <Space
        direction="horizontal"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 500px))",
          justifyContent: "space-around",
          marginBottom: "50px",
        }}
      >
        <div style={boxStyles}>
          <div>Invested value</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {investedValue} $
          </div>
        </div>
        <div style={boxStyles}>
          <PieChart
            highcharts={Highcharts}
            options={chartOptions}
            ref={chartComponentRef}
          />
        </div>
      </Space>
      <Space
        direction="horizontal"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
        }}
      >
        {renderCards()}
      </Space>
    </div>
  );
};

export default DashboardScreen;
