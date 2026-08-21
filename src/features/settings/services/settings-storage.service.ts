import { defaultSettings } from '../data/default-settings';
import type { LabSettings } from '../types/settings.types';

const STORAGE_KEY = 'wasla-lab-settings-v1';

export function loadSettings(): LabSettings {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved
      ? (JSON.parse(saved) as LabSettings)
      : structuredClone(defaultSettings);
  } catch {
    return structuredClone(defaultSettings);
  }
}

export function saveSettings(settings: LabSettings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* Local persistence is optional in this POC. */
  }
}
