import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="flex-1 pt-28 lg:pt-28 w-full max-w-full overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}
