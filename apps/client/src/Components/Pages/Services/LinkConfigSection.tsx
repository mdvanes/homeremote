import { ServiceLinkType, ServiceStack } from "@homeremote/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkIcon from "@mui/icons-material/Link";
import {
    Box,
    Button,
    Collapse,
    FormControl,
    FormControlLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from "@mui/material";
import { FC, useMemo, useState } from "react";
import {
    GetCaddyInfoApiResponse,
    useGetCaddyInfoQuery,
} from "../../../Services/generated/caddyInfoApiWithRetry";
import { useSetLinkConfigMutation } from "../../../Services/servicesApi";

interface LinkConfigSectionProps {
    stack: ServiceStack;
}

const publishedPorts = (stack: ServiceStack): number[] => {
    const ports = new Set<number>();
    stack.containers.forEach((container) =>
        container.ports.forEach((port) => {
            if (!port.internal && port.publicPort) {
                ports.add(port.publicPort);
            }
        })
    );
    return [...ports].sort((a, b) => a - b);
};

const findCaddyDomains = (
    caddyInfo: GetCaddyInfoApiResponse | undefined,
    stack: ServiceStack
): string[] => {
    if (!caddyInfo?.reachable) {
        return [];
    }
    const urlWithoutScheme = stack.link?.url?.replace(/^https?:\/\//, "");
    const domains = new Set<string>();
    for (const server of caddyInfo.servers ?? []) {
        for (const route of server.routes) {
            const matchesUpstream = route.upstreams.some((upstream) => {
                return upstream === urlWithoutScheme;
            });
            if (matchesUpstream) {
                route.domains.forEach((domain) => domains.add(domain));
            }
        }
    }
    return [...domains].sort();
};

export const LinkConfigSection: FC<LinkConfigSectionProps> = ({ stack }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [setLinkConfig, { isLoading }] = useSetLinkConfigMutation();

    const ports = useMemo(() => publishedPorts(stack), [stack]);
    const link = stack.link;
    const [type, setType] = useState<ServiceLinkType>(link?.type ?? "none");
    const [port, setPort] = useState<number>(link?.port ?? ports[0] ?? 0);
    const [fqdn, setFqdn] = useState<string>(link?.fqdn ?? "");
    const [icon, setIcon] = useState<string>(link?.icon ?? "");

    const { data: caddyInfo } = useGetCaddyInfoQuery();
    const caddyDomains = useMemo(
        () => findCaddyDomains(caddyInfo, stack),
        [caddyInfo, stack]
    );

    const preview =
        type === "none"
            ? "no link"
            : type === "port"
              ? `→ port ${port}`
              : `→ https://${fqdn || "hostname"}`;

    const save = async () => {
        await setLinkConfig({
            stack: stack.Name,
            config: {
                type,
                port: type === "port" ? port : undefined,
                fqdn: type === "fqdn" ? fqdn : undefined,
                icon: icon || undefined,
            },
        });
    };

    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                marginX: 1,
                marginY: 1,
            }}
        >
            <Box
                onClick={() => setIsOpen((prev) => !prev)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    paddingX: 1,
                    paddingY: 0.75,
                    cursor: "pointer",
                    fontSize: 13,
                }}
            >
                <LinkIcon sx={{ fontSize: 16 }} />
                <span>Service link</span>
                <Box
                    component="span"
                    sx={{
                        fontSize: 11,
                        color: "primary.main",
                        fontFamily: "monospace",
                        marginLeft: 0.5,
                    }}
                >
                    {link?.url ?? preview}
                </Box>
                <ExpandMoreIcon
                    sx={{
                        marginLeft: "auto",
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.15s",
                    }}
                />
            </Box>
            <Collapse in={isOpen}>
                <Box sx={{ paddingX: 1.5, paddingBottom: 1.5 }}>
                    <Box
                        sx={{
                            fontSize: 11,
                            color: "text.secondary",
                            marginBottom: 1,
                        }}
                    >
                        Controls the link icon on the dashboard row and the
                        button in the service bar.
                    </Box>
                    <FormControl>
                        <RadioGroup
                            value={type}
                            onChange={(event) =>
                                setType(event.target.value as ServiceLinkType)
                            }
                        >
                            <FormControlLabel
                                value="none"
                                control={<Radio size="small" />}
                                label="No link"
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <FormControlLabel
                                    value="port"
                                    control={<Radio size="small" />}
                                    label="Direct port"
                                />
                                <Select
                                    size="small"
                                    value={ports.length ? port : ""}
                                    disabled={type !== "port" || !ports.length}
                                    onChange={(event) =>
                                        setPort(Number(event.target.value))
                                    }
                                    sx={{ fontSize: 12, minWidth: 110 }}
                                >
                                    {ports.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            :{option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <FormControlLabel
                                    value="fqdn"
                                    control={<Radio size="small" />}
                                    label="FQDN (Caddy)"
                                />
                                <TextField
                                    size="small"
                                    placeholder="service.home.arpa"
                                    value={fqdn}
                                    disabled={type !== "fqdn"}
                                    onChange={(event) =>
                                        setFqdn(event.target.value)
                                    }
                                    slotProps={{
                                        htmlInput: {
                                            "aria-label": "FQDN",
                                            style: { fontSize: 12 },
                                        },
                                    }}
                                />
                            </Box>
                            {caddyDomains.length > 0 && (
                                <Box
                                    sx={{
                                        fontSize: 11,
                                        color: "text.secondary",
                                        fontFamily: "monospace",
                                        marginLeft: 4,
                                    }}
                                >
                                    Caddy domain: {caddyDomains.join(", ")}
                                </Box>
                            )}
                        </RadioGroup>
                    </FormControl>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            marginTop: 1,
                        }}
                    >
                        <span>Icon</span>
                        <TextField
                            size="small"
                            placeholder="jellyfin"
                            value={icon}
                            onChange={(event) => setIcon(event.target.value)}
                            slotProps={{
                                htmlInput: {
                                    "aria-label": "Icon",
                                    style: { fontSize: 12 },
                                },
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            fontSize: 11,
                            color: "text.secondary",
                            fontFamily: "monospace",
                            marginTop: 0.5,
                        }}
                    >
                        {preview}
                    </Box>
                    <Box sx={{ marginTop: 1.5 }}>
                        <Button
                            size="small"
                            variant="outlined"
                            disabled={isLoading}
                            onClick={save}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

export default LinkConfigSection;
