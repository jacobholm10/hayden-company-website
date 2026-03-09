export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] bg-charcoal-900 overflow-auto">
      {children}
    </div>
  );
}
