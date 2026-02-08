import { Button } from "@/components/ui/button";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
	return (
		<ThemeProvider>
			<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
					<a href="/" className="flex items-center gap-2">
						<span className="text-2xl font-bold">MicroPOS</span>
					</a>

					<nav className="hidden md:flex items-center gap-6">
						<a
							href="#features"
							className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
						>
							Características
						</a>
						<a
							href="#pricing"
							className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
						>
							Precios
						</a>
						<a
							href="#about"
							className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
						>
							Acerca
						</a>
					</nav>

					<div className="flex items-center gap-2">
						<ThemeToggle />
						<a href="/auth/signin">
							<Button variant="ghost" size="sm">
								Iniciar Sesión
							</Button>
						</a>
						<a href="/auth/signup">
							<Button variant="default" size="sm">
								Comenzar Gratis
							</Button>
						</a>
					</div>
				</div>
			</header>
		</ThemeProvider>
	);
}
