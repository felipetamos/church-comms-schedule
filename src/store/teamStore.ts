
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TeamMember, Assignment, Event, Schedule } from '@/types/team';

interface TeamStore {
  members: TeamMember[];
  assignments: Assignment[];
  events: Event[];
  schedules: Schedule[];
  
  // Team member actions
  addMember: (member: TeamMember) => void;
  removeMember: (id: string) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  importMembers: (members: TeamMember[]) => void;
  
  // Assignment actions
  addAssignment: (assignment: Assignment) => void;
  removeAssignment: (id: string) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  
  // Event actions
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  
  // Schedule actions
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (id: string) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  
  // Utility actions
  incrementAssignmentCount: (memberId: string) => void;
  resetAssignmentCounts: () => void;
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      members: [],
      assignments: [],
      events: [],
      schedules: [],
      
      addMember: (member) =>
        set((state) => ({ members: [...state.members, member] })),
      
      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          assignments: state.assignments.filter((a) => a.memberId !== id),
        })),
      
      updateMember: (id, updates) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      
      importMembers: (members) =>
        set((state) => ({ members: [...state.members, ...members] })),
      
      addAssignment: (assignment) =>
        set((state) => ({ assignments: [...state.assignments, assignment] })),
      
      removeAssignment: (id) =>
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== id),
        })),
      
      updateAssignment: (id, updates) =>
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      
      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),
      
      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
          assignments: state.assignments.filter((a) => a.eventId !== id),
        })),
      
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      
      addSchedule: (schedule) =>
        set((state) => ({ schedules: [...state.schedules, schedule] })),
      
      removeSchedule: (id) =>
        set((state) => ({
          schedules: state.schedules.filter((s) => s.id !== id),
        })),
      
      updateSchedule: (id, updates) =>
        set((state) => ({
          schedules: state.schedules.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      
      incrementAssignmentCount: (memberId) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === memberId ? { ...m, assignmentCount: m.assignmentCount + 1 } : m
          ),
        })),
      
      resetAssignmentCounts: () =>
        set((state) => ({
          members: state.members.map((m) => ({ ...m, assignmentCount: 0 })),
        })),
    }),
    {
      name: 'church-communication-team-storage',
    }
  )
);
