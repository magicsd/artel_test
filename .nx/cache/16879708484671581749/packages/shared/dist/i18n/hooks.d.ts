import { resources } from './init';
export declare const useTranslation: (ns?: keyof typeof resources.en) => import('react-i18next').UseTranslationResponse<any, undefined>;
export declare const useLanguage: () => {
    currentLanguage: string;
    changeLanguage: (lng: string) => void;
    languages: string[];
};
//# sourceMappingURL=hooks.d.ts.map