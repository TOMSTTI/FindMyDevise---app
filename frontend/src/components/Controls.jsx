import React from 'react';

const Controls = ({ isTracking, onToggle }) => {
  return (
    <div className="glass-panel controls-panel">
      <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem' }}>
        <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Location Sharing</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {isTracking ? 'Your location is visible to others' : 'You are hidden'}
        </span>
      </div>

      <button
        onClick={() => onToggle(!isTracking)}
        className={`btn ${isTracking ? 'btn-danger' : 'btn-primary'}`}
        style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.5rem' }}
      >
        {isTracking ? 'Stop Sharing' : 'Start Sharing'}
      </button>
    </div>
  );
};

export default Controls;
