import { K8s } from '@kinvolk/headlamp-plugin/lib';

const { KubeObject } = K8s.cluster;

export class VirtualService extends KubeObject {
  static kind = 'VirtualService';
  static apiName = 'virtualservices';
  static apiVersion = 'networking.istio.io/v1';
  static isNamespaced = true;
}

export class DestinationRule extends KubeObject {
  static kind = 'DestinationRule';
  static apiName = 'destinationrules';
  static apiVersion = 'networking.istio.io/v1';
  static isNamespaced = true;
}

export class Gateway extends KubeObject {
  static kind = 'Gateway';
  static apiName = 'gateways';
  static apiVersion = 'networking.istio.io/v1';
  static isNamespaced = true;
}

export class ServiceEntry extends KubeObject {
  static kind = 'ServiceEntry';
  static apiName = 'serviceentries';
  static apiVersion = 'networking.istio.io/v1';
  static isNamespaced = true;
}

export class Sidecar extends KubeObject {
  static kind = 'Sidecar';
  static apiName = 'sidecars';
  static apiVersion = 'networking.istio.io/v1';
  static isNamespaced = true;
}

export class WorkloadEntry extends KubeObject {
  static kind = 'WorkloadEntry';
  static apiName = 'workloadentries';
  static apiVersion = 'networking.istio.io/v1';
  static isNamespaced = true;
}

export class WorkloadGroup extends KubeObject {
  static kind = 'WorkloadGroup';
  static apiName = 'workloadgroups';
  static apiVersion = 'networking.istio.io/v1';
  static isNamespaced = true;
}

export class ProxyConfig extends KubeObject {
  static kind = 'ProxyConfig';
  static apiName = 'proxyconfigs';
  static apiVersion = 'networking.istio.io/v1beta1';
  static isNamespaced = true;
}
