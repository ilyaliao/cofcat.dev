'use client';

import { Popover, type PopoverProps, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { navigationItems } from '~/config/nav';

function NavItem({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const isActive = usePathname() === href;

  return (
    <li>
      <Link
        className={clsx(
          'relative block whitespace-nowrap px-3 py-2 transition',
          isActive
            ? 'text-sky-600 dark:text-sky-400'
            : 'hover:text-sky-600 dark:hover:text-sky-400'
        )}
        href={href}
      >
        {children}
        {isActive && (
          <motion.span
            className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-sky-700/0 via-sky-700/70 to-sky-700/0 dark:from-sky-400/0 dark:via-sky-400/40 dark:to-sky-400/0"
            layoutId="active-nav-item"
          />
        )}
      </Link>
    </li>
  );
}

function Desktop({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radius = useMotionValue(0);
  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - bounds.left);
      mouseY.set(clientY - bounds.top);
      radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5);
    },
    [mouseX, mouseY, radius]
  );
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`;

  return (
    <nav
      className={clsx(
        'group relative',
        'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90',
        'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md',
        'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
        '[--spotlight-color:rgb(224_242_254_/_0.6)] dark:[--spotlight-color:rgb(180_230_253_/_0.07)]',
        className
      )}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Spotlight overlay */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
      />

      <ul className="flex bg-transparent px-3 text-sm font-medium text-zinc-800 dark:text-zinc-200 ">
        {navigationItems.map(({ href, text }) => (
          <NavItem href={href} key={href}>
            {text}
          </NavItem>
        ))}
      </ul>
    </nav>
  );
}

function MobileNavItem({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <li>
      <Popover.Button as={Link} className="block py-2" href={href}>
        {children}
      </Popover.Button>
    </li>
  );
}

function Mobile(props: PopoverProps<'div'>) {
  return (
    <Popover {...props}>
      <Popover.Button className="group flex items-center rounded-full bg-gradient-to-b from-zinc-50/20 to-white/80 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md focus:outline-none focus-visible:ring-2 dark:from-zinc-900/30 dark:to-zinc-800/80 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20 dark:focus-visible:ring-yellow-500/80">
        前往
        {/* Chevron */}
        <svg
          aria-hidden="true"
          className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400"
          viewBox="0 0 8 6"
        >
          <path
            d="M1.75 1.75 4 4.25l2.25-2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={React.Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur dark:bg-black/80" />
        </Transition.Child>
        <Transition.Child
          as={React.Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-gradient-to-b from-zinc-100/75 to-white p-8 ring-1 ring-zinc-900/5 dark:from-zinc-900/50 dark:to-zinc-900 dark:ring-zinc-800"
            focus
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button aria-label="關閉選單" className="-m-1 p-1">
                <svg
                  aria-hidden="true"
                  className="h-6 w-6 text-zinc-500 dark:text-zinc-400"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </Popover.Button>
              <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                前往
              </h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-zinc-500/20 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                {navigationItems.map(({ href, text }) => (
                  <MobileNavItem href={href} key={href}>
                    {text}
                  </MobileNavItem>
                ))}
              </ul>
            </nav>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export const NavigationBar = {
  Desktop,
  Mobile,
} as const;