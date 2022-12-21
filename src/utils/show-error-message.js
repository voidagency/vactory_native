import { showMessage } from "react-native-flash-message";

export const showErrorMessage = (message = "Something went wrong") => {
  showMessage({
    message,
    type: "danger",
    duration: 4000,
  });
};
