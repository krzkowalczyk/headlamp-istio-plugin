import { registerRoute, registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';
import { ResourceDetailPage } from './components/ResourceDetailPage';
import { ResourceListPage } from './components/ResourceListPage';
import { RESOURCE_CONFIGS } from './registry';

// Top-level Istio sidebar entry
registerSidebarEntry({
  parent: null,
  name: 'istio',
  label: 'Istio',
  icon: 'mdi:lan',
  url: '/istio/virtualservices',
});

// Register sidebar entries and routes for each resource type (flat, 2-level)
for (const config of RESOURCE_CONFIGS) {
  const listRouteName = `istio-${config.urlSegment}`;
  const detailRouteName = `istio-${config.urlSegment}-detail`;
  const basePath = `/istio/${config.urlSegment}`;

  registerSidebarEntry({
    parent: 'istio',
    name: config.sidebarName,
    label: config.pluralLabel,
    url: basePath,
  });

  registerRoute({
    path: basePath,
    sidebar: config.sidebarName,
    name: listRouteName,
    exact: true,
    component: () => (
      <ResourceListPage
        resourceClass={config.resourceClass}
        title={config.pluralLabel}
        detailRouteName={detailRouteName}
      />
    ),
  });

  registerRoute({
    path: `${basePath}/:namespace/:name`,
    sidebar: config.sidebarName,
    name: detailRouteName,
    exact: true,
    component: () => <ResourceDetailPage resourceClass={config.resourceClass} />,
  });
}
