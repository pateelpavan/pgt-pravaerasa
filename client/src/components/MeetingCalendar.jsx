import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  ExternalLink, 
  FileText, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

export default function MeetingCalendar({ meetings = [] }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Nov 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getMeetingsForDay = (day) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateFormatted = `${year}-${monthStr}-${dayStr}`;
    return meetings.filter(m => m.date === dateFormatted);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Scheduled Meetings
            </h3>
            <p className="text-xs text-slate-500">
              Synchronized consultations & sprint reviews scheduled by PTG engineering leads
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'calendar'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {meetings.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CalendarIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No Scheduled Meetings Found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Your technical account manager will schedule upcoming architecture demos and milestone reviews here.
              </p>
            </div>
          ) : (
            meetings.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-orange-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                      Engineering Sync
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {m.title}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-orange-500" />
                      {m.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      {m.time}
                    </span>
                  </div>

                  {m.notes && (
                    <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 mt-1">
                      <FileText className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{m.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="shrink-0">
                  <a
                    href={m.meetingLink || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 transition-all transform hover:scale-[1.02]"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meeting</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800">
              {monthNames[month]} {year}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} className="text-[10px] font-bold text-slate-400">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`cal-empty-${i}`} className="h-16 rounded-xl bg-slate-50 opacity-40"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayMeetings = getMeetingsForDay(day);
              const hasMeeting = dayMeetings.length > 0;

              return (
                <div
                  key={`cal-day-${day}`}
                  className={`h-16 p-1.5 rounded-xl border transition-colors flex flex-col justify-between ${
                    hasMeeting
                      ? 'bg-orange-50 border-orange-300 text-orange-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-[11px] font-bold">{day}</span>
                  {hasMeeting && (
                    <div className="space-y-0.5">
                      {dayMeetings.map((dm, idx) => (
                        <a
                          key={idx}
                          href={dm.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          title={`${dm.title} at ${dm.time}`}
                          className="block text-[8px] truncate bg-orange-500 hover:bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold"
                        >
                          {dm.time} {dm.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
