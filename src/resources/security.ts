import { K8s } from '@kinvolk/headlamp-plugin/lib';

const { KubeObject } = K8s.cluster;

export class PeerAuthentication extends KubeObject {
  static kind = 'PeerAuthentication';
  static apiName = 'peerauthentications';
  static apiVersion = 'security.istio.io/v1';
  static isNamespaced = true;
}

export class RequestAuthentication extends KubeObject {
  static kind = 'RequestAuthentication';
  static apiName = 'requestauthentications';
  static apiVersion = 'security.istio.io/v1';
  static isNamespaced = true;
}

export class AuthorizationPolicy extends KubeObject {
  static kind = 'AuthorizationPolicy';
  static apiName = 'authorizationpolicies';
  static apiVersion = 'security.istio.io/v1';
  static isNamespaced = true;
}
