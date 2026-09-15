import { describe, expect, it } from 'vitest';
import {
  conditionFields,
  describePolicyEffect,
  formatFieldValues,
  formatTarget,
  getAction,
  operationFields,
  sourceFields,
} from './helpers';

describe('sourceFields', () => {
  it('collects positive and negated source fields', () => {
    const fields = sourceFields([
      {
        source: {
          principals: ['cluster.local/ns/default/sa/sleep'],
          notNamespaces: ['kube-system'],
        },
      },
    ]);
    expect(fields).toEqual([
      { name: 'Principals', values: ['cluster.local/ns/default/sa/sleep'], negated: false },
      { name: 'Namespaces', values: ['kube-system'], negated: true },
    ]);
  });

  it('returns empty for missing from', () => {
    expect(sourceFields(undefined)).toEqual([]);
  });
});

describe('operationFields', () => {
  it('collects operation fields', () => {
    expect(operationFields([{ operation: { methods: ['GET'], notPaths: ['/admin*'] } }])).toEqual([
      { name: 'Methods', values: ['GET'], negated: false },
      { name: 'Paths', values: ['/admin*'], negated: true },
    ]);
  });
});

describe('conditionFields', () => {
  it('maps values and notValues', () => {
    expect(
      conditionFields([{ key: 'request.headers[x-version]', values: ['v1'], notValues: ['v0'] }])
    ).toEqual([
      { name: 'request.headers[x-version]', values: ['v1'], negated: false },
      { name: 'request.headers[x-version]', values: ['v0'], negated: true },
    ]);
  });
});

describe('formatFieldValues', () => {
  it('prefixes negated values', () => {
    expect(formatFieldValues({ name: 'Paths', values: ['/a', '/b'], negated: true })).toBe(
      'not /a, /b'
    );
  });
});

describe('getAction', () => {
  it('defaults to ALLOW', () => {
    expect(getAction({})).toBe('ALLOW');
  });
});

describe('describePolicyEffect', () => {
  it('warns on ALLOW without rules', () => {
    expect(describePolicyEffect({})).toMatch(/denied/);
  });
  it('warns on empty ALLOW rule', () => {
    expect(describePolicyEffect({ rules: [{}] })).toMatch(/allowed/);
  });
  it('warns on DENY without rules', () => {
    expect(describePolicyEffect({ action: 'DENY' })).toMatch(/never matches/);
  });
  it('returns null for normal policy', () => {
    expect(describePolicyEffect({ rules: [{ to: [{ operation: { paths: ['/'] } }] }] })).toBeNull();
  });
});

describe('formatTarget', () => {
  it('formats selector labels', () => {
    expect(formatTarget({ selector: { matchLabels: { app: 'httpbin' } } })).toBe('app=httpbin');
  });
  it('formats targetRefs', () => {
    expect(formatTarget({ targetRefs: [{ kind: 'Gateway', name: 'gw' }] })).toBe('Gateway/gw');
  });
  it('defaults to namespace-wide', () => {
    expect(formatTarget({})).toBe('all workloads in namespace');
  });
});
