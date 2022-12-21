import { StyleSheet } from "react-native";

export const _shadowStyle = (shadowColor) => {
  return {
    shadowColor,
    shadowRadius: 9,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  };
};

export default StyleSheet.create({
  titleStyle: {
    padding: 16,
    fontSize: 32,
    marginTop: 32,
    fontWeight: "bold",
    letterSpacing: 0,
    textAlign: "center",
    color: "#6c64ff",
  },
  container: {
    top: 0,
  },
  descriptionStyle: {
    marginLeft: 16,
    marginRight: 16,
    fontSize: 13,
    letterSpacing: 0,
    textAlign: "center",
    color: "#6a758f",
  },
  imageStyle: {
    width: 300,
    height: 200,
  },
  center: {
    alignSelf: "center",
    alignContent: "center",
  },
  buttonContainerStyle: {
    margin: 36,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6c64ff",
  },
  buttonTextStyle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});