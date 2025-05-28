DROP POLICY IF EXISTS "Users can create their own instances" ON public.instances;
DROP POLICY IF EXISTS "Users can update their own instances" ON public.instances;
DROP POLICY IF EXISTS "Users can delete their own instances" ON public.instances;
DROP POLICY IF EXISTS "Users can create their own images" ON public.images;
DROP POLICY IF EXISTS "Users can update their own images" ON public.images;
DROP POLICY IF EXISTS "Users can delete their own images" ON public.images;
DROP POLICY IF EXISTS "Users can create their own billing" ON public.billing;
DROP POLICY IF EXISTS "Users can update their own billing" ON public.billing;
DROP POLICY IF EXISTS "Users can delete their own billing" ON public.billing;
CREATE POLICY "Users can create their own instances" ON public.instances
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own instances" ON public.instances
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own instances" ON public.instances
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own images" ON public.images
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own images" ON public.images
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own images" ON public.images
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own billing" ON public.billing
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own billing" ON public.billing
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own billing" ON public.billing
    FOR DELETE TO authenticated
    USING (user_id = auth.uid()); 