import { useState } from 'react';
import { saveSettings } from '../services/settings-storage.service';
import { loadSettings } from '../services/settings-storage.service';

export function useLabSettings() {
  const [settings, setSettings] = useState(loadSettings);
  const update = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => setSettings((current) => ({ ...current, [key]: value }));
  const persist = () => saveSettings(settings);
  return { settings, update, persist };
}
