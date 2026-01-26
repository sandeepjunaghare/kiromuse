import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"
import logo from "/assets/images/cm-logo.png"

interface LogoProps {
  variant?: "full" | "icon" | "responsive"
  className?: string
  asLink?: boolean
}

export function Logo({
  variant = "full",
  className,
  asLink = true,
}: LogoProps) {
  const content = (
    <img
      src={logo}
      alt="CompuMatrice AI to AI"
      className={cn(variant === "full" ? "h-6 w-auto" : "size-5", className)}
    />
  )

  if (!asLink) {
    return content
  }

  return <Link to="/">{content}</Link>
}
