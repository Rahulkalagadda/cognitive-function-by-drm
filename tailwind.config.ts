import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
  			brand: {
  				primary: '#2563EB',
  				secondary: '#0D9488',
  				purple: '#7C3AED',
  				coral: '#D85A30',
  				amber: '#F59E0B'
  			},
  			domain: {
  				attention: '#2563EB',
  				memory: '#7C3AED',
  				executive: '#0D9488',
  				shadow: '#D85A30',
  				processing: '#F59E0B',
  				perception: '#D85A30',
  				coordination: '#10B981'
  			},
  			questionnaire: {
  				phq: '#2563EB',
  				gad: '#0D9488',
  				pss: '#F59E0B'
  			},
  			surface: {
  				page: '#F8FAFC',
  				card: '#FFFFFF',
  				muted: '#F1F5F9',
  				dark: '#1a1a2e'
  			},
  			score: {
  				exceptional: '#166534',
  				good: '#15803D',
  				monitoring: '#B45309',
  				attention: '#B91C1C'
  			},
  			border: {
  				default: '#E2E8F0',
  				strong: '#CBD5E1',
          input: 'hsl(var(--border))'
  			},
  			status: {
  				pending: '#F59E0B',
  				complete: '#10B981',
  				error: '#EF4444',
  				info: '#3B82F6'
  			}
  		},
  		borderRadius: {
  			DEFAULT: '8px',
  			md: '8px',
  			lg: '12px',
  			xl: '16px',
  			'2xl': '20px',
  			'3xl': '28px'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'monospace'
  			]
  		},
  		boxShadow: {
  			card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  			modal: '0 20px 60px rgba(0,0,0,0.15)'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(8px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			slideInRight: {
  				'0%': {
  					transform: 'translateX(100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			fadeIn: 'fadeIn 0.3s ease-out forwards',
  			scaleIn: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			slideInRight: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
};
export default config;
