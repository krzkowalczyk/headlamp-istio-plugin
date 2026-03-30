import { K8s } from '@kinvolk/headlamp-plugin/lib';
import {
  ConditionsTable,
  MainInfoSection,
  NameValueTable,
  SectionBox,
  SimpleTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import Chip from '@mui/material/Chip';
import { useParams } from 'react-router-dom';

const { KubeObject } = K8s.cluster;

interface VirtualServiceDetailPageProps {
  resourceClass: typeof KubeObject;
}

function summarizeMatch(matches: any[] | undefined): string {
  if (!matches?.length) return 'any';

  return matches
    .map(match => {
      const parts: string[] = [];
      if (match.uri) {
        const [type, val] = Object.entries(match.uri)[0] as [string, string];
        parts.push(`uri ${type}: ${val}`);
      }
      if (match.method) {
        const [type, val] = Object.entries(match.method)[0] as [string, string];
        parts.push(`method ${type}: ${val}`);
      }
      if (match.headers) {
        const headerCount = Object.keys(match.headers).length;
        parts.push(`${headerCount} header${headerCount > 1 ? 's' : ''}`);
      }
      if (match.port) parts.push(`port: ${match.port}`);
      return parts.join(', ') || 'custom match';
    })
    .join(' | ');
}

function formatDestinations(routes: any[] | undefined): string {
  if (!routes?.length) return '-';

  return routes
    .map(r => {
      let dest = r.destination?.host || '?';
      if (r.destination?.subset) dest += `:${r.destination.subset}`;
      if (r.destination?.port?.number) dest += ` port ${r.destination.port.number}`;
      if (routes.length > 1 && r.weight !== null) dest += ` (${r.weight}%)`;
      return dest;
    })
    .join(', ');
}

function formatFault(fault: any | undefined): string {
  if (!fault) return '-';
  const parts: string[] = [];
  if (fault.delay) {
    parts.push(
      `delay ${fault.delay.fixedDelay || '?'}${fault.delay.percentage?.value !== null ? ` ${fault.delay.percentage.value}%` : ''}`
    );
  }
  if (fault.abort) {
    parts.push(
      `abort ${fault.abort.httpStatus || '?'}${fault.abort.percentage?.value !== null ? ` ${fault.abort.percentage.value}%` : ''}`
    );
  }
  return parts.join(', ') || '-';
}

function ChipList({ items }: { items: string[] }) {
  return (
    <>
      {items.map(item => (
        <Chip key={item} label={item} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
      ))}
    </>
  );
}

export function VirtualServiceDetailPage({ resourceClass }: VirtualServiceDetailPageProps) {
  const { name, namespace } = useParams<{ name: string; namespace: string }>();
  const [resource, error] = resourceClass.useGet(name, namespace);

  const spec = resource?.jsonData?.spec;

  return (
    <>
      <MainInfoSection resource={resource} error={error} />

      {spec && (
        <SectionBox title="Spec">
          <NameValueTable
            rows={[
              {
                name: 'Hosts',
                value: spec.hosts?.length ? <ChipList items={spec.hosts} /> : '-',
              },
              {
                name: 'Gateways',
                value: spec.gateways?.length ? (
                  <ChipList items={spec.gateways} />
                ) : (
                  <Chip label="mesh" size="small" variant="outlined" />
                ),
              },
              {
                name: 'Export To',
                value: spec.exportTo?.length ? spec.exportTo.join(', ') : 'not set',
              },
            ]}
          />
        </SectionBox>
      )}

      {spec?.http?.length > 0 && (
        <SectionBox title="HTTP Routes">
          <SimpleTable
            columns={[
              { label: '#', getter: (row: any) => row.index },
              { label: 'Match', getter: (row: any) => summarizeMatch(row.route.match) },
              {
                label: 'Destinations',
                getter: (row: any) => formatDestinations(row.route.route),
              },
              { label: 'Timeout', getter: (row: any) => row.route.timeout || '-' },
              {
                label: 'Retries',
                getter: (row: any) =>
                  row.route.retries
                    ? `${row.route.retries.attempts} attempts`
                    : '-',
              },
              { label: 'Fault', getter: (row: any) => formatFault(row.route.fault) },
              {
                label: 'Mirror',
                getter: (row: any) => row.route.mirror?.host || '-',
              },
            ]}
            data={spec.http.map((route: any, i: number) => ({ index: i + 1, route }))}
            emptyMessage="No HTTP routes configured."
          />
        </SectionBox>
      )}

      {spec?.tls?.length > 0 && (
        <SectionBox title="TLS Routes">
          <SimpleTable
            columns={[
              { label: '#', getter: (row: any) => row.index },
              {
                label: 'SNI Hosts',
                getter: (row: any) =>
                  row.route.match
                    ?.flatMap((m: any) => m.sniHosts || [])
                    .join(', ') || '-',
              },
              {
                label: 'Destinations',
                getter: (row: any) => formatDestinations(row.route.route),
              },
            ]}
            data={spec.tls.map((route: any, i: number) => ({ index: i + 1, route }))}
            emptyMessage="No TLS routes configured."
          />
        </SectionBox>
      )}

      {spec?.tcp?.length > 0 && (
        <SectionBox title="TCP Routes">
          <SimpleTable
            columns={[
              { label: '#', getter: (row: any) => row.index },
              {
                label: 'Destinations',
                getter: (row: any) => formatDestinations(row.route.route),
              },
            ]}
            data={spec.tcp.map((route: any, i: number) => ({ index: i + 1, route }))}
            emptyMessage="No TCP routes configured."
          />
        </SectionBox>
      )}

      {resource?.jsonData?.status?.conditions && (
        <SectionBox title="Conditions">
          <ConditionsTable resource={resource.jsonData} />
        </SectionBox>
      )}
    </>
  );
}
