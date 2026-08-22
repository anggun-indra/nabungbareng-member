// Subtle and non-intrusive haptics
export const haptic = {
  // Silent or very gentle
  light: () => {
    // Silent for regular clicks to avoid annoying vibrations
  },

  medium: () => {
    // Silent for regular drags
  },

  // Subtle tick on selection or filter change
  selection: () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10)
      } catch {
        // Ignore
      }
    }
  },

  // Subtle single tick only on successful payment submission
  success: () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15)
      } catch {
        // Ignore
      }
    }
  },

  error: () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(30)
      } catch {
        // Ignore
      }
    }
  },
}
