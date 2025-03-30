import { TrackerItem } from "@homeremote/types";
import { FC } from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import useStyles from "./Map.styles";

interface Props {
    coords: TrackerItem[][];
}

export const AssetsChart: FC<Props> = ({ coords }) => {
    const { classes } = useStyles();

    const asset1 = coords[0]; // Traccar is not sending batteryLevel attribute.
    const data = asset1
        ? asset1.map((item) => ({
              battery: item.batteryLevel, // ? parseInt(item.battery, 10) : -1,
              // temperature: item.temperature, // ? parseInt(item.temperature, 10) : -1,
          }))
        : [];

    return (
        <div className={classes.chart}>
            <LineChart width={500} height={150} data={data}>
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="battery"
                    stroke="#8884d8"
                    dot={false}
                />
                <YAxis
                    yAxisId="left"
                    orientation="left"
                    label="%"
                    width={75}
                    domain={[0, 100]}
                />
                {/* <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#888400"
                /> */}
                {/* <YAxis
                    yAxisId="right"
                    orientation="right"
                    label="°C"
                    width={75}
                /> */}
                <XAxis dataKey="time" />
                <Tooltip
                    formatter={(value, name) => {
                        if (name === "battery") {
                            return `${value}%`;
                        }
                        if (name === "temperature") {
                            return `${value}°C`;
                        }
                        return value;
                    }}
                />
            </LineChart>
        </div>
    );
};
