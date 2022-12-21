import { useAppConfig } from "../../../AppConfigContext";

export default function ConfigurationLayerScreen() {
  const { getUiComponent } = useAppConfig();
  const ConfigurationLayer = getUiComponent("ConfigurationLayer");

  return <ConfigurationLayer />
}
