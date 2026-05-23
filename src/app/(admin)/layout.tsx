import 'bootstrap/dist/css/bootstrap.min.css'; 
import Footer from '@/components/footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}