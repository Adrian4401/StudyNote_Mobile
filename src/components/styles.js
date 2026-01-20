import { StyleSheet } from "react-native";
import { fontSizes } from "../styles/typography.js";

export const componentsStyles = (theme) =>
  StyleSheet.create({
    // TEXT FIELD
    textField: {
      searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.textPrimary,
        marginBottom: 20,
      },
      searchIcon: {
        paddingVertical: 10,
        paddingLeft: 20,
        flex: 1,
        textAlign: 'center',
      },
      input: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 10,
        paddingLeft: 20,
        color: theme.textPrimary,
        borderRadius: 10,
        flex: 9
      },
    },
    // ERROR
    errorContainer: {
      padding: 10,
      backgroundColor: '#F59099',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    // BUTTONS
    buttons: {
      goBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
      },
      goBackText: {
        color: theme.textPrimary,
        fontSize: fontSizes.large,
        paddingRight: 5
      },
      makeButton: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: theme.primary,
        paddingVertical: 5,
        borderRadius: 20,
        justifyContent: 'center',
        marginTop: 20
      },
      makeText: {
        color: '#fff',
        fontSize: fontSizes.large,
        paddingRight: 5
      },
      settingsScreenButton: {
        width: '100%',
        backgroundColor: theme.secondary,
        borderRadius: 20,
        padding: 10,
        marginVertical: 5,
        flexDirection: 'row', 
        paddingHorizontal: 20
      },
      settingsScreenButtonText: {
        fontSize: fontSizes.medium,
        color: '#fff',
        paddingHorizontal: 10
      },
      authButtonOutlined: {
        container: {
          width: '100%', 
          backgroundColor: theme.newBackground, 
          height: 50, 
          width: '98.5%',
          alignItems: 'center', 
          borderRadius: 10, 
          borderWidth: 1, 
          borderColor: theme.textPrimary
        },
        text: {
          fontSize: fontSizes.medium, 
          paddingVertical: 10, 
          color: theme.textPrimary, 
          fontWeight: '500'
        }
      },
      authButton: {
        gradient: {
          borderRadius: 10, 
          width: '100%', 
          height: 50, 
          alignItems: 'center', 
          justifyContent: 'center',
          marginTop: 10
        },
        container: {
          width: '100%', 
          height: '100%', 
          alignItems: 'center', 
          justifyContent: 'center'
        },
        text: {
          fontSize: fontSizes.medium, 
          paddingVertical: 10, 
          color: theme.textPrimary, 
          fontWeight: '500'
        }
      }
    },
    // SAFEAREA
    safeArea: {
      top: {
        flex: 0, 
        backgroundColor: theme.navigation
      },
      bottom: {
        flex: 1, 
        backgroundColor: theme.background
      }
    },
    // EVENTS
    events: {
      container: {
        width: '100%',
        backgroundColor: theme.secondary,
        borderRadius: 20,
        padding: 10,
        marginVertical: 5
      },
      titleContainer: {
        width: '100%',
        padding: 2,
        backgroundColor: theme.eventBackground,
        borderRadius: 15,
        alignItems: 'center'
      },
      titleText: {
        fontSize: fontSizes.medium + 2,
        textTransform: 'uppercase',
        color: theme.textPrimary
      },
      subjectContainer: {
        flexDirection: 'row',
        marginVertical: 12,
        paddingHorizontal: 5,
        alignItems: 'center'
      },
      subjectText: {
        fontSize: fontSizes.medium,
        color: theme.textPrimary,
        paddingHorizontal: 10
      },
      dateAndTimeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center'
      },

    }
  })