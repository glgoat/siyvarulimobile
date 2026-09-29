# Siyvaruli mobile

Standalone Expo + React Native app for siyvaruli.ge. The website and this project are separate clients that share the existing Supabase backend.

## Run

1. Copy .env.example to .env and set EXPO_PUBLIC_SUPABASE_URL plus EXPO_PUBLIC_SUPABASE_ANON_KEY.
2. Run npm install.
3. Run npx expo start.

Use Expo Go for a physical-device preview, or npx expo start --android / npx expo start --ios for a native simulator.

## Shared backend

The app uses the existing profiles, photos, likes, passes, matches, messages, user_settings, blocks, and profile-photos storage bucket. It never uses a service-role key. RLS remains the authorization boundary.

The web app at https://github.com/glgoat/siyvaruli-ge is not modified by this project.
