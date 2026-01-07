'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// --- FUNÇÃO DE MÁSCARA ---
const formatarTelefone = (valor: string) => {
  const apenasNumeros = valor.replace(/\D/g, '');
  const limitado = apenasNumeros.substring(0, 11);
  if (limitado.length === 0) return '';
  if (limitado.length <= 2) return `(${limitado}`;
  if (limitado.length <= 7) return `(${limitado.substring(0, 2)}) ${limitado.substring(2)}`;
  return `(${limitado.substring(0, 2)}) ${limitado.substring(2, 7)}-${limitado.substring(7)}`;
};

// --- REGRAS DE VALIDAÇÃO ---
const inscricaoSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 letras'),
  whatsapp: z.string()
    .transform(val => val.replace(/\D/g, ''))
    .refine(val => val.length === 11, 'O telefone precisa ter exatamente 11 dígitos (DDD + Número)'),
  email: z.string()
    .email('Digite um e-mail válido')
    .toLowerCase()
    .refine((email) => {
      const dominiosPermitidos = ['gmail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'yahoo.com.br', 'icloud.com', 'uol.com.br', 'bol.com.br'];
      const dominio = email.split('@')[1];
      return dominiosPermitidos.includes(dominio);
    }, 'Use um e-mail pessoal: Gmail, Outlook, Hotmail ou Yahoo.'),
  emergenciaNome: z.string().min(3, 'Nome do contato de emergência é obrigatório'),
  emergenciaTel: z.string()
    .transform(val => val.replace(/\D/g, ''))
    .refine(val => val.length === 11, 'Telefone de emergência incompleto'),
  termoImagem: z.boolean().refine(val => val === true, 'Você precisa aceitar o termo de imagem'),
});

type FormErrors = { [key: string]: string };

export default function Inscricao() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    emergenciaNome: '',
    emergenciaTel: '',
    termoImagem: false
  });

  // --- TRAVA DE SEGURANÇA SILENCIOSA ---
  useEffect(() => {
    async function validarAcesso() {
      const { count, error } = await supabase
        .from('inscritos')
        .select('*', { count: 'exact', head: true });

      // Se já atingiu o limite (ex: 30), expulsa silenciosamente
      if (!error && count !== null && count >= 80) {
        toast.error('Desculpe, as vagas acabaram de ser preenchidas! 🚫');
        router.push('/'); 
      }
    }
    validarAcesso();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'whatsapp' || name === 'emergenciaTel') {
      const valorMascarado = formatarTelefone(value);
      setFormData(prev => ({ ...prev, [name]: valorMascarado }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const resultadoValidacao = inscricaoSchema.safeParse(formData);

    if (!resultadoValidacao.success) {
      const novosErros: FormErrors = {};
      resultadoValidacao.error.issues.forEach(issue => {
        const campo = String(issue.path[0]); 
        novosErros[campo] = issue.message;
      });
      setErrors(novosErros);
      toast.warning('Verifique os campos em vermelho! 🛑');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/inscricao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          whatsapp: formData.whatsapp.replace(/\D/g, ''), 
          emergenciaTel: formData.emergenciaTel.replace(/\D/g, '')
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Inscrição confirmada! Entrando no grupo VIP... 💚');
        setTimeout(() => {
          window.location.href = 'https://chat.whatsapp.com/H5DWJOz0wcC2PntYSq1t8y'; 
        }, 1500); 
      } else {
        toast.error(data.message || 'Erro ao realizar inscrição.');
      }
    } catch (error) {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Header />

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 mt-8 animate-enter">
        <div className="mb-6">
          <Link href="/" className="text-zinc-500 hover:text-emerald-500 transition flex items-center gap-2 text-sm font-medium">
            ← Voltar ao início
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2 text-emerald-500">
          Garantir Vaga
        </h1>
        <p className="text-zinc-400 text-center mb-10">
          Preencha seus dados para a Trilha dos Invasores
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Nome Completo</label>
            <input name="nome" type="text" placeholder="Seu nome completo" 
              className={`w-full bg-zinc-900 border rounded-lg p-3 outline-none transition
                ${errors.nome ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-emerald-500'}
              `}
              value={formData.nome} onChange={handleChange} disabled={loading}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">WhatsApp</label>
              <input name="whatsapp" type="tel" placeholder="(81) 99999-9999" maxLength={15}
                className={`w-full bg-zinc-900 border rounded-lg p-3 outline-none transition
                  ${errors.whatsapp ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-emerald-500'}
                `}
                value={formData.whatsapp} onChange={handleChange} disabled={loading}
              />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">E-mail</label>
              <input name="email" type="text" placeholder="seu@email.com" 
                className={`w-full bg-zinc-900 border rounded-lg p-3 outline-none transition
                  ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-emerald-500'}
                `}
                value={formData.email} onChange={handleChange} disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50 mt-4">
            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-3">
              Contato de Emergência
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Nome do Parente</label>
                <input name="emergenciaNome" type="text" 
                  className={`w-full bg-zinc-950 border rounded-lg p-3 outline-none transition
                    ${errors.emergenciaNome ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-emerald-500'}
                  `}
                  value={formData.emergenciaNome} onChange={handleChange} disabled={loading}
                />
                {errors.emergenciaNome && <p className="text-red-500 text-xs mt-1">{errors.emergenciaNome}</p>}
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Telefone do Parente</label>
                <input name="emergenciaTel" type="tel" placeholder="(81) 99999-9999" maxLength={15}
                  className={`w-full bg-zinc-950 border rounded-lg p-3 outline-none transition
                    ${errors.emergenciaTel ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-emerald-500'}
                  `}
                  value={formData.emergenciaTel} onChange={handleChange} disabled={loading}
                />
                {errors.emergenciaTel && <p className="text-red-500 text-xs mt-1">{errors.emergenciaTel}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 py-2">
            <div className="flex items-start gap-3">
              <input 
                name="termoImagem" type="checkbox" id="termo"
                className="mt-1 w-5 h-5 accent-emerald-500 cursor-pointer"
                checked={formData.termoImagem} onChange={handleChange} disabled={loading}
              />
              <label htmlFor="termo" className="text-sm text-zinc-300 cursor-pointer select-none">
                Autorizo o uso da minha imagem em fotos e vídeos tirados durante a trilha.
              </label>
            </div>
            {errors.termoImagem && <p className="text-red-500 text-xs ml-8">{errors.termoImagem}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`
              w-full font-bold py-4 rounded-lg transition-all duration-200 mt-4
              ${loading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 hover:scale-[1.01]'
              }
            `}
          >
            {loading ? 'SALVANDO...' : 'CONFIRMAR INSCRIÇÃO'}
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
}