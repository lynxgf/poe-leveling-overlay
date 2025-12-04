import React, { useState } from 'react';
import type { LevelingStep } from '../types/leveling';
import { getStepIcon, getStepColor } from '../utils/stepUtils';
import { translateDescription, translateHint, translateLayoutTip, translateReward } from '../utils/translate';

interface StepCardProps {
  step: LevelingStep;
  isCurrent: boolean;
  index: number;
  onToggle: (stepId: string) => void;
  showHints: boolean;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  isCurrent,
  index,
  onToggle,
  showHints,
}) => {
  const [showHintTooltip, setShowHintTooltip] = useState(false);
  const [showLayoutTooltip, setShowLayoutTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isHighPriority = ['passive', 'trial', 'kill_boss'].includes(step.type);
  const borderColor = getStepColor(step.type);
  const opacity = isCurrent ? 1 : Math.max(0.5, 1 - index * 0.15);

  return (
    <div
      className="step-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        gap: '16px',
        padding: isCurrent ? '20px' : '16px',
        background: isCurrent
          ? isHighPriority
            ? 'linear-gradient(135deg, rgba(240, 184, 102, 0.08) 0%, rgba(240, 184, 102, 0.02) 100%)'
            : 'rgba(255, 255, 255, 0.04)'
          : 'rgba(255, 255, 255, 0.02)',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: '12px',
        opacity,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: isCurrent ? '15px' : '14px',
        position: 'relative',
        transform: isHovered && !step.checked ? 'translateX(4px)' : 'translateX(0)',
        boxShadow: isCurrent && isHighPriority
          ? `0 0 30px rgba(${step.type === 'passive' ? '16, 185, 129' : '240, 184, 102'}, 0.15)`
          : isHovered ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none',
      }}
    >
      <input
        type="checkbox"
        checked={step.checked || false}
        onChange={() => onToggle(step.id)}
        style={{
          marginTop: '2px',
          cursor: 'pointer',
          width: '20px',
          height: '20px',
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${borderColor}20 0%, ${borderColor}08 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: `1px solid ${borderColor}30`,
            }}
          >
            <span style={{ color: borderColor, fontSize: '20px', lineHeight: 1 }}>
              {getStepIcon(step.type)}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            {step.zone && isCurrent && (
              <div
                style={{
                  fontSize: '11px',
                  color: 'rgba(240, 184, 102, 0.8)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '6px',
                }}
              >
                {step.zone}
              </div>
            )}

            <div style={{
              color: step.checked ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
              textDecoration: step.checked ? 'line-through' : 'none',
              fontWeight: isCurrent ? 500 : 400,
              lineHeight: 1.5,
            }}>
              {translateDescription(step.description)}
            </div>

            {step.reward && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                  borderLeft: '4px solid #10B981',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15), inset 0 0 20px rgba(16, 185, 129, 0.05)',
                  animation: 'pulse 2s infinite',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  padding: '2px 8px',
                  borderBottomLeftRadius: '8px',
                  fontSize: '9px',
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}>
                  НАГРАДА
                </div>

                <span style={{
                  fontSize: '24px',
                  filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))',
                  animation: 'bounce 2s infinite',
                }}>🎁</span>
                <span style={{
                  fontSize: '14px',
                  color: '#34D399',
                  fontWeight: 600,
                  textShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
                  letterSpacing: '0.3px',
                }}>
                  {translateReward(step.reward)}
                </span>
              </div>
            )}
          </div>
        </div>

        {showHints && step.hint && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: step.layoutTip ? '60px' : '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 10,
            }}
            onMouseEnter={() => setShowHintTooltip(true)}
            onMouseLeave={() => setShowHintTooltip(false)}
          >
            <span style={{
              fontSize: '16px',
              color: '#FFD699',
              animation: 'bounce 1s ease-in-out infinite',
              filter: 'drop-shadow(0 0 4px rgba(255, 200, 100, 0.8))',
            }}>◀</span>
            <div
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'help',
                fontSize: '20px',
                background: 'linear-gradient(135deg, rgba(255, 200, 100, 0.25) 0%, rgba(255, 200, 100, 0.1) 100%)',
                borderRadius: '10px',
                border: '2px solid rgba(255, 200, 100, 0.5)',
                animation: 'attentionPulse 1.5s ease-in-out infinite',
              }}
            >
              💡
              {showHintTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '52px',
                    background: 'rgba(15, 15, 20, 0.98)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 200, 100, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    minWidth: '300px',
                    maxWidth: '500px',
                    width: 'max-content',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    lineHeight: 1.6,
                    pointerEvents: 'none',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 200, 100, 0.15)',
                    zIndex: 1000,
                    whiteSpace: 'normal',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#FFD699', fontWeight: 600, fontSize: '15px', borderBottom: '1px solid rgba(255, 200, 100, 0.12)'}}>
                    💡 Подсказка
                  </div>
                  {translateHint(step.hint!)}
                </div>
              )}
            </div>
          </div>
        )}

        {showHints && step.layoutTip && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 10,
            }}
            onMouseEnter={() => setShowLayoutTooltip(true)}
            onMouseLeave={() => setShowLayoutTooltip(false)}
          >
            <span style={{
              fontSize: '16px',
              color: '#F0B866',
              animation: 'bounce 1s ease-in-out infinite',
              filter: 'drop-shadow(0 0 4px rgba(240, 184, 102, 0.8))',
            }}>◀</span>
            <div
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'help',
                fontSize: '20px',
                background: 'linear-gradient(135deg, rgba(240, 184, 102, 0.25) 0%, rgba(240, 184, 102, 0.1) 100%)',
                borderRadius: '10px',
                border: '2px solid rgba(240, 184, 102, 0.5)',
                animation: 'attentionPulse 1.5s ease-in-out infinite',
              }}
            >
              🗺️
              {showLayoutTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '52px', // Чуть дальше от иконки
                    background: 'rgba(15, 15, 20, 0.98)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(240, 184, 102, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    minWidth: '300px', // Минимальная ширина для "прямоугольности"
                    maxWidth: '500px', // Максимальная ширина
                    width: 'max-content', // Тянется по контенту
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    lineHeight: 1.6,
                    pointerEvents: 'none',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(240, 184, 102, 0.15)',
                    zIndex: 1000,
                    whiteSpace: 'normal',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#F0B866', fontWeight: 600, fontSize: '15px', borderBottom: '1px solid rgba(240, 184, 102, 0.12)'}}>
                    🗺️ Совет по карте
                  </div>
                  {translateLayoutTip(step.layoutTip!)}
                </div>
              )}
            </div>
          </div>
        )}

        {step.optionalNote && (
          <div
            style={{
              paddingLeft: '52px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.4)',
              fontStyle: 'italic',
            }}
          >
            Примечание: {step.optionalNote}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepCard;