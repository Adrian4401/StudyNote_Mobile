import { SafeAreaView, View } from "react-native";
import { useDarkMode } from "../context/DarkModeContext";

export const Safearea = ({ children }) => {
    const { theme } = useDarkMode()

    return (
        <>
            <SafeAreaView edges={['top']} style={{flex: 0, backgroundColor: theme.navigation}}/>
            <SafeAreaView edges={['left', 'right', 'bottom']} style={{flex: 1, backgroundColor: theme.background}}>
                {children}
            </SafeAreaView>
        </>
    )
}

export const SafeareaNoNav = ({ children }) => {
    const { theme } = useDarkMode()

    return (
        <>
            <SafeAreaView edges={['top']} style={{flex: 0, backgroundColor: theme.navigation}}/>
            <View edges={['left', 'right', 'bottom']} style={{flex: 1, backgroundColor: theme.background}}>
                {children}
            </View>
        </>
    )
}