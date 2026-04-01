import { describe, expect, it } from 'vitest';
import { formatDestinations, formatFault, formatRoutes, summarizeMatch } from './helpers';

describe('summarizeMatch', () => {
  it('returns "any" for undefined', () => {
    expect(summarizeMatch(undefined)).toBe('any');
  });

  it('returns "any" for empty array', () => {
    expect(summarizeMatch([])).toBe('any');
  });

  it('summarizes URI match', () => {
    expect(summarizeMatch([{ uri: { prefix: '/api' } }])).toBe('uri prefix: /api');
  });

  it('summarizes exact URI match', () => {
    expect(summarizeMatch([{ uri: { exact: '/health' } }])).toBe('uri exact: /health');
  });

  it('summarizes method match', () => {
    expect(summarizeMatch([{ method: { exact: 'GET' } }])).toBe('method exact: GET');
  });

  it('summarizes header match with singular', () => {
    expect(summarizeMatch([{ headers: { 'x-env': { exact: 'staging' } } }])).toBe('1 header');
  });

  it('summarizes header match with plural', () => {
    expect(
      summarizeMatch([{ headers: { 'x-env': { exact: 'staging' }, 'x-ver': { exact: '2' } } }])
    ).toBe('2 headers');
  });

  it('summarizes port match', () => {
    expect(summarizeMatch([{ port: 8080 }])).toBe('port: 8080');
  });

  it('combines multiple conditions', () => {
    expect(summarizeMatch([{ uri: { prefix: '/api' }, method: { exact: 'POST' } }])).toBe(
      'uri prefix: /api, method exact: POST'
    );
  });

  it('joins multiple matches with pipe', () => {
    expect(
      summarizeMatch([{ uri: { prefix: '/api' } }, { uri: { prefix: '/v2' } }])
    ).toBe('uri prefix: /api | uri prefix: /v2');
  });

  it('returns "custom match" for unrecognized fields', () => {
    expect(summarizeMatch([{ sourceLabels: { app: 'web' } }])).toBe('custom match');
  });
});

describe('formatDestinations', () => {
  it('returns "-" for undefined', () => {
    expect(formatDestinations(undefined)).toBe('-');
  });

  it('returns "-" for empty array', () => {
    expect(formatDestinations([])).toBe('-');
  });

  it('formats single destination', () => {
    expect(formatDestinations([{ destination: { host: 'reviews' } }])).toBe('reviews');
  });

  it('formats destination with subset', () => {
    expect(formatDestinations([{ destination: { host: 'reviews', subset: 'v2' } }])).toBe(
      'reviews:v2'
    );
  });

  it('formats destination with port', () => {
    expect(
      formatDestinations([{ destination: { host: 'reviews', port: { number: 8080 } } }])
    ).toBe('reviews port 8080');
  });

  it('formats weighted destinations', () => {
    expect(
      formatDestinations([
        { destination: { host: 'reviews', subset: 'v2' }, weight: 80 },
        { destination: { host: 'reviews', subset: 'v3' }, weight: 20 },
      ])
    ).toBe('reviews:v2 (80%), reviews:v3 (20%)');
  });

  it('returns "?" for missing host', () => {
    expect(formatDestinations([{ destination: {} }])).toBe('?');
  });
});

describe('formatFault', () => {
  it('returns "-" for undefined', () => {
    expect(formatFault(undefined)).toBe('-');
  });

  it('returns "-" for empty object', () => {
    expect(formatFault({})).toBe('-');
  });

  it('formats delay fault', () => {
    expect(
      formatFault({ delay: { fixedDelay: '5s', percentage: { value: 10 } } })
    ).toBe('delay 5s 10%');
  });

  it('formats abort fault', () => {
    expect(
      formatFault({ abort: { httpStatus: 503, percentage: { value: 5 } } })
    ).toBe('abort 503 5%');
  });

  it('formats combined faults', () => {
    expect(
      formatFault({
        delay: { fixedDelay: '5s', percentage: { value: 10 } },
        abort: { httpStatus: 503, percentage: { value: 5 } },
      })
    ).toBe('delay 5s 10%, abort 503 5%');
  });

  it('handles missing fixedDelay', () => {
    expect(formatFault({ delay: { percentage: { value: 10 } } })).toBe('delay ? 10%');
  });
});

describe('formatRoutes', () => {
  it('returns "-" for undefined spec', () => {
    expect(formatRoutes(undefined)).toBe('-');
  });

  it('returns "-" for empty spec', () => {
    expect(formatRoutes({})).toBe('-');
  });

  it('formats HTTP routes', () => {
    expect(formatRoutes({ http: [{}, {}] })).toBe('2 HTTP');
  });

  it('formats TLS routes', () => {
    expect(formatRoutes({ tls: [{}] })).toBe('1 TLS');
  });

  it('formats TCP routes', () => {
    expect(formatRoutes({ tcp: [{}, {}, {}] })).toBe('3 TCP');
  });

  it('formats mixed routes', () => {
    expect(formatRoutes({ http: [{}, {}], tls: [{}], tcp: [{}] })).toBe('2 HTTP, 1 TLS, 1 TCP');
  });
});
