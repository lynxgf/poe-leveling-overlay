import React, { useState, useEffect, useMemo } from 'react';
import type { LevelingStep, LevelingAct, GroupedStep } from '../types/leveling';
import { loadLevelingData, clearCache } from '../utils/dataLoader';
import { loadProgress, saveProgress, loadSettings, saveSettings } from '../utils/storage';
import StepCard from './StepCard';
import ZoneGroup from './ZoneGroup';
import ProgressBar from './ProgressBar';
import SettingsPanel from './SettingsPanel';

const LevelingGuide: React.FC = () => {
  const [levelingData, setLevelingData] = useState<{ acts: LevelingAct[] } | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [settings, setSettings] = useState(loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await loadLevelingData(settings.gameVersion);
        setLevelingData(data);
        const progress = loadProgress(settings.gameVersion);
        setCompletedSteps(progress);
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize:', error);
        setLoading(false);
      }
    };
    init();
  }, [settings.gameVersion]);

  // Reload data when game version changes
  useEffect(() => {
    const reloadData = async () => {
      try {
        setLoading(true);
        clearCache();
        const data = await loadLevelingData(settings.gameVersion);
        setLevelingData(data);
        const progress = loadProgress(settings.gameVersion);
        setCompletedSteps(progress);
        setCurrentStepIndex(0);
        setLoading(false);
      } catch (error) {
        console.error('Failed to reload data:', error);
        setLoading(false);
      }
    };
    if (settings.gameVersion) {
      reloadData();
    }
  }, [settings.gameVersion]);

  const currentAct = useMemo(() => {
    if (!levelingData) return null;
    return levelingData.acts.find(act => act.actNumber === settings.currentAct) || levelingData.acts[0];
  }, [levelingData, settings.currentAct]);

  const getAllSteps = (): LevelingStep[] => {
    if (!currentAct) return [];

    return currentAct.steps
      .filter(step => settings.showOptional || step.type !== 'optional')
      .map(step => ({
        ...step,
        checked: completedSteps.has(step.id),
      }));
  };

  const groupStepsByZone = (steps: LevelingStep[]): GroupedStep[] => {
    const grouped: GroupedStep[] = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (grouped.length > 0) {
        const lastGroup = grouped[grouped.length - 1];
        const sameZone = step.zoneId && lastGroup.zoneId
          ? lastGroup.zoneId === step.zoneId
          : lastGroup.zone === step.zone;

        if (sameZone) {
          lastGroup.steps.push(step);
          lastGroup.allChecked = lastGroup.steps.every(s => s.checked);
          if (!lastGroup.layoutTip && step.layoutTip) {
            lastGroup.layoutTip = step.layoutTip;
          }
          continue;
        }
      }

      grouped.push({
        zone: step.zone,
        zoneId: step.zoneId,
        steps: [step],
        allChecked: step.checked || false,
        layoutTip: step.layoutTip,
      });
    }

    return grouped;
  };

  const getCurrentSteps = (): GroupedStep[] => {
    const allSteps = getAllSteps();

    if (showAllSteps) {
      const visibleCount = settings.visibleSteps;
      const startIdx = Math.max(0, currentStepIndex);
      const endIdx = Math.min(allSteps.length, startIdx + visibleCount);
      const sliced = allSteps.slice(startIdx, endIdx);
      return groupStepsByZone(sliced);
    } else {
      const uncheckedSteps = allSteps.filter(s => !s.checked);
      const visibleCount = settings.visibleSteps;
      const currentUncheckedIdx = Math.max(0, Math.min(uncheckedSteps.length - 1, currentStepIndex));
      const endIdx = Math.min(uncheckedSteps.length, currentUncheckedIdx + visibleCount);
      const sliced = uncheckedSteps.slice(currentUncheckedIdx, endIdx);
      return groupStepsByZone(sliced);
    }
  };

  const handleToggleStep = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
    saveProgress(newCompleted, settings.gameVersion);
  };

  const handleToggleGroup = (stepIds: string[]) => {
    const newCompleted = new Set(completedSteps);
    const allChecked = stepIds.every(id => newCompleted.has(id));

    stepIds.forEach(id => {
      if (allChecked) {
        newCompleted.delete(id);
      } else {
        newCompleted.add(id);
      }
    });

    setCompletedSteps(newCompleted);
    saveProgress(newCompleted, settings.gameVersion);
  };

  const navigateSteps = (direction: number) => {
    const allSteps = getAllSteps();

    if (direction < 0) {
      setShowAllSteps(true);
    }

    const targetIndex = currentStepIndex + direction;

    if (targetIndex >= 0 && targetIndex < allSteps.length) {
      setCurrentStepIndex(targetIndex);
    } else if (direction > 0 && showAllSteps) {
      setShowAllSteps(false);
      setCurrentStepIndex(0);
    }
  };

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const currentSteps = getCurrentSteps();
  const allSteps = getAllSteps();
  const completedCount = allSteps.filter(s => s.checked).length;
  const totalCount = allSteps.length;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#fff'
      }}>
        Загрузка данных...
      </div>
    );
  }

  if (!levelingData || !currentAct) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#fff'
      }}>
        Ошибка загрузки данных
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f16 0%, #1a1a24 100%)',
        color: '#fff',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Site Header */}
      <header
        style={{
          background: 'rgba(10, 10, 15, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(240, 184, 102, 0.15)',
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #F0B866 0%, #FFD699 50%, #F0B866 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{
              fontSize: '32px',
              WebkitTextFillColor: 'initial',
              filter: 'drop-shadow(0 0 8px rgba(240, 184, 102, 0.5))',
            }}>⚡</span>
            Path of Exile Leveling Guide
          </h1>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}>
            {settings.gameVersion === 'poe1' ? 'Path of Exile 1' : 'Path of Exile 2'} • Act {currentAct.actNumber}: {currentAct.actName}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* Game Version Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              onClick={() => {
                if (settings.gameVersion !== 'poe1') {
                  handleSettingsChange({ ...settings, gameVersion: 'poe1', currentAct: 1 });
                }
              }}
              style={{
                padding: '10px 20px',
                background: settings.gameVersion === 'poe1'
                  ? 'linear-gradient(135deg, rgba(240, 184, 102, 0.2) 0%, rgba(240, 184, 102, 0.1) 100%)'
                  : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: settings.gameVersion === 'poe1' ? '#F0B866' : 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: settings.gameVersion === 'poe1'
                  ? '0 0 20px rgba(240, 184, 102, 0.15)'
                  : 'none',
              }}
            >
              PoE 1
            </button>
            <button
              onClick={() => {
                if (settings.gameVersion !== 'poe2') {
                  handleSettingsChange({ ...settings, gameVersion: 'poe2', currentAct: 1 });
                }
              }}
              style={{
                padding: '10px 20px',
                background: settings.gameVersion === 'poe2'
                  ? 'linear-gradient(135deg, rgba(240, 184, 102, 0.2) 0%, rgba(240, 184, 102, 0.1) 100%)'
                  : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: settings.gameVersion === 'poe2' ? '#F0B866' : 'rgba(255, 255, 255, 0.6)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: settings.gameVersion === 'poe2'
                  ? '0 0 20px rgba(240, 184, 102, 0.15)'
                  : 'none',
              }}
            >
              PoE 2
            </button>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '15px',
              cursor: 'pointer',
              padding: '12px 24px',
              borderRadius: '12px',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(240, 184, 102, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(240, 184, 102, 0.3)';
              e.currentTarget.style.color = '#F0B866';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '18px' }}>⚙</span>
            Настройки
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: '32px',
          gap: '32px',
        }}
      >
        {/* Sidebar for Act Navigation */}
        <aside
          style={{
            width: '260px',
            background: 'rgba(15, 15, 20, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px 20px',
            height: 'fit-content',
            position: 'sticky',
            top: '100px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '16px',
              marginTop: 0,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}
          >
            Акты
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {levelingData.acts.map((act) => (
              <button
                key={act.actNumber}
                onClick={() => handleSettingsChange({ ...settings, currentAct: act.actNumber })}
                style={{
                  padding: '14px 16px',
                  background:
                    settings.currentAct === act.actNumber
                      ? 'linear-gradient(135deg, rgba(240, 184, 102, 0.15) 0%, rgba(240, 184, 102, 0.05) 100%)'
                      : 'rgba(255, 255, 255, 0.02)',
                  border: 'none',
                  borderLeft: settings.currentAct === act.actNumber
                    ? '3px solid #F0B866'
                    : '3px solid transparent',
                  borderRadius: '8px',
                  color: settings.currentAct === act.actNumber ? '#F0B866' : 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  fontWeight: settings.currentAct === act.actNumber ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  textAlign: 'left',
                  boxShadow: settings.currentAct === act.actNumber
                    ? '0 4px 16px rgba(240, 184, 102, 0.1)'
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (settings.currentAct !== act.actNumber) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderLeftColor = 'rgba(240, 184, 102, 0.3)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (settings.currentAct !== act.actNumber) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <div style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  marginBottom: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{
                    opacity: settings.currentAct === act.actNumber ? 1 : 0.5,
                    fontSize: '12px',
                  }}>
                    {settings.currentAct === act.actNumber ? '▶' : '○'}
                  </span>
                  Act {act.actNumber}
                </div>
                <div style={{
                  fontSize: '12px',
                  opacity: 0.6,
                  marginLeft: '20px',
                }}>{act.actName}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            background: 'rgba(15, 15, 20, 0.4)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
              gap: '20px',
              marginBottom: '28px',
            }}
          >
            {currentSteps.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '80px 20px',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#10B981',
                  marginBottom: '8px',
                }}>
                  Все задачи выполнены!
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}>
                  Отличная работа! Переходи к следующему акту.
                </div>
              </div>
            ) : (
              currentSteps.map((group, index) => {
                if (group.steps.length > 1) {
                  return (
                    <ZoneGroup
                      key={`${group.zone}-${index}`}
                      group={group}
                      isCurrent={index === 0}
                      index={index}
                      onToggle={handleToggleStep}
                      onToggleGroup={handleToggleGroup}
                      showHints={settings.showHints}
                    />
                  );
                } else {
                  return (
                    <StepCard
                      key={group.steps[0].id}
                      step={group.steps[0]}
                      isCurrent={index === 0}
                      index={index}
                      onToggle={handleToggleStep}
                      showHints={settings.showHints}
                    />
                  );
                }
              })
            )}
          </div>

          {/* Progress Bar */}
          <ProgressBar completed={completedCount} total={totalCount} />

          {/* Navigation Controls */}
          <div
            style={{
              marginTop: '24px',
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <button
              onClick={() => navigateSteps(-1)}
              style={{
                padding: '12px 28px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.7)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateX(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <span>←</span> Назад
            </button>
            <button
              onClick={() => navigateSteps(1)}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, rgba(240, 184, 102, 0.15) 0%, rgba(240, 184, 102, 0.08) 100%)',
                border: '1px solid rgba(240, 184, 102, 0.25)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                color: '#F0B866',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240, 184, 102, 0.25) 0%, rgba(240, 184, 102, 0.15) 100%)';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(240, 184, 102, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240, 184, 102, 0.15) 0%, rgba(240, 184, 102, 0.08) 100%)';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Далее <span>→</span>
            </button>
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowSettings(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(15, 15, 20, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8)',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <SettingsPanel
              settings={settings}
              acts={levelingData.acts}
              onSettingsChange={handleSettingsChange}
              onClose={() => setShowSettings(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelingGuide;