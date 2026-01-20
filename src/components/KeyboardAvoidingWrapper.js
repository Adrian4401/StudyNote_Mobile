import { ScrollView, KeyboardAvoidingView, View } from "react-native"

export const KeyboardAvoidingWrapper = ({ children }) => {
    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ flex: 1 }}>
                    {children}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
