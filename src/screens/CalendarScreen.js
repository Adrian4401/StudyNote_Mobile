import { useState, useCallback } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { FontAwesome5, FontAwesome, AntDesign } from '@expo/vector-icons'
import { CustomStatusBar } from '../components/StatusBar'
import { ShowEvents } from '../components/ShowEvents'
import { textDate } from '../utils/date'
import { useLanguage } from '../context/LanguageContext'
import appLanguage from '../utils/languages'
import { useDarkMode } from '../context/DarkModeContext'
import { createStyles } from '../styles/index'
import { Safearea } from '../components/SafeArea'
import { useAuth } from '../context/AuthContext'
import { getAllEvents } from '../api/events'
import { LoadingIndicator } from '../components/LoadingIndicator'



export default function CalendarScreen() {
    const navigation = useNavigation()

    const { userToken, user } = useAuth()
    const { language } = useLanguage()
    const { theme } = useDarkMode()

    const styles = createStyles(theme)
    const calendarStyles = createCalendarStyles(theme)

    const getTranslatedText = (key) => {
        return appLanguage[language][key]
    }

    const [weeklyData, setWeeklyData] = useState([])
    const [futureData, setFutureData] = useState([])
    const [olderData, setOlderData] = useState([])
    const [loading, setLoading] = useState(true)

    const splitEventsByDate = (events) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)

        const weekly = []
        const future = []
        const older = []

        events.forEach((event) => {
            const eventDate = new Date(event.deadline)
            const eventDay = new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate()
            )

            if (eventDay < today) {
                older.push(event)
            } else if (eventDay <= nextWeek) {
                weekly.push(event)
            } else {
                future.push(event)
            }
        })

        return { weekly, future, older }
    }

    useFocusEffect(
        useCallback(() => {
            const loadEvents = async () => {
                if (!userToken) {
                    setLoading(false)
                    return
                }

                setLoading(true)

                try {
                    const data = await getAllEvents(userToken)
                    const { weekly, future, older } = splitEventsByDate(data || [])

                    setWeeklyData(weekly)
                    setFutureData(future)
                    setOlderData(older)

                    console.log('Events loaded successfully')
                } catch (error) {
                    console.log('Loading events failed: ', error.message)
                } finally {
                    setLoading(false)
                }
            }

            loadEvents()
        }, [userToken])
    )

    const renderSectionHeader = (title, subtitle = null, icon = 'calendar-check') => {
        return (
            <View style={calendarStyles.sectionHeader}>
                <View style={calendarStyles.sectionIcon}>
                    <FontAwesome5 name={icon} size={14} color="#fff" />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.headlineText}>{title}</Text>

                    {subtitle ? (
                        <Text style={{ ...styles.littleText, marginTop: 2 }}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
            </View>
        )
    }

    const renderThisWeekEvents = () => {
        return (
            <View style={calendarStyles.section}>
                {renderSectionHeader(
                    getTranslatedText('thisWeekEventsText'),
                    getTranslatedText('thisWeekEventsLittleText'),
                    'calendar-day'
                )}

                <ShowEvents dataType={weeklyData} navigation={navigation} />
            </View>
        )
    }

    const renderFutureEvents = () => {
        return (
            <View style={calendarStyles.section}>
                {renderSectionHeader(
                    getTranslatedText('futureEventsText'),
                    null,
                    'calendar-plus'
                )}

                <ShowEvents dataType={futureData} navigation={navigation} />
            </View>
        )
    }

    const renderOlderEvents = () => {
        return (
            <View style={calendarStyles.section}>
                {renderSectionHeader(
                    getTranslatedText('olderEventsText'),
                    null,
                    'history'
                )}

                <ShowEvents dataType={olderData} navigation={navigation} />
            </View>
        )
    }

    const renderEmptyEvents = () => {
        return (
            <View style={calendarStyles.emptyContainer}>
                <View style={calendarStyles.emptyIconContainer}>
                    <FontAwesome name="folder-open" size={44} color={theme.textSecondary} />
                </View>

                <Text style={calendarStyles.emptyTitle}>
                    {getTranslatedText('emptyEventsText')}
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('AddEventScreen')}
                    style={calendarStyles.emptyButton}
                >
                    <AntDesign name="plus" size={18} color="#fff" />
                    <Text style={calendarStyles.emptyButtonText}>
                        {getTranslatedText('add')} {getTranslatedText('event')}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderAllEvents = () => {
        if (
            weeklyData.length === 0 &&
            futureData.length === 0 &&
            olderData.length === 0
        ) {
            return renderEmptyEvents()
        }

        return (
            <>
                {weeklyData.length > 0 ? renderThisWeekEvents() : null}
                {futureData.length > 0 ? renderFutureEvents() : null}
                {olderData.length > 0 ? renderOlderEvents() : null}
            </>
        )
    }

    return (
        <Safearea>
            <CustomStatusBar />

            <View style={styles.headerBackground}>
                <Text style={styles.headerText}>
                    {getTranslatedText('calendarScreenTitle')}
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.viewContainer}>
                    <View style={calendarStyles.topPanel}>
                      <View style={{ flex: 1 }}>
                          <Text style={calendarStyles.welcomeText}>
                              {getTranslatedText('welcome')}{' '}
                              <Text style={{ color: theme.primary }}>{user?.username}</Text>
                          </Text>

                          <View style={calendarStyles.dateRow}>
                              <FontAwesome5
                                  name="calendar-day"
                                  size={14}
                                  color={theme.textSecondary}
                                  style={{ marginRight: 10 }}
                              />

                              <Text style={calendarStyles.dateText}>
                                  {getTranslatedText('todayDate')} {textDate(language)}
                              </Text>
                          </View>
                      </View>

                      <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => navigation.navigate('AddEventScreen')}
                          style={calendarStyles.addButton}
                      >
                          <AntDesign name="plus" size={22} color="#fff" />
                      </TouchableOpacity>
                  </View>

                    {loading ? (
                        <View style={calendarStyles.loadingContainer}>
                            <LoadingIndicator />
                        </View>
                    ) : (
                        renderAllEvents()
                    )}
                </View>
            </ScrollView>

            <View style={{ width: '100%', height: 40 }} />
        </Safearea>
    )
}

const createCalendarStyles = (theme) => {
    return StyleSheet.create({
        topPanel: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 28,
            paddingBottom: 18,
            borderBottomColor: theme.textSecondary,
            borderBottomWidth: 1
        },
        welcomeText: {
            color: theme.textPrimary,
            fontSize: 24,
            marginBottom: 10
        },
        dateRow: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        dateText: {
            color: theme.textSecondary,
            fontSize: 15
        },
        addButton: {
            width: 44,
            height: 44,
            borderRadius: 8,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 14
        },
        welcomeText: {
            color: theme.textPrimary,
            fontSize: 24,
            marginBottom: 12
        },
        dateRow: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        dateText: {
            color: theme.textSecondary,
            fontSize: 15
        },
        addButton: {
            width: 46,
            height: 46,
            borderRadius: 8,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 12
        },
        section: {
            width: '100%',
            marginBottom: 22
        },
        sectionHeader: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10
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
        emptyContainer: {
            width: '100%',
            alignItems: 'center',
            marginTop: 70,
            paddingHorizontal: 20
        },
        emptyIconContainer: {
            width: 84,
            height: 84,
            borderRadius: 8,
            backgroundColor: theme.secondary,
            borderColor: theme.textSecondary,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18
        },
        emptyTitle: {
            color: theme.textSecondary,
            fontSize: 18,
            textAlign: 'center',
            textTransform: 'uppercase',
            marginBottom: 20
        },
        emptyButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.primary,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 16
        },
        emptyButtonText: {
            color: '#fff',
            fontSize: 16,
            marginLeft: 8
        },
        loadingContainer: {
            width: '100%',
            alignItems: 'center',
            marginTop: 80
        }
    })
}