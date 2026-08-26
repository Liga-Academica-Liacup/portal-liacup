export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      conteudos_educativos: {
        Row: {
          alterado_em: string
          arquivado: boolean
          autor_id: string | null
          criado_em: string
          descricao: string | null
          formato: string | null
          id: string
          link: string | null
          ordem: number
          publicado: boolean
          titulo: string
        }
        Insert: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          criado_em?: string
          descricao?: string | null
          formato?: string | null
          id?: string
          link?: string | null
          ordem?: number
          publicado?: boolean
          titulo: string
        }
        Update: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          criado_em?: string
          descricao?: string | null
          formato?: string | null
          id?: string
          link?: string | null
          ordem?: number
          publicado?: boolean
          titulo?: string
        }
        Relationships: []
      }
      controle_de_origem: {
        Row: {
          id: string
          momento: string
          resumo_do_endereco: string
        }
        Insert: {
          id?: string
          momento?: string
          resumo_do_endereco: string
        }
        Update: {
          id?: string
          momento?: string
          resumo_do_endereco?: string
        }
        Relationships: []
      }
      docentes: {
        Row: {
          alterado_em: string
          arquivado: boolean
          autor_id: string | null
          criado_em: string
          formacao: string | null
          foto_url: string | null
          id: string
          nome: string
          ordem: number
          publicado: boolean
          titulacao: string | null
        }
        Insert: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          criado_em?: string
          formacao?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          ordem?: number
          publicado?: boolean
          titulacao?: string | null
        }
        Update: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          criado_em?: string
          formacao?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          ordem?: number
          publicado?: boolean
          titulacao?: string | null
        }
        Relationships: []
      }
      eventos: {
        Row: {
          alterado_em: string
          arquivado: boolean
          autor_id: string | null
          criado_em: string
          data_evento: string
          descricao: string | null
          id: string
          inscricao_url: string | null
          local: string | null
          ordem: number
          publicado: boolean
          titulo: string
        }
        Insert: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          criado_em?: string
          data_evento: string
          descricao?: string | null
          id?: string
          inscricao_url?: string | null
          local?: string | null
          ordem?: number
          publicado?: boolean
          titulo: string
        }
        Update: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          criado_em?: string
          data_evento?: string
          descricao?: string | null
          id?: string
          inscricao_url?: string | null
          local?: string | null
          ordem?: number
          publicado?: boolean
          titulo?: string
        }
        Relationships: []
      }
      faq: {
        Row: {
          alterado_em: string
          arquivado: boolean
          autor_id: string | null
          criado_em: string
          id: string
          ordem: number
          pergunta: string
          publicado: boolean
          resposta: string
        }
        Insert: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          criado_em?: string
          id?: string
          ordem?: number
          pergunta: string
          publicado?: boolean
          resposta: string
        }
        Update: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          criado_em?: string
          id?: string
          ordem?: number
          pergunta?: string
          publicado?: boolean
          resposta?: string
        }
        Relationships: []
      }
      galeria_albuns: {
        Row: {
          alterado_em: string
          arquivado: boolean
          autor_id: string | null
          capa_url: string | null
          criado_em: string
          data_album: string | null
          descricao: string | null
          id: string
          ordem: number
          publicado: boolean
          titulo: string
        }
        Insert: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          capa_url?: string | null
          criado_em?: string
          data_album?: string | null
          descricao?: string | null
          id?: string
          ordem?: number
          publicado?: boolean
          titulo: string
        }
        Update: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          capa_url?: string | null
          criado_em?: string
          data_album?: string | null
          descricao?: string | null
          id?: string
          ordem?: number
          publicado?: boolean
          titulo?: string
        }
        Relationships: []
      }
      galeria_fotos: {
        Row: {
          album_id: string
          alterado_em: string
          arquivado: boolean
          arquivo_url: string | null
          autor_id: string | null
          criado_em: string
          id: string
          legenda: string | null
          ordem: number
          publicado: boolean
        }
        Insert: {
          album_id: string
          alterado_em?: string
          arquivado?: boolean
          arquivo_url?: string | null
          autor_id?: string | null
          criado_em?: string
          id?: string
          legenda?: string | null
          ordem?: number
          publicado?: boolean
        }
        Update: {
          album_id?: string
          alterado_em?: string
          arquivado?: boolean
          arquivo_url?: string | null
          autor_id?: string | null
          criado_em?: string
          id?: string
          legenda?: string | null
          ordem?: number
          publicado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "galeria_fotos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "galeria_albuns"
            referencedColumns: ["id"]
          },
        ]
      }
      leituras: {
        Row: {
          alterado_em: string
          arquivado: boolean
          autor_id: string | null
          autoria: string | null
          criado_em: string
          id: string
          link: string | null
          ordem: number
          publicado: boolean
          referencia: string | null
          titulo: string
        }
        Insert: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          autoria?: string | null
          criado_em?: string
          id?: string
          link?: string | null
          ordem?: number
          publicado?: boolean
          referencia?: string | null
          titulo: string
        }
        Update: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          autoria?: string | null
          criado_em?: string
          id?: string
          link?: string | null
          ordem?: number
          publicado?: boolean
          referencia?: string | null
          titulo?: string
        }
        Relationships: []
      }
      ligantes: {
        Row: {
          alterado_em: string
          arquivado: boolean
          autor_id: string | null
          cargo: string | null
          criado_em: string
          curso: string | null
          eh_diretoria: boolean
          foto_url: string | null
          id: string
          nome: string
          ordem: number
          publicado: boolean
        }
        Insert: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          cargo?: string | null
          criado_em?: string
          curso?: string | null
          eh_diretoria?: boolean
          foto_url?: string | null
          id?: string
          nome: string
          ordem?: number
          publicado?: boolean
        }
        Update: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          cargo?: string | null
          criado_em?: string
          curso?: string | null
          eh_diretoria?: boolean
          foto_url?: string | null
          id?: string
          nome?: string
          ordem?: number
          publicado?: boolean
        }
        Relationships: []
      }
      materiais: {
        Row: {
          alterado_em: string
          arquivado: boolean
          arquivo_url: string | null
          autor_id: string | null
          criado_em: string
          descricao: string | null
          id: string
          ordem: number
          publicado: boolean
          tipo: string | null
          titulo: string
        }
        Insert: {
          alterado_em?: string
          arquivado?: boolean
          arquivo_url?: string | null
          autor_id?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          ordem?: number
          publicado?: boolean
          tipo?: string | null
          titulo: string
        }
        Update: {
          alterado_em?: string
          arquivado?: boolean
          arquivo_url?: string | null
          autor_id?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          ordem?: number
          publicado?: boolean
          tipo?: string | null
          titulo?: string
        }
        Relationships: []
      }
      mensagens: {
        Row: {
          alterado_em: string
          assunto: string | null
          email: string
          id: string
          nome: string
          recebida_em: string
          situacao: Database["public"]["Enums"]["situacao_da_mensagem"]
          texto: string
        }
        Insert: {
          alterado_em?: string
          assunto?: string | null
          email: string
          id?: string
          nome: string
          recebida_em?: string
          situacao?: Database["public"]["Enums"]["situacao_da_mensagem"]
          texto: string
        }
        Update: {
          alterado_em?: string
          assunto?: string | null
          email?: string
          id?: string
          nome?: string
          recebida_em?: string
          situacao?: Database["public"]["Enums"]["situacao_da_mensagem"]
          texto?: string
        }
        Relationships: []
      }
      noticias: {
        Row: {
          alterado_em: string
          arquivado: boolean
          autor_id: string | null
          corpo: string | null
          criado_em: string
          data_noticia: string
          id: string
          imagem_url: string | null
          link_externo: string | null
          ordem: number
          publicado: boolean
          resumo: string | null
          titulo: string
        }
        Insert: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          corpo?: string | null
          criado_em?: string
          data_noticia?: string
          id?: string
          imagem_url?: string | null
          link_externo?: string | null
          ordem?: number
          publicado?: boolean
          resumo?: string | null
          titulo: string
        }
        Update: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          corpo?: string | null
          criado_em?: string
          data_noticia?: string
          id?: string
          imagem_url?: string | null
          link_externo?: string | null
          ordem?: number
          publicado?: boolean
          resumo?: string | null
          titulo?: string
        }
        Relationships: []
      }
      projetos: {
        Row: {
          alterado_em: string
          arquivado: boolean
          autor_id: string | null
          criado_em: string
          descricao: string | null
          eixo: Database["public"]["Enums"]["eixo_de_projeto"]
          id: string
          ordem: number
          publicado: boolean
          titulo: string
        }
        Insert: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          criado_em?: string
          descricao?: string | null
          eixo: Database["public"]["Enums"]["eixo_de_projeto"]
          id?: string
          ordem?: number
          publicado?: boolean
          titulo: string
        }
        Update: {
          alterado_em?: string
          arquivado?: boolean
          autor_id?: string | null
          criado_em?: string
          descricao?: string | null
          eixo?: Database["public"]["Enums"]["eixo_de_projeto"]
          id?: string
          ordem?: number
          publicado?: boolean
          titulo?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      eixo_de_projeto: "ensino" | "extensao" | "pesquisa" | "secretaria"
      situacao_da_mensagem: "nao_lida" | "lida" | "arquivada"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      eixo_de_projeto: ["ensino", "extensao", "pesquisa", "secretaria"],
      situacao_da_mensagem: ["nao_lida", "lida", "arquivada"],
    },
  },
} as const
