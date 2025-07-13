import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const languages = [
  'en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'ru', 'ar', 'hi',
  'pt', 'it', 'nl', 'tr', 'vi', 'th', 'id', 'ms', 'fil', 'pl'
];

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: languages,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    resources: {
      en: {
        translation: {
          "AI Face Analysis": "AI Face Analysis",
          "Discover your beauty score, celebrity matches, and cultural bias insights through our revolutionary AI technology.": "Discover your beauty score, celebrity matches, and cultural bias insights through our revolutionary AI technology.",
          "Back to Home": "Back to Home",
          "Upload Photo": "Upload Photo",
          "Drag & drop or click to upload your photo": "Drag & drop or click to upload your photo",
          "JPG, PNG, WebP up to 10MB": "JPG, PNG, WebP up to 10MB",
          "Take Photo": "Take Photo",
          "Use your camera to capture a photo": "Use your camera to capture a photo",
          "Real-time capture": "Real-time capture",
          "Tips for Best Results": "Tips for Best Results",
          "Use a clear, front-facing photo": "Use a clear, front-facing photo",
          "Good lighting for better accuracy": "Good lighting for better accuracy",
          "Neutral expression recommended": "Neutral expression recommended",
          "No filters or heavy editing": "No filters or heavy editing",
          "Analyzing Your Face": "Analyzing Your Face",
          "Our AI is processing your image...": "Our AI is processing your image...",
          "This may take a few moments": "This may take a few moments",
          "Language": "Language"
        }
      },
      ko: {
        translation: {
          "AI Face Analysis": "AI 얼굴 분석",
          "Discover your beauty score, celebrity matches, and cultural bias insights through our revolutionary AI technology.": "혁신적인 AI 기술로 당신의 미모 점수, 닮은꼴 연예인, 문화적 편향 인사이트를 확인하세요.",
          "Back to Home": "홈으로 돌아가기",
          "Upload Photo": "사진 업로드",
          "Drag & drop or click to upload your photo": "사진을 드래그하거나 클릭하여 업로드하세요",
          "JPG, PNG, WebP up to 10MB": "JPG, PNG, WebP 최대 10MB",
          "Take Photo": "사진 촬영",
          "Use your camera to capture a photo": "카메라로 사진을 촬영하세요",
          "Real-time capture": "실시간 촬영",
          "Tips for Best Results": "최고 결과를 위한 팁",
          "Use a clear, front-facing photo": "정면, 선명한 사진을 사용하세요",
          "Good lighting for better accuracy": "정확도를 높이려면 밝은 곳에서 촬영하세요",
          "Neutral expression recommended": "중립적인 표정이 좋습니다",
          "No filters or heavy editing": "필터나 과도한 보정은 피하세요",
          "Analyzing Your Face": "얼굴 분석 중",
          "Our AI is processing your image...": "AI가 이미지를 처리하고 있습니다...",
          "This may take a few moments": "잠시만 기다려주세요",
          "Language": "언어"
        }
      },
      ja: {
        translation: {
          "AI Face Analysis": "AI顔分析",
          "Discover your beauty score, celebrity matches, and cultural bias insights through our revolutionary AI technology.": "革新的なAI技術で美しさスコア、有名人のそっくり度、文化的バイアスを発見しましょう。",
          "Back to Home": "ホームに戻る",
          "Upload Photo": "写真をアップロード",
          "Drag & drop or click to upload your photo": "写真をドラッグ＆ドロップまたはクリックしてアップロード",
          "JPG, PNG, WebP up to 10MB": "JPG, PNG, WebP 最大10MB",
          "Take Photo": "写真を撮る",
          "Use your camera to capture a photo": "カメラで写真を撮影",
          "Real-time capture": "リアルタイム撮影",
          "Tips for Best Results": "最良の結果のためのヒント",
          "Use a clear, front-facing photo": "正面で鮮明な写真を使用してください",
          "Good lighting for better accuracy": "明るい場所で撮影してください",
          "Neutral expression recommended": "中立的な表情をおすすめします",
          "No filters or heavy editing": "フィルターや過度な編集は避けてください",
          "Analyzing Your Face": "顔を分析中",
          "Our AI is processing your image...": "AIが画像を処理しています...",
          "This may take a few moments": "しばらくお待ちください",
          "Language": "言語"
        }
      }
    }
  });

export default i18n; 