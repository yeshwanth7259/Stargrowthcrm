import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, Clock, UserCheck, LogOut } from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, checkIn, checkOut, attendance } = useCRM();
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const todayDate = new Date().toISOString().split('T')[0];
  const todayAtt = attendance.find(a => a.userId === currentUser.id && a.date === todayDate);
  const isCheckedIn = todayAtt?.status === 'Checked In';

  const handleAction = (isCheckInAction: boolean) => {
    if (isCheckInAction) {
      checkIn(note);
    } else {
      checkOut(note);
    }
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Workstation Attendance Check-In</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-slate-600 space-y-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500">{currentUser.designation}</div>
            </div>
            <span
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                isCheckedIn
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {todayAtt?.status || 'Offline'}
            </span>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Session Work Note / Objective</label>
            <textarea
              rows={3}
              placeholder="e.g. Working on Meta Ads retargeting campaigns & SEO keyword audits for Q3..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          {isCheckedIn ? (
            <button
              type="button"
              onClick={() => handleAction(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Shift Check-Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleAction(true)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Check-In Daily Shift</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
