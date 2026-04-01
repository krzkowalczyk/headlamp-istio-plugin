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
import { formatDestinations, formatFault, summarizeMatch } from './helpers';

const { KubeObject } = K8s.cluster;

interface VirtualServiceDetailPageProps {
  resourceClass: typeof KubeObject;
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
