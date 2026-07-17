import { DesktopSidebar } from "@/components/navigation";
import { Navbar } from "@/components/navigation";
import ClientTokenWrapper from "@/components/wrappers/client-token-wrapper";
import { UserProfileWrapper } from "@/components/wrappers/user-profile-wrapper";
import { Providers } from "../providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientTokenWrapper>
      <UserProfileWrapper>
        
        <Providers>
        <section>
          <div className="flex h-screen">
            <DesktopSidebar />
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
                <Navbar />
                <main className="flex-1 overflow-y-auto scrollbar px-4 md:px-6 py-4">{children}</main>
              </div>
            </div>
          </div>
        </section>
        </Providers>
      </UserProfileWrapper>
    </ClientTokenWrapper>
  );
}
