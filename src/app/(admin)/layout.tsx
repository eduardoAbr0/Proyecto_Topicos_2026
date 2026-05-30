import 'bootstrap/dist/css/bootstrap.min.css';
import AdminLayout from '@/layout/AdminLayout';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                <AdminLayout>{children}</AdminLayout>
            </body>

            <Script
                src="https://kit.fontawesome.com/f50be4e936.js"
                crossOrigin="anonymous"
                strategy="afterInteractive"
            />
        </html>
    );
}