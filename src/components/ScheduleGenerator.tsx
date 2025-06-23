
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Download, Users, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTeamStore } from '@/store/teamStore';
import { generateSchedule } from '@/utils/scheduleGenerator';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';

export const ScheduleGenerator = () => {
  const { members, addSchedule, resetAssignmentCounts } = useTeamStore();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [scheduleName, setScheduleName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchedule, setGeneratedSchedule] = useState<any>(null);

  const handleGenerateSchedule = async () => {
    if (!startDate || !endDate || !scheduleName) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (members.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione membros da equipe antes de gerar o cronograma",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      resetAssignmentCounts();
      const schedule = generateSchedule(
        scheduleName,
        new Date(startDate),
        new Date(endDate),
        members
      );
      
      addSchedule(schedule);
      setGeneratedSchedule(schedule);
      
      toast({
        title: "Sucesso",
        description: `Cronograma "${scheduleName}" gerado com sucesso!`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar cronograma",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportExcel = () => {
    if (!generatedSchedule) return;
    exportToExcel(generatedSchedule);
    toast({
      title: "Sucesso",
      description: "Cronograma exportado para Excel!"
    });
  };

  const handleExportPDF = () => {
    if (!generatedSchedule) return;
    exportToPDF(generatedSchedule);
    toast({
      title: "Sucesso", 
      description: "Cronograma exportado para PDF!"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Gerar Novo Cronograma
            </CardTitle>
            <CardDescription>
              Configure as datas e gere automaticamente as escalas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="schedule-name">Nome do Cronograma</Label>
              <Input
                id="schedule-name"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                placeholder="Ex: Cronograma Janeiro 2024"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Data Início</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-date">Data Fim</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={handleGenerateSchedule} 
              className="w-full" 
              disabled={isGenerating}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {isGenerating ? 'Gerando...' : 'Gerar Cronograma'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Estatísticas da Equipe
            </CardTitle>
            <CardDescription>
              Informações sobre os membros cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{members.length}</div>
                <div className="text-sm text-muted-foreground">Total de Membros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {members.filter(m => m.functions.includes('Foto')).length}
                </div>
                <div className="text-sm text-muted-foreground">Fotógrafos</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {members.filter(m => m.functions.includes('História')).length}
                </div>
                <div className="text-sm text-muted-foreground">Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {members.filter(m => m.functions.includes('Edição')).length}
                </div>
                <div className="text-sm text-muted-foreground">Editores</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {members.filter(m => m.functions.includes('Legenda')).length}
              </div>
              <div className="text-sm text-muted-foreground">Legendas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {generatedSchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exportar Cronograma
            </CardTitle>
            <CardDescription>
              Baixe o cronograma gerado em diferentes formatos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleExportExcel} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar para Excel
              </Button>
              <Button onClick={handleExportPDF} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar para PDF
              </Button>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Resumo do Cronograma:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Nome: {generatedSchedule.name}</p>
                <p>• Período: {generatedSchedule.startDate.toLocaleDateString()} - {generatedSchedule.endDate.toLocaleDateString()}</p>
                <p>• Total de eventos: {generatedSchedule.events.length}</p>
                <p>• Total de escalações: {generatedSchedule.events.reduce((sum: number, event: any) => sum + event.assignments.length, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
