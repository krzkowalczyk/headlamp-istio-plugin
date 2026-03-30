import { K8s } from '@kinvolk/headlamp-plugin/lib';

const { KubeObject } = K8s.cluster;

export class WasmPlugin extends KubeObject {
  static kind = 'WasmPlugin';
  static apiName = 'wasmplugins';
  static apiVersion = 'extensions.istio.io/v1alpha1';
  static isNamespaced = true;
}
