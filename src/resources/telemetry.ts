import { K8s } from '@kinvolk/headlamp-plugin/lib';

const { KubeObject } = K8s.cluster;

export class Telemetry extends KubeObject {
  static kind = 'Telemetry';
  static apiName = 'telemetries';
  static apiVersion = 'telemetry.istio.io/v1';
  static isNamespaced = true;
}
