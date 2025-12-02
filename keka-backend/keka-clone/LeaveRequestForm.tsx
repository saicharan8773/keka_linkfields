import React, { useState, useEffect } from 'react';

interface LeaveType {
  id: number;
  name: string;
  defaultDays: number;
  isUnlimited: boolean;
  code: string;
}

const LEAVE_TYPES: LeaveType[] = [
  { id: 1, name: 'Casual Leave', defaultDays: 8, isUnlimited: false, code: 'CL' },
  { id: 2, name: 'Compensatory Off', defaultDays: 15, isUnlimited: false, code: 'Comp Off' },
  { id: 3, name: 'Earned Leave', defaultDays: 15, isUnlimited: false, code: 'EL' },
  { id: 4, name: 'Floater Leave', defaultDays: 3, isUnlimited: false, code: 'Floater' },
  { id: 5, name: 'LOP', defaultDays: 0, isUnlimited: true, code: 'LOP' },
  { id: 6, name: 'Maternity Leave', defaultDays: 182, isUnlimited: false, code: 'Maternity' },
  { id: 7, name: 'Sick Leave', defaultDays: 10, isUnlimited: false, code: 'SL' },
  { id: 8, name: 'Paternity Leave', defaultDays: 14, isUnlimited: false, code: 'Paternity' },
];

const LeaveRequestForm: React.FC = () => {
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [leaveTypeId, setLeaveTypeId] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [calculatedDays, setCalculatedDays] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Extract EmployeeId from JWT
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        
        // Look for employeeId claim (case-insensitive check might be safer, but prompt said "employeeId")
        if (payload.employeeId) {
            setEmployeeId(payload.employeeId);
        } else {
            // Fallback: sometimes claims are mapped to long URLs or different casing
            const keys = Object.keys(payload);
            const idKey = keys.find(k => k.toLowerCase().includes('employeeid'));
            if (idKey) {
                setEmployeeId(payload[idKey]);
            } else {
                setError("Employee ID not found in token.");
            }
        }
      } catch (e) {
        console.error("Invalid token", e);
        setError("Invalid authentication token.");
      }
    } else {
      setError("No authentication token found. Please login.");
    }
  }, []);

  useEffect(() => {
    calculateDuration();
  }, [startDate, endDate]);

  const calculateDuration = () => {
    if (!startDate || !endDate) {
      setCalculatedDays(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setCalculatedDays(0);
      return;
    }

    // Calculate difference in days (inclusive)
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    setCalculatedDays(diffDays);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!employeeId) {
      setError("Cannot submit: Employee ID missing.");
      return;
    }

    if (!leaveTypeId || !startDate || !endDate || !reason) {
      setError("All fields are required.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setError("End Date must be greater than or equal to Start Date.");
      return;
    }

    const selectedLeave = LEAVE_TYPES.find(l => l.id === Number(leaveTypeId));
    if (selectedLeave && !selectedLeave.isUnlimited) {
        if (calculatedDays > selectedLeave.defaultDays) {
            setError(`Cannot exceed default allowed days (${selectedLeave.defaultDays}) for ${selectedLeave.name}.`);
            return;
        }
    }

    setIsSubmitting(true);

    const payload = {
      employeeId: employeeId,
      leaveTypeId: Number(leaveTypeId),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      reason: reason
    };

    try {
      const response = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccess("Leave request submitted successfully.");
        handleReset();
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.message || "Failed to submit leave request.");
      }
    } catch (err) {
      setError("An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setLeaveTypeId('');
    setStartDate('');
    setEndDate('');
    setReason('');
    setCalculatedDays(0);
    // Don't clear employeeId or error/success messages immediately if called from submit
  };

  const getSelectedLeaveType = () => {
      return LEAVE_TYPES.find(l => l.id === Number(leaveTypeId));
  };

  const selectedLeave = getSelectedLeaveType();

  return (
    <div className="leave-request-container">
      <h2>Apply for Leave</h2>
      
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Leave Type</label>
          <select 
            value={leaveTypeId} 
            onChange={(e) => setLeaveTypeId(Number(e.target.value))}
            required
          >
            <option value="">-- Select Leave Type --</option>
            {LEAVE_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.name} ({type.code})
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {startDate && endDate && (
            <div className="summary-box">
                <p><strong>Total Days:</strong> {calculatedDays}</p>
                {selectedLeave && (
                    <>
                        <p><strong>Default Allowed:</strong> {selectedLeave.isUnlimited ? 'Unlimited' : selectedLeave.defaultDays}</p>
                        {!selectedLeave.isUnlimited && (
                            <p className={calculatedDays > selectedLeave.defaultDays ? 'text-danger' : ''}>
                                <strong>Remaining (from Default):</strong> {Math.max(0, selectedLeave.defaultDays - calculatedDays)}
                            </p>
                        )}
                    </>
                )}
            </div>
        )}

        <div className="form-group">
          <label>Reason</label>
          <textarea 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            required
            rows={4}
          ></textarea>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
          <button type="button" className="btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      <style jsx>{`
        .leave-request-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-family: 'Inter', sans-serif;
        }

        h2 {
          margin-bottom: 1.5rem;
          color: #333;
          text-align: center;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-row .form-group {
          flex: 1;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #555;
        }

        select, input, textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        select:focus, input:focus, textarea:focus {
          border-color: #007bff;
          outline: none;
        }

        .summary-box {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.25rem;
          border-left: 4px solid #007bff;
        }

        .summary-box p {
          margin: 0.25rem 0;
          color: #444;
        }

        .text-danger {
          color: #dc3545 !important;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
        }

        .alert {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
        }

        .error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
      `}</style>
    </div>
  );
};

export default LeaveRequestForm;
