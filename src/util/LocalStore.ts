class LocalStore {
    getItem = (key: string) => {
        return localStorage.getItem(key)
    }

    setItem = (key: string, value: any) => {
        return localStorage.setItem(key, value)
    }

    removeItem = (key: string) => {
        return localStorage.removeItem(key)
    }

    getJson = (key: string) => {
        const value = this.getItem(key)
        try {
            return value ? JSON.parse(value) : null
        } catch {
            return null
        }
    }

    setJson = (key: string, value: any) => {
        return this.setItem(key, JSON.stringify(value))
    }
}

export const localStore = new LocalStore()