import React, { useState } from 'react';
import type { GroupedStep } from '../types/leveling';
import { getStepIcon } from '../utils/stepUtils';
import { pluralizeTask } from '../utils/pluralize';
import { translateDescription } from '../utils/translate';

interface ZoneGroupProps {
  group: GroupedStep;
  isCurrent: boolean;
  index: number;
  onToggle: (stepId: string) => void;
  onToggleGroup: (stepIds: string[]) => void;
  showHints: boolean;
}

const ZoneGroup: React.FC<ZoneGroupProps> = ({
  group,
  isCurrent,
  index,
  onToggle,
  onToggleGroup,
  showHints,
}) => {
  const [showLayoutTooltip, setShowLayoutTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const borderColor = '#10B981';
  const opacity = isCurrent ? 1 : Math.max(0.5, 1 - index * 0.15);

  const handleMasterToggle = () => {
    const stepIds = group.steps.map(s => s.id);
    onToggleGroup(stepIds);
  };

  return (
    <div
      className="zone-group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: isCurrent ? '20px' : '16px',
        background: isCurrent
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%)'
          : 'rgba(255, 255, 255, 0.02)',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: '12px',
        opacity,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: isCurrent ? '15px' : '14px',
        position: 'relative',
        overflow: 'hidden',
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
        boxShadow: isHovered ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '14px',
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
        }}
      >
        <input
          type="checkbox"
          checked={group.allChecked}
          onChange={handleMasterToggle}
          style={{
            cursor: 'pointer',
            width: '20px',
            height: '20px',
            flexShrink: 0,
          }}
        />
        <div
          style={{
            fontWeight: 600,
            color: borderColor,
            fontSize: isCurrent ? '16px' : '15px',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '16px' }}>📍</span>
          {group.zone}
          <span style={{
            fontSize: '12px',
            color: 'rgba(16, 185, 129, 0.6)',
            fontWeight: 500,
          }}>
            ({group.steps.length} {pluralizeTask(group.steps.length)})
          </span>
        </div>
        {group.layoutTip && (
          <div
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'help',
              fontSize: '20px',
              background: 'rgba(240, 184, 102, 0.15)',
              borderRadius: '8px',
              border: '1px solid rgba(240, 184, 102, 0.3)',
              animation: 'pulse 2s ease-in-out infinite',
              boxShadow: '0 0 12px rgba(240, 184, 102, 0.3)',
            }}
            onMouseEnter={() => setShowLayoutTooltip(true)}
            onMouseLeave={() => setShowLayoutTooltip(false)}
          >
            🗺️
            {showLayoutTooltip && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '50px',
                  background: 'rgba(15, 15, 20, 0.98)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(240, 184, 102, 0.3)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  maxWidth: '300px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: 1.5,
                  pointerEvents: 'none',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(240, 184, 102, 0.2)',
                  zIndex: 1000,
                  whiteSpace: 'normal',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  color: '#F0B866',
                  fontWeight: 600,
                }}>
                  🗺️ Совет по карте
                </div>
                {group.layoutTip}
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingLeft: '32px',
        }}
      >
        {group.steps.map((step) => (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '14px',
              padding: '10px 12px',
              background: step.checked
                ? 'rgba(255, 255, 255, 0.01)'
                : 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            <input
              type="checkbox"
              checked={step.checked || false}
              onChange={() => onToggle(step.id)}
              style={{
                marginTop: '2px',
                cursor: 'pointer',
                width: '18px',
                height: '18px',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: step.checked ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.8)',
                  textDecoration: step.checked ? 'line-through' : 'none',
                  lineHeight: 1.5,
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{
                  fontSize: '14px',
                  opacity: step.checked ? 0.5 : 1,
                }}>
                  {getStepIcon(step.type as any)}
                </span>
                {translateDescription(step.description)}
              </div>
              {showHints && step.hint && step.hint.length <= 40 && (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontStyle: 'italic',
                    marginTop: '4px',
                    marginLeft: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>💡</span> {step.hint}
                </div>
              )}
              {step.reward && (
                <div
                  style={{
                    fontSize: '13px',
                    color: '#fff',
                    marginTop: '8px',
                    marginLeft: '22px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.15) 100%)',
                    borderRadius: '10px',
                    border: '2px solid rgba(16, 185, 129, 0.6)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(16, 185, 129, 0.1)',
                    width: 'fit-content',
                  }}
                >
                  <span style={{ fontSize: '18px', filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))' }}>🎁</span>
                  <span style={{
                    background: 'linear-gradient(90deg, #10B981, #34D399)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 800,
                  }}>НАГРАДА</span>
                  <span style={{ color: '#34D399', fontSize: '16px' }}>➔</span>
                  <span style={{ color: '#fff' }}>{step.reward}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ZoneGroup;



