import './globals.css'
import Navbar from "@/components/Navbar"
import AuthProvider from "@/context/AuthProvider"


export const metadata = {
    title: 'FeedZen',
    description: 'Share your feedback anonymously',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">

            <body>
                <AuthProvider>
                    <Navbar />
                    {children}
                </AuthProvider>
            </body>

        </html>
    )
}
