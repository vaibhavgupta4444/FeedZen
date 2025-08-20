
import './globals.css'


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
        
      
        {children}
        
      </body>
     
    </html>
  )
}
