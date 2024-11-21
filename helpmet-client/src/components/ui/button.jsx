import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import "../../index.css";
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

// Icon Buttons
const icons = {
  edit: (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none">
      <g clipPath="url(#clip0_1017_1377)">
        <path 
        d="M6.25 17.0833L17.5 5.83333L14.1667 2.5L2.91667 13.75L1.66667 18.3333L6.25 17.0833Z" 
        stroke="#1D2939" 
        strokeWidth="1.66667" 
        strokeLinecap="round" 
        strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_1017_1377">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  expand: (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none">
      <path 
      d="M5 7.5L10 12.5L15 7.5" 
      stroke="#1D2939" 
      strokeWidth="1.66667" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="icon-path"/>
    </svg>
  ),
  hide: (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none">
      <path d="M15 12.5L10 7.5L5 12.5" 
      stroke="#475467" 
      strokeWidth="1.66667" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="icon-path"/>
    </svg>
  ),
  delete: (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none">
      <path d="M2.5 5.00002H4.16667M4.16667 5.00002H17.5M4.16667 5.00002V16.6667C4.16667 17.1087 4.34226 17.5326 4.65482 17.8452C4.96738 18.1578 5.39131 18.3334 5.83333 18.3334H14.1667C14.6087 18.3334 15.0326 18.1578 15.3452 17.8452C15.6577 17.5326 15.8333 17.1087 15.8333 16.6667V5.00002H4.16667ZM6.66667 5.00002V3.33335C6.66667 2.89133 6.84226 2.4674 7.15482 2.15484C7.46738 1.84228 7.89131 1.66669 8.33333 1.66669H11.6667C12.1087 1.66669 12.5326 1.84228 12.8452 2.15484C13.1577 2.4674 13.3333 2.89133 13.3333 3.33335V5.00002M8.33333 9.16669V14.1667M11.6667 9.16669V11.6667V14.1667" 
      stroke="#475467" 
      strokeWidth="1.66667" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="icon-path"/>
    </svg>
  ),
  close: (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none">
      <path d="M5 15L15 5M5 5L15 15" 
      stroke="#1D2939" 
      strokeWidth="1.67" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="icon-path"/>
    </svg>
  ),
  previous: (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none">
      <path d="M12.5 5L7.5 10L12.5 15"
      stroke="#1D2939" 
      strokeWidth="1.66667" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="icon-path"/>
    </svg>
  ),
  next: (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none">
      <path d="M7.5 15L12.5 10L7.5 5" 
      stroke="#1D2939" 
      strokeWidth="1.66667" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="icon-path"/>
    </svg>
  ),
  toggleActive: (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="24"
    viewBox="0 0 40 24"
    fill="none"
    >
      <rect 
      x="0.5" 
      y="0.5"
      width="39" 
      height="22" 
      rx="12" 
      fill="#D9D6FE"
      stroke="#9B8AFB"
      strokeWidth="1" />
      <circle 
      cx="28" 
      cy="12"
      r="7" 
      fill="#6938EF" />
    </svg>
  ),
  toggleInactive: (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="24"
    viewBox="0 0 40 24"
    fill="none"
    >
      <rect 
      x="0.5" 
      y="0.5"
      width="39" 
      height="22" 
      rx="12" 
      fill="#F9FAFB"
      stroke="#98A2B3"
      strokeWidth="1" />
      <circle 
      cx="12" 
      cy="12" 
      r="7" 
      fill="#98A2B3" />
    </svg>
  ),
};

const IconButton = ({ icon, onClick, className, ...props }) => {
  const IconComponent = icons[icon];

  return (
    <button onClick={onClick} className={`icon-button ${className}`} {...props}>
      {IconComponent ? IconComponent : null}
    </button>
  );
};


export { Button, buttonVariants, IconButton }
