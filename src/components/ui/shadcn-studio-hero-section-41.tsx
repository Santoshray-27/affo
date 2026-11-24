"use client"

import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react"
import type {
  ComponentProps,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  SVGAttributes,
} from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"
import type { UseEmblaCarouselType } from "embla-carousel-react"
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Circle,
  MenuIcon,
} from "lucide-react"

const CircleSmallIcon = (props: SVGAttributes<SVGElement>) => (
  <Circle className="size-2 fill-current" {...props} />
)

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type NavigationItem = {
  title: string
  href: string
}

export type NavigationSection = {
  title: string
  icon?: ReactNode
} & (
  | {
      items: NavigationItem[]
      href?: never
    }
  | {
      items?: never
      href: string
    }
)

export type MenuData = {
  id: number | string
  img: string
  imgAlt: string
  userAvatar: string
  userComment: string
  title?: string
  subtitle?: string
  href?: string
  badge?: string
}

export type HeroSection41Props = {
  /** Links rendered in the header navigation (and mobile menu). */
  navigationData?: NavigationSection[]
  /** Dishes / Categories shown in the carousels, each with an origin or customer comment. */
  menudata?: MenuData[]
  brandName?: string
  eyebrow?: string
  /** Label of the header call-to-action button. */
  headerCtaLabel?: string
  heading?: string
  description?: string
  primaryCtaLabel?: string
  secondaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaHref?: string
  /** Delay between automatic slides in milliseconds. */
  autoplayDelay?: number
  className?: string
  /** Whether to render the fixed site header (false when embedding as an inner page section). */
  showHeader?: boolean
}

/* -------------------------------------------------------------------------- */
/*                         UI primitives (self-contained)                     */
/* -------------------------------------------------------------------------- */

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5",
        lg: "h-9 gap-1.5 px-2.5",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

const Button = ({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) => {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) => {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselProps = {
  opts?: UseCarouselParameters[0]
  plugins?: UseCarouselParameters[1]
  setApi?: (api: CarouselApi) => void
}

const CarouselContext = createContext<{
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
} | null>(null)

const useCarousel = () => {
  const context = useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = ({
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: ComponentProps<"div"> & CarouselProps) => {
  const [carouselRef, api] = useEmblaCarousel({ ...opts, axis: "x" }, plugins)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        api?.scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        api?.scrollNext()
      }
    },
    [api]
  )

  useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  return (
    <CarouselContext.Provider value={{ carouselRef }}>
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

const CarouselContent = ({ className, ...props }: ComponentProps<"div">) => {
  const { carouselRef } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div className={cn("-ml-4 flex", className)} {...props} />
    </div>
  )
}

const CarouselItem = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn("min-w-0 shrink-0 grow-0 basis-full pl-4", className)}
      {...props}
    />
  )
}

const DropdownMenuContent = ({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) => {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

const DropdownMenuItem = ({
  className,
  ...props
}: MenuPrimitive.Item.Props) => {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted data-open:bg-muted/50 data-open:hover:bg-muted data-open:focus:bg-muted"
)

const NavigationMenu = ({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align">) => {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      <NavigationMenuPrimitive.Portal>
        <NavigationMenuPrimitive.Positioner
          side="bottom"
          sideOffset={8}
          align={align}
          alignOffset={0}
          className="isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none"
        >
          <NavigationMenuPrimitive.Popup className="xs:w-(--popup-width) relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0">
            <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
          </NavigationMenuPrimitive.Popup>
        </NavigationMenuPrimitive.Positioner>
      </NavigationMenuPrimitive.Portal>
    </NavigationMenuPrimitive.Root>
  )
}

const NavigationMenuList = ({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.List>) => {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-0",
        className
      )}
      {...props}
    />
  )
}

const NavigationMenuItem = ({
  className,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Item>) => {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const NavigationMenuTrigger = ({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) => {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

const NavigationMenuContent = ({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) => {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-auto p-1 transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out",
        className
      )}
      {...props}
    />
  )
}

const NavigationMenuLink = ({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) => {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 data-active:bg-muted/50 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Logo                                    */
/* -------------------------------------------------------------------------- */

const BistroLogo = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <rect
        width="32"
        height="32"
        rx="16"
        transform="matrix(1 0 0 -1 0 32)"
        className="fill-forest"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.6335 9.37402C12.4778 9.37402 14.145 10.1271 15.3467 11.3418L11.8436 14.8456C10.6136 14.0151 8.62354 14.2897 7.48627 17.2828C7.42492 17.4438 7.36357 17.6049 7.30222 17.7659C7.03765 18.4622 7.17875 19.1777 7.67952 19.6785C8.18029 20.1785 8.89578 20.3196 9.59133 20.055L10.0752 19.8717C13.0683 18.7345 13.3429 16.7444 12.5123 15.5144L15.964 12.0627C17.1427 10.884 17.9019 10.0979 19.5499 9.62786C20.1289 9.46298 20.7401 9.37402 21.372 9.37402C25.0338 9.37402 28.0016 12.3426 28.0016 16.0044C28.0016 19.6662 25.0338 22.634 21.372 22.634C19.5545 22.634 17.908 21.9024 16.7102 20.7183L19.961 17.4683C20.237 17.6302 20.5515 17.7007 20.8919 17.6754C21.3804 17.6386 21.7869 17.4139 22.0768 17.019L24.9456 13.1217L24.7892 12.9653L21.8375 15.9162C21.7884 15.966 21.7071 15.966 21.658 15.9162C21.609 15.8671 21.609 15.7858 21.658 15.7368L24.6097 12.7851L24.382 12.5581L21.4311 15.5098C21.3812 15.5588 21.3007 15.5588 21.2508 15.5098C21.2018 15.4599 21.2018 15.3794 21.2508 15.3295L24.2025 12.3779L23.9748 12.1509L21.0238 15.1026C20.974 15.1516 20.8935 15.1516 20.8436 15.1026C20.7945 15.0527 20.7945 14.9722 20.8436 14.9223L23.7953 11.9714L23.6473 11.8234C23.5906 11.8556 23.5346 11.8917 23.4809 11.9308L19.7416 14.6831C19.3467 14.9737 19.122 15.3794 19.0852 15.8679C19.0591 16.2084 19.1297 16.5228 19.2922 16.7996L16.086 20.0059C15.0614 20.953 14.3168 21.6915 13.0177 22.1923C12.2784 22.4776 11.474 22.634 10.6335 22.634C6.97246 22.634 4.00391 19.6662 4.00391 16.0044C4.00391 12.3426 6.97246 9.37402 10.6335 9.37402Z"
        className="fill-white"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Header navigation                             */
/* -------------------------------------------------------------------------- */

const MenuNavigation = ({
  navigationData,
  className,
  align = "start",
}: {
  navigationData: NavigationSection[]
  className?: string
  align?: "start" | "center" | "end"
}) => {
  return (
    <NavigationMenu className={className} align={align}>
      <NavigationMenuList className="flex-wrap justify-start gap-1.5">
        {navigationData.map((navItem) => {
          if (navItem.href) {
            return (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuLink
                  href={navItem.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent! px-3 py-1.5 text-base! text-muted-foreground hover:text-primary focus:text-primary dark:hover:bg-accent/50"
                  )}
                >
                  {navItem.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          }

          return (
            <NavigationMenuItem key={navItem.title}>
              <NavigationMenuTrigger className="bg-transparent px-3 py-1.5 text-base text-muted-foreground hover:text-primary focus:text-primary dark:hover:bg-accent/50 dark:data-open:hover:bg-accent/50 [&>svg]:size-4">
                {navItem.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="w-auto data-[motion=from-end]:slide-in-from-right-30! data-[motion=from-start]:slide-in-from-left-30! data-[motion=to-end]:slide-out-to-right-30! data-[motion=to-start]:slide-out-to-left-30!">
                <ul className="grid w-38 gap-4">
                  <li>
                    {navItem.items?.map((item) => (
                      <NavigationMenuLink key={item.title} href={item.href}>
                        {item.title}
                      </NavigationMenuLink>
                    ))}
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const MenuDropdown = ({
  trigger,
  navigationData,
  align = "start",
}: {
  trigger: ReactElement
  navigationData: NavigationSection[]
  align?: "center" | "end" | "start"
}) => {
  return (
    <MenuPrimitive.Root>
      <MenuPrimitive.Trigger render={trigger} />
      <DropdownMenuContent className="w-56" align={align}>
        {navigationData.map((navItem) => {
          if (navItem.href) {
            return (
              <DropdownMenuItem
                key={navItem.title}
                render={<a href={navItem.href} />}
              >
                {navItem.icon}
                {navItem.title}
              </DropdownMenuItem>
            )
          }

          return (
            <CollapsiblePrimitive.Root
              key={navItem.title}
              render={<MenuPrimitive.Group />}
            >
              <CollapsiblePrimitive.Trigger
                nativeButton={false}
                render={
                  <DropdownMenuItem
                    closeOnClick={false}
                    className="group justify-between"
                  />
                }
              >
                {navItem.icon}
                <span className="flex-1">{navItem.title}</span>
                <ChevronRightIcon className="shrink-0 transition-transform group-data-panel-open:rotate-90" />
              </CollapsiblePrimitive.Trigger>
              <CollapsiblePrimitive.Panel className="pl-2">
                {navItem.items?.map((item) => (
                  <DropdownMenuItem
                    key={item.title}
                    render={<a href={item.href} />}
                  >
                    <CircleSmallIcon />
                    <span>{item.title}</span>
                  </DropdownMenuItem>
                ))}
              </CollapsiblePrimitive.Panel>
            </CollapsiblePrimitive.Root>
          )
        })}
      </DropdownMenuContent>
    </MenuPrimitive.Root>
  )
}

const Header = ({
  navigationData,
  brandName,
  ctaLabel,
  ctaHref,
}: {
  navigationData: NavigationSection[]
  brandName: string
  ctaLabel: string
  ctaHref: string
}) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 h-17.5 w-full border-b transition-all duration-300",
        {
          "bg-background shadow-md": isScrolled,
        }
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <BistroLogo />
          <span className="text-[20px] font-semibold text-primary">
            {brandName}
          </span>
        </a>

        {/* Navigation */}
        <MenuNavigation
          navigationData={navigationData}
          className="max-lg:hidden [&_[data-slot=navigation-menu-list]]:gap-1"
        />

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            size="lg"
            className="rounded-full"
            render={<a href={ctaHref} />}
            nativeButton={false}
          >
            {ctaLabel}
          </Button>

          {/* Navigation for small screens */}
          <MenuDropdown
            align="end"
            navigationData={navigationData}
            trigger={
              <Button
                variant="outline"
                size="icon-lg"
                className="rounded-full lg:hidden"
              >
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            }
          />
        </div>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*                                Hero section                                */
/* -------------------------------------------------------------------------- */

export const HeroSection41 = ({
  navigationData = [],
  menudata = [],
  brandName = "Annapurna",
  eyebrow = "Shop by category",
  headerCtaLabel = "View all",
  heading = "Everything fresh, in one place",
  description = "Seasonal fruits and vegetables, cold-pressed raw tonics, and living organic staples hand-picked fresh from verified partner orchards across Delhi NCR.",
  primaryCtaLabel = "Explore category",
  secondaryCtaLabel = "View all produce",
  primaryCtaHref = "/shop",
  secondaryCtaHref = "/shop",
  autoplayDelay = 3800,
  className,
  showHeader = false,
}: HeroSection41Props) => {
  const [mainApi, setMainApi] = useState<CarouselApi>()
  const [thumbApi, setThumbApi] = useState<CarouselApi>()
  const [commentsApi, setCommentsApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [autoplay] = useState(() =>
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
  )

  // Keep the three carousels in sync, whichever one the user interacts with.
  useEffect(() => {
    const apis = [mainApi, thumbApi, commentsApi]
    const cleanups: Array<() => void> = []

    apis.forEach((api) => {
      if (!api) return

      const onSelect = () => {
        const selectedIndex = api.selectedScrollSnap()

        setCurrent(selectedIndex)
        apis.forEach((other) => {
          if (other && other !== api) other.scrollTo(selectedIndex)
        })
      }

      api.on("select", onSelect)
      cleanups.push(() => api.off("select", onSelect))
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [mainApi, thumbApi, commentsApi])

  const handleThumbClick = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index)
    },
    [mainApi]
  )

  const activeItem = menudata[current] || menudata[0]
  const targetHref = activeItem?.href || primaryCtaHref

  return (
    <div className={cn("overflow-x-hidden", className)}>
      {showHeader && (
        <Header
          navigationData={navigationData}
          brandName={brandName}
          ctaLabel={headerCtaLabel}
          ctaHref={secondaryCtaHref}
        />
      )}

      <main className={cn("flex flex-col", showHeader && "pt-17.5")}>
        <section className="flex-1 py-4 sm:py-6 lg:py-8">
          <div className="mx-auto flex h-full max-w-7xl flex-col gap-10 lg:gap-14 px-4 sm:px-6 lg:px-8">
            {/* Top Grid: Headline + Main Category Visual */}
            <div className="grid grid-cols-1 gap-6 gap-y-8 md:gap-y-12 lg:grid-cols-5 items-center">
              <div className="flex w-full flex-col justify-center gap-4 max-lg:items-center lg:col-span-3">
                {eyebrow && (
                  <span className="text-[12px] font-semibold uppercase tracking-eyebrow text-forest">
                    {eyebrow}
                  </span>
                )}

                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] font-medium text-ink leading-[1.12] tracking-tight max-lg:text-center">
                  {activeItem?.title || heading}
                </h2>

                <p className="max-w-xl text-base sm:text-lg text-muted max-lg:text-center leading-relaxed">
                  {activeItem?.subtitle || description}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    size="lg"
                    className="group relative w-fit overflow-hidden rounded-full bg-forest text-white hover:bg-forest-deep text-sm font-semibold px-6 py-2.5 shadow-soft transition-all"
                    render={<a href={targetHref} />}
                    nativeButton={false}
                  >
                    <span>{primaryCtaLabel}</span>
                    <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-full bg-cream text-forest border border-line hover:border-forest/40 text-sm font-medium px-5 py-2.5 transition-all"
                    render={<a href={secondaryCtaHref} />}
                    nativeButton={false}
                  >
                    {secondaryCtaLabel}
                  </Button>
                </div>
              </div>

              {/* Main Category Visual Spotlight Carousel */}
              <Carousel
                className="w-full lg:col-span-2"
                setApi={setMainApi}
                plugins={[autoplay]}
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {menudata.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="flex w-full items-center justify-center"
                    >
                      <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[380px] rounded-3xl overflow-hidden bg-mint border border-line shadow-card p-3">
                        <img
                          src={item.img}
                          alt={item.imgAlt}
                          className="w-full h-full object-cover rounded-2xl transition-transform duration-700 hover:scale-[1.03]"
                        />
                        {item.badge && (
                          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-xs text-forest text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs border border-line">
                            {item.badge}
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Bottom Row: Synced Angled Category Selectors + Sourcing Notes */}
            <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-5 items-center pt-2 border-t border-line">
              {/* Synced Thumbnails Carousel */}
              <Carousel
                className="relative w-full max-lg:order-2 lg:col-span-3"
                setApi={setThumbApi}
                opts={{ loop: true }}
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream via-cream/80 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream via-cream/80 to-transparent" />
                <CarouselContent className="my-1 flex">
                  {menudata.map((item, index) => (
                    <CarouselItem
                      key={item.id}
                      className="basis-1/2 cursor-pointer items-center sm:basis-1/3 md:basis-1/3 lg:basis-1/3"
                      onClick={() => handleThumbClick(index)}
                    >
                      <div className="relative flex h-28 sm:h-32 items-center justify-center p-2">
                        <div
                          className={cn(
                            "absolute inset-0 rounded-2xl border transition-all duration-300",
                            current === index
                              ? "bg-white border-forest shadow-md ring-2 ring-forest/20"
                              : "bg-white/60 hover:bg-white border-line"
                          )}
                        />
                        <div className="relative z-1 flex items-center gap-3 px-3">
                          <img
                            src={item.img}
                            alt={item.imgAlt}
                            className="size-14 sm:size-16 rounded-xl object-cover border border-line shadow-xs shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-leaf font-semibold block truncate">
                              {item.badge || `0${index + 1}`}
                            </span>
                            <span
                              className={cn(
                                "text-xs sm:text-sm font-medium line-clamp-1 block transition-colors",
                                current === index ? "text-forest font-semibold" : "text-ink"
                              )}
                            >
                              {item.title || item.imgAlt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Synced Farm Origin / Customer Notes */}
              <Carousel
                className="flex w-full items-center justify-center lg:col-span-2"
                setApi={setCommentsApi}
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {menudata.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="flex h-full min-h-14 w-full items-center gap-3.5 px-4 bg-white/70 rounded-2xl border border-line p-3"
                    >
                      <img
                        src={item.userAvatar}
                        alt=""
                        className="size-11 rounded-full border-2 border-forest/30 shadow-xs object-cover shrink-0"
                      />
                      <Separator
                        orientation="vertical"
                        className="hidden h-8 w-0.5 rounded-full bg-forest sm:block data-vertical:self-center"
                      />
                      <p className="text-xs sm:text-[13px] text-ink leading-relaxed font-medium">
                        &ldquo;{item.userComment}&rdquo;
                      </p>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HeroSection41
