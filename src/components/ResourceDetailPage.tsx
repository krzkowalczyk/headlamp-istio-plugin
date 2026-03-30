import {
  ConditionsTable,
  MainInfoSection,
  SectionBox,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { K8s } from '@kinvolk/headlamp-plugin/lib';
import { useParams } from 'react-router-dom';

const { KubeObject } = K8s.cluster;

interface ResourceDetailPageProps {
  resourceClass: typeof KubeObject;
}

export function ResourceDetailPage({ resourceClass }: ResourceDetailPageProps) {
  const { name, namespace } = useParams<{ name: string; namespace: string }>();
  const [resource, error] = resourceClass.useGet(name, namespace);

  return (
    <>
      <MainInfoSection resource={resource} error={error} />
      {resource?.jsonData?.status?.conditions && (
        <SectionBox title="Conditions">
          <ConditionsTable resource={resource.jsonData} />
        </SectionBox>
      )}
    </>
  );
}
