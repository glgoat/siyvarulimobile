import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

export type Language = 'ka' | 'en';

const translations: Record<string, string> = {
  'პარამეტრები': 'Settings', 'ანგარიში': 'Account', 'პროფილის რედაქტირება': 'Edit profile', 'პაროლის შეცვლა': 'Change password', 'ვერიფიკაცია': 'Verification',
  'აღმოჩენის პრეფერენციები': 'Discovery preferences', 'ასაკის დიაპაზონი': 'Age range', 'ქალაქი': 'City', 'ურთიერთობის მიზანი': 'Relationship goal', 'ყველა ქალაქი': 'Any city', 'ყველა მიზანი': 'Any goal', 'შენახვა': 'Save',
  'შეტყობინებები': 'Notifications', 'მატჩის შეტყობინებები': 'Match notifications', 'შეტყობინებების გაფრთხილებები': 'Message notifications', 'მოწონებების გაფრთხილებები': 'Like notifications', 'კონფიდენციალურობა': 'Privacy', 'ონლაინ სტატუსის ჩვენება': 'Show online status', 'ასაკის ჩვენება': 'Show age', 'ქალაქის ჩვენება': 'Show city', 'აღმოჩენაში გამოჩენა': 'Show in discovery',
  'ანგარიშის მოქმედებები': 'Account actions', 'ანგარიშის გააქტიურება': 'Reactivate account', 'ანგარიშის დაპაუზება': 'Pause account', 'გასვლა': 'Log out', 'ანგარიშის წაშლა': 'Delete account', 'მუქი რეჟიმი': 'Dark mode', 'აირჩიე ქალაქი': 'Choose a city', 'აირჩიე მიზანი': 'Choose a goal', 'გაუქმება': 'Cancel',
  'სერიოზული ურთიერთობა': 'Serious relationship', 'მსუბუქი ურთიერთობა': 'Casual relationship', 'მეგობრობა': 'Friendship', 'ჯერ არ ვიცი': 'Not sure', 'პაროლის შენახვა': 'Save password', 'ახალი პაროლი': 'New password', 'გაიმეორე პაროლი': 'Repeat password',
  'კარგია, რომ დაბრუნდი.': 'Welcome back.', 'შენი ადამიანი აქ გელოდება.': 'Your person is waiting.', 'შედი შენს პროფილზე და განაგრძე გაცნობა.': 'Sign in and continue meeting people.', 'შექმენი პროფილი და გაიცანი ადამიანები საქართველოში.': 'Create a profile and meet people in Georgia.', 'სახელი': 'Name', 'ელფოსტა': 'Email', 'პაროლი': 'Password', 'შესვლა': 'Sign in', 'რეგისტრაცია': 'Create account', 'ან': 'or', 'Google-ით გაგრძელება': 'Continue with Google', 'დაგავიწყდა პაროლი?': 'Forgot password?', 'ახალი ხარ? შექმენი ანგარიში': 'New here? Create an account', 'უკვე გაქვს ანგარიში? შედი': 'Already have an account? Sign in',
  'ჩემი პროფილი': 'My profile', 'საქმიანობა': 'Occupation', 'განათლება': 'Education', 'სიმაღლე (სმ)': 'Height (cm)', 'შენს შესახებ': 'About you', 'ფოტოების არჩევა': 'Choose photos', 'მოთხოვნის გაგზავნა': 'Submit request', 'სელფის გადაღება': 'Take selfie', 'ფოტოს არჩევა გალერეიდან': 'Choose from gallery', 'დამატებითი ინფორმაცია': 'Additional information', 'იპოვე შენი ადამიანი': 'Find your person', 'მარჯვნივ მოწონება · მარცხნივ გამოტოვება': 'Swipe right to like · left to skip', 'მოწონებები': 'Likes', 'მატჩები': 'Matches', 'ურთიერთმოწონებები, რომლებსაც გაგრძელება შეუძლია.': 'Mutual likes that can become something more.', 'დაიწყე საუბარი': 'Start a conversation', 'საუბრები ჯერ არ გაქვს': 'No conversations yet', 'მატჩის შემდეგ აქ შეძლებ საუბრის დაწყებას.': 'You can start chatting here after a match.', 'ხელახლა ცდა': 'Try again', 'ახალი პროფილები მალე გამოჩნდება': 'New profiles will appear soon', 'შეცვალე ფილტრები ან მოგვიანებით დაბრუნდი.': 'Change your filters or come back later.',
};

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void }>({
  language: 'ka',
  setLanguage: () => undefined,
});

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>('ka');

  useEffect(() => {
    AsyncStorage.getItem('siyvaruli-language').then((value) => {
      if (value === 'ka' || value === 'en') setLanguageState(value);
    });
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    void AsyncStorage.setItem('siyvaruli-language', next);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function translateText(text: string, language: Language) {
  return language === 'en' ? translations[text] || text : text;
}
