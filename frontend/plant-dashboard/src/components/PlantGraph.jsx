import React, { useContext, useEffect, useState } from "react";
import {TimeEvent, TimeRange, TimeSeries} from "pondjs";
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";

export default function PlantGraph(props) {

    const series1 = [100,2000,3000,4000,500];

    var beginTime = new Date("2023-05-05T13:26:30.152Z");
    var midTime = new Date("2023-05-05T16:02:14.593Z");
    var endTime =   new Date("2023-05-05T17:32:40.402Z");
    var range = new TimeRange(beginTime, endTime);

    const events = [];
    events.push(new TimeEvent(new Date("2023-05-05T13:26:30.152Z"), {value: 1500}));
    events.push(new TimeEvent(new Date("2023-05-05T16:02:14.593Z"), {value: 2000}));
    events.push(new TimeEvent(new Date("2023-05-05T17:32:40.402Z"), {value: 2500}));

    const series = new TimeSeries({
        name: "moisture_level",
        events: events
    });


  return (
    <>
        <p>{`Begin time is ${beginTime.getTime()}`}</p>
        <p>{`End time is ${endTime.getTime()}`}</p>
        <p>{`Range is ${range}`}</p>
        <p>{`Series is ${series}`}</p>
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
