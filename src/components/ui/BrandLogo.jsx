import React, { useId } from 'react';

const PALETTE_GRADIENTS = {
    botanical: ['#10b981', '#047857'],
    mercury: ['#3b82f6', '#1d4ed8'],
    editorial: ['#ea580c', '#9a3412'],
    nordic: ['#475569', '#1e293b'],
    okabe_ito: ['#0072B2', '#004d7a']
};

const BrandLogo = ({ className = 'w-7 h-7', colorPalette = 'botanical' }) => {
    const gradId = useId();
    const [stopStart, stopEnd] = PALETTE_GRADIENTS[colorPalette] || PALETTE_GRADIENTS.botanical;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className={className}
            role="img"
            aria-label="Balanced Logo"
        >
            <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={stopStart} />
                    <stop offset="100%" stopColor={stopEnd} />
                </linearGradient>
            </defs>

            {/* Background Squircle */}
            <rect width="512" height="512" rx="120" fill={`url(#${gradId})`} />

            {/* Left & Right Counterweights (Growth & Stability) */}
            <circle cx="152" cy="184" r="44" fill="#ffffff" />
            <circle cx="360" cy="184" r="44" fill="#ffffff" fillOpacity="0.72" />

            {/* Precision Level Beam */}
            <rect x="96" y="246" width="320" height="36" rx="18" fill="#ffffff" />

            {/* Keystone Fulcrum Triangle */}
            <path
                d="M 245 304 Q 256 288 267 304 L 318 386 Q 327 400 310 400 L 202 400 Q 185 400 194 386 Z"
                fill="#ffffff"
                fillOpacity="0.88"
            />
        </svg>
    );
};

export default BrandLogo;
