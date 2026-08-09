import { Outlet, Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, Phone, Mail, UserPlus } from 'lucide-react'
import { Logo } from '@/components/Logo'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Careers', href: '/careers' },
  { label: 'Support', href: '/support-center' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
]

export function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-navy-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/">
              <Logo />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link to="/signup" className="btn-secondary text-xs sm:text-sm hidden sm:inline-flex">
                <UserPlus className="h-4 w-4" /> Sign Up
              </Link>
              <Link to="/login" className="btn-primary text-xs sm:text-sm">
                <LogIn className="h-4 w-4" /> Login
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-navy-900 border-l border-white/5 z-50 lg:hidden"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <Logo />
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="p-3 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-secondary w-full mt-3">
                  <UserPlus className="h-4 w-4" /> Sign Up
                </Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary w-full mt-2">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Logo />
              <p className="mt-4 text-sm text-slate-400 max-w-xs">
                Professional Customer Support & Business Process Outsourcing. Enterprise-grade workforce, payroll, and operations management.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/about" className="hover:text-brand-violet">About Us</Link></li>
                <li><Link to="/services" className="hover:text-brand-violet">Services</Link></li>
                <li><Link to="/careers" className="hover:text-brand-violet">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-brand-violet">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/support-center" className="hover:text-brand-violet">Support Center</Link></li>
                <li><Link to="/customer-support" className="hover:text-brand-violet">Customer Support</Link></li>
                <li><Link to="/faq" className="hover:text-brand-violet">FAQ</Link></li>
                <li><Link to="/login" className="hover:text-brand-violet">Employee Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/terms" className="hover:text-brand-violet">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-brand-violet">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-brand-violet">Cookie Policy</Link></li>
              </ul>
              <div className="mt-4 space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> +92 21 111 696 379</p>
                <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> info@myne7x.com</p>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} MYNE7X BPO. All rights reserved.</p>
            <p>Powered by Supabase · Deployed on Vercel</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
