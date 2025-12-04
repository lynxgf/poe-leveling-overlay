import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      style={{
        padding: '20px 24px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 600,
          }}
        >
          Прогресс акта
        </div>
        <div
          style={{
            fontSize: '14px',
            color: percentage >= 100 ? '#10B981' : '#F0B866',
            fontWeight: 700,
          }}
        >
          {completed}/{total} ({percentage}%)
        </div>
      </div>
      <div
        style={{
          width: '100%',
          height: '8px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: percentage >= 100
              ? 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
              : 'linear-gradient(90deg, #F0B866 0%, #FFD699 50%, #F0B866 100%)',
            backgroundSize: '200% 100%',
            borderRadius: '4px',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: percentage >= 100
              ? '0 0 16px rgba(16, 185, 129, 0.5)'
              : '0 0 12px rgba(240, 184, 102, 0.4)',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;


