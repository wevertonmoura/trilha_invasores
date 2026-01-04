import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. VERIFICAÇÃO INTELIGENTE
    // Buscamos se existe alguém com esse E-mail OU esse WhatsApp
    // E pedimos para trazer os dados (select) para comparar
    const { data: usuarioExistente } = await supabase
      .from('inscritos')
      .select('email, whatsapp')
      .or(`email.eq.${body.email},whatsapp.eq.${body.whatsapp}`)
      .maybeSingle();

    // Se encontrou alguém, vamos descobrir O QUE está repetido
    if (usuarioExistente) {
      
      // Caso 1: A pessoa tentou usar EXATAMENTE os mesmos dados de novo
      if (usuarioExistente.email === body.email && usuarioExistente.whatsapp === body.whatsapp) {
        return NextResponse.json(
          { message: 'Você já está inscrito! E-mail e WhatsApp já constam na lista. ✅' },
          { status: 409 }
        );
      }

      // Caso 2: Só o E-mail é igual
      if (usuarioExistente.email === body.email) {
        return NextResponse.json(
          { message: 'Este E-mail já está sendo usado por outra pessoa. 📧' },
          { status: 409 }
        );
      }

      // Caso 3: Só o WhatsApp é igual
      if (usuarioExistente.whatsapp === body.whatsapp) {
        return NextResponse.json(
          { message: 'Este número de WhatsApp já foi cadastrado. 📱' },
          { status: 409 }
        );
      }
    }

    // 2. SE NÃO EXISTE NINGUÉM, PODE SALVAR
    const { error } = await supabase
      .from('inscritos')
      .insert({
        nome: body.nome,
        whatsapp: body.whatsapp,
        email: body.email,
        emergencia_nome: body.emergenciaNome,
        emergencia_tel: body.emergenciaTel,
        termo_imagem: body.termoImagem
      });

    if (error) {
      console.error('Erro ao salvar:', error);
      return NextResponse.json(
        { message: 'Erro ao salvar sua inscrição.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    return NextResponse.json(
      { message: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}