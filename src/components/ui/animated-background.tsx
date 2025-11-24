export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 dark:opacity-20" />
      
      {/* Floating orbs */}
      <div className="absolute top-0 -left-4 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob opacity-70" />
      <div className="absolute top-0 -right-4 w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 opacity-70" />
      <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-accent/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000 opacity-70" />
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
    </div>
  );
};
