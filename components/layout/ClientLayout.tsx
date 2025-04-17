"use client";


type ClientLayoutProps = {
  children: React.ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
