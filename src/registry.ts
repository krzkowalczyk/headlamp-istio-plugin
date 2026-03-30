import { K8s } from '@kinvolk/headlamp-plugin/lib';

type KubeObjectClass = (typeof K8s.cluster)['KubeObject'];
import * as Resources from './resources';

export interface ResourceConfig {
  label: string;
  pluralLabel: string;
  sidebarName: string;
  resourceClass: KubeObjectClass;
  urlSegment: string;
}

export const RESOURCE_CONFIGS: ResourceConfig[] = [
  // Networking
  {
    label: 'Virtual Service',
    pluralLabel: 'Virtual Services',
    sidebarName: 'istio-virtualservices',
    resourceClass: Resources.VirtualService,
    urlSegment: 'virtualservices',
  },
  {
    label: 'Destination Rule',
    pluralLabel: 'Destination Rules',
    sidebarName: 'istio-destinationrules',
    resourceClass: Resources.DestinationRule,
    urlSegment: 'destinationrules',
  },
  {
    label: 'Gateway',
    pluralLabel: 'Gateways',
    sidebarName: 'istio-gateways',
    resourceClass: Resources.Gateway,
    urlSegment: 'gateways',
  },
  {
    label: 'Service Entry',
    pluralLabel: 'Service Entries',
    sidebarName: 'istio-serviceentries',
    resourceClass: Resources.ServiceEntry,
    urlSegment: 'serviceentries',
  },
  {
    label: 'Sidecar',
    pluralLabel: 'Sidecars',
    sidebarName: 'istio-sidecars',
    resourceClass: Resources.Sidecar,
    urlSegment: 'sidecars',
  },
  {
    label: 'Workload Entry',
    pluralLabel: 'Workload Entries',
    sidebarName: 'istio-workloadentries',
    resourceClass: Resources.WorkloadEntry,
    urlSegment: 'workloadentries',
  },
  {
    label: 'Workload Group',
    pluralLabel: 'Workload Groups',
    sidebarName: 'istio-workloadgroups',
    resourceClass: Resources.WorkloadGroup,
    urlSegment: 'workloadgroups',
  },
  {
    label: 'Proxy Config',
    pluralLabel: 'Proxy Configs',
    sidebarName: 'istio-proxyconfigs',
    resourceClass: Resources.ProxyConfig,
    urlSegment: 'proxyconfigs',
  },
  // Security
  {
    label: 'Peer Authentication',
    pluralLabel: 'Peer Authentications',
    sidebarName: 'istio-peerauthentications',
    resourceClass: Resources.PeerAuthentication,
    urlSegment: 'peerauthentications',
  },
  {
    label: 'Request Authentication',
    pluralLabel: 'Request Authentications',
    sidebarName: 'istio-requestauthentications',
    resourceClass: Resources.RequestAuthentication,
    urlSegment: 'requestauthentications',
  },
  {
    label: 'Authorization Policy',
    pluralLabel: 'Authorization Policies',
    sidebarName: 'istio-authorizationpolicies',
    resourceClass: Resources.AuthorizationPolicy,
    urlSegment: 'authorizationpolicies',
  },
  // Telemetry
  {
    label: 'Telemetry',
    pluralLabel: 'Telemetries',
    sidebarName: 'istio-telemetries',
    resourceClass: Resources.Telemetry,
    urlSegment: 'telemetries',
  },
  // Extensions
  {
    label: 'Wasm Plugin',
    pluralLabel: 'Wasm Plugins',
    sidebarName: 'istio-wasmplugins',
    resourceClass: Resources.WasmPlugin,
    urlSegment: 'wasmplugins',
  },
];
