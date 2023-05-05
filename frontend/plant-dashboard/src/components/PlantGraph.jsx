import React, { useEffect, useState } from "react";
import { TimeEvent, TimeSeries } from "pondjs";
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";

export default function PlantGraph(props) {
  let events = [];
  events.push(new TimeEvent(new Date("2023-05-05T13:26:30.152Z"), { value: 1500 }));
  events.push(new TimeEvent(new Date("2023-05-05T16:02:14.593Z"), { value: 2000 }));
  events.push(new TimeEvent(new Date("2023-05-05T17:32:40.402Z"), { value: 2500 }));

  // state variables
  const [data, setData] = useState([]);
  const [series, setSeries] = useState(
    new TimeSeries({
      name: "moisture_level",
      events: events,
    })
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to ping latest data from API
  function loadLatestData() {
    fetch("http://ryan-plant-dashboard.live:25565/data")
      .then((res) => res.json())
      .then((json) => {
        console.log(`JSON is: ${JSON.stringify(json.data, null, 2)}`);
        setData(json.data);
      })
      .catch((e) => {
        alert("An error occured while making the request");
      });
  }

  // Load data on page load
  useEffect(() => loadLatestData(), []);

  useEffect(() => {
    let events = data.map(
      (sensor_val) => new TimeEvent(new Date(sensor_val.timestamp), { value: sensor_val.moisture })
    );
    events.sort((event) => event.key())
    setSeries(
      new TimeSeries({
        name: "moisture_level",
        events: events,
      })
    );
    setIsLoaded(true);
  }, data);

  if (isLoaded) {
    return (
      <>
        <p>{`Series is ${JSON.stringify(series, null, 2)}`}</p>
        <p>{`Series length is ${series["points"]}`}</p>
        {/* <p>{`Data is ${JSON.stringify(data, null, 2)}`}</p> */}
        <ChartContainer timeRange={series.timerange()} width={800}>
          <ChartRow height="200">
            <YAxis id="axis1" label="Moisture Level" min={0} max={5000} width="60" type="linear" />
            <Charts>
              <LineChart axis="axis1" series={series} column={["moisture"]} />
            </Charts>
          </ChartRow>
        </ChartContainer>
      </>
    );
  }
  else {
    return <><p>Still loading!</p></>
  }
}
