import { K8s } from '@kinvolk/headlamp-plugin/lib';
import {
  ConditionsTable,
  MainInfoSection,
  NameValueTable,
  SectionBox,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import { useParams } from 'react-router-dom';
import {
  conditionFields,
  describePolicyEffect,
  formatFieldValues,
  formatTarget,
  getAction,
  operationFields,
  RuleField,
  sourceFields,
} from './helpers';

const { KubeObject } = K8s.cluster;

interface AuthorizationPolicyDetailPageProps {
  resourceClass: typeof KubeObject;
}

const ACTION_COLORS: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
  ALLOW: 'success',
  DENY: 'error',
  AUDIT: 'warning',
  CUSTOM: 'info',
};

function ruleRows(rule: any) {
  const groups: [string, RuleField[]][] = [
    ['From', sourceFields(rule?.from)],
    ['To', operationFields(rule?.to)],
  ];
  const rows = groups.flatMap(([group, fields]) =>
    fields.map(field => ({ name: `${group} ${field.name}`, value: formatFieldValues(field) }))
  );
  conditionFields(rule?.when).forEach(field => {
    rows.push({
      name: 'When',
      value: `${field.name} ${field.negated ? 'not in' : 'in'} ${field.values.join(', ')}`,
    });
  });
  return rows.length ? rows : [{ name: 'Match', value: 'all requests' }];
}

export function AuthorizationPolicySections({ jsonData }: { jsonData: any }) {
  const spec = jsonData?.spec;
  const action = getAction(spec);
  const effect = describePolicyEffect(spec);

  return (
    <>
      <SectionBox title="Policy">
        {effect && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {effect}
          </Alert>
        )}
        <NameValueTable
          rows={[
            {
              name: 'Action',
              value: <Chip label={action} size="small" color={ACTION_COLORS[action]} />,
            },
            {
              name: 'Provider',
              value: spec?.provider?.name,
              hide: action !== 'CUSTOM',
            },
            { name: 'Target', value: formatTarget(spec) },
          ]}
        />
      </SectionBox>

      {spec?.rules?.map((rule: any, i: number) => (
        <SectionBox key={i} title={`Rule ${i + 1}`}>
          <NameValueTable rows={ruleRows(rule)} />
        </SectionBox>
      ))}
    </>
  );
}

export function AuthorizationPolicyDetailPage({
  resourceClass,
}: AuthorizationPolicyDetailPageProps) {
  const { name, namespace } = useParams<{ name: string; namespace: string }>();
  const [resource, error] = resourceClass.useGet(name, namespace);

  return (
    <>
      <MainInfoSection resource={resource} error={error} />

      {resource && <AuthorizationPolicySections jsonData={resource.jsonData} />}

      {resource?.jsonData?.status?.conditions && (
        <SectionBox title="Conditions">
          <ConditionsTable resource={resource.jsonData} />
        </SectionBox>
      )}
    </>
  );
}
