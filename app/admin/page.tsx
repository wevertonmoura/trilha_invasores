'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// 1. O CONTRATO (INTERFACE) - NÍVEL SÊNIOR 📘
interface Inscrito {
  id: number;
  created_at: string;
  nome: string;
  email: string;
  whatsapp: string;
  emergencia_nome: string;
  emergencia_tel: string;
  termo_imagem: boolean;
}

export default function Admin() {
  const [acesso, setAcesso] = useState(false);
  const [senha, setSenha] = useState('');
  
  // Lista de inscritos tipada corretamente
  const [inscritos, setInscritos] = useState<Inscrito[]>([]); 
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Inscrito | null>(null);

  // --- NOVIDADE: FUNÇÃO DE EXPORTAR PARA EXCEL/CSV 📊 ---
  function exportarParaExcel() {
    if (inscritos.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    // 1. Cria o cabeçalho das colunas
    const headers = ['Nome,WhatsApp,Email,Contato Emergencia,Tel Emergencia,Aceitou Termo'];
    
    // 2. Transforma cada inscrito em uma linha de texto separada por vírgula
    const rows = inscritos.map(pessoa => 
      `"${pessoa.nome}","${pessoa.whatsapp}","${pessoa.email}","${pessoa.emergencia_nome}","${pessoa.emergencia_tel}","${pessoa.termo_imagem ? 'Sim' : 'Não'}"`
    );

    // 3. Junta tudo
    const csvContent = [headers, ...rows].join('\n');

    // 4. Cria o arquivo para download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lista_invasores_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // -------------------------------------------------------

  // LOGIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (senha === '85113257') { 
      setAcesso(true);
      buscarInscritos();
    } else {
      alert('Senha incorreta!');
    }
  };

  // BUSCAR
  async function buscarInscritos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('inscritos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert('Erro ao carregar.');
    } else {
      setInscritos((data as Inscrito[]) || []);
    }
    setLoading(false);
  }

  // EXCLUIR
  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir esse inscrito para sempre?')) return;

    const { error } = await supabase.from('inscritos').delete().eq('id', id);

    if (error) {
      alert('Erro ao excluir: ' + error.message);
    } else {
      alert('Inscrito removido!');
      buscarInscritos();
    }
  }

  // ATUALIZAR
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editando) return;

    const { error } = await supabase
      .from('inscritos')
      .update({
        nome: editando.nome,
        whatsapp: editando.whatsapp,
        email: editando.email,
        emergencia_nome: editando.emergencia_nome,
        emergencia_tel: editando.emergencia_tel,
        termo_imagem: editando.termo_imagem
      })
      .eq('id', editando.id);

    if (error) {
      alert('Erro ao atualizar: ' + error.message);
    } else {
      alert('Dados atualizados com sucesso!');
      setEditando(null);
      buscarInscritos();
    }
  }

  // --- TELA DE LOGIN ---
  if (!acesso) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full max-w-md shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">🔒 Área Restrita</h1>
          <input 
            type="password" 
            placeholder="Senha" 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white mb-4 outline-none focus:border-emerald-500 transition" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
          />
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition">
            Entrar
          </button>
          <Link href="/" className="block text-center text-zinc-500 mt-6 hover:text-emerald-500 text-sm transition">
            ← Voltar ao site
          </Link>
        </form>
      </div>
    );
  }

  // --- TELA DO PAINEL ---
  return (
    <main className="min-h-screen bg-zinc-950 p-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* TOPO DO ADMIN */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-lg">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            👮‍♂️ Painel Admin 
            <span className="text-emerald-500 text-sm bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              Total: {inscritos.length}
            </span>
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-3 text-sm font-medium">
            {/* BOTÃO NOVO DE EXPORTAR 👇 */}
            <button 
              onClick={exportarParaExcel} 
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 border border-zinc-700"
              title="Baixar lista para Excel"
            >
              📊 Baixar Planilha
            </button>

            <Link href="/" className="text-zinc-400 hover:text-white transition px-2">🏠 Início</Link>
            <Link href="/inscricao" className="text-zinc-400 hover:text-white transition px-2">📝 Nova Inscrição</Link>
            <button onClick={() => setAcesso(false)} className="text-red-400 hover:text-red-300 transition px-2">Sair</button>
          </div>
        </div>

        {/* TABELA DE DADOS */}
        {loading ? (
          <div className="text-center py-20 text-zinc-500 animate-pulse flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            Carregando dados...
          </div>
        ) : (
          <div className="overflow-x-auto bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl">
            <table className="w-full text-left text-zinc-300">
              <thead className="bg-zinc-950 text-white uppercase text-xs font-bold border-b border-zinc-800">
                <tr>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Contato</th>
                  <th className="p-4">Emergência</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {inscritos.map((pessoa) => (
                  <tr key={pessoa.id} className="hover:bg-zinc-800/50 transition duration-150">
                    <td className="p-4">
                      <div className="font-medium text-white">{pessoa.nome}</div>
                      <div className="text-xs text-zinc-500 font-mono mt-0.5">{pessoa.email}</div>
                    </td>
                    <td className="p-4 text-sm font-mono text-zinc-400">{pessoa.whatsapp}</td>
                    <td className="p-4 text-sm">
                      <div className="text-zinc-300">{pessoa.emergencia_nome}</div>
                      <div className="text-zinc-500 text-xs font-mono">{pessoa.emergencia_tel}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => setEditando(pessoa)} 
                          className="bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white p-2 rounded-lg transition border border-blue-500/20" 
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(pessoa.id)} 
                          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition border border-red-500/20" 
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE EDIÇÃO */}
      {editando && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md animate-fade-in">
          <form onSubmit={handleUpdate} className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-zinc-800 pb-2">Editar Inscrito</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase">Nome</label>
                <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition" 
                  value={editando.nome} onChange={e => setEditando({...editando, nome: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">WhatsApp</label>
                  <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition" 
                    value={editando.whatsapp} onChange={e => setEditando({...editando, whatsapp: e.target.value})} />
                </div>
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
                   <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition" 
                    value={editando.email} onChange={e => setEditando({...editando, email: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Nome Emergência</label>
                  <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition" 
                    value={editando.emergencia_nome} onChange={e => setEditando({...editando, emergencia_nome: e.target.value})} />
                </div>
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase">Tel Emergência</label>
                   <input className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition" 
                    value={editando.emergencia_tel} onChange={e => setEditando({...editando, emergencia_tel: e.target.value})} />
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-2 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                 <input type="checkbox" id="edit-termo" className="w-4 h-4 accent-emerald-500" 
                  checked={editando.termo_imagem} onChange={e => setEditando({...editando, termo_imagem: e.target.checked})} />
                 <label htmlFor="edit-termo" className="text-sm text-zinc-300 cursor-pointer">Aceitou termo de imagem?</label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => setEditando(null)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg transition font-medium">Cancelar</button>
              <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg transition font-bold shadow-lg shadow-emerald-900/20">Salvar Alterações</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}