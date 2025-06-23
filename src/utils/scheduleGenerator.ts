
import { TeamMember, FunctionType, Event, Assignment, Schedule } from '@/types/team';
import { addDays, format, getDay, lastDayOfMonth, startOfMonth } from 'date-fns';

export function generateSchedule(
  name: string,
  startDate: Date,
  endDate: Date,
  members: TeamMember[]
): Schedule {
  const events: Event[] = [];
  const functions: FunctionType[] = ['Foto', 'História', 'Edição', 'Legenda'];
  
  // Track assignment counts for fair distribution
  const memberAssignments = new Map<string, number>();
  members.forEach(member => {
    memberAssignments.set(member.id, 0);
  });

  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayOfWeek = getDay(currentDate);
    
    // Thursday 8:00 PM service
    if (dayOfWeek === 4) {
      const event = createEvent(
        'culto',
        new Date(currentDate),
        '20:00',
        'Culto de Quinta-feira',
        functions,
        members,
        memberAssignments
      );
      events.push(event);
    }
    
    // Sunday services (10:00 AM and 6:00 PM)
    if (dayOfWeek === 0) {
      const morningEvent = createEvent(
        'culto',
        new Date(currentDate),
        '10:00',
        'Culto de Domingo - Manhã',
        functions,
        members,
        memberAssignments
      );
      events.push(morningEvent);
      
      const eveningEvent = createEvent(
        'culto',
        new Date(currentDate),
        '18:00',
        'Culto de Domingo - Noite',
        functions,
        members,
        memberAssignments
      );
      events.push(eveningEvent);
    }
    
    currentDate = addDays(currentDate, 1);
  }
  
  // Add monthly vigils (last Friday of each month)
  const vigils = generateMonthlyVigils(startDate, endDate, functions, members, memberAssignments);
  events.push(...vigils);
  
  return {
    id: crypto.randomUUID(),
    name,
    startDate,
    endDate,
    events: events.sort((a, b) => a.date.getTime() - b.date.getTime()),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function createEvent(
  type: 'culto' | 'vigilia',
  date: Date,
  time: string,
  title: string,
  functions: FunctionType[],
  members: TeamMember[],
  memberAssignments: Map<string, number>
): Event {
  const assignments: Assignment[] = [];
  
  functions.forEach(func => {
    const availableMembers = members.filter(member => 
      member.functions.includes(func)
    );
    
    if (availableMembers.length === 0) return;
    
    // Sort by assignment count (ascending) for fair distribution
    availableMembers.sort((a, b) => 
      (memberAssignments.get(a.id) || 0) - (memberAssignments.get(b.id) || 0)
    );
    
    const selectedMember = availableMembers[0];
    const currentCount = memberAssignments.get(selectedMember.id) || 0;
    memberAssignments.set(selectedMember.id, currentCount + 1);
    
    assignments.push({
      id: crypto.randomUUID(),
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      function: func,
      eventId: crypto.randomUUID(),
      eventType: type,
      date,
      time
    });
  });
  
  return {
    id: crypto.randomUUID(),
    type,
    date,
    time,
    title,
    assignments
  };
}

function generateMonthlyVigils(
  startDate: Date,
  endDate: Date,
  functions: FunctionType[],
  members: TeamMember[],
  memberAssignments: Map<string, number>
): Event[] {
  const vigils: Event[] = [];
  let currentMonth = new Date(startDate);
  
  while (currentMonth <= endDate) {
    const lastDay = lastDayOfMonth(currentMonth);
    const lastFriday = getLastFridayOfMonth(currentMonth);
    
    if (lastFriday >= startDate && lastFriday <= endDate) {
      const vigil = createEvent(
        'vigilia',
        lastFriday,
        '21:00',
        `Vigília de ${format(lastFriday, 'MMMM yyyy')}`,
        functions,
        members,
        memberAssignments
      );
      vigils.push(vigil);
    }
    
    // Move to next month
    currentMonth = startOfMonth(addDays(lastDay, 1));
  }
  
  return vigils;
}

function getLastFridayOfMonth(date: Date): Date {
  const lastDay = lastDayOfMonth(date);
  const lastDayOfWeek = getDay(lastDay);
  
  // Calculate days to subtract to get to Friday (5)
  let daysToSubtract = (lastDayOfWeek + 2) % 7;
  if (daysToSubtract === 0) daysToSubtract = 7;
  
  return addDays(lastDay, -daysToSubtract);
}
