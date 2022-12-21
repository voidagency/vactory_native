import { useAppConfig } from "../../../AppConfigContext";

export default function NotFoundScreen() {
  const { getUiComponent } = useAppConfig();
  const NotFound = getUiComponent("NotFound");

  return <NotFound />
}
