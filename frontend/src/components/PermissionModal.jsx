import React from 'react';

export default function PermissionModal({ isOpen, onAllow, onSkip }) {
  if (!isOpen) return null;

  return (
    <div id="permission-modal" className="active" role="dialog" aria-modal="true" aria-labelledby="perm-title">
      <div className="permission-box glass-dark">
        <div className="permission-icon">🔔</div>
        <h2 className="permission-title" id="perm-title">Enable Notifications</h2>
        <p className="permission-text">
          For the most magical experience, allow notifications so you'll be alerted at exactly midnight with your special birthday surprise! Keep this page open until the clock strikes 12. 🌙
        </p>
        <button className="permission-btn" id="allow-notifications-btn" onClick={onAllow}>
          Allow Notifications 💌
        </button>
        <br />
        <button className="permission-btn permission-btn-skip" id="skip-notifications-btn" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}
