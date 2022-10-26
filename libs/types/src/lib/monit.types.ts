export interface MonitXml {
    monit: {
        server: {
            id: string;
            incarnation: number;
            version: string;
            uptime: number;
            poll: number;
            startdelay: 0;
            localhostname: string;
            controlfile: string;
            httpd: {
                address: string;
                port: number;
                ssl: number;
            };
        };
        platform: {
            name: string;
            release: string;
            version: string;
            machine: string;
            cpu: number;
            memory: number;
            swap: number;
        };
        service: {
            name: string;
            collected_sec: number;
            collected_usec: number;
            status: number;
            status_hint: number;
            monitor: number;
            monitormode: number;
            onreboot: number;
            pendingaction: number;
            every: {
                type: number;
                counter: number;
                number: number;
            };
            program?: {
                started: number;
                status: number;
                output: number;
            };
            port?: {
                hostname: string;
                portnumber: number;
                request: string;
                protocol: string;
                type: string;
                responsetime: number;
            };
            fstype?: string;
            fsflags?: string;
            mode?: number;
            uid?: number;
            gid?: number;
            block?: {
                percent: number;
                usage: number;
                total: number;
            };
            inode?: {
                percent: number;
                usage: number;
                total: number;
            };
            read?: {
                bytes: {
                    count: number;
                    total: number;
                };
                operations: {
                    count: number;
                    total: number;
                };
            };
            write?: {
                bytes: {
                    count: number;
                    total: number;
                };
                operations: {
                    count: number;
                    total: number;
                };
            };
            servicetime?: {
                read: number;
                write: number;
            };
        }[];
    };
}

export interface MonitItem {
    localhostname: string;
    uptime: number;
    serviceNames: string[];
}

export interface GetMonitResponse {
    monitlist: MonitItem[];
}
