import { K8s } from '@kinvolk/headlamp-plugin/lib';
import {
  CreateResourceButton,
  Link,
  SectionBox,
  SectionFilterHeader,
  Table,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import { NotSupported } from '../NotSupported';
import { formatRoutes } from './helpers';

const { KubeObject } = K8s.cluster;
type KubeObjectInstance = InstanceType<typeof KubeObject>;

interface VirtualServiceListPageProps {
  resourceClass: typeof KubeObject;
  title: string;
  detailRouteName: string;
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
    <SectionBox title={<SectionFilterHeader title={title} titleSideActions={[<CreateResourceButton resourceClass={resourceClass} />]} />}>
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
            accessorFn: (item: KubeObjectInstance) => formatRoutes(item.jsonData?.spec),
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
