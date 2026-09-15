import React from 'react';
import LoveLetterIcon from './icons/LoveLetterIcon';
import SparkleIcon from './icons/SparkleIcon';

export default function PermissionModal({ isOpen, onAllow, onSkip }) {
  if (!isOpen) return null;

  return (
    <div id="permission-modal" className="active" role="dialog" aria-modal="true" aria-labelledby="perm-title">
      <div className="permission-box glass-dark">
        <div className="permission-icon"><i className="fas fa-bell text-yellow-400"></i></div>
        <h2 className="permission-title" id="perm-title">Enable Notifications</h2>
        <p className="permission-text">
          For the most magical experience, allow notifications so you'll be alerted at exactly midnight with your special birthday surprise! Keep this page open until the clock strikes 12. <SparkleIcon size="1em" />
        </p>
        <button className="permission-btn" id="allow-notifications-btn" onClick={onAllow}>
          Allow Notifications <LoveLetterIcon size="1.1em" style={{ marginLeft: '6px' }} />
        </button>
        <br />
        <button className="permission-btn permission-btn-skip" id="skip-notifications-btn" onClick={onSkip}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

