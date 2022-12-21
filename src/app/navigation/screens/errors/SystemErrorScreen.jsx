import { useAppConfig } from "../../../AppConfigContext";

export default function SystemErrorScreen() {
  const { getUiComponent } = useAppConfig();
  const SystemError = getUiComponent("SystemError");

  return <SystemError />;
}
