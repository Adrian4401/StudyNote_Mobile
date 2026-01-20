import { MyColors } from './colors'
import { StyleSheet } from 'react-native'
import { fontSizes } from './typography'


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
            fontSize: fontSizes.xlarge,
            textTransform: 'uppercase',
            fontWeight: '500'
        },

        // TEXT
        eventNameText: {
            fontSize: fontSizes.medium + 2,
            textTransform: 'uppercase',
            color: theme.textPrimary
        },
        subjectText: {
            fontSize: fontSizes.medium,
            color: theme.textPrimary,
            paddingHorizontal: 10
        },
        headlineText: {
            fontSize: fontSizes.medium,
            textTransform: 'uppercase',
            color: theme.textPrimary,
            marginBottom: 7
        },
        sectionText: {
            fontSize: fontSizes.medium,
            textTransform: 'uppercase',
            color: theme.textPrimary,
            marginBottom: 5,
            marginTop: 10
        },
        littleText: {
            fontSize: fontSizes.small,
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
        fontSize: fontSizes.medium,
        textTransform: 'uppercase',
        color: '#fff',
        marginBottom: 10
    },
    sectionText: {
        fontSize: fontSizes.medium,
        textTransform: 'uppercase',
        color: MyColors.textPrimary,
        marginBottom: 5,
        marginTop: 10
    },
    littleText: {
        fontSize: fontSizes.small,
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
        fontSize: fontSizes.medium,
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