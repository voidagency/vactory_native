import React from "react";
import { Widgets } from "@runtime/widgets";
import { Text } from "@ui-kitten/components";
// import { TextWarningMessage } from "../text-status-message"
import { useAppConfig } from "@vactory/hooks";

const ParagraphsTemplate = (props) => {
  const { getUiComponent } = useAppConfig();
  const { id, settings, title, showTitle, ...rest } = props;
	const TextWarningMessage = getUiComponent("TextWarningMessage");
  let Component = Widgets[id];

  if (!Component) {
    return <TextWarningMessage>Caught an error. Template {id} is not mapped!</TextWarningMessage>;
  }

  return (
    <>
      {title && showTitle && <Text category="h2">{title}</Text>}
      <Component data={settings} {...rest} />
    </>
  );
};

export default ParagraphsTemplate;
