/**
 * @typedef {Object} Game
 * @property {string} id
 * @property {string} title
 * @property {'Arcade' | 'Puzzle' | 'Classic' | 'Action' | 'Retro' | 'Custom' | string} category
 * @property {string} description
 * @property {string} iframeUrl
 * @property {string} [author]
 * @property {string} [controls]
 * @property {string} [accentColor]
 * @property {boolean} [isCustom]
 */

/**
 * @typedef {'All' | 'Favorites' | 'Arcade' | 'Puzzle' | 'Action' | 'Classic'} CategoryFilterType
 */

export const CATEGORIES = ['All', 'Favorites', 'Arcade', 'Puzzle', 'Action', 'Classic'];
