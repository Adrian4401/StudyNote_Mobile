import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AIModelContext = createContext();

const AI_MODEL_STORAGE_KEY = "@ai_model";

const DEFAULT_AI_MODEL = "gpt-5-mini";

export const AI_MODELS = {
  GPT_5_MINI: "gpt-5-mini",
  GEMINI_3_5_FLASH_LITE: "gemini-3.5-flash-lite",
};

export const AIModelProvider = ({ children }) => {
  const [aiModel, setAiModel] = useState(DEFAULT_AI_MODEL);
  const [loadingAiModel, setLoadingAiModel] =
    useState(true);

  useEffect(() => {
    loadAiModel();
  }, []);

  const loadAiModel = async () => {
    try {
      const savedModel = await AsyncStorage.getItem(
        AI_MODEL_STORAGE_KEY,
      );

      if (savedModel) {
        setAiModel(savedModel);
      }
    } catch (error) {
      console.error("Error loading AI model:", error);
    } finally {
      setLoadingAiModel(false);
    }
  };

  const changeAiModel = async (model) => {
    try {
      setAiModel(model);
      await AsyncStorage.setItem(
        AI_MODEL_STORAGE_KEY,
        model,
      );
    } catch (error) {
      console.error("Error saving AI model:", error);
    }
  };

  return (
    <AIModelContext.Provider
      value={{
        aiModel,
        changeAiModel,
        loadingAiModel,
      }}
    >
      {children}
    </AIModelContext.Provider>
  );
};

export const useAIModel = () => {
  const context = useContext(AIModelContext);

  if (!context) {
    throw new Error(
      "useAIModel must be used within AIModelProvider",
    );
  }

  return context;
};
