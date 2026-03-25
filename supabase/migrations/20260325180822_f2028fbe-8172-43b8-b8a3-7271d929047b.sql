
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, role, hourly_rate, category, validation_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'dj'),
    COALESCE((NEW.raw_user_meta_data->>'hourly_rate')::integer, 40),
    COALESCE(NEW.raw_user_meta_data->>'category', 'pending'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'empresario' THEN 'awaiting_admin'
      ELSE 'pending'
    END
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;
