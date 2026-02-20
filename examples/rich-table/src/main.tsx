import React, { useState, useEffect } from "react";
import {
  render,
  Box,
  Text,
  ScrollView,
  Table,
  TableRow,
  TableHeaderRow,
  TableCell,
  Progress,
  Spinner,
  Link,
  useInput,
} from "@semos-labs/glyph";

// ── Data ─────────────────────────────────────────────────────────

interface Service {
  name: string;
  status: "healthy" | "degraded" | "down";
  uptime: string;
  load: number;
  url: string;
  region: string;
  instances: number;
}

const SERVICES: Service[] = [
  { name: "API Gateway",    status: "healthy",  uptime: "45d 12h", load: 0.42, url: "https://api.example.com",    region: "us-east-1", instances: 3 },
  { name: "Auth Service",   status: "healthy",  uptime: "30d 6h",  load: 0.18, url: "https://auth.example.com",   region: "us-east-1", instances: 2 },
  { name: "User DB",        status: "degraded", uptime: "12d 3h",  load: 0.87, url: "https://db.example.com",     region: "eu-west-1", instances: 1 },
  { name: "Cache Layer",    status: "healthy",  uptime: "60d 0h",  load: 0.05, url: "https://cache.example.com",  region: "us-west-2", instances: 4 },
  { name: "Search Engine",  status: "down",     uptime: "0d 0h",   load: 0,    url: "https://search.example.com", region: "ap-south-1", instances: 0 },
  { name: "CDN Edge",       status: "healthy",  uptime: "90d 8h",  load: 0.33, url: "https://cdn.example.com",    region: "global",    instances: 12 },
  { name: "ML Pipeline",    status: "degraded", uptime: "5d 19h",  load: 0.95, url: "https://ml.example.com",     region: "us-east-1", instances: 2 },
  { name: "Notification Svc", status: "healthy", uptime: "22d 4h", load: 0.11, url: "https://notify.example.com", region: "eu-west-1", instances: 2 },
];

// ── Status badge ─────────────────────────────────────────────────

function StatusBadge({ status }: { status: Service["status"] }) {
  const color = status === "healthy" ? "green" : status === "degraded" ? "yellow" : "red";
  const icon = status === "healthy" ? "●" : status === "degraded" ? "◐" : "✖";
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Box style={{ flexDirection: "row", gap: 1 }}>
      <Text style={{ color }}>{icon}</Text>
      <Text style={{ color }}>{label}</Text>
    </Box>
  );
}

// ── Region badge ─────────────────────────────────────────────────

function RegionBadge({ region }: { region: string }) {
  const flag =
    region.startsWith("us") ? "🇺🇸"
    : region.startsWith("eu") ? "🇪🇺"
    : region.startsWith("ap") ? "🇮🇳"
    : "🌍";

  return (
    <Box style={{ flexDirection: "row", gap: 1 }}>
      <Text>{flag}</Text>
      <Text style={{ dim: true }}>{region}</Text>
    </Box>
  );
}

// ── Instance count ───────────────────────────────────────────────

function InstanceCount({ count }: { count: number }) {
  const color = count === 0 ? "red" : count < 3 ? "yellow" : "green";
  const blocks = "█".repeat(Math.min(count, 8));
  const remaining = count > 8 ? `+${count - 8}` : "";

  return (
    <Box style={{ flexDirection: "row", gap: 1 }}>
      <Text style={{ color }}>{blocks}{remaining}</Text>
      <Text style={{ dim: true }}>({count})</Text>
    </Box>
  );
}

// ── Animated load value ──────────────────────────────────────────

function AnimatedLoad({ baseLoad }: { baseLoad: number }) {
  const [load, setLoad] = useState(baseLoad);

  useEffect(() => {
    const timer = setInterval(() => {
      // Small random fluctuation ±5%
      const jitter = (Math.random() - 0.5) * 0.1;
      setLoad(Math.max(0, Math.min(1, baseLoad + jitter)));
    }, 2000);
    return () => clearInterval(timer);
  }, [baseLoad]);

  const color = load > 0.8 ? "red" : load > 0.5 ? "yellow" : "green";
  const pct = `${Math.round(load * 100)}%`;

  return (
    <Box style={{ flexDirection: "row", gap: 1, flexGrow: 1 }}>
      {/* Wrap Progress in a flex box so its width:"100%" resolves
          relative to this wrapper instead of hogging the whole row */}
      <Box style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}>
        <Progress value={load} style={{ color }} />
      </Box>
      <Text style={{ color, bold: load > 0.8 }}>{pct}</Text>
    </Box>
  );
}

// ── App ──────────────────────────────────────────────────────────

function App() {
  const [scrollOffset, setScrollOffset] = useState(0);

  useInput((key) => {
    if (key.name === "q" || (key.ctrl && key.name === "c")) {
      process.exit(0);
    }
    if (key.name === "up") setScrollOffset((o) => Math.max(0, o - 1));
    else if (key.name === "down") setScrollOffset((o) => o + 1);
    else if (key.name === "pageup") setScrollOffset((o) => Math.max(0, o - 10));
    else if (key.name === "pagedown") setScrollOffset((o) => o + 10);
  });

  return (
    <ScrollView scrollOffset={scrollOffset} onScroll={setScrollOffset} style={{ flexGrow: 1 }}>
      <Box style={{ flexDirection: "column", padding: 1, gap: 2 }}>
        <Text style={{ bold: true, color: "cyanBright" }}>
          🖥  Rich Table Demo — Service Dashboard
        </Text>

        {/* ── Full variant with rich content ── */}
        <Box style={{ flexDirection: "column", gap: 1 }}>
          <Text style={{ color: "cyan", bold: true }}>
            Full border — status badges, progress bars, links:
          </Text>
          <Table border="round" borderColor="cyan">
            <TableHeaderRow style={{ color: "cyanBright" }}>
              <TableCell>Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Uptime</TableCell>
              <TableCell>Load</TableCell>
              <TableCell>Endpoint</TableCell>
            </TableHeaderRow>
            {SERVICES.map((svc) => (
              <TableRow key={svc.name}>
                <TableCell style={{ bold: true }}>{svc.name}</TableCell>
                <TableCell>
                  <StatusBadge status={svc.status} />
                </TableCell>
                <TableCell style={{ dim: true }}>{svc.uptime}</TableCell>
                <TableCell>
                  {svc.status === "down" ? (
                    <Text style={{ color: "red", dim: true }}>—</Text>
                  ) : (
                    <AnimatedLoad baseLoad={svc.load} />
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={svc.url}
                    style={{ color: "blueBright", underline: true }}
                    focusable={false}
                  >
                    <Text style={{ color: "blueBright", underline: true }}>
                      {svc.url.replace("https://", "")}
                    </Text>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Box>

        {/* ── Clean-vertical with region + instances ── */}
        <Box style={{ flexDirection: "column", gap: 1 }}>
          <Text style={{ color: "magenta", bold: true }}>
            Clean-vertical — region flags, instance bars:
          </Text>
          <Table variant="clean-vertical" borderColor="magenta">
            <TableHeaderRow style={{ color: "magentaBright" }}>
              <TableCell>Service</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Instances</TableCell>
              <TableCell>Status</TableCell>
            </TableHeaderRow>
            {SERVICES.map((svc) => (
              <TableRow key={svc.name}>
                <TableCell>{svc.name}</TableCell>
                <TableCell>
                  <RegionBadge region={svc.region} />
                </TableCell>
                <TableCell>
                  <InstanceCount count={svc.instances} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={svc.status} />
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Box>

        {/* ── Clean variant with spinner ── */}
        <Box style={{ flexDirection: "column", gap: 1 }}>
          <Text style={{ color: "yellow", bold: true }}>
            Clean — live spinners for active services:
          </Text>
          <Table variant="clean" borderColor="yellow">
            <TableHeaderRow style={{ color: "yellowBright" }}>
              <TableCell>Service</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Load</TableCell>
            </TableHeaderRow>
            {SERVICES.filter((s) => s.status !== "down").map((svc) => (
              <TableRow key={svc.name}>
                <TableCell>{svc.name}</TableCell>
                <TableCell>
                  <Spinner
                    label="Processing"
                    style={{ color: svc.status === "degraded" ? "yellow" : "green" }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Text style={{
                    color: svc.load > 0.8 ? "red" : svc.load > 0.5 ? "yellow" : "green",
                    bold: svc.load > 0.8,
                  }}>
                    {Math.round(svc.load * 100)}%
                  </Text>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Box>

        {/* ── Multi-element cell layout ── */}
        <Box style={{ flexDirection: "column", gap: 1 }}>
          <Text style={{ color: "green", bold: true }}>
            Double border — complex cell layouts:
          </Text>
          <Table border="double" borderColor="green">
            <TableHeaderRow style={{ color: "greenBright" }}>
              <TableCell>Project</TableCell>
              <TableCell>Details</TableCell>
              <TableCell align="center">Progress</TableCell>
            </TableHeaderRow>
            <TableRow>
              <TableCell>
                <Box style={{ flexDirection: "column" }}>
                  <Text style={{ bold: true, color: "white" }}>glyph-core</Text>
                  <Text style={{ dim: true, italic: true }}>v2.4.1</Text>
                </Box>
              </TableCell>
              <TableCell>
                <Box style={{ flexDirection: "column" }}>
                  <Box style={{ flexDirection: "row", gap: 1 }}>
                    <Text style={{ color: "green" }}>+142</Text>
                    <Text style={{ color: "red" }}>-38</Text>
                    <Text style={{ dim: true }}>lines</Text>
                  </Box>
                  <Text style={{ dim: true }}>Last commit: 2h ago</Text>
                </Box>
              </TableCell>
              <TableCell>
                <AnimatedLoad baseLoad={0.85} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Box style={{ flexDirection: "column" }}>
                  <Text style={{ bold: true, color: "white" }}>glyph-cli</Text>
                  <Text style={{ dim: true, italic: true }}>v1.0.0-beta</Text>
                </Box>
              </TableCell>
              <TableCell>
                <Box style={{ flexDirection: "column" }}>
                  <Box style={{ flexDirection: "row", gap: 1 }}>
                    <Text style={{ color: "green" }}>+891</Text>
                    <Text style={{ color: "red" }}>-202</Text>
                    <Text style={{ dim: true }}>lines</Text>
                  </Box>
                  <Text style={{ dim: true }}>Last commit: 15m ago</Text>
                </Box>
              </TableCell>
              <TableCell>
                <AnimatedLoad baseLoad={0.45} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Box style={{ flexDirection: "column" }}>
                  <Text style={{ bold: true, color: "white" }}>glyph-docs</Text>
                  <Text style={{ dim: true, italic: true }}>v2.4.1</Text>
                </Box>
              </TableCell>
              <TableCell>
                <Box style={{ flexDirection: "column" }}>
                  <Box style={{ flexDirection: "row", gap: 1 }}>
                    <Text style={{ color: "green" }}>+23</Text>
                    <Text style={{ color: "red" }}>-5</Text>
                    <Text style={{ dim: true }}>lines</Text>
                  </Box>
                  <Text style={{ dim: true }}>Last commit: 1d ago</Text>
                </Box>
              </TableCell>
              <TableCell>
                <AnimatedLoad baseLoad={0.98} />
              </TableCell>
            </TableRow>
          </Table>
        </Box>

        <Text style={{ dim: true }}>Press 'q' to quit • ↑/↓ to scroll</Text>
      </Box>
    </ScrollView>
  );
}

render(<App />);
