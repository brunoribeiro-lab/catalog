'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DialogAction, DialogProps } from '@/types/Dialog';

export default function Dialog({
    open,
    onClose,
    title,
    message,
    actions = [{ label: 'OK', role: 'cancel' }],
    stacked,
    closeOnBackdrop = true,
}: DialogProps) {
    const [mounted, setMounted] = React.useState(false);
    const titleId = React.useId();
    const messageId = React.useId();

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setMounted(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!mounted || !open) return null;

    const isTwoSideBySide = !stacked && actions.length === 2;

    const handleAction = (a: DialogAction) => {
        a.onPress?.();
        if (a.role === 'cancel' || a.role === undefined) onClose();
    };

    const roleClass = (role?: DialogAction['role']) => {
        if (role === 'destructive') return 'text-red-600';
        if (role === 'cancel') return 'font-semibold text-blue-600';
        return 'text-blue-600';
    };

    const panel = (
        <div className="fixed inset-0 z-[1000]">
            <div
                className="absolute inset-0 bg-black/40 transition-opacity duration-150 opacity-100"
                onClick={() => (closeOnBackdrop ? onClose() : undefined)}
            />
            <div className="absolute inset-0 flex items-center justify-center p-6">
                <div
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby={title ? titleId : undefined}
                    aria-describedby={message ? messageId : undefined}
                    className="w-full max-w-xs bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)] transform transition-all duration-150 scale-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-5 pt-4 pb-3 text-center">
                        {title ? (
                            <h2 id={titleId} className="text-[17px] font-semibold text-zinc-900">
                                {title}
                            </h2>
                        ) : null}
                        {message ? (
                            <p
                                id={messageId}
                                className={`mt-1 text-[13px] leading-5 text-zinc-600 ${title ? '' : 'mt-0'}`}
                            >
                                {message}
                            </p>
                        ) : null}
                    </div>

                    <div className="h-px bg-zinc-200" />

                    {isTwoSideBySide ? (
                        <div className="grid grid-cols-2">
                            {actions.slice(0, 2).map((a, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAction(a)}
                                    className={`h-12 text-[17px] ${roleClass(a.role)} focus:outline-none active:bg-zinc-100 transition-colors ${i === 1 ? 'border-l border-zinc-200' : ''
                                        }`}
                                >
                                    {a.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {actions.map((a, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <div className="h-px bg-zinc-200" />}
                                    <button
                                        onClick={() => handleAction(a)}
                                        className={`h-12 text-[17px] ${roleClass(a.role)} focus:outline-none active:bg-zinc-100 transition-colors`}
                                    >
                                        {a.label}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(panel, document.body);
}