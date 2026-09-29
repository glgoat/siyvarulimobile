-- Test-only seed. Run this manually in the Supabase SQL editor with a service-role session.
-- It creates six clearly marked demo accounts: two male, two female, and two other.
-- Password for every demo account: FakeTest123!
-- This script is idempotent by email and does not change existing real users.

DO $$
DECLARE
  demo record;
  uid uuid;
BEGIN
  FOR demo IN
    SELECT * FROM (VALUES
      ('demo_male_01@siyvaruli.test', 'Demo Male 01', 'male', 'women', 'თბილისი', '1996-03-15'::date, 'მუსიკა და მოგზაურობა მიყვარს.', 41.7151, 44.8271, 1),
      ('demo_male_02@siyvaruli.test', 'Demo Male 02', 'male', 'everyone', 'ბათუმი', '1993-05-12'::date, 'აქტიური ცხოვრება, სპორტი და კარგი საუბრები.', 41.6168, 41.6367, 2),
      ('demo_female_01@siyvaruli.test', 'Demo Female 01', 'female', 'men', 'ქუთაისი', '1997-06-10'::date, 'ხელოვნება, კინო და ახალი ადგილები.', 42.2679, 42.7189, 3),
      ('demo_female_02@siyvaruli.test', 'Demo Female 02', 'female', 'everyone', 'თბილისი', '1995-02-18'::date, 'კულინარია, წიგნები და იუმორი.', 41.7151, 44.8271, 4),
      ('demo_other_01@siyvaruli.test', 'Demo Other 01', 'other', 'everyone', 'რუსთავი', '1998-09-25'::date, 'მუსიკა, დიზაინი და გულწრფელი ადამიანები.', 41.5495, 44.9932, 5),
      ('demo_other_02@siyvaruli.test', 'Demo Other 02', 'other', 'men', 'გორი', '1994-12-03'::date, 'მოგზაურობა, ბუნება და ფოტოგრაფია.', 41.9842, 44.1153, 6)
    ) AS values(email, display_name, gender, interested_in, city, date_of_birth, bio, latitude, longitude, photo_id)
  LOOP
    SELECT id INTO uid FROM auth.users WHERE email = demo.email;
    IF uid IS NULL THEN
      uid := gen_random_uuid();
      INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
      VALUES (uid, demo.email, crypt('FakeTest123!', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('first_name', demo.display_name));
    END IF;

    UPDATE public.profiles SET first_name = demo.display_name, date_of_birth = demo.date_of_birth, gender = demo.gender, interested_in = demo.interested_in, city = demo.city, bio = demo.bio, profile_completed = true, is_paused = false, is_suspended = false, latitude = demo.latitude, longitude = demo.longitude WHERE id = uid;
    INSERT INTO public.photos (user_id, url, position) SELECT uid, 'https://i.pravatar.cc/800?img=' || demo.photo_id, 0 WHERE NOT EXISTS (SELECT 1 FROM public.photos WHERE user_id = uid);
  END LOOP;
END $$;
