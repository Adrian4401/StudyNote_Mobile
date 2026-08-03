import { Platform, Switch, View, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export const QuestionTypeSwitch = ({
    icon,
    label,
    value,
    active,
    onToggle,
    theme,
    styles
}) => {
    return (
        <View style={{
            ...styles.eventView,
            flexDirection: 'row',
            paddingHorizontal: 20,
            alignItems: 'center',
            marginBottom: 10
        }}>
            <MaterialCommunityIcons
                name={icon}
                size={24}
                color={theme.primary}
                style={{ paddingHorizontal: 5, width: '10%', textAlign: 'center' }}
            />

            <Text style={styles.subjectText}>{label}</Text>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Switch
                    value={active}
                    onValueChange={() => onToggle(value)}
                    trackColor={{ false: theme.textSecondary, true: theme.primary }}
                    thumbColor={active ? '#0066CD' : '#BDBBBB'}
                    style={{ height: Platform.OS === 'android' ? 20 : 30 }}
                />
            </View>
        </View>
    )
}