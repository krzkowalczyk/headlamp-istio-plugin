export function summarizeMatch(matches: any[] | undefined): string {
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

export function formatDestinations(routes: any[] | undefined): string {
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

export function formatFault(fault: any | undefined): string {
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

export function formatRoutes(spec: any): string {
  if (!spec) return '-';

  const parts: string[] = [];
  if (spec.http?.length) parts.push(`${spec.http.length} HTTP`);
  if (spec.tls?.length) parts.push(`${spec.tls.length} TLS`);
  if (spec.tcp?.length) parts.push(`${spec.tcp.length} TCP`);

  return parts.length > 0 ? parts.join(', ') : '-';
}
