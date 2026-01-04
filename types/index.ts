// types/index.ts (ou no topo do admin)
export interface Inscrito {
  id: number;
  created_at: string;
  nome: string;
  email: string;
  whatsapp: string;
  emergencia_nome: string;
  emergencia_tel: string;
  termo_imagem: boolean;
}