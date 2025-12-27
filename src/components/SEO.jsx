import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({
    title,
    description,
    canonical,
    type = 'website',
    name = 'Balanced',
    image = '/og-image.png' // Default image in public folder
}) {
    const siteUrl = 'https://www.balanced-portfolio.com';
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
    const fullTitle = `${title} | ${name}`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={description} />
            <link rel="canonical" href={fullCanonical} />

            {/* End standard metadata tags */}

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:image" content={`${siteUrl}${image}`} />
            {/* End Facebook tags */}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${siteUrl}${image}`} />
            {/* End Twitter tags */}
        </Helmet>
    );
}
