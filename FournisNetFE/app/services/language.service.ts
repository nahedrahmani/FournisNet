import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'fr' | 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly langs: { code: Lang; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English',  flag: '🇬🇧' },
    { code: 'ar', label: 'عربي',     flag: '🇹🇳' },
  ];

  constructor(private translate: TranslateService) {
    const saved = (localStorage.getItem('fn_lang') as Lang) || 'fr';
    this.setLang(saved);
  }

  get current(): Lang {
    return this.translate.currentLang as Lang || 'fr';
  }

  get isRtl(): boolean {
    return this.current === 'ar';
  }

  setLang(lang: Lang): void {
    this.translate.use(lang);
    localStorage.setItem('fn_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  currentLabel(): string {
    return this.langs.find(l => l.code === this.current)?.flag + ' ' +
           this.langs.find(l => l.code === this.current)?.label || '';
  }
}
