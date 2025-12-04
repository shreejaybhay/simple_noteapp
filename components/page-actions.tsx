"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface PageAction {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "destructive" | "ghost" | "secondary";
  className?: string;
  disabled?: boolean;
}

interface PageActionsProps {
  title: string;
  subtitle?: string;
  badge?: string;
  backHref: string;
  backLabel?: string;
  actions?: PageAction[];
  mobileActions?: PageAction[];
}

export const PageActions = ({
  title,
  subtitle,
  badge,
  backHref,
  backLabel = "Back",
  actions = [],
  mobileActions = [],
}: PageActionsProps) => {
  const allActions = [...actions, ...mobileActions];

  return (
    <div className="border-b bg-background/95 backdrop-blur sticky top-[69px] z-40">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Back button and title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <Link href={backHref}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">{backLabel}</span>
              </Link>
            </Button>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-semibold truncate">
                  {title}
                </h1>
                {badge && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {badge}
                  </Badge>
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop actions - show first 2-3 actions */}
            <div className="hidden sm:flex items-center gap-2">
              {actions.slice(0, 3).map((action, index) => (
                <ActionButton key={index} action={action} />
              ))}
            </div>

            {/* Mobile dropdown - show all actions */}
            {allActions.length > 0 && (
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {allActions.map((action, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={action.onClick}
                        asChild={!!action.href}
                        className={action.className}
                      >
                        {action.href ? (
                          <Link href={action.href} className="flex items-center">
                            {action.icon}
                            <span className="ml-2">{action.label}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center cursor-pointer">
                            {action.icon}
                            <span className="ml-2">{action.label}</span>
                          </div>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Desktop overflow dropdown - show remaining actions if more than 3 */}
            {actions.length > 3 && (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {actions.slice(3).map((action, index) => (
                      <DropdownMenuItem
                        key={index + 3}
                        onClick={action.onClick}
                        asChild={!!action.href}
                        className={action.className}
                      >
                        {action.href ? (
                          <Link href={action.href} className="flex items-center">
                            {action.icon}
                            <span className="ml-2">{action.label}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center cursor-pointer">
                            {action.icon}
                            <span className="ml-2">{action.label}</span>
                          </div>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ action }: { action: PageAction }) => {
  const buttonProps = {
    variant: action.variant || "outline" as const,
    size: "sm" as const,
    className: action.className,
    onClick: action.onClick,
    disabled: action.disabled,
  };

  const content = (
    <>
      {action.icon}
      <span className="ml-2 hidden lg:inline">{action.label}</span>
    </>
  );

  if (action.href) {
    return (
      <Button {...buttonProps} asChild>
        <Link href={action.href}>{content}</Link>
      </Button>
    );
  }

  return <Button {...buttonProps}>{content}</Button>;
};