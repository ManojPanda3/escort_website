export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      age_proof: {
        Row: {
          age_proofs: string[] | null
          email: string | null
          id: string
          isverified: boolean | null
          owner: string | null
          username: string | null
        }
        Insert: {
          age_proofs?: string[] | null
          email?: string | null
          id?: string
          isverified?: boolean | null
          owner?: string | null
          username?: string | null
        }
        Update: {
          age_proofs?: string[] | null
          email?: string | null
          id?: string
          isverified?: boolean | null
          owner?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "age_proof_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          owner: string | null
          to: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          owner?: string | null
          to?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          owner?: string | null
          to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_to_fkey"
            columns: ["to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string | null
          country: string
          id: string
          name: string | null
          region: string | null
        }
        Insert: {
          city?: string | null
          country: string
          id?: string
          name?: string | null
          region?: string | null
        }
        Update: {
          city?: string | null
          country?: string
          id?: string
          name?: string | null
          region?: string | null
        }
        Relationships: []
      }
      meetup: {
        Row: {
          created_at: string
          date: string | null
          "from time": string | null
          id: string
          owner: string | null
          "until time": string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          "from time"?: string | null
          id?: string
          owner?: string | null
          "until time"?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          "from time"?: string | null
          id?: string
          owner?: string | null
          "until time"?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["payment_type"] | null
          created_at: string | null
          features: string[]
          id: string
          isvip_included: boolean | null
          max_media: number | null
          max_places: number | null
          price: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          type: string
        }
        Insert: {
          billing_cycle?: Database["public"]["Enums"]["payment_type"] | null
          created_at?: string | null
          features?: string[]
          id?: string
          isvip_included?: boolean | null
          max_media?: number | null
          max_places?: number | null
          price: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          type: string
        }
        Update: {
          billing_cycle?: Database["public"]["Enums"]["payment_type"] | null
          created_at?: string | null
          features?: string[]
          id?: string
          isvip_included?: boolean | null
          max_media?: number | null
          max_places?: number | null
          price?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          type?: string
        }
        Relationships: []
      }
      pictures: {
        Row: {
          created_at: string
          id: string
          "is main": boolean | null
          likes: number | null
          owner: string | null
          picture: string | null
          ranking: number | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          "is main"?: boolean | null
          likes?: number | null
          owner?: string | null
          picture?: string | null
          ranking?: number | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          "is main"?: boolean | null
          likes?: number | null
          owner?: string | null
          picture?: string | null
          ranking?: number | null
          title?: string | null
        }
        Relationships: []
      }
      rates: {
        Row: {
          created_at: string
          discounts: number | null
          duration: string | null
          id: string
          outcall: boolean | null
          owner: string | null
          price: string | null
          reason: string | null
        }
        Insert: {
          created_at?: string
          discounts?: number | null
          duration?: string | null
          id?: string
          outcall?: boolean | null
          owner?: string | null
          price?: string | null
          reason?: string | null
        }
        Update: {
          created_at?: string
          discounts?: number | null
          duration?: string | null
          id?: string
          outcall?: boolean | null
          owner?: string | null
          price?: string | null
          reason?: string | null
        }
        Relationships: []
      }
      story: {
        Row: {
          created_at: string
          id: string
          isvideo: boolean | null
          liked_user: string[]
          likes: number | null
          owner: string | null
          thumbnail: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          isvideo?: boolean | null
          liked_user?: string[]
          likes?: number | null
          owner?: string | null
          thumbnail?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          isvideo?: boolean | null
          liked_user?: string[]
          likes?: number | null
          owner?: string | null
          thumbnail?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
      story_likes: {
        Row: {
          created_at: string
          id: number
          post: string | null
          user: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          post?: string | null
          user?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          post?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stroy_likes_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "story"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          owner: string | null
          to: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          owner?: string | null
          to?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          owner?: string | null
          to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_owner_fkey1"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string | null
          expired_at: string | null
          id: string
          offer_id: string | null
          owner: string | null
          price: string | null
          session_id: string | null
          status: Database["public"]["Enums"]["payment status"] | null
          stripe_price_id: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          expired_at?: string | null
          id?: string
          offer_id?: string | null
          owner?: string | null
          price?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["payment status"] | null
          stripe_price_id?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          expired_at?: string | null
          id?: string
          offer_id?: string | null
          owner?: string | null
          price?: string | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["payment status"] | null
          stripe_price_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          about: string | null
          age: number | null
          availability: string | null
          body_type: string | null
          bookmark: string[] | null
          categories: Database["public"]["Enums"]["escort_category"][] | null
          cover_image: string | null
          created_at: string | null
          current_offer: string | null
          dress_size: number | null
          email: string
          eye_color: string | null
          gender: string | null
          hair_color: string | null
          height: number | null
          id: string
          interested_services:
            | Database["public"]["Enums"]["service_type"][]
            | null
          is_available: boolean | null
          is_traveling: boolean | null
          is_verified: boolean | null
          is_vip: boolean | null
          location: string | null
          location_name: string | null
          name: string | null
          phone_number: string | null
          place_of_services: string[] | null
          profile_picture: string | null
          ratings: number
          services: Database["public"]["Enums"]["service_type"][] | null
          total_media: number | null
          traveling_location: string | null
          user_type: Database["public"]["Enums"]["user type"] | null
          username: string
        }
        Insert: {
          about?: string | null
          age?: number | null
          availability?: string | null
          body_type?: string | null
          bookmark?: string[] | null
          categories?: Database["public"]["Enums"]["escort_category"][] | null
          cover_image?: string | null
          created_at?: string | null
          current_offer?: string | null
          dress_size?: number | null
          email: string
          eye_color?: string | null
          gender?: string | null
          hair_color?: string | null
          height?: number | null
          id: string
          interested_services?:
            | Database["public"]["Enums"]["service_type"][]
            | null
          is_available?: boolean | null
          is_traveling?: boolean | null
          is_verified?: boolean | null
          is_vip?: boolean | null
          location?: string | null
          location_name?: string | null
          name?: string | null
          phone_number?: string | null
          place_of_services?: string[] | null
          profile_picture?: string | null
          ratings?: number
          services?: Database["public"]["Enums"]["service_type"][] | null
          total_media?: number | null
          traveling_location?: string | null
          user_type?: Database["public"]["Enums"]["user type"] | null
          username: string
        }
        Update: {
          about?: string | null
          age?: number | null
          availability?: string | null
          body_type?: string | null
          bookmark?: string[] | null
          categories?: Database["public"]["Enums"]["escort_category"][] | null
          cover_image?: string | null
          created_at?: string | null
          current_offer?: string | null
          dress_size?: number | null
          email?: string
          eye_color?: string | null
          gender?: string | null
          hair_color?: string | null
          height?: number | null
          id?: string
          interested_services?:
            | Database["public"]["Enums"]["service_type"][]
            | null
          is_available?: boolean | null
          is_traveling?: boolean | null
          is_verified?: boolean | null
          is_vip?: boolean | null
          location?: string | null
          location_name?: string | null
          name?: string | null
          phone_number?: string | null
          place_of_services?: string[] | null
          profile_picture?: string | null
          ratings?: number
          services?: Database["public"]["Enums"]["service_type"][] | null
          total_media?: number | null
          traveling_location?: string | null
          user_type?: Database["public"]["Enums"]["user type"] | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_current_offer_fkey"
            columns: ["current_offer"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_location_fkey"
            columns: ["location"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      escort_category:
        | "Blonde"
        | "Busty"
        | "Mature"
        | "Young"
        | "Cougar"
        | "MILF"
        | "Red Hair"
        | "Black Hair"
        | "Brunette"
        | "Slim"
        | "Tall"
        | "BBW"
        | "Curvy"
        | "Voluptuous"
        | "Petite"
        | "Touring"
        | "Disability Friendly"
        | "Tattooed"
        | "No Tattoo"
        | "Submissive"
        | "Shaved"
        | "Natural Bush"
        | "Non Smoking"
        | "Enhanced Breasts"
        | "Natural Breasts"
        | "Fitness"
        | "Massage / Erotic Relaxation"
        | "Photos Verified"
        | "Fly Me To You"
        | "Doubles Profiles"
      gender_type: "male" | "female" | "trans" | "binary"
      "payment status": "pending" | "failed" | "success"
      payment_type: "weekly" | "yearly" | "monthly"
      service_type:
        | "Affectionate cuddling"
        | "Affectionate kissing"
        | "Anal play"
        | "Anal play - On me"
        | "Anal play - On you"
        | "B + D – bondage + discipline"
        | "BBBJ – bare back blow job"
        | "BDSM"
        | "BJ – blow job"
        | "BLS – balls licking and sucking"
        | "BS - body slide"
        | "Body worship"
        | "Bondage"
        | "CBJ – covered blow job"
        | "CBT – cock and ball torture"
        | "COB – cum on body"
        | "DATY – oral on me"
        | "DDP – double digit penetration"
        | "DP – double penetration"
        | "DT – deep throat"
        | "Dinner companion"
        | "Doggy style"
        | "Erotic sensual massage"
        | "FE – female ejaculation (squirting)"
        | "FS – full service"
        | "Fetish"
        | "Fly Me To You"
        | "Foot fetish"
        | "For Couples"
        | "Full oil massage"
        | "GFE - girlfriend experience"
        | "Greek – anal sex"
        | "HJ – hand job"
        | "Happy ending"
        | "LK – light kissing"
        | "Light bondage"
        | "Light spanking"
        | "MFF – male female female"
        | "MMF - male male female"
        | "MSOG – multiple shots on goal"
        | "Massage"
        | "Masturbation"
        | "Multiple positions"
        | "Mutual French (oral)"
        | "Mutual masturbation"
        | "Mutual natural oral"
        | "Natural oral"
        | "Overnight stays"
        | "PSE – porn star experience"
        | "Prostate massage"
        | "Rimming"
        | "Rimming - On me"
        | "Sex toys"
        | "Sexy lingerie"
        | "Sexy shower for 2"
        | "Social escort"
        | "Spanking - On me"
        | "Spanking - On you"
        | "Squirting"
        | "Strap on"
        | "Strap on - on me"
        | "Strap on - on you"
        | "Travel Companion"
      "user type": "general" | "bdsm" | "escort" | "couple"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
