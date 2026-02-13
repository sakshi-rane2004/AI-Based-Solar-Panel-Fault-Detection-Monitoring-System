import React from 'react';

const SeverityBadge = ({ severity }) => {
  const getBadgeClass = (severity) => {
    if (!severity) return 'badge badge-none';
    
    const severityLower = severity.toLowerCase();
    
    switch (severityLower) {
      case 'none':
        return 'badge badge-none';
      case 'low':
        return 'badge badge-low';
      case 'medium':
        return 'badge badge-medium';
      case 'high':
        return 'badge badge-high';
      case 'critical':
        return 'badge badge-critical';
      default:
        return 'badge badge-none';
    }
  };

  const getDisplayText = (severity) => {
    if (!severity) return 'None';
    return severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();
  };

  return (
    <span className={getBadgeClass(severity)}>
      {getDisplayText(severity)}
    </span>
  );
};

export default SeverityBadge;