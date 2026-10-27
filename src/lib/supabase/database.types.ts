export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          user_id: string;
        };
        Insert: {
          user_id: string;
        };
        Update: {
          user_id?: string;
        };
        Relationships: [];
      };
      app_settings: {
        Row: {
          academic_year: string;
          id: boolean;
          payment_account_name: string | null;
          payment_account_no: string | null;
          payment_amount: number | null;
          payment_bank: string | null;
          registration_open: boolean;
          updated_at: string;
        };
        Insert: {
          academic_year?: string;
          id?: boolean;
          payment_account_name?: string | null;
          payment_account_no?: string | null;
          payment_amount?: number | null;
          payment_bank?: string | null;
          registration_open?: boolean;
          updated_at?: string;
        };
        Update: {
          academic_year?: string;
          id?: boolean;
          payment_account_name?: string | null;
          payment_account_no?: string | null;
          payment_amount?: number | null;
          payment_bank?: string | null;
          registration_open?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      registrations: {
        Row: {
          achievements: string;
          admin_note: string | null;
          birth_date: string;
          birth_order: number;
          birth_place: string;
          consented_at: string;
          contact_phone: string;
          created_at: string;
          father_education: Database["public"]["Enums"]["education_level"];
          father_job: string;
          father_name: string;
          gender: "L" | "P";
          hobby: string;
          id: string;
          medical_conditions: string;
          mother_education: Database["public"]["Enums"]["education_level"];
          mother_job: string;
          mother_name: string;
          parent_address: string;
          payment_proof_mime: string;
          payment_proof_path: string;
          payment_proof_size: number;
          reg_number: string;
          rejection_reason: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          academic_year: string;
          siblings_count: number;
          status: Database["public"]["Enums"]["registration_status"];
          student_address: string;
          student_name: string;
          student_nickname: string;
          updated_at: string;
          wave: number;
        };
        Insert: {
          achievements?: string;
          admin_note?: string | null;
          birth_date: string;
          birth_order: number;
          birth_place: string;
          consented_at: string;
          contact_phone: string;
          created_at?: string;
          father_education: Database["public"]["Enums"]["education_level"];
          father_job: string;
          father_name: string;
          gender: "L" | "P";
          hobby: string;
          id?: string;
          medical_conditions?: string;
          mother_education: Database["public"]["Enums"]["education_level"];
          mother_job: string;
          mother_name: string;
          parent_address: string;
          payment_proof_mime: string;
          payment_proof_path: string;
          payment_proof_size: number;
          reg_number?: string;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          academic_year: string;
          siblings_count: number;
          status?: Database["public"]["Enums"]["registration_status"];
          student_address: string;
          student_name: string;
          student_nickname: string;
          updated_at?: string;
          wave: number;
        };
        Update: {
          achievements?: string;
          admin_note?: string | null;
          birth_date?: string;
          birth_order?: number;
          birth_place?: string;
          consented_at?: string;
          contact_phone?: string;
          created_at?: string;
          father_education?: Database["public"]["Enums"]["education_level"];
          father_job?: string;
          father_name?: string;
          gender?: "L" | "P";
          hobby?: string;
          id?: string;
          medical_conditions?: string;
          mother_education?: Database["public"]["Enums"]["education_level"];
          mother_job?: string;
          mother_name?: string;
          parent_address?: string;
          payment_proof_mime?: string;
          payment_proof_path?: string;
          payment_proof_size?: number;
          reg_number?: string;
          rejection_reason?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          academic_year?: string;
          siblings_count?: number;
          status?: Database["public"]["Enums"]["registration_status"];
          student_address?: string;
          student_name?: string;
          student_nickname?: string;
          updated_at?: string;
          wave?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      education_level: "sd_mi" | "smp_mts" | "sma_smk_ma" | "d1_d3" | "s1_s3";
      registration_status: "pending" | "verified" | "rejected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
