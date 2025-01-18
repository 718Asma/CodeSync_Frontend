interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className, width = 120, height = 40 }: LogoProps) {
  return (
    <div className={className}>
      <img
        src="../../../assets/Untitled-2-02.png"
        alt="Code Sync"
        width={width}
        height={height}
        className="h-auto w-auto"
      />
    </div>
  )
}
