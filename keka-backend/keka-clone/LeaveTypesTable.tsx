import React, { useEffect, useState } from 'react';

interface LeaveTypeAvailability {
  leaveTypeId: number;
  leaveTypeName: string;
  availabilityLabel: string;
  remainingDays: number | null;
  isUnlimited: boolean;
  isSelectable: boolean;
}

const LeaveTypesTable: React.FC<{ employeeId: string }> = ({ employeeId }) => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaveTypes();
  }, [employeeId]);

  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/Leave/types/${employeeId}`, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Add if needed
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch leave types');
      }

      const data = await response.json();
      setLeaveTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityBadge = (leaveType: LeaveTypeAvailability) => {
    if (leaveType.isUnlimited) {
      return <span className="badge badge-unlimited">Infinite Balance</span>;
    }
    
    if ((leaveType.remainingDays ?? 0) <= 0) {
      return <span className="badge badge-not-available">Not Available</span>;
    }

    const days = leaveType.remainingDays!;
    const label = days === 1 ? '1 day available' : `${days} days available`;
    return <span className="badge badge-available">{label}</span>;
  };

  if (loading) {
    return <div className="loading">Loading leave types...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1>Leave Types & Availability</h1>
      <div className="table-wrapper">
        <table className="leave-types-table">
          <thead>
            <tr>
              <th>Leave Type ID</th>
              <th>Leave Type Name</th>
              <th>Remaining Days</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Selectable</th>
            </tr>
          </thead>
          <tbody>
            {leaveTypes.map((leaveType) => (
              <tr key={leaveType.leaveTypeId}>
                <td>{leaveType.leaveTypeId}</td>
                <td><strong>{leaveType.leaveTypeName}</strong></td>
                <td className="days-cell">
                  {leaveType.isUnlimited ? (
                    <span className="unlimited-indicator">Unlimited</span>
                  ) : (
                    leaveType.remainingDays ?? 0
                  )}
                </td>
                <td>{getAvailabilityBadge(leaveType)}</td>
                <td>{leaveType.isUnlimited ? 'Unlimited' : 'Limited'}</td>
                <td className={leaveType.isSelectable ? 'selectable' : 'not-selectable'}>
                  {leaveType.isSelectable ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        h1 {
          color: #333;
          margin-bottom: 24px;
          font-size: 24px;
          font-weight: 600;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        thead {
          background-color: #f8f9fa;
        }

        th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        td {
          padding: 14px 16px;
          border-bottom: 1px solid #e9ecef;
          color: #212529;
          font-size: 14px;
        }

        tbody tr:hover {
          background-color: #f8f9fa;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .badge-available {
          background-color: #d4edda;
          color: #155724;
        }

        .badge-not-available {
          background-color: #f8d7da;
          color: #721c24;
        }

        .badge-unlimited {
          background-color: #d1ecf1;
          color: #0c5460;
        }

        .days-cell {
          font-weight: 600;
          color: #495057;
        }

        .selectable {
          color: #28a745;
        }

        .not-selectable {
          color: #dc3545;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }

        .error {
          background-color: #f8d7da;
          color: #721c24;
          border-radius: 4px;
        }

        .unlimited-indicator {
          color: #0c5460;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default LeaveTypesTable;



