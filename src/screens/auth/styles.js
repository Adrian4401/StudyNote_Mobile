import { MyColors } from "../../styles/colors";
import { StyleSheet } from "react-native";
import { fontSizes } from "../../styles/typography";

export const authStyles = (theme) =>
  StyleSheet.create({
    // AUTH SCREEN
    headerContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginTop: 20,
    },
    headerText: {
      fontSize: fontSizes.large + 6,
      color: theme.textPrimary,
    },
    headerIconsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      flex: 1,
      marginBottom: 6,
    },
    logoContainer: {
      flex: 1,
      width: "100%",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 30,
      paddingTop: 20,
    },
    mainContainer: {
      flex: 3,
      justifyContent: "space-between",
      backgroundColor: theme.newBackground,
      width: "100%",
      padding: 20,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      marginTop: 20,
    },
    formContainer: {
      flex: 3,
      justifyContent: "center",
    },
    bottomContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    changeFormContainer: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      marginVertical: 20,
    },
  });
