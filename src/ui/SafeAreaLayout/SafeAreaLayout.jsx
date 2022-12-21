import React from "react";
import {
  Layout,
  useTheme,
} from "@ui-kitten/components";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SafeAreaLayout = ({ insets, ...props }) => {
    const theme = useTheme();
    const insetsConfig = useSafeAreaInsets();
  
    const backgroundColor = theme[`background-basic-color-${props.level}`];
  
    return (
      <Layout
        {...props}
        style={[
          props.style,
          backgroundColor && { backgroundColor },
          {
            paddingTop: insets === "top" ? insetsConfig.top : 0,
            paddingBottom: insets === "bottom" ? insetsConfig.bottom : 0,
          },
        ]}
      />
    );
  };