import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/css/style.css';
import '@/styles/css/index.css'

import Footer from '@/components/footer';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
                <script src="https://kit.fontawesome.com/f50be4e936.js" crossOrigin="anonymous" async></script>
            </head>
            <body>

                <main>{children}</main>

                <Footer />
            </body>
        </html>
    );
}
