import { MyColors } from './colors'
import { StyleSheet } from 'react-native'


export const createStyles = (theme) => {
    // CONTAINER
    const container = {
        flex: 1,
        backgroundColor: theme.background,
        alignItems: 'center',
    }

    return StyleSheet.create({
        viewContainer: {
            ...container,
            padding: 20,
            paddingBottom: 120
        },
        flatlistContainer: {
            ...container,
            paddingHorizontal: 20
        },

        // HEADER
        headerBackground: {
            position: 'relative',
            top: 0,
            width: '100%',
            height: 50,
            backgroundColor: theme.navigation,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            justifyContent: 'center',
            alignItems: 'center'
        },
        headerText: {
            color: theme.primary,
            textAlign: 'center',
            fontSize: 30,
            textTransform: 'uppercase',
            fontWeight: '500'
        },

        // TEXT
        eventNameText: {
            fontSize: 25,
            textTransform: 'uppercase',
            color: theme.textPrimary
        },
        subjectText: {
            fontSize: 20,
            color: theme.textPrimary,
            paddingHorizontal: 10
        },
        headlineText: {
            fontSize: 22,
            textTransform: 'uppercase',
            color: theme.textPrimary,
            marginBottom: 7
        },
        sectionText: {
            fontSize: 20,
            textTransform: 'uppercase',
            color: theme.textPrimary,
            marginBottom: 5,
            marginTop: 10
        },
        littleText: {
            fontSize: 15,
            color: theme.textSecondary,
            textTransform: 'uppercase'
        },

        // VIEWS
        eventView: {
            width: '100%',
            backgroundColor: theme.secondary,
            borderRadius: 20,
            padding: 10,
            marginVertical: 5
        },
        eventNameView: {
            width: '100%',
            padding: 2,
            backgroundColor: theme.eventBackground,
            borderRadius: 15,
            alignItems: 'center'
        },
        eventSubjectView: {
            flexDirection: 'row',
            marginVertical: 12,
            paddingHorizontal: 5,
            alignItems: 'center'
        },
        eventDatetimeView: {
            flexDirection: 'row',
            paddingHorizontal: 5,
            alignItems: 'center'
        },
        headlineView: {
            width: '100%',
            marginTop: 10
        },
        headlineViewWithIcon: {
            marginBottom: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center'
        },
        bottomButtonsView: {
            width: '100%',
            paddingHorizontal: 30,
            flexDirection: 'row',
            justifyContent: 'space-between'
        },

        // 'GO BACK' BUTTON 
        goBackButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10
        },
        goBackText: {
            color: theme.textPrimary,
            fontSize: 25,
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
            fontSize: 25,
            paddingRight: 5
        }
    })
}

export const headerStyles = {
    headerBackground: {
      position: 'relative',
      top: 0,
      width: '100%',
      height: 50,
      backgroundColor: MyColors.navigation,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerText: {
        color: MyColors.primary,
        textAlign: 'center',
        fontSize: 30,
        textTransform: 'uppercase',
        fontWeight: 500
    }
}

export const globalStyles = {
    headlineView: {
        width: '100%',
        marginTop: 10
    },
    headlineViewWithIcon: {
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
    },
    headlineText: {
        fontSize: 22,
        textTransform: 'uppercase',
        color: '#fff',
        marginBottom: 10
    },
    sectionText: {
        fontSize: 20,
        textTransform: 'uppercase',
        color: MyColors.textPrimary,
        marginBottom: 5,
        marginTop: 10
    },
    littleText: {
        fontSize: 15,
        color: MyColors.appLightGray,
        textTransform: 'uppercase'
    },
    eventView: {
        width: '100%',
        backgroundColor: MyColors.secondary,
        borderRadius: 20,
        padding: 10,
        marginVertical: 5
    },
    eventSubjectView: {
        flexDirection: 'row',
        marginVertical: 15,
        paddingHorizontal: 5,
        alignItems: 'center'
    },
    eventDatetimeView: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center'
    },
    subjectText: {
        fontSize: 20,
        color: '#fff',
        paddingHorizontal: 10
    },
    bottomButtonsView: {
        width: '100%',
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
}