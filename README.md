# Siyvaruli mobile

Standalone Expo + React Native app for siyvaruli.ge. The website and this project are separate clients that share the existing Supabase backend.

## Run

1. Copy .env.example to .env and set EXPO_PUBLIC_SUPABASE_URL plus EXPO_PUBLIC_SUPABASE_ANON_KEY (or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY).
2. Run npm install.
3. Run npx expo start.

Use Expo Go for a physical-device preview, or npx expo start --android / npx expo start --ios for a native simulator.

## Shared backend

The app uses the existing profiles, photos, likes, passes, matches, messages, user_settings, blocks, and profile-photos storage bucket. It never uses a service-role key. RLS remains the authorization boundary.

The web app at https://github.com/glgoat/siyvaruli-ge is not modified by this project.

The mobile client rejects localhost and placeholder Supabase hosts so a device never silently tries to authenticate against a non-routable development URL.

## Google sign-in

The app starts Google OAuth through the same Supabase project as the website and exchanges the PKCE code on-device. Enable Google under Supabase Authentication > Providers, then add `siyvaruli://auth/callback` to Authentication > URL Configuration > Redirect URLs. The Google Cloud OAuth client should use the Supabase callback URL shown in the provider settings, usually `https://<project-ref>.supabase.co/auth/v1/callback`.

After changing OAuth settings, restart Expo with `npx expo start --tunnel --clear --go` so the device receives the current bundle.
