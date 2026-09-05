// ===== BASE COLORS =====
const BG = '#18161a' // Modern black with grey undertone
const NEON_GREEN = '#33FF33' // Bright, vivid green
const DARK_NEON_GREEN = '#226622' // Darker green with glow
const LIGHT_GREEN = '#90EE90' // Classic, soft, and highly readable
const NEON_PURPLE = '#9933FF' // Bright, vivid purple
const LIGHT_PURPLE = '#B19CD9' // Classic, soft, and highly readable

// ===== PONG GAME COLORS =====
export const CANVAS_COLOR = BG
export const BALL_COLOR = NEON_PURPLE
export const PADDLE_COLOR = NEON_PURPLE
export const PIXEL_COLOR = NEON_GREEN
export const HIT_COLOR = DARK_NEON_GREEN

// ===== NAVBAR COLORS =====
export const NAV_BG_COLOR = BG
export const NAV_BORDER_COLOR = NEON_PURPLE
export const NAV_TEXT_COLOR = NEON_GREEN
export const NAV_HOVER_COLOR = DARK_NEON_GREEN

// ===== SITE COLORS =====
export const SITE_BG_COLOR = BG
export const SITE_HEADER_COLOR = NEON_GREEN
export const SITE_SUBHEADER_COLOR = LIGHT_PURPLE
export const SITE_TEXT_COLOR = LIGHT_GREEN
export const SITE_SUBTEXT_COLOR = LIGHT_PURPLE
export const SITE_BORDER_COLOR = NEON_PURPLE
export const SITE_BTN_COLOR = LIGHT_PURPLE
export const SITE_CARD_COLOR = BG

// ===== DERIVED TRANSLUCENT VARIANTS =====
// Hoisted to module scope so render paths avoid per-frame string concatenation.
// Suffix is hex alpha: 20≈12%, 30≈19%, 40≈25%, 50≈31%, 60≈38%, 80≈50%, f8≈97%.
export const SITE_BTN_COLOR_20 = `${SITE_BTN_COLOR}20` as const
export const SITE_BTN_COLOR_40 = `${SITE_BTN_COLOR}40` as const
export const SITE_BTN_COLOR_50 = `${SITE_BTN_COLOR}50` as const
export const SITE_BTN_COLOR_60 = `${SITE_BTN_COLOR}60` as const
export const SITE_TEXT_COLOR_20 = `${SITE_TEXT_COLOR}20` as const
export const SITE_TEXT_COLOR_30 = `${SITE_TEXT_COLOR}30` as const
export const SITE_BORDER_COLOR_20 = `${SITE_BORDER_COLOR}20` as const
export const SITE_BORDER_COLOR_30 = `${SITE_BORDER_COLOR}30` as const
export const SITE_BORDER_COLOR_40 = `${SITE_BORDER_COLOR}40` as const
export const SITE_BORDER_COLOR_60 = `${SITE_BORDER_COLOR}60` as const
export const SITE_CARD_COLOR_80 = `${SITE_CARD_COLOR}80` as const
export const NAV_BG_COLOR_F8 = `${NAV_BG_COLOR}f8` as const
export const NAV_BORDER_COLOR_60 = `${NAV_BORDER_COLOR}60` as const

// ===== HOISTED COMPOSITE SHADOWS / BORDERS =====
export const SECTION_SHADOW =
  `0 0 0 1px ${SITE_BORDER_COLOR_20}, 0 0 5px ${SITE_BORDER_COLOR_30}` as const
export const CARD_SHADOW =
  `0 0 0 1px ${SITE_BORDER_COLOR}, 0 0 10px ${SITE_BORDER_COLOR_40}` as const
export const TIMELINE_DOT_SHADOW =
  `0 0 0 2px ${SITE_BORDER_COLOR}, 0 0 15px ${SITE_BTN_COLOR_60}` as const
export const SKILL_BAR_SHADOW = `0 0 8px ${SITE_BTN_COLOR_60}` as const
export const PINNED_BADGE_BORDER = `1px solid ${SITE_BTN_COLOR_40}` as const
export const NAVBAR_SHADOW =
  `0 0 0 1px ${NAV_BORDER_COLOR}, 0 0 10px ${NAV_BORDER_COLOR_60}` as const
export const SITE_BTN_BORDER = `1px solid ${SITE_BTN_COLOR}` as const

// ===== SHARED STYLE PRESETS =====
export const OUTLINE_BTN_STYLE = {
  backgroundColor: SITE_BTN_COLOR_20,
  color: SITE_BTN_COLOR,
  borderColor: SITE_BTN_COLOR,
} as const

export const ICON_BG_STYLE = {
  backgroundColor: SITE_BTN_COLOR_20,
} as const
