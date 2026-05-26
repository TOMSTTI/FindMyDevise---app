import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import MapComponent from '../components/Map';
import Controls from '../components/Controls';

const Dashboard = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [activeUsers, setActiveUsers] = useState({}); // { userId: { username, lat, lng, timestamp } }
  const [myLocation, setMyLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(user?.trackingEnabled || false);

  // Handle Socket Events
  useEffect(() => {
    if (!socket) return;

    socket.on('locationUpdate', (data) => {
      setActiveUsers((prev) => ({
        ...prev,
        [data.userId]: data
      }));
    });

    socket.on('userStoppedTracking', ({ userId }) => {
      setActiveUsers((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    });

    return () => {
      socket.off('locationUpdate');
      socket.off('userStoppedTracking');
    };
  }, [socket]);

  // Handle Geolocation Tracking
  useEffect(() => {
    let watchId;

    if (isTracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc = { lat: latitude, lng: longitude };
          setMyLocation(loc);

          // Emit to socket
          if (socket) {
            socket.emit('updateLocation', loc);
          }
        },
        (error) => {
          console.error('Error getting location', error);
          if (error.code === error.PERMISSION_DENIED) {
            handleToggleTracking(false);
          }
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else {
      setMyLocation(null);
      if (socket) {
        socket.emit('stopTracking');
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, socket]);

  const handleToggleTracking = async (newStatus) => {
    setIsTracking(newStatus);
    
    // Update backend setting
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/tracking`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ trackingEnabled: newStatus })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to update tracking status', error);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Map Layer */}
      <div className="map-container">
        <MapComponent activeUsers={activeUsers} myLocation={myLocation} myUser={user} />
      </div>

      {/* UI Overlay */}
      <div className="ui-overlay">
        
        {/* User List Panel */}
        <div className="glass-panel user-list-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Active Devices</h3>
            <button 
              onClick={logout}
              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Sign Out
            </button>
          </div>
          
          {Object.keys(activeUsers).length === 0 && !isTracking ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No users currently sharing location.</p>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {isTracking && (
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)' }}></div>
                  <span style={{ fontWeight: '500' }}>You ({user.username})</span>
                </li>
              )}
              {Object.values(activeUsers).map(u => (
                <li key={u.userId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
                  <span>{u.username}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(u.timestamp).toLocaleTimeString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Floating Controls */}
        <Controls isTracking={isTracking} onToggle={handleToggleTracking} />
      </div>
    </div>
  );
};

export default Dashboard;
