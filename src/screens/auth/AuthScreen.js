import {
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SafeareaAuth } from "../../components/SafeArea";
import { useDarkMode } from "../../context/DarkModeContext";
import { AuthButton } from "../../components/Buttons";
import { FontAwesome6 } from "@expo/vector-icons";
import { fontSizes } from "../../styles/typography";
import { Error } from "../../components/Errors";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useState } from "react";
import appLanguage from "../../utils/languages";
import { useLanguage } from "../../context/LanguageContext";
import { authStyles } from "./styles";

export default function AuthScreen() {
  const { setUserToken } = useAuth();
  const { theme } = useDarkMode();
  const styles = authStyles(theme);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] =
    useState("");

  const { language } = useLanguage();
  const getTranslatedText = (key) => {
    return appLanguage[language][key];
  };

  const changeForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <SafeareaAuth>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <Logo styles={styles} />
            <View style={styles.mainContainer}>
              <View style={{ flex: 1 }}>
                <Header
                  title={
                    isRegistering
                      ? getTranslatedText("registerTitle")
                      : getTranslatedText("loginTitle")
                  }
                  styles={styles}
                />
              </View>

              <View style={styles.formContainer}>
                {isRegistering ? (
                  <RegisterForm />
                ) : (
                  <LoginForm />
                )}
              </View>

              <View style={styles.bottomContainer}>
                <View style={styles.changeFormContainer}>
                  <Text
                    style={{ color: theme.textSecondary }}
                  >
                    {isRegistering
                      ? getTranslatedText("haveAccountText")
                      : getTranslatedText("noAccountText")}
                  </Text>
                </View>
                <AuthButton
                  text={
                    isRegistering
                      ? getTranslatedText("loginButton")
                      : getTranslatedText("registerButton")
                  }
                  onPress={changeForm}
                  outlined
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeareaAuth>
  );
}

const Logo = ({ styles }) => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("../../../assets/icons/new_logo.png")}
        style={{ width: 40, height: 50 }}
        resizeMode="contain"
      />
      <Image
        source={require("../../../assets/icons/new_title.png")}
        style={{ width: 220, height: 36 }}
        resizeMode="contain"
      />
    </View>
  );
};

const Header = ({ title, styles }) => {
  const { theme } = useDarkMode();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
      <View style={styles.headerIconsContainer}>
        <FontAwesome6
          name="discord"
          size={fontSizes.medium}
          color={theme.textSecondary}
          style={{ marginRight: 20 }}
        />
        <FontAwesome6
          name="square-instagram"
          size={fontSizes.medium}
          color={theme.textSecondary}
          style={{ marginRight: 20 }}
        />
        <FontAwesome6
          name="facebook"
          size={fontSizes.medium}
          color={theme.textSecondary}
        />
      </View>
    </View>
  );
};
