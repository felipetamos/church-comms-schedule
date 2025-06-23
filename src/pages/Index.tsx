
import React from 'react';
import { TeamManager } from '@/components/TeamManager';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';
import { ScheduleGenerator } from '@/components/ScheduleGenerator';
import { UserMenu } from '@/components/UserMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold text-primary">
                  Sistema de Agendamento - Departamento de Comunicação
                </CardTitle>
                <CardDescription className="text-lg">
                  Gerenciamento de equipes e cronogramas para cultos e vigílias
                </CardDescription>
              </div>
              <UserMenu />
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="team">Gerenciar Equipe</TabsTrigger>
            <TabsTrigger value="schedule">Gerar Cronograma</TabsTrigger>
            <TabsTrigger value="calendar">Visualizar Agenda</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            <TeamManager />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <ScheduleGenerator />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <ScheduleCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
