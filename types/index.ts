export type Gender = 'male' | 'female' | 'other';
export type InterestedIn = 'men' | 'women' | 'everyone';
export type RelationshipIntention = 'serious' | 'casual' | 'friendship' | 'not_sure';

export interface Profile {
  id: string;
  first_name: string;
  date_of_birth: string | null;
  gender: Gender | null;
  interested_in: InterestedIn | null;
  city: string;
  bio: string;
  height: number | null;
  occupation: string | null;
  education: string | null;
  languages: string[];
  relationship_intention: RelationshipIntention | null;
  is_verified: boolean;
  verification_status: string;
  is_paused: boolean;
  is_suspended: boolean;
  profile_completed: boolean;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export interface Photo { id: string; user_id: string; url: string; position: number; created_at: string; }
export interface Match { id: string; user1_id: string; user2_id: string; created_at: string; }
export interface Message { id: string; match_id: string; sender_id: string; content: string; image_url: string | null; read: boolean; read_at: string | null; deleted_at: string | null; created_at: string; }
export type NotificationType = 'match' | 'message' | 'like' | 'verification' | 'report' | 'account';
export interface Notification { id: string; user_id: string; type: NotificationType; title: string | null; body: string | null; data: Record<string, unknown> | null; read: boolean; read_at: string | null; created_at: string; }
export interface UserSettings { user_id: string; language: string; dark_mode: boolean; show_online_status: boolean; show_age: boolean; show_city: boolean; notifications_enabled: boolean; match_notifications: boolean; message_notifications: boolean; like_notifications: boolean; discovery_age_min: number; discovery_age_max: number; discovery_city: string | null; discovery_intention: RelationshipIntention | null; show_in_discovery: boolean; }
export interface Interest { id: string; key: string; category: string | null; }
export interface DiscoveryProfile extends Profile { photos: Photo[]; age: number | null; has_liked_me?: boolean; }
