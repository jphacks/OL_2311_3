import Providers from "@/lib/providers"

import "./global.css"

type RootLayoutProps = {
  children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="ja" prefix="og: http://ogp.me/ns#">
      <body className="bg-[#fafaf9]">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
