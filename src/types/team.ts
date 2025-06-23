
export type FunctionType = 'Foto' | 'História' | 'Edição' | 'Legenda';

export interface TeamMember {
  id: string;
  name: string;
  functions: FunctionType[];
  availability: string;
  email: string;
  phone: string;
  assignmentCount: number;
}

export interface Assignment {
  id: string;
  memberId: string;
  memberName: string;
  function: FunctionType;
  eventId: string;
  eventType: 'culto' | 'vigilia';
  date: Date;
  time: string;
}

export interface Event {
  id: string;
  type: 'culto' | 'vigilia';
  date: Date;
  time: string;
  title: string;
  assignments: Assignment[];
}

export interface Schedule {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  events: Event[];
  createdAt: Date;
  updatedAt: Date;
}
