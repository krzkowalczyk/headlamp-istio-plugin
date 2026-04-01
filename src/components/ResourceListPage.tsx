import { K8s } from '@kinvolk/headlamp-plugin/lib';
import {
  CreateResourceButton,
  Link,
  SectionBox,
  SectionFilterHeader,
  Table,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { useFilterFunc } from '@kinvolk/headlamp-plugin/lib/Utils';
import { NotSupported } from './NotSupported';

const { KubeObject } = K8s.cluster;
type KubeObjectInstance = InstanceType<typeof KubeObject>;

interface ResourceListPageProps {
  resourceClass: typeof KubeObject;
  title: string;
  detailRouteName: string;
}

export function ResourceListPage({ resourceClass, title, detailRouteName }: ResourceListPageProps) {
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
