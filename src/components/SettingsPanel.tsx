import React from 'react';
import type { LevelingAct } from '../types/leveling';
import type { LevelingSettings } from '../utils/storage';

interface SettingsPanelProps {
  settings: LevelingSettings;
  acts: LevelingAct[];
  onSettingsChange: (settings: LevelingSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  acts,
  onSettingsChange,
  onClose,
}) => {
  const handleChange = (key: keyof LevelingSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div>
      <div
        style={{
          fontSize: '20px',
          fontWeight: 700,
          marginBottom: '24px',
          color: '#F0B866',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Настройки</span>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            fontSize: '18px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            marginBottom: '10px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Версия игры
        </label>
        <div
          style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '10px',
            padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            onClick={() => handleChange('gameVersion', 'poe1')}
            style={{
              flex: 1,
              padding: '12px',
              background: settings.gameVersion === 'poe1'
                ? 'linear-gradient(135deg, rgba(240, 184, 102, 0.2) 0%, rgba(240, 184, 102, 0.1) 100%)'
                : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: settings.gameVersion === 'poe1' ? '#F0B866' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Path of Exile 1
          </button>
          <button
            onClick={() => handleChange('gameVersion', 'poe2')}
            style={{
              flex: 1,
              padding: '12px',
              background: settings.gameVersion === 'poe2'
                ? 'linear-gradient(135deg, rgba(240, 184, 102, 0.2) 0%, rgba(240, 184, 102, 0.1) 100%)'
                : 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: settings.gameVersion === 'poe2' ? '#F0B866' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Path of Exile 2
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            marginBottom: '10px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Акт
        </label>
        <select
          value={settings.currentAct}
          onChange={(e) => handleChange('currentAct', parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23ffffff' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
        >
          {acts.map((act) => (
            <option key={act.actNumber} value={act.actNumber} style={{ background: '#1a1a24' }}>
              Act {act.actNumber}: {act.actName}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            marginBottom: '10px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Количество видимых шагов
        </label>
        <input
          type="number"
          min="1"
          max="20"
          value={settings.visibleSteps}
          onChange={(e) => handleChange('visibleSteps', parseInt(e.target.value) || 3)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 500,
            padding: '8px 0',
          }}
        >
          <input
            type="checkbox"
            checked={settings.showHints}
            onChange={(e) => handleChange('showHints', e.target.checked)}
            style={{
              cursor: 'pointer',
              width: '18px',
              height: '18px',
            }}
          />
          Показывать подсказки
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 500,
            padding: '8px 0',
          }}
        >
          <input
            type="checkbox"
            checked={settings.showOptional}
            onChange={(e) => handleChange('showOptional', e.target.checked)}
            style={{
              cursor: 'pointer',
              width: '18px',
              height: '18px',
            }}
          />
          Показывать опциональные шаги
        </label>
      </div>
    </div>
  );
};

export default SettingsPanel;


