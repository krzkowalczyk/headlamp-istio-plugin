import { K8s } from '@kinvolk/headlamp-plugin/lib';
import {
  Link,
  SectionBox,
  SectionFilterHeader,
  Table,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import { NotSupported } from '../NotSupported';

const { KubeObject } = K8s.cluster;
type KubeObjectInstance = InstanceType<typeof KubeObject>;

interface VirtualServiceListPageProps {
  resourceClass: typeof KubeObject;
  title: string;
  detailRouteName: string;
}

function formatRoutes(item: KubeObjectInstance): string {
  const spec = item.jsonData?.spec;
  if (!spec) return '-';

  const parts: string[] = [];
  if (spec.http?.length) parts.push(`${spec.http.length} HTTP`);
  if (spec.tls?.length) parts.push(`${spec.tls.length} TLS`);
  if (spec.tcp?.length) parts.push(`${spec.tcp.length} TCP`);

  return parts.length > 0 ? parts.join(', ') : '-';
}

export function VirtualServiceListPage({
  resourceClass,
  title,
  detailRouteName,
}: VirtualServiceListPageProps) {
  const filterFunction = useFilterFunc();
  const [resources, error] = resourceClass.useList();

  if ((error as any)?.status === 404) {
    return <NotSupported typeName={title} />;
  }

  return (
    <SectionBox title={<SectionFilterHeader title={title} />}>
      <Table
        data={resources}
        columns={[
          {
            header: 'Name',
            accessorFn: (item: KubeObjectInstance) => item.getName(),
            Cell: ({ row: { original: item } }: { row: { original: KubeObjectInstance } }) => (
              <Link
                routeName={detailRouteName}
                params={{
                  name: item.getName(),
                  namespace: item.getNamespace(),
                }}
              >
                {item.getName()}
              </Link>
            ),
          },
          {
            header: 'Namespace',
            accessorFn: (item: KubeObjectInstance) => item.getNamespace(),
          },
          {
            header: 'Hosts',
            accessorFn: (item: KubeObjectInstance) =>
              item.jsonData?.spec?.hosts?.join(', ') || '-',
          },
          {
            header: 'Gateways',
            accessorFn: (item: KubeObjectInstance) =>
              item.jsonData?.spec?.gateways?.join(', ') || 'mesh',
          },
          {
            header: 'Routes',
            accessorFn: (item: KubeObjectInstance) => formatRoutes(item),
          },
          {
            header: 'Age',
            accessorFn: (item: KubeObjectInstance) => -new Date(item.getCreationTs()).getTime(),
            Cell: ({ row: { original: item } }: { row: { original: KubeObjectInstance } }) =>
              item.getAge(),
          },
        ]}
        filterFunction={filterFunction}
      />
    </SectionBox>
  );
}
