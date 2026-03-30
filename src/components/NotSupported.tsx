import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import Typography from '@mui/material/Typography';

export function NotSupported({ typeName }: { typeName: string }) {
  return (
    <SectionBox title={typeName}>
      <Typography>
        {typeName} CRD is not available on this cluster. Make sure Istio is installed.
      </Typography>
    </SectionBox>
  );
}
