import { TrackerItem } from "@homeremote/types";
import { FC } from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import useStyles from "./Map.styles";

interface Props {
    coords: TrackerItem[][];
    setActiveMarkerTimestamp: (timestamp: string) => void;
}

export const AssetsChart: FC<Props> = ({
    coords,
    setActiveMarkerTimestamp,
}) => {
    const { classes } = useStyles();

    const asset1 = coords[0]; // Traccar is not sending batteryLevel attribute.
    const data = asset1
        ? asset1.map((item) => ({
              battery: item.batteryLevel, // ? parseInt(item.battery, 10) : -1,
              time: item.time,
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
                    activeDot={{
                        onMouseOver: (_fn, point) => {
                            const p = point as { payload?: { time?: string } };
                            setActiveMarkerTimestamp(p?.payload?.time ?? "");
                        },
                        onMouseOut: (_fn, point) => {
                            setActiveMarkerTimestamp("");
                        },
                    }}
                />
                <YAxis
                    yAxisId="left"
                    orientation="left"
                    label="%"
                    width={75}
                    domain={[0, 100]}
                />
                <XAxis
                    dataKey="time"
                    tickFormatter={(value) =>
                        new Date(value.toString()).toLocaleString("en-uk", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                    }
                />
                <Tooltip
                    labelFormatter={(value) =>
                        new Date(value.toString()).toLocaleString("en-uk")
                    }
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
