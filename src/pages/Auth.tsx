
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Chrome, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type FormData = z.infer<typeof formSchema>;

const Auth = () => {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Erro no login",
          description: "Ocorreu um erro ao fazer login com Google. Tente novamente.",
          variant: "destructive",
        });
        console.error('Erro no login:', error);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Algo deu errado. Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = isSignUp 
        ? await signUpWithEmail(data.email, data.password)
        : await signInWithEmail(data.email, data.password);
      
      if (error) {
        toast({
          title: isSignUp ? "Erro no cadastro" : "Erro no login",
          description: error.message || "Ocorreu um erro. Tente novamente.",
          variant: "destructive",
        });
      } else if (isSignUp) {
        toast({
          title: "Cadastro realizado",
          description: "Verifique seu email para confirmar a conta.",
        });
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Algo deu errado. Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            {isSignUp ? 'Criar Conta' : 'Bem-vindo'}
          </CardTitle>
          <CardDescription>
            Sistema de Agendamento - Departamento de Comunicação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground mb-6">
            {isSignUp 
              ? 'Crie sua conta para acessar o sistema'
              : 'Faça login para acessar o sistema de gerenciamento de equipes e cronogramas'
            }
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="seu@email.com" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="Sua senha"
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" size="lg">
                {isSignUp ? 'Criar Conta' : 'Entrar'}
              </Button>
            </form>
          </Form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>
          
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Entrar com Google
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? 'Já tem uma conta? Faça login'
                : 'Não tem uma conta? Cadastre-se'
              }
            </button>
          </div>
          
          <div className="text-xs text-center text-muted-foreground mt-4">
            Ao fazer login, você concorda com nossos termos de uso e política de privacidade.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
