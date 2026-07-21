import { ActivityIndicator } from "react-native";
import { useDarkMode } from "../context/DarkModeContext";

export const LoadingIndicator = () => {
    const { theme } = useDarkMode();

    return (
        <ActivityIndicator 
            size='large'
            color={theme.primary}
        />
    )
}