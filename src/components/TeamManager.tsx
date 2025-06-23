
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Upload, UserPlus, Trash2, Edit, Download } from 'lucide-react';
import { TeamMember, FunctionType } from '@/types/team';
import { useTeamStore } from '@/store/teamStore';

export const TeamManager = () => {
  const { members, addMember, removeMember, updateMember, importMembers } = useTeamStore();
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '',
    functions: [],
    availability: '',
    email: '',
    phone: ''
  });
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const functions: FunctionType[] = ['Foto', 'História', 'Edição', 'Legenda'];

  const handleAddMember = () => {
    if (!newMember.name || !newMember.functions?.length) {
      toast({
        title: "Erro",
        description: "Nome e pelo menos uma função são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const member: TeamMember = {
      id: crypto.randomUUID(),
      name: newMember.name,
      functions: newMember.functions as FunctionType[],
      availability: newMember.availability || '',
      email: newMember.email || '',
      phone: newMember.phone || '',
      assignmentCount: 0
    };

    addMember(member);
    setNewMember({ name: '', functions: [], availability: '', email: '', phone: '' });
    toast({
      title: "Sucesso",
      description: "Membro adicionado com sucesso!"
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const newMembers: TeamMember[] = [];

        lines.forEach((line, index) => {
          if (index === 0) return; // Skip header
          const [name, functionsStr, availability, email, phone] = line.split(',');
          
          if (name?.trim()) {
            const member: TeamMember = {
              id: crypto.randomUUID(),
              name: name.trim(),
              functions: functionsStr ? functionsStr.split(';').map(f => f.trim() as FunctionType) : ['Foto'],
              availability: availability?.trim() || '',
              email: email?.trim() || '',
              phone: phone?.trim() || '',
              assignmentCount: 0
            };
            newMembers.push(member);
          }
        });

        importMembers(newMembers);
        toast({
          title: "Sucesso",
          description: `${newMembers.length} membros importados com sucesso!`
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao processar arquivo",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const toggleFunction = (func: FunctionType) => {
    const currentFunctions = newMember.functions || [];
    if (currentFunctions.includes(func)) {
      setNewMember({
        ...newMember,
        functions: currentFunctions.filter(f => f !== func)
      });
    } else {
      setNewMember({
        ...newMember,
        functions: [...currentFunctions, func]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Adicionar Membro
            </CardTitle>
            <CardDescription>
              Adicione novos membros da equipe de comunicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                placeholder="Digite o nome do membro"
              />
            </div>

            <div>
              <Label>Funções</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {functions.map((func) => (
                  <Button
                    key={func}
                    type="button"
                    variant={newMember.functions?.includes(func) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFunction(func)}
                  >
                    {func}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="availability">Disponibilidade</Label>
              <Textarea
                id="availability"
                value={newMember.availability}
                onChange={(e) => setNewMember({ ...newMember, availability: e.target.value })}
                placeholder="Ex: Disponível quintas e domingos. Não disponível no primeiro domingo do mês."
                rows={3}
              />
            </div>

            <Button onClick={handleAddMember} className="w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Membro
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Importar Membros
            </CardTitle>
            <CardDescription>
              Importe uma lista de membros via arquivo CSV
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Arquivo CSV</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mt-2"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Formato do arquivo CSV:</p>
              <code className="block bg-muted p-2 rounded text-xs">
                Nome,Funções,Disponibilidade,Email,Telefone<br/>
                João Silva,Foto;Edição,Disponível quintas,joao@email.com,(11) 99999-9999
              </code>
            </div>
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Baixar Modelo CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Membros ({members.length})</CardTitle>
          <CardDescription>
            Gerencie os membros da equipe de comunicação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Funções</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Escalações</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {member.functions.map((func) => (
                        <Badge key={func} variant="secondary">{func}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {member.email && <div>{member.email}</div>}
                      {member.phone && <div>{member.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{member.assignmentCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
