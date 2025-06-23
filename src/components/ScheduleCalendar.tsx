
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Users, Clock } from 'lucide-react';
import { useTeamStore } from '@/store/teamStore';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ScheduleCalendar = () => {
  const { events, schedules } = useTeamStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<string>('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const filteredEvents = events.filter(event => {
    const isInMonth = isSameMonth(event.date, currentDate);
    if (selectedSchedule === 'all') return isInMonth;
    
    const schedule = schedules.find(s => s.events.some(e => e.id === event.id));
    return isInMonth && schedule?.id === selectedSchedule;
  });

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => isSameDay(event.date, day));
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Cronograma:</label>
          <select 
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">Todos</option>
            {schedules.map(schedule => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agenda de Eventos
          </CardTitle>
          <CardDescription>
            Visualize os eventos e escalações do mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
                {day}
              </div>
            ))}
            
            {monthDays.map(day => {
              const dayEvents = getEventsForDay(day);
              return (
                <div 
                  key={day.toISOString()} 
                  className="min-h-24 p-1 border border-border rounded-md bg-background hover:bg-muted/50 transition-colors"
                >
                  <div className="text-sm font-medium mb-1">
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        className="text-xs p-1 rounded bg-primary/10 text-primary border border-primary/20"
                      >
                        <div className="font-medium">{event.time}</div>
                        <div className="truncate" title={event.title}>
                          {event.type === 'culto' ? 'Culto' : 'Vigília'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {filteredEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Escalações do Mês
            </CardTitle>
            <CardDescription>
              Lista detalhada de todas as escalações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <div key={event.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(event.date, 'dd/MM/yyyy')}
                        <Clock className="w-4 h-4 ml-2" />
                        {event.time}
                      </div>
                    </div>
                    <Badge variant={event.type === 'culto' ? 'default' : 'secondary'}>
                      {event.type === 'culto' ? 'Culto' : 'Vigília'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {event.assignments.map(assignment => (
                      <div key={assignment.id} className="bg-muted/50 rounded-md p-3">
                        <div className="font-medium text-sm text-primary">
                          {assignment.function}
                        </div>
                        <div className="text-sm">{assignment.memberName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground">
              Não há eventos programados para este mês.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
