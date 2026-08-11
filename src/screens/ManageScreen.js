import { useState, useCallback } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'

import { useLanguage } from '../context/LanguageContext'
import appLanguage from '../utils/languages'
import { useDarkMode } from '../context/DarkModeContext'
import { createStyles } from '../styles/index'
import { Safearea } from '../components/SafeArea.js'
import { getAllSubjects } from '../api/subjects'
import { getAllClasses } from '../api/classes'
import { useAuth } from '../context/AuthContext.js'
import { LoadingIndicator } from '../components/LoadingIndicator'

export default function ManageScreen() {
    const navigation = useNavigation()
    const { userToken } = useAuth()

    const { language } = useLanguage()
    const { theme } = useDarkMode()

    const styles = createStyles(theme)
    const manageStyles = createManageStyles(theme)

    const getTranslatedText = (key) => {
        return appLanguage[language][key]
    }

    const [subjects, setSubjects] = useState([])
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                if (!userToken) {
                    setLoading(false)
                    return
                }

                setLoading(true)

                try {
                    const subjectsData = await getAllSubjects(userToken)
                    const classesData = await getAllClasses(userToken)

                    setSubjects(subjectsData || [])
                    setClasses(classesData || [])
                } catch (error) {
                    console.log('Loading manage data failed', error.message)
                } finally {
                    setLoading(false)
                }
            }

            loadData()
        }, [userToken])
    )

    const renderSectionHeader = ({ title, icon, onAdd }) => {
        return (
            <View style={manageStyles.sectionHeader}>
                <View style={manageStyles.sectionTitleRow}>
                    <View style={manageStyles.sectionIcon}>
                        <MaterialCommunityIcons name={icon} size={18} color="#fff" />
                    </View>

                    <Text style={styles.headlineText}>{title}</Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onAdd}
                    style={manageStyles.addButton}
                >
                    <AntDesign name="plus" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        )
    }

    const renderEmptyState = (text, icon) => {
        return (
            <View style={manageStyles.emptyContainer}>
                <MaterialCommunityIcons
                    name={icon}
                    size={42}
                    color={theme.textSecondary}
                    style={{ marginBottom: 12 }}
                />

                <Text style={manageStyles.emptyText}>{text}</Text>
            </View>
        )
    }

    const renderManageItem = ({ id, name, onEdit }) => {
        return (
            <TouchableOpacity
                key={id}
                activeOpacity={0.8}
                onPress={onEdit}
                style={manageStyles.itemCard}
            >
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={manageStyles.itemText}
                >
                    {name}
                </Text>

                <View style={manageStyles.editButton}>
                    <MaterialIcons name="edit" size={20} color="#fff" />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Safearea>
            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>
                    {getTranslatedText('manageScreenTitle')}
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.viewContainer}>
                    {loading ? (
                        <View style={manageStyles.loadingContainer}>
                            <LoadingIndicator />
                        </View>
                    ) : (
                        <>
                            <View style={manageStyles.section}>
                                {renderSectionHeader({
                                    title: getTranslatedText('subjectSectionHeadline'),
                                    icon: 'book-outline',
                                    onAdd: () => navigation.navigate('AddSubjectScreen')
                                })}

                                {subjects.length > 0 ? (
                                    subjects.map((subject) =>
                                        renderManageItem({
                                            id: `subject-${subject.id}`,
                                            name: subject.name,
                                            onEdit: () =>
                                                navigation.navigate('EditSubjectScreen', {
                                                    subjectID: subject.id,
                                                    subjectName: subject.name
                                                })
                                        })
                                    )
                                ) : (
                                    renderEmptyState(
                                        getTranslatedText('emptySubjectsInfo'),
                                        'notebook-plus'
                                    )
                                )}
                            </View>

                            <View style={manageStyles.section}>
                                {renderSectionHeader({
                                    title: getTranslatedText('classesSectionHeadline'),
                                    icon: 'shape-outline',
                                    onAdd: () => navigation.navigate('AddClassScreen')
                                })}

                                {classes.length > 0 ? (
                                    classes.map((myclass) =>
                                        renderManageItem({
                                            id: `class-${myclass.id}`,
                                            name: myclass.name,
                                            onEdit: () =>
                                                navigation.navigate('EditClassScreen', {
                                                    classID: myclass.id,
                                                    className: myclass.name
                                                })
                                        })
                                    )
                                ) : (
                                    renderEmptyState(
                                        getTranslatedText('emptyClassesInfo'),
                                        'notebook-plus'
                                    )
                                )}
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            <View style={{ width: '100%', height: 40 }} />
        </Safearea>
    )
}

const createManageStyles = (theme) => {
    return StyleSheet.create({
        section: {
            width: '100%',
            marginBottom: 28
        },
        sectionHeader: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12
        },
        sectionTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
        },
        sectionIcon: {
            width: 34,
            height: 34,
            borderRadius: 8,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10
        },
        addButton: {
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12
        },
        itemCard: {
            width: '100%',
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8,
            padding: 14,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center'
        },
        itemText: {
            flex: 1,
            color: theme.textPrimary,
            fontSize: 18,
            marginRight: 12
        },
        editButton: {
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center'
        },
        emptyContainer: {
            width: '100%',
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            borderRadius: 8,
            padding: 24,
            alignItems: 'center'
        },
        emptyText: {
            color: theme.textSecondary,
            fontSize: 16,
            textAlign: 'center',
            textTransform: 'uppercase'
        },
        loadingContainer: {
            width: '100%',
            alignItems: 'center',
            marginTop: 80
        }
    })
}