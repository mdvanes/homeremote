import { FC } from "react";
import { useGetElectricExportsQuery } from "../../../../Services/generated/energyUsageApi";

export const ElectricChart: FC = () => {
    const { data } = useGetElectricExportsQuery();
    return (
        <>
            ElectricChart {JSON.stringify(data, null, 2)}
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
                                <tr>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>{file.exportName}</td>
                                    <td>
                                        {new Date(
                                            file.dateMillis
                                        ).toLocaleDateString("en-gb", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            weekday: "short",
                                        })}
                                    </td>
                                    <td>{JSON.stringify(file)}</td>
                                </tr>
                            )}
                        </>
                    ))}{" "}
                </tbody>
            </table>
        </>
    );
};
