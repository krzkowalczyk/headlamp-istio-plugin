# Headlamp Istio Plugin

A [Headlamp](https://headlamp.dev/) plugin for viewing and managing [Istio](https://istio.io/) service mesh resources.

## Features

- Sidebar navigation with all Istio resource types
- List and detail views for 13 Istio CRDs
- Enhanced Virtual Service views with spec-level fields (hosts, gateways, HTTP/TLS/TCP routes, match conditions, destinations, fault injection, and more)
- Extensible architecture — easy to add custom views for other resource types

### Supported Resources

| Category | Resources |
|----------|-----------|
| Networking | Virtual Service, Destination Rule, Gateway, Service Entry, Sidecar, Workload Entry, Workload Group, Proxy Config |
| Security | Peer Authentication, Request Authentication, Authorization Policy |
| Telemetry | Telemetry |
| Extensions | Wasm Plugin |

## Installation

### Plugin Catalog (Artifact Hub)

1. Open Headlamp and go to **Settings > Plugin Catalog**
2. Search for **Istio**
3. Click **Install**

### Manual

```bash
git clone https://github.com/krzkowalczyk/headlamp-istio-plugin.git
cd headlamp-istio-plugin
npm install
npm run build
npm run package
```

Extract the generated `headlamp-k8s-istio-*.tar.gz` into your Headlamp plugins directory:

| Platform | Path |
|----------|------|
| Linux | `~/.config/Headlamp/plugins/` |
| macOS | `~/Library/Application Support/Headlamp/plugins/` |

## Development

```bash
npm install       # Install dependencies
npm run start     # Start dev server (with Headlamp desktop running)
npm run build     # Production build
npm run tsc       # Type check
npm run lint      # Lint
npm run test      # Run tests
```

## Releasing

Push a tag to trigger the GitHub Actions release workflow:

```bash
git tag v0.2.0
git push origin v0.2.0
```

The workflow builds, packages, creates a GitHub Release with the tarball, and updates `artifacthub-pkg.yml` with the download URL and checksum.

## License

[Apache 2.0](LICENSE)
