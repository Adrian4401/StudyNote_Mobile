import { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    Switch,
    Platform,
    ScrollView,
    Modal,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { createStyles } from '../styles/index'
import { SettingsScreenButton } from '../components/Buttons'
import appLanguage from '../utils/languages'
import { useLanguage } from '../context/LanguageContext'
import { useDarkMode } from '../context/DarkModeContext'
import { useAuth } from '../context/AuthContext'
import { Safearea } from '../components/SafeArea'
import { changePassword } from '../api/auth'
import { Error } from '../components/Errors'

export default function SettingsScreen() {
    const { userToken, user, setUserToken } = useAuth()

    const { language, changeLanguage } = useLanguage()
    const { darkMode, changeDarkMode, theme } = useDarkMode()

    const styles = createStyles(theme)
    const settingsStyles = createSettingsStyles(theme)

    const getTranslatedText = (key) => {
        return appLanguage[language][key]
    }

    const [openLanguages, setOpenLanguages] = useState(false)
    const [languages, setLanguages] = useState([
        {
            label: 'Polski',
            value: 'pl',
            icon: () => (
                <Image
                    source={require('../../assets/flags/pl_flag.png')}
                    style={{ borderRadius: 20, marginHorizontal: 5 }}
                />
            )
        },
        {
            label: 'English',
            value: 'en',
            icon: () => (
                <Image
                    source={require('../../assets/flags/uk_flag.png')}
                    style={{ borderRadius: 20, marginHorizontal: 5 }}
                />
            )
        }
    ])

    const [passwordModalVisible, setPasswordModalVisible] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [repeatNewPassword, setRepeatNewPassword] = useState('')
    const [errorCode, setErrorCode] = useState('')
    const [savingPassword, setSavingPassword] = useState(false)

    const onLogout = async () => {
        await setUserToken(null)
    }

    const handleLanguageChange = (value) => {
        changeLanguage(value)
    }

    const handleDarkModeChange = (value) => {
        changeDarkMode(value)
    }

    const resetPasswordForm = () => {
        setCurrentPassword('')
        setNewPassword('')
        setRepeatNewPassword('')
        setErrorCode('')
    }

    const closePasswordModal = () => {
        setPasswordModalVisible(false)
        resetPasswordForm()
    }

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !repeatNewPassword) {
            setErrorCode('PASSWORD_MISSING_FIELDS')
            return
        }

        if (newPassword !== repeatNewPassword) {
            setErrorCode('PASSWORDS_NOT_MATCH')
            return
        }

        try {
            setSavingPassword(true)
            setErrorCode('')

            await changePassword({
                currentPassword,
                newPassword,
                token: userToken
            })

            closePasswordModal()
        } catch (error) {
            setErrorCode(error.message)
        } finally {
            setSavingPassword(false)
        }
    }

    return (
        <Safearea>
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>
                    {getTranslatedText('settingsScreenTitle')}
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.viewContainer}>
                    <View style={settingsStyles.userCard}>
                        <View style={settingsStyles.avatar}>
                            <MaterialCommunityIcons name="account" size={34} color="#fff" />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={settingsStyles.usernameText}
                            >
                                {user?.username}
                            </Text>

                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={settingsStyles.userSubtitle}
                            >
                                {user?.email}
                            </Text>
                        </View>
                    </View>

                    <View style={settingsStyles.section}>
                        <Text style={styles.sectionText}>
                            {getTranslatedText('userSection')}
                        </Text>

                        <SettingsScreenButton
                            onPress={() => setPasswordModalVisible(true)}
                            icon="lock-reset"
                            text={getTranslatedText('changePassword')}
                        />

                        <Text style={settingsStyles.smallInfo}>
                            {getTranslatedText('accountSettingsInfo')}
                        </Text>
                    </View>

                    <View style={settingsStyles.section}>
                        <Text style={styles.sectionText}>
                            {getTranslatedText('languageText')}
                        </Text>

                        <DropDownPicker
                            listMode="SCROLLVIEW"
                            placeholder={getTranslatedText('languageText')}
                            open={openLanguages}
                            value={language}
                            items={languages}
                            setOpen={setOpenLanguages}
                            setValue={(callback) => {
                                const value = typeof callback === 'function'
                                    ? callback(language)
                                    : callback

                                handleLanguageChange(value)
                            }}
                            setItems={setLanguages}
                            style={settingsStyles.dropdown}
                            dropDownContainerStyle={settingsStyles.dropdownContainer}
                            textStyle={settingsStyles.dropdownText}
                            placeholderStyle={settingsStyles.dropdownPlaceholder}
                            arrowIconContainerStyle={settingsStyles.arrowIconContainer}
                        />
                    </View>

                    <View style={settingsStyles.section}>
                        <Text style={styles.sectionText}>
                            {getTranslatedText('themeText')}
                        </Text>

                        <View style={settingsStyles.settingRow}>
                            <MaterialCommunityIcons
                                name="invert-colors"
                                size={24}
                                color={theme.primary}
                                style={{ marginRight: 12 }}
                            />

                            <Text style={settingsStyles.settingText}>
                                {darkMode
                                    ? getTranslatedText('dark')
                                    : getTranslatedText('light')}
                            </Text>

                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Switch
                                    value={darkMode}
                                    onValueChange={handleDarkModeChange}
                                    trackColor={{
                                        false: theme.textSecondary,
                                        true: theme.primary
                                    }}
                                    thumbColor={darkMode ? '#0066CD' : '#BDBBBB'}
                                    style={{
                                        height: Platform.OS === 'android' ? 20 : 30
                                    }}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={settingsStyles.logoutSection}>
                        <SettingsScreenButton
                            onPress={onLogout}
                            icon="logout"
                            text={getTranslatedText('logoutButton')}
                        />
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={passwordModalVisible}
                transparent
                animationType="fade"
                onRequestClose={closePasswordModal}
            >
                <View style={settingsStyles.modalOverlay}>
                    <View style={settingsStyles.modalContainer}>
                        <Text style={settingsStyles.modalTitle}>
                            {getTranslatedText('changePassword')}
                        </Text>

                        {errorCode ? (
                            <Error
                                message={errorCode}
                                getTranslatedText={getTranslatedText}
                            />
                        ) : null}

                        <TextInput
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder={getTranslatedText('currentPassword')}
                            placeholderTextColor={theme.textSecondary}
                            secureTextEntry
                            style={settingsStyles.input}
                        />

                        <TextInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder={getTranslatedText('newPassword')}
                            placeholderTextColor={theme.textSecondary}
                            secureTextEntry
                            style={settingsStyles.input}
                        />

                        <TextInput
                            value={repeatNewPassword}
                            onChangeText={setRepeatNewPassword}
                            placeholder={getTranslatedText('repeatNewPassword')}
                            placeholderTextColor={theme.textSecondary}
                            secureTextEntry
                            style={settingsStyles.input}
                        />

                        <View style={settingsStyles.modalButtons}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={closePasswordModal}
                                style={settingsStyles.secondaryButton}
                            >
                                <Text style={settingsStyles.secondaryButtonText}>
                                    {getTranslatedText('cancel')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={handleChangePassword}
                                disabled={savingPassword}
                                style={settingsStyles.primaryButton}
                            >
                                {savingPassword ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={settingsStyles.primaryButtonText}>
                                        {getTranslatedText('save')}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={{ width: '100%', height: 40 }} />
        </Safearea>
    )
}

const createSettingsStyles = (theme) => {
    return StyleSheet.create({
        userCard: {
            width: '100%',
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 28
        },
        avatar: {
            width: 58,
            height: 58,
            borderRadius: 8,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14
        },
        usernameText: {
            color: theme.textPrimary,
            fontSize: 22,
            marginBottom: 4
        },
        userSubtitle: {
            color: theme.textSecondary,
            fontSize: 14
        },
        section: {
            width: '100%',
            marginBottom: 28,
        },
        smallInfo: {
            color: theme.textSecondary,
            fontSize: 13,
            marginTop: 10
        },
        settingRow: {
            width: '100%',
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 14,
            flexDirection: 'row',
            alignItems: 'center'
        },
        settingText: {
            color: theme.textPrimary,
            fontSize: 18
        },
        dropdown: {
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8,
            zIndex: 3000
        },
        dropdownContainer: {
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8
        },
        dropdownText: {
            color: theme.textPrimary,
            fontSize: 18
        },
        dropdownPlaceholder: {
            color: theme.textSecondary
        },
        arrowIconContainer: {
            backgroundColor: theme.primary,
            borderRadius: 5,
            marginEnd: 5
        },
        logoutSection: {
            width: '100%',
            marginTop: 20,
            marginBottom: 40
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.55)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
        },
        modalContainer: {
            width: '100%',
            backgroundColor: theme.background,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8,
            padding: 18
        },
        modalTitle: {
            color: theme.textPrimary,
            fontSize: 22,
            marginBottom: 18
        },
        input: {
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            color: theme.textPrimary,
            marginBottom: 12
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8
        },
        primaryButton: {
            flex: 1,
            backgroundColor: theme.primary,
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
            marginLeft: 8
        },
        primaryButtonText: {
            color: '#fff',
            fontSize: 16
        },
        secondaryButton: {
            flex: 1,
            borderColor: theme.primary,
            borderWidth: 1,
            borderRadius: 8,
            padding: 12,
            alignItems: 'center',
            marginRight: 8
        },
        secondaryButtonText: {
            color: theme.primary,
            fontSize: 16
        }
    })
}