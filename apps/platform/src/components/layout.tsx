import { useTheme } from '@artelonline/shared'
import { Button } from '@artelonline/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@artelonline/ui'
import { Menu, Moon, Sun, Globe, User, LogIn, UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function Layout() {
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation('common')
  const location = useLocation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(newLang)
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="bg-background min-h-screen">
      {/* Fixed Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-primary-foreground text-sm font-bold">A</span>
            </div>
            <span className="text-xl font-bold">АртельОнлайн</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>{t('navigation.platform')}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-6">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/dashboard"
                          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                        >
                          <div className="text-sm leading-none font-medium">
                            {t('navigation.dashboard')}
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            {t('navigation.dashboardDesc')}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/about"
                          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                        >
                          <div className="text-sm leading-none font-medium">
                            {t('navigation.about')}
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            {t('navigation.aboutDesc')}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-9 w-9 px-0">
              <Globe className="h-4 w-4" />
              <span className="sr-only">{t('toggleLanguage')}</span>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">{t('toggleTheme')}</span>
            </Button>

            {/* Auth Buttons - Desktop */}
            {!isAuthPage && (
              <div className="hidden items-center space-x-2 md:flex">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn />
                    {t('navigation.login')}
                  </Link>
                </Button>
              </div>
            )}

            {/* User Menu - when authenticated */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden h-9 w-9 px-0">
                  <User className="h-4 w-4" />
                  <span className="sr-only">{t('userMenu')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  {t('profile')}
                </DropdownMenuItem>
                <DropdownMenuItem>{t('settings')}</DropdownMenuItem>
                <DropdownMenuItem>{t('logout')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">{t('menu')}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>АртельОнлайн</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Link
                        to="/dashboard"
                        className="hover:bg-accent block rounded-md px-3 py-2 text-sm font-medium"
                      >
                        {t('navigation.dashboard')}
                      </Link>
                      <Link
                        to="/about"
                        className="hover:bg-accent block rounded-md px-3 py-2 text-sm font-medium"
                      >
                        {t('navigation.about')}
                      </Link>
                    </div>

                    {!isAuthPage && (
                      <div className="space-y-2 border-t pt-4">
                        <Link
                          to="/login"
                          className="hover:bg-accent flex items-center rounded-md px-3 py-2 text-sm font-medium"
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          {t('navigation.login')}
                        </Link>
                        <Link
                          to="/register"
                          className="hover:bg-accent flex items-center rounded-md px-3 py-2 text-sm font-medium"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          {t('navigation.register')}
                        </Link>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-muted-foreground text-sm">
              © 2024 АртельОнлайн. {t('allRightsReserved')}
            </p>
            <div className="text-muted-foreground flex items-center space-x-4 text-sm">
              <Link to="/privacy" className="hover:text-foreground">
                {t('privacy')}
              </Link>
              <Link to="/terms" className="hover:text-foreground">
                {t('terms')}
              </Link>
              <Link to="/support" className="hover:text-foreground">
                {t('support')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
