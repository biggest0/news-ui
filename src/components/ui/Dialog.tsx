import * as React from "react"
import { useTranslation } from "react-i18next"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { LuX } from "react-icons/lu"

/**
 * Modal dialog built on @base-ui/react Dialog — focus trap, Escape close,
 * aria-modal, body scroll lock and focus return come from the primitive.
 * Adapted to this app the same way Sheet.tsx was: react-icons instead of
 * lucide, PascalCase filename, semantic tokens, app Button.
 *
 * Responsive by default: a slide-up bottom sheet below `md`, a centered card
 * from `md` up. Positioning is handled by Dialog.Viewport (a scrollable
 * container) rather than fixed-position transforms, so a dialog taller than
 * the viewport scrolls instead of overflowing off-screen.
 *
 * Use DialogTitle / DialogDescription inside the content — they wire
 * aria-labelledby / aria-describedby automatically.
 */

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

/**
 * The dialog panel. Renders the portal, backdrop and scrollable viewport
 * around the popup, so consumers only supply the contents.
 *
 * @param showCloseButton - Renders the top-right X. Turn it off when the
 *   dialog supplies its own dismiss affordance.
 * @param viewportClassName - Escape hatch for the positioning container
 *   (e.g. changing vertical alignment); the popup itself takes `className`.
 */
function DialogContent({
  className,
  viewportClassName,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
  viewportClassName?: string
}) {
  const { t } = useTranslation()
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Viewport
        data-slot="dialog-viewport"
        className={cn(
          "fixed inset-0 z-50 flex items-end justify-center overflow-y-auto overscroll-contain md:items-center md:p-6",
          viewportClassName
        )}
      >
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            // Bottom sheet under md (full width, top corners rounded, slides
            // up); centered card from md up (capped width, fully rounded,
            // fades + scales in). Transition data attributes come from base-ui.
            "relative flex w-full flex-col rounded-t-xl border-t border-border-subtle bg-popover bg-clip-padding text-popover-foreground shadow-lg transition-all duration-200 ease-out",
            "data-starting-style:translate-y-6 data-starting-style:opacity-0 data-ending-style:translate-y-6 data-ending-style:opacity-0",
            "md:max-w-lg md:rounded-xl md:border",
            "md:data-starting-style:translate-y-0 md:data-starting-style:scale-95 md:data-ending-style:translate-y-0 md:data-ending-style:scale-95",
            // Respect reduced-motion: no slide/scale, no fade — appear as-is
            "motion-reduce:transition-none motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-starting-style:opacity-100 motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-ending-style:opacity-100",
            className
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              render={
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4"
                  size="icon-sm"
                />
              }
            >
              <LuX />
              <span className="sr-only">{t("COMMON.CLOSE")}</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 p-6 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-lg font-semibold tracking-wider text-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "mt-0.5 text-sm leading-relaxed text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
