import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Clock, AlertTriangle, Info } from 'lucide-react';

export default function PaymentCalendar({ installments = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // Default around 2026 sprint
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayEvents(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayEvents(null);
  };

  const setToday = () => {
    setCurrentDate(new Date());
    setSelectedDayEvents(null);
  };

  const getInstallmentsForDate = (day) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateFormatted = `${year}-${monthStr}-${dayStr}`;

    const matches = [];

    installments.forEach(inst => {
      if (inst.dueDate === dateFormatted) {
        matches.push({
          type: 'due',
          installmentNumber: inst.installmentNumber,
          amount: inst.amount,
          status: inst.status,
          date: inst.dueDate
        });
      }
      if (inst.paidDate === dateFormatted) {
        matches.push({
          type: 'paid',
          installmentNumber: inst.installmentNumber,
          amount: inst.amount,
          status: 'Paid',
          date: inst.paidDate
        });
      }
    });

    return matches;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Payment & EMI Calendar
            </h3>
            <p className="text-xs text-slate-500">
              Interactive timeline tracking installment deadlines and verified receipts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={setToday}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 min-w-[130px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-16 rounded-xl bg-slate-50 border border-slate-100 opacity-40"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const events = getInstallmentsForDate(day);
          const hasPaid = events.some(e => e.type === 'paid');
          const hasDuePending = events.some(e => e.type === 'due' && e.status === 'Pending');
          const hasDueOverdue = events.some(e => e.type === 'due' && e.status === 'Overdue');
          
          let dayStyle = 'bg-white border-slate-200 hover:border-orange-300 text-slate-700';
          if (hasPaid) {
            dayStyle = 'bg-emerald-50/70 border-emerald-300 text-emerald-800 shadow-sm shadow-emerald-500/5';
          } else if (hasDueOverdue) {
            dayStyle = 'bg-rose-50/70 border-rose-300 text-rose-800';
          } else if (hasDuePending) {
            dayStyle = 'bg-orange-50/70 border-orange-300 text-orange-800';
          }

          return (
            <div
              key={`day-${day}`}
              onClick={() => events.length > 0 && setSelectedDayEvents({ day, month: monthNames[month], year, events })}
              className={`h-16 p-2 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${dayStyle} ${events.length > 0 ? 'hover:scale-[1.03] ring-1 ring-orange-400/40' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{day}</span>
                {events.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                )}
              </div>

              {/* Event indicators in day slot */}
              <div className="space-y-0.5 overflow-hidden">
                {events.map((evt, idx) => (
                  <div
                    key={idx}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                      evt.type === 'paid'
                        ? 'bg-emerald-600 text-white'
                        : evt.status === 'Overdue'
                        ? 'bg-rose-600 text-white'
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    {evt.type === 'paid' ? `Paid #${evt.installmentNumber}` : `Due #${evt.installmentNumber}`}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Event Drawer */}
      {selectedDayEvents && (
        <div className="mt-4 p-4 rounded-2xl bg-orange-50/80 border border-orange-200 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-orange-200">
            <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-orange-600" />
              Events on {selectedDayEvents.day} {selectedDayEvents.month} {selectedDayEvents.year}
            </span>
            <button
              onClick={() => setSelectedDayEvents(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold"
            >
              ✕ Close
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {selectedDayEvents.events.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2.5">
                  {item.type === 'paid' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : item.status === 'Overdue' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-600" />
                  )}
                  <div>
                    <p className="font-bold text-slate-800">
                      Installment #{item.installmentNumber} ({item.type === 'paid' ? 'Payment Verified' : 'Payment Due'})
                    </p>
                    <p className="text-[11px] text-slate-500">Date: {item.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 text-sm">₹{Number(item.amount).toLocaleString('en-IN')}</span>
                  <span className={`block text-[10px] font-bold ${
                    item.status === 'Paid' ? 'text-emerald-700' : item.status === 'Overdue' ? 'text-rose-700' : 'text-orange-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Legend */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
        <span className="font-bold text-slate-700">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Paid Date</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span>Pending Due Date</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Overdue Date</span>
        </div>
      </div>
    </div>
  );
}
