import { DayHours, StoreSettings, Appointment } from '../types';

export interface GeneratedSlot {
  timeStr: string; // e.g. "11:30 AM"
  hour24: number;
  minute: number;
  isAvailable: boolean;
  reason?: string;
}

// Convert 24h "HH:MM" to minutes from midnight
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Format hour and minute to "hh:mm AM/PM"
export function formatTimeAmPm(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${period}`;
}

// Get day key: monday, tuesday, etc.
export function getDayKeyFromDate(dateStr: string): keyof StoreSettings['openingHours'] {
  // dateStr is YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days: (keyof StoreSettings['openingHours'])[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[date.getDay()];
}

// Generate slots for a given date
export function getSlotsForDate(
  dateStr: string,
  settings: StoreSettings,
  existingAppointments: Appointment[]
): { slots: GeneratedSlot[]; isBlockedDate: boolean; dailyLimitReached: boolean; message?: string } {
  // 1. Check if blocked holiday / date
  if (settings.blockedDates && settings.blockedDates.includes(dateStr)) {
    return { slots: [], isBlockedDate: true, dailyLimitReached: false, message: 'Store is closed on this date.' };
  }

  // 2. Check past date
  const today = new Date();
  const todayYMD = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  if (dateStr < todayYMD) {
    return { slots: [], isBlockedDate: true, dailyLimitReached: false, message: 'Past dates cannot be selected.' };
  }

  // 3. Check daily limit
  const activeBookingsForDate = existingAppointments.filter(
    (app) => app.appointmentDate === dateStr && (app.status === 'confirmed' || app.status === 'pending')
  );

  const dailyLimitReached = activeBookingsForDate.length >= (settings.dailyBookingLimit || 20);

  // 4. Get day hours
  const dayKey = getDayKeyFromDate(dateStr);
  const dayHours: DayHours = settings.openingHours[dayKey];

  if (!dayHours || !dayHours.isOpen) {
    return { slots: [], isBlockedDate: true, dailyLimitReached, message: 'Store is closed on this day.' };
  }

  const openMinutes = timeToMinutes(dayHours.open);
  const closeMinutes = timeToMinutes(dayHours.close);
  const breakStartMin = dayHours.breakStart ? timeToMinutes(dayHours.breakStart) : null;
  const breakEndMin = dayHours.breakEnd ? timeToMinutes(dayHours.breakEnd) : null;

  const duration = settings.appointmentDuration || 45;
  const buffer = settings.bufferTime || 15;
  const slotInterval = duration + buffer; // e.g. 60 mins

  const slots: GeneratedSlot[] = [];
  const currentTotalMinutes = today.getHours() * 60 + today.getMinutes();
  const isToday = dateStr === todayYMD;

  for (let m = openMinutes; m + duration <= closeMinutes; m += slotInterval) {
    const slotHour = Math.floor(m / 60);
    const slotMinute = m % 60;
    const timeStr = formatTimeAmPm(slotHour, slotMinute);
    const slotEndM = m + duration;

    // Check Friday or day break (e.g. 13:00 to 15:00)
    let isDuringBreak = false;
    if (breakStartMin !== null && breakEndMin !== null) {
      // If slot starts during break or ends inside break or spans across break
      if ((m >= breakStartMin && m < breakEndMin) || (slotEndM > breakStartMin && slotEndM <= breakEndMin) || (m < breakStartMin && slotEndM > breakEndMin)) {
        isDuringBreak = true;
      }
    }

    if (isDuringBreak) {
      continue; // do not even generate or allow slot during Friday 1-3 PM prayer/lunch break
    }

    // Check past time if today
    let isPastTime = false;
    if (isToday) {
      // add 30 min grace lead time so customers can't book within the immediate 30 mins
      if (m <= currentTotalMinutes + 30) {
        isPastTime = true;
      }
    }

    // Check if slot already reserved by an active booking
    const isBooked = activeBookingsForDate.some((app) => app.appointmentTime === timeStr);

    let isAvailable = true;
    let reason: string | undefined = undefined;

    if (isPastTime) {
      isAvailable = false;
      reason = 'Time slot has passed';
    } else if (dailyLimitReached) {
      isAvailable = false;
      reason = 'Daily booking limit reached';
    } else if (isBooked) {
      isAvailable = false;
      reason = 'Slot already reserved';
    }

    slots.push({
      timeStr,
      hour24: slotHour,
      minute: slotMinute,
      isAvailable,
      reason,
    });
  }

  return { slots, isBlockedDate: false, dailyLimitReached };
}

// Generate unique booking ID
export function generateBookingId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `FT-BTM-${randomNum}`;
}
