import { useLanguage } from './hooks.js'

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage, languages } = useLanguage()

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.currentTarget.value)}
      className={className}
    >
      {languages.map((lang: string) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
