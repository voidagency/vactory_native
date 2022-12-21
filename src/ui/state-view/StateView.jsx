import * as React from "react";
import { Text, View, Image } from "react-native";
import { useTheme } from "@ui-kitten/components";

import styles, { _shadowStyle } from "./StateView.style";
import RNBounceable from "@freakycoder/react-native-bounceable";

export const StateView = ({
  style,
  title,
  onPress,
  description,
  imageStyle,
  titleStyle,
  buttonText,
  shadowStyle,
  imageSource,
  descriptionStyle,
  buttonComponent,
  buttonTextStyle,
  buttonContainerStyle,
  isCenter = true,
  enableButton = false,
  enableImage = true,
  ...rest
}) => {
  const theme = useTheme();

  const renderButton = () => {
    return (
      enableButton &&
      (buttonComponent || (
        <RNBounceable
          bounceEffect={0.95}
          {...rest}
          style={[
            styles.buttonContainerStyle,
            buttonContainerStyle,
            { backgroundColor: theme["color-primary-default"] },
          ]}
          onPress={onPress}
        >
          <Text style={[styles.buttonTextStyle, buttonTextStyle]}>
            {buttonText}
          </Text>
        </RNBounceable>
      ))
    );
  };

  const renderDescription = () => (
    <Text
      style={[
        isCenter && styles.center,
        styles.descriptionStyle,
        descriptionStyle,
      ]}
    >
      {description}
    </Text>
  );

  const renderTitle = () => {
    return (
      <Text style={[isCenter && styles.center, styles.titleStyle, titleStyle, { color: theme["color-primary-default"] },]}>
        {title}
      </Text>
    );
  }

  const renderImage = () => (
    <Image
      resizeMode="cover"
      source={imageSource || require("./undraw-page-not-found.png")}
      style={[styles.imageStyle, imageStyle, isCenter && styles.center]}
      {...rest}
    />
  );

  return (
    <View style={[styles.container, style]}>
      {enableImage ? renderImage() : null}
      {renderTitle()}
      {renderDescription()}
      {renderButton()}
    </View>
  );
};
