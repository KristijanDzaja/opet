import React, { useState, useEffect, createContext } from 'react'

const getInitialTheme = () => {
    // Check if localStorage is available in the window object
    if (typeof window !== 'undefined' && window.localStorage) {
        // Retrieve the theme preference from localStorage
        const storedPrefs = window.localStorage.getItem('color-theme')
        if (typeof storedPrefs === 'string') {
            return storedPrefs
        }

        // If no theme preference is found in localStorage, check the user's system preferences
        const userMedia = window.matchMedia('(prefers-color-scheme: dark)')
        if (userMedia.matches) {
            return 'dark'
        }
    }
    // If no localStorage or system preference is available, default to 'light' theme
    return 'light'
}

export const ThemeContext = createContext()

export const ThemeProvider = ({ initialTheme, children }) => {
    // State to manage the current theme
    const [theme, setTheme] = useState(getInitialTheme)

    // Function to apply and save the selected theme
    const rawSetTheme = (theme) => {
        const root = window.document.documentElement;
        const isDark = theme === 'dark'

        // Remove existing theme class and add the new one
        root.classList.remove(isDark ? 'light' : 'dark')
        root.classList.add(theme)

        // Save the selected theme to localStorage
        localStorage.setItem('color-theme', theme)
    }

    // Set the initial theme if provided
    if (initialTheme) {
        rawSetTheme(initialTheme)
    }

    // Effect to update the theme when it changes
    useEffect(() => {
        rawSetTheme(theme)
    }, [theme])

    // Provide the theme state and setter to the components using ThemeContext
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}