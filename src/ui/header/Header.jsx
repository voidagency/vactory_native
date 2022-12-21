import * as React from "react";
import { useCallback } from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import RNBounceable from "@freakycoder/react-native-bounceable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Button, Layout, useTheme, Icon, Toggle } from "@ui-kitten/components";
import { useAuth } from "@vactory/hooks";
// import { ThemeContext } from "@context/theme"

const UserAccount = () => {
  const { isAuthenticated, profile, goToSignInScreen } = useAuth();

  const LockIcon = (props) => <Icon {...props} name="unlock-outline" />;

  const onProfilePicPress = () => {};
  const onAuthButtonPress = () => {
    goToSignInScreen();
  };

  if (isAuthenticated) {
    return (
      <RNBounceable onPress={onProfilePicPress}>
        <Image
          source={{ uri: profile?.avatar }}
          style={styles.profileImageStyle}
        />
      </RNBounceable>
    );
  }

  return (
    <Button
      status="primary"
      onPress={onAuthButtonPress}
      size="small"
      accessoryLeft={LockIcon}
    />
  );
};

const MenuIcon = () => {
  const navigation = useNavigation();

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, []);

  return (
    <TouchableOpacity onPress={openDrawer}>
      <Icon
        name="menu-2-outline"
        style={{
          width: 25,
          height: 25,
        }}
        fill="#000"
        size={25}
      />
    </TouchableOpacity>
  );
};

const MenuBackIcon = () => {
  const navigation = useNavigation();

  const setDrawerBack = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <TouchableOpacity onPress={setDrawerBack}>
      <Icon
        name="arrow-ios-back-outline"
        style={{
          width: 25,
          height: 25,
        }}
        fill="#000"
        size={25}
      />
    </TouchableOpacity>
  );
};

const defaultProfilePicture = {
  uri: "https://images.unsplash.com/photo-1484399172022-72a90b12e3c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80",
};
const searchIcon = require("./local-assets/search.png");

export const _container = (height, backgroundColor) => ({
  width: "100%",
  height,
  top: 0,
  paddingLeft: 24,
  paddingRight: 24,
  backgroundColor,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
});

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

export default class HeaderVariant1 extends React.PureComponent {
  renderLeftAlignedComponent = () => {
    const {
      titleText,
      leftButtonComponent,
      disableLeftAlignedButton = false,
      leftAlignedButtonImageSource = require("./local-assets/left-arrow.png"),
      ImageComponent = Image,
      onLeftButtonPress,
      drawerOptions,
    } = this.props;

    // console.log("drawerOptions", typeof drawerOptions?.showBackButton)
    return (
      <View style={styles.leftAlignedContainer}>
        {/* {(!disableLeftAlignedButton && leftButtonComponent) && ( */}
        {drawerOptions?.showBackButton &&
        drawerOptions?.showBackButton === true ? (
          <MenuBackIcon />
        ) : (
          <MenuIcon />
        )}
        {/* <MenuBackIcon />  */}
        {/* <MenuIcon /> */}
        {/* )} */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleTextStyle}>{titleText}</Text>
        </View>
      </View>
    );
  };

  renderFirstIcon = () => {
    const {
      disableFirstIcon = false,
      onFirstIconPress,
      ImageComponent = Image,
      firstIconImageSource = searchIcon,
    } = this.props;
    return (
      !disableFirstIcon && (
        <View style={styles.iconButtonContainer}>
          <RNBounceable
            bounceEffect={0.8}
            bounceFriction={2}
            onPress={onFirstIconPress}
          >
            <Icon
              name="search-outline"
              style={{
                width: 25,
                height: 25,
              }}
              fill="#000"
              size={25}
            />
            {/* <ImageComponent
              resizeMode="contain"
              source={firstIconImageSource}
              style={styles.iconImageStyle}
            /> */}
          </RNBounceable>
        </View>
      )
    );
  };

  // renderSecondIcon = () => {
  //   const {
  //     onSecondIconPress,
  //     ImageComponent = Image,
  //     disableSecondIcon = false,
  //     secondIconImageSource = bagIcon,
  //   } = this.props;

  //   return (
  //     !disableSecondIcon && (
  //       <View style={styles.iconButtonContainer}>
  //         <RNBounceable
  //           bounceEffect={0.8}
  //           bounceFriction={2}
  //           onPress={onSecondIconPress}
  //         >
  //           <ImageComponent
  //             resizeMode="contain"
  //             source={secondIconImageSource}
  //             style={styles.iconImageStyle}
  //           />
  //         </RNBounceable>
  //       </View>
  //     )
  //   );
  // };

  // renderThirdIcon = () => {
  //   const {
  //     onThirdIconPress,
  //     ImageComponent = Image,
  //     disableThirdIcon = false,
  //     thirdIconImageSource = notificationIcon,
  //   } = this.props;
  //   return (
  //     !disableThirdIcon && (
  //       <View style={styles.iconButtonContainer}>
  //         <RNBounceable
  //           bounceEffect={0.8}
  //           bounceFriction={2}
  //           onPress={onThirdIconPress}
  //         >
  //           <ImageComponent
  //             resizeMode="contain"
  //             source={thirdIconImageSource}
  //             style={styles.iconImageStyle}
  //           />
  //         </RNBounceable>
  //       </View>
  //     )
  //   );
  // };

  renderProfilePicture = () => {
    const {
      onProfilePicPress,
      ImageComponent = Image,
      profileImageSource = defaultProfilePicture,
    } = this.props;
    return <UserAccount />;
  };


  // renderThemeSwitcher = () => {
  //   return (
  //     <ThemeContext.Consumer>
  //       {({ theme, toggleTheme }) => (
  //         <View style={styles.toggleContainer}>
  //           <Toggle
  //             checked={theme === "dark"}
  //             onChange={toggleTheme}
  //             status="control"
  //             style={styles.toggle}
  //           />
  //         </View>
  //       )}
  //     </ThemeContext.Consumer>
  //   )
  // }

  renderRightAlignedComponent = () => {
    return (
      <View style={styles.rightAlignedContainer}>
        {/* {this.renderThemeSwitcher()} */}
        {this.renderFirstIcon()}
        {/* {this.renderSecondIcon()} */}
        {/* {this.renderThirdIcon()} */}
        {this.renderProfilePicture()}
      </View>
    );
  };
  render() {
    const { style, height = 50, backgroundColor = "#fff" } = this.props;
    return (
      <SafeAreaLayout insets="top">
        <View style={[_container(height, backgroundColor), style]}>
          {this.renderLeftAlignedComponent()}
          {this.renderRightAlignedComponent()}
        </View>
      </SafeAreaLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  leftAlignedContainer: {
    marginRight: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leftAlignedButtonImageStyle: {
    height: 25,
    width: 25,
  },
  titleContainer: {
    marginLeft: 16,
  },
  titleTextStyle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rightAlignedContainer: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonContainer: {
    marginRight: 14,
  },
  iconImageStyle: {
    width: 18,
    height: 18,
  },
  profileImageStyle: {
    width: 35,
    height: 35,
    borderRadius: 12,
  },
  toggleContainer:{
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  toggle:{
    borderRadius: 30,
    backgroundColor: "black"
  }
});
