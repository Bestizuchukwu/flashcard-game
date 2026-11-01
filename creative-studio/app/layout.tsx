import "./globals.css";

export const metadata = {
  title: "Astera Studio",
  description: "Premium creative studio inspired by modern design suites.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
