export interface RuleField {
  name: string;
  values: string[];
  negated: boolean;
}

const SOURCE_FIELDS: [string, string][] = [
  ['principals', 'Principals'],
  ['requestPrincipals', 'Request Principals'],
  ['namespaces', 'Namespaces'],
  ['ipBlocks', 'IP Blocks'],
  ['remoteIpBlocks', 'Remote IP Blocks'],
  ['serviceAccounts', 'Service Accounts'],
];

const OPERATION_FIELDS: [string, string][] = [
  ['hosts', 'Hosts'],
  ['ports', 'Ports'],
  ['methods', 'Methods'],
  ['paths', 'Paths'],
];

function collectFields(obj: any, fields: [string, string][]): RuleField[] {
  if (!obj) return [];

  const result: RuleField[] = [];
  fields.forEach(([key, label]) => {
    if (obj[key]?.length) {
      result.push({ name: label, values: obj[key], negated: false });
    }
    const notKey = `not${key[0].toUpperCase()}${key.slice(1)}`;
    if (obj[notKey]?.length) {
      result.push({ name: label, values: obj[notKey], negated: true });
    }
  });
  return result;
}

export function sourceFields(from: any[] | undefined): RuleField[] {
  return (from || []).flatMap(f => collectFields(f.source, SOURCE_FIELDS));
}

export function operationFields(to: any[] | undefined): RuleField[] {
  return (to || []).flatMap(t => collectFields(t.operation, OPERATION_FIELDS));
}

export function conditionFields(when: any[] | undefined): RuleField[] {
  return (when || []).flatMap(c => {
    const result: RuleField[] = [];
    if (c.values?.length) result.push({ name: c.key, values: c.values, negated: false });
    if (c.notValues?.length) result.push({ name: c.key, values: c.notValues, negated: true });
    return result;
  });
}

export function getAction(spec: any): string {
  return spec?.action || 'ALLOW';
}

export function describePolicyEffect(spec: any): string | null {
  if (!spec) return null;

  const action = getAction(spec);
  const hasRules = spec.rules?.length > 0;

  if (action === 'ALLOW' && !hasRules) {
    return 'No rules with ALLOW action: all requests to the selected workloads are denied.';
  }
  if (action === 'ALLOW' && spec.rules.some((r: any) => !r || Object.keys(r).length === 0)) {
    return 'Contains an empty rule with ALLOW action: all requests are allowed.';
  }
  if (action === 'DENY' && !hasRules) {
    return 'No rules with DENY action: this policy never matches.';
  }
  return null;
}

export function formatTarget(spec: any): string {
  if (!spec) return '-';

  if (spec.selector?.matchLabels) {
    return Object.entries(spec.selector.matchLabels)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ');
  }
  const refs = spec.targetRefs || (spec.targetRef ? [spec.targetRef] : []);
  if (refs.length) {
    return refs.map((r: any) => `${r.kind}/${r.name}`).join(', ');
  }
  return 'all workloads in namespace';
}

export function formatFieldValues(field: RuleField): string {
  const values = field.values.join(', ');
  return field.negated ? `not ${values}` : values;
}
