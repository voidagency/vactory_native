import { useAppConfig } from "../../../AppConfigContext";

export default function UnauthorizedScreen() {
  const { getUiComponent } = useAppConfig();
  const Unauthorized = getUiComponent("Unauthorized");

  return <Unauthorized />
}
