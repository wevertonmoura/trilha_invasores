'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase'; // Conexão com o banco

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  
  // ESTADO DO CRONÔMETRO
  const [timeLeft, setTimeLeft] = useState({
    dias: 0, horas: 0, minutos: 0, segundos: 0
  });

  // ESTADOS DE CONTROLE
  const [inscricoesAbertas, setInscricoesAbertas] = useState(true);
  const [vagasEsgotadas, setVagasEsgotadas] = useState(false);

  // 1. SPLASH SCREEN INTELIGENTE
  useEffect(() => {
    const jaViuSplash = sessionStorage.getItem('splash_visto');
    if (jaViuSplash) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splash_visto', 'true');
      }, 4000); // 4 segundos de exibição
      return () => clearTimeout(timer);
    }
  }, []);

  // 2. VERIFICAR SE JÁ ATINGIU 100 INSCRITOS 📊
  useEffect(() => {
    async function verificarVagas() {
      const { count, error } = await supabase
        .from('inscritos')
        .select('*', { count: 'exact', head: true });

      if (!error && count !== null) {
        if (count >= 100) {
          setVagasEsgotadas(true);
        }
      }
    }
    verificarVagas();
  }, []);

  // 3. LÓGICA DO TEMPO (Cronômetro + Data Limite)
  useEffect(() => {
    const dataEvento = new Date('2026-01-18T06:30:00').getTime(); 
    const dataLimite = new Date('2026-01-17T00:00:00').getTime();

    const intervalo = setInterval(() => {
      const agora = new Date().getTime();

      const distancia = dataEvento - agora;
      if (distancia < 0) {
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
      } else {
        setTimeLeft({
          dias: Math.floor(distancia / (1000 * 60 * 60 * 24)),
          horas: Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((distancia % (1000 * 60)) / 1000),
        });
      }

      if (agora >= dataLimite) {
        setInscricoesAbertas(false);
      } else {
        setInscricoesAbertas(true);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const renderBotao = () => {
    if (vagasEsgotadas) {
      return (
        <button disabled className="bg-red-900/50 text-red-200 border border-red-800 px-10 py-4 rounded-full text-lg font-bold cursor-not-allowed shadow-xl">
          🚫 VAGAS ESGOTADAS
        </button>
      );
    }

    if (!inscricoesAbertas) {
      return (
        <button disabled className="bg-zinc-700 text-zinc-400 border border-zinc-600 px-10 py-4 rounded-full text-lg font-bold cursor-not-allowed shadow-xl">
          🔒 INSCRIÇÕES ENCERRADAS
        </button>
      );
    }

    return (
      <Link 
        href="/inscricao" 
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 hover:shadow-emerald-500/20 inline-block shadow-xl"
      >
        GARANTIR MINHA VAGA
      </Link>
    );
  };

  return (
    <main className="bg-zinc-950 min-h-screen flex flex-col relative">

      {/* SPLASH SCREEN OTIMIZADA PARA MOBILE E DESKTOP */}
      {showSplash && (
        <div className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center animate-splash-end">
          {/* Ajustado tamanho (w-44/h-44) para melhor visualização em celulares */}
          <div className="w-44 h-44 md:w-64 md:h-64 rounded-full overflow-hidden flex items-center justify-center border-4 border-white bg-zinc-900 shadow-2xl animate-pulse">
            <img 
              src="/logo.png" 
              alt="Logo Invasores" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <Header />
      
      <div className={`flex-1 ${showSplash ? 'animate-enter delay-[3500ms]' : ''}`}> 
        
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
          
          <div className="absolute inset-0 z-0">
            {/* Atualizado para usar o arquivo brennand-trilhaa.jpg conforme sua pasta public */}
            <Image 
              src="/brennand-trilhaa.jpg" 
              alt="Trilha Cachoeira do Brennand"
              fill 
              priority 
              className="object-cover" 
              quality={90}
            />
            <div className="absolute inset-0 bg-black/50" /> 
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/20" />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
              Trilha Cachoeira <br /> 
              <span className="text-emerald-500 font-black">do Brennand</span>
            </h1>
            
            <p className="text-zinc-200 text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-md font-light">
              Organizado pelo Grupo Invasores. Conecte-se com a natureza, 
              supere seus limites e explore cenários incríveis.
            </p>

            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-lg mx-auto mb-10">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl flex flex-col items-center min-w-[70px]">
                <span className="text-2xl md:text-4xl font-bold text-emerald-500">{timeLeft.dias}</span>
                <span className="text-[10px] md:text-xs text-zinc-300 uppercase tracking-widest mt-1">Dias</span>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl flex flex-col items-center min-w-[70px]">
                <span className="text-2xl md:text-4xl font-bold text-white">{timeLeft.horas}</span>
                <span className="text-[10px] md:text-xs text-zinc-300 uppercase tracking-widest mt-1">Horas</span>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl flex flex-col items-center min-w-[70px]">
                <span className="text-2xl md:text-4xl font-bold text-white">{timeLeft.minutos}</span>
                <span className="text-[10px] md:text-xs text-zinc-300 uppercase tracking-widest mt-1">Min</span>
              </div>
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-xl flex flex-col items-center min-w-[70px]">
                <span className="text-2xl md:text-4xl font-bold text-emerald-500 animate-pulse">{timeLeft.segundos}</span>
                <span className="text-[10px] md:text-xs text-zinc-300 uppercase tracking-widest mt-1">Seg</span>
              </div>
            </div>

            <div className="block flex flex-col items-center gap-3">
              {renderBotao()}
            </div>

          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-8 border-b border-zinc-800 pb-4 inline-block">
            Sobre a Experiência
          </h2>
          <p className="text-zinc-400 leading-relaxed text-lg md:text-xl text-justify md:text-center">
            A Trilha dos Invasores na Cachoeira do Brennand é uma experiência imersiva que une desafio,
            contato direto com a natureza e espírito de comunidade. Durante o percurso, enfrentaremos
            trechos de mata fechada, riachos e terrenos irregulares.
          </p>
        </section>
      </div>
      
      <Footer />
    </main>
  );
}