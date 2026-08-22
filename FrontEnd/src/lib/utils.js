import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple class names conditionally and handles Tailwind CSS conflicts.
 * @param {...(string|undefined|null|boolean|Object)} inputs - Class names or conditional class objects
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default cn;
