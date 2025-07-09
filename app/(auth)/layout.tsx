export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex items-center justify-center w-full h-[80vh]">
      {children}
    </div>
  );
}
