import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const BentoGrid = ({ children, className, ...props }) => (
  <div
    className={cn(
      "grid w-full auto-rows-[20rem] grid-cols-3 gap-[18px] sm:gap-[21.6px] lg:auto-rows-[22rem]",
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  onClick,
  cta,
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={(e) => onClick?.(e)}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.(e)}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-[18px] cursor-pointer outline-none",
      "bg-white border border-[#d1d5db]",
      "shadow-[0px_2px_4px_rgba(0,0,0,.04),0px_8px_24px_rgba(0,0,0,.04)]",
      "will-change-transform transition-[border-color,box-shadow] duration-200 ease-out",
      "hover:border-[#a5c9ff] hover:shadow-[0px_22.5px_34.2px_-9.9px_rgba(165,201,255,0.32),0px_8.1px_16.2px_-9.9px_rgba(0,0,0,0.18)]",
      "active:scale-[0.98]",
      "focus-visible:ring-2 focus-visible:ring-[#a5c9ff] focus-visible:ring-offset-4",
      className
    )}
  >
    <div>{background}</div>

    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-5 pb-4 transition-all duration-300 lg:group-hover:-translate-y-10">
      {Icon && (
        <Icon className="h-8 w-8 origin-left transform-gpu text-[#374151] transition-all duration-300 ease-in-out group-hover:scale-75" />
      )}
      <h3 className="mt-1 font-space text-[15.3px] font-normal uppercase leading-snug tracking-normal text-[#1a1c1c]">
        {name}
      </h3>
      <p className="text-[12.6px] leading-[19.8px] text-[#4b5563] [text-wrap:pretty]">
        {description}
      </p>
    </div>

    <div className="pointer-events-none absolute bottom-0 z-10 flex w-full translate-y-10 transform-gpu flex-row items-center p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-normal text-[#111827]">
        {cta}
        <ArrowRightIcon className="h-3 w-3" />
      </span>
    </div>

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-[#a5c9ff]/[.04]" />
  </div>
)

export { BentoCard, BentoGrid }
