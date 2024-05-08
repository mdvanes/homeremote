import { Box } from "@mui/material";
import { FC } from "react";
import { useGetElectricExportsQuery } from "../../../../Services/generated/energyUsageApi";

export const ElectricChart: FC = () => {
    const { data } = useGetElectricExportsQuery();
    return (
        <>
            ElectricChart
            {/* {JSON.stringify(data, null, 2)} */}
            <Box
                style={{
                    overflowX: "scroll",
                }}
            >
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>file name</th>
                            <th>date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((file) => (
                            <>
                                {file.dateMillis && (
                                    <tr key={file.exportName}>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td style={{ minWidth: "250px" }}>
                                            {file.exportName}
                                        </td>
                                        <td style={{ minWidth: "150px" }}>
                                            {new Date(
                                                file.dateMillis
                                            ).toLocaleDateString("en-gb", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                weekday: "short",
                                            })}
                                        </td>
                                        {file.entries?.map((e, i) => (
                                            <td
                                                key={i}
                                                style={{
                                                    textAlign: "right",
                                                    minWidth: "50px",
                                                }}
                                                title={e.time}
                                            >
                                                {e.v}
                                                {/* {e.v} v{e.v1} */}
                                                {/* {JSON.stringify(e)} */}
                                            </td>
                                        ))}
                                        {/* <td>{JSON.stringify(file)}</td> */}
                                    </tr>
                                )}
                            </>
                        ))}{" "}
                    </tbody>
                </table>
            </Box>
        </>
    );
};
