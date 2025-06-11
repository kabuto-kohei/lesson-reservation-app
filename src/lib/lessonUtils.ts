// ラベル一覧を共通定義
export const LESSON_TYPE_LABELS: Record<string, string> = {
  reserve: "スクール",
  trial: "スクール体験",
  rope: "ロープ講習",
};

// 共通で使える表示ラベル関数
export function getLessonTypeLabel(type?: string): string {
  return type ? LESSON_TYPE_LABELS[type] || "種別なし" : "種別なし";
}

// オプション生成（selectタグなどに使う用）
export const lessonTypeOptions = Object.entries(LESSON_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);
