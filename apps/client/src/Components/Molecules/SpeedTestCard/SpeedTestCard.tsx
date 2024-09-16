import SpeedIcon from "@mui/icons-material/Speed";
import {
    Card,
    CardContent,
    Fab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { FC, useEffect, useState } from "react";

interface SpeedTestResponse {
    message: string;
    data: {
        id: number;
        ping: number;
        download: number;
        upload: number;
        server_id: number;
        server_host: string;
        server_name: string;
        url: string;
        scheduled: boolean;
        failed: boolean;
        created_at: string;
        updated_at: string;
    };
}

const FORMAT_DEFAULT_LOCALE = "nl-NL";

const FORMAT_DATE = new Intl.DateTimeFormat(FORMAT_DEFAULT_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

const BASE_URL = "http://192.168.0.8:8089";

// NOTE: this hacky implementation is because the API is deprecated, but there is no replacement API yet.
const fetchSpeedTest = async () => {
    const response = await fetch(`${BASE_URL}/api/speedtest/latest`);
    const data: SpeedTestResponse = await response.json();
    return data;
};

export const SpeedTestCard: FC = () => {
    const [speedTestResult, setSpeedTestResult] = useState<SpeedTestResponse>();

    const fetchSpeedTestAndSet = async () => {
        const result = await fetchSpeedTest();
        setSpeedTestResult(result);
    };

    useEffect(() => {
        fetchSpeedTestAndSet();
    }, []);

    if (!speedTestResult) {
        return null;
    }

    return (
        <Card>
            <CardContent sx={{ position: "relative" }}>
                <Table sx={{ marginBottom: 3 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>down</TableCell>
                            <TableCell>up</TableCell>
                            <TableCell>ping</TableCell>
                            <TableCell>timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            hover
                            onClick={() => window.open(BASE_URL)}
                            title="Open speedtest-tracker"
                            style={{ cursor: "pointer" }}
                        >
                            <TableCell>
                                {Math.round(speedTestResult.data.download)}
                                Mbps
                            </TableCell>
                            <TableCell>
                                {Math.round(speedTestResult.data.upload)}
                                Mbps
                            </TableCell>
                            <TableCell>
                                {Math.round(speedTestResult.data.ping)}ms
                            </TableCell>
                            <TableCell>
                                {FORMAT_DATE.format(
                                    new Date(speedTestResult.data.updated_at)
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <Fab
                    color="primary"
                    aria-label="speed"
                    size="small"
                    onClick={fetchSpeedTestAndSet}
                    title="Get latest speedtest result"
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                    }}
                >
                    <SpeedIcon />
                </Fab>
            </CardContent>
        </Card>
    );
};
