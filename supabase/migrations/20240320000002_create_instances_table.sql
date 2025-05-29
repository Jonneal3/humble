-- Create instances table
CREATE TABLE IF NOT EXISTS "public"."instances" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "config" "jsonb" DEFAULT '{}'::jsonb
);

ALTER TABLE "public"."instances" OWNER TO "postgres";

-- Add primary key
ALTER TABLE ONLY "public"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");

-- Add foreign key to auth.users
ALTER TABLE ONLY "public"."instances"
    ADD CONSTRAINT "instances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE "public"."instances" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can select their own instances" ON "public"."instances"
    FOR SELECT TO "authenticated"
    USING ("user_id" = "auth"."uid"());

CREATE POLICY "Users can create their own instances" ON "public"."instances"
    FOR INSERT TO "authenticated"
    WITH CHECK ("user_id" = "auth"."uid"());

CREATE POLICY "Users can update their own instances" ON "public"."instances"
    FOR UPDATE TO "authenticated"
    USING ("user_id" = "auth"."uid"())
    WITH CHECK ("user_id" = "auth"."uid"());

CREATE POLICY "Users can delete their own instances" ON "public"."instances"
    FOR DELETE TO "authenticated"
    USING ("user_id" = "auth"."uid"());

-- Grant permissions
GRANT ALL ON TABLE "public"."instances" TO "anon";
GRANT ALL ON TABLE "public"."instances" TO "authenticated";
GRANT ALL ON TABLE "public"."instances" TO "service_role";

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION "public"."handle_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "instances_updated_at"
  BEFORE UPDATE ON "public"."instances"
  FOR EACH ROW
  EXECUTE FUNCTION "public"."handle_updated_at"(); 