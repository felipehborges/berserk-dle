import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Berserkdle — Personagem do dia',
  description:
    'Um personagem. Oito tentativas. Um desafio diário no mundo de Berserk, com pistas a cada palpite.',
};
export const viewport: Viewport = { themeColor: '#151513' };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <noscript>
          Ative o JavaScript no navegador para jogar Berserkdle.
        </noscript>
        {children}
      </body>
    </html>
  );
}
