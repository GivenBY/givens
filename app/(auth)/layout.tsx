export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-4 p-4">
      {children}
    </div>
  );
}
