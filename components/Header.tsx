import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed w-full z-50 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO / NOME */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-emerald-500 font-black text-2xl tracking-tighter hover:text-emerald-400 transition-colors">
            INVASORES<span className="text-white">.</span>
          </span>
        </Link>

        {/* MENU DE NAVEGAÇÃO (Sem o Admin) */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-300">
          <Link href="/" className="hover:text-emerald-400 transition">Início</Link>
          <Link href="/inscricao" className="hover:text-emerald-400 transition">Inscrição</Link>
          {/* A LINHA DO ADMIN FOI APAGADA AQUI */}
        </nav>

        {/* BOTÃO */}
        <Link href="/inscricao" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition">
          Participar
        </Link>
      </div>
    </header>
  );
}