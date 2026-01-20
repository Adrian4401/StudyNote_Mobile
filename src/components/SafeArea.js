import { useDarkMode } from "../context/DarkModeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { componentsStyles } from "./styles";

export const Safearea = ({ children }) => {
    const { theme } = useDarkMode()
    const styles = componentsStyles(theme).safeArea

    return (
        <>
            <SafeAreaView edges={['top']} style={styles.top}/>
            <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.bottom}>
                {children}
            </SafeAreaView>
        </>
    )
}

export const SafeareaNoNav = ({ children }) => {
    const { theme } = useDarkMode()
    const styles = componentsStyles(theme).safeArea

    return (
        <>
            <SafeAreaView edges={['top']} style={styles.top}/>
            <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.bottom}>
                {children}
            </SafeAreaView>
        </>
    )
}

export const SafeareaAuth = ({ children }) => {
    const { theme } = useDarkMode()

    return (
        <>
            <SafeAreaView edges={['top']} style={{flex: 0, backgroundColor: theme.background}}/>
            <SafeAreaView edges={['left', 'right', 'bottom']} style={{flex: 1, backgroundColor: theme.background}}>
                {children}
            </SafeAreaView>
        </>
    )
}