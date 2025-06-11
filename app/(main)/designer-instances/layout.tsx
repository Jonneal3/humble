import NavbarWrapper from "@/components/NavbarWrapper";

export default function DesignerInstancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper />
      {children}
    </>
  );
} 