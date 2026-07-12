import { useState, useEffect } from "react";

// Custom hook for localStorage management
/**
 * useState persisted to localStorage under `key` (JSON-serialized).
 * @returns [value, setValue] tuple, same contract as useState
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.error("Error reading localStorage key “" + key + "”:", error);
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			window.localStorage.setItem(key, JSON.stringify(storedValue));
		} catch (error) {
			console.error("Error setting localStorage key “" + key + "”: ", error);
		}
	}, [key, storedValue]);

	return [storedValue, setStoredValue] as const;
}
